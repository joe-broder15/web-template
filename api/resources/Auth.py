from flask_restful import Resource
from flask import request
from sqlalchemy.sql.expression import text
from marshmallow import ValidationError
from models.Models import User, UserProfile, BlackListToken, DBSession
from serializers.Serializers import UserSchema
from http import HTTPStatus
import jwt
from datetime import datetime, timedelta
from flask_bcrypt import generate_password_hash, check_password_hash
from functools import wraps

# serializer for user class
user_serializer = UserSchema();

# decorator for verifying the JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        # return 401 if token is not passed
        if not token:
            return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        
        # check if jwt
        if token.split(" ")[0] != "JWT":
            return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        token = token.split(" ")[1]

        # check if token is blacklisted
        session = DBSession()
        if session.query(BlackListToken).filter(BlackListToken.token == token).first() != None:
            return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        
        #try to decode token
        try:
            data = jwt.decode(token, 'your secret key', algorithms=["HS256"])
        except:
            return {"errors": "Bad Token"}, HTTPStatus.UNAUTHORIZED

        # call wrapped function with decoded token as an arg
        return  f(user_token = data, *args, **kwargs)
   
    return decorated


# Resourse for getting user data, registration, and deleting users
class UserResource(Resource):

    # get username and email
    @token_required
    def get(self, user_token):
        # get and return user data
        session = DBSession()
        user = session.query(User).filter(User.username == user_token['username']).one()
        return user_serializer.dump(user), HTTPStatus.OK

    # register a new user
    def post(self):
        # serialize request data
        try:
            data = user_serializer.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, HTTPStatus.BAD_REQUEST

        # create new User
        session = DBSession()
        try:
            # hash serialized password using bcrypt
            pw_hash = generate_password_hash(data['password'], 10)
            user = User(username=data['username'], password_hash=pw_hash, email=data['email'])
            profile = UserProfile(username=data['username']);

        except:
            return {"errors": "bad credentials"}, HTTPStatus.BAD_REQUEST
        
        # add user to db
        session.add(user)
        session.add(profile)
        session.commit()

        # return new ceated user
        return user_serializer.dump(user), HTTPStatus.CREATED
    
    # delete user
    @token_required
    def delete(self, user_token):
        # blacklist token and delete user
        session = DBSession()
        token = BlackListToken(token=request.headers['Authorization'])
        user = session.query(User).filter(User.username == user_token['username']).one()
        session.delete(user)
        session.add(token)
        session.commit()
        return HTTPStatus.OK

# issues and blacklists tokens
class TokenResource(Resource):
    # login with credentials and get a new token
    def post(self):
        # serialize request data
        try:
            data = user_serializer.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, HTTPStatus.BAD_REQUEST

        # fetch user data
        session = DBSession()
        try:
            user = session.query(User).filter(User.email == data['email']).one()
        except:
            return {"errors": "user not found"}, HTTPStatus.NOT_FOUND

        # check password hash and encode token
        if check_password_hash(user.password_hash, data['password']):
            token = jwt.encode({
                'username': user.username,
                'email': user.email,
                'privilege': user.privilege,
                'exp' : datetime.utcnow() + timedelta(minutes = 30)
            }, 'your secret key', algorithm="HS256")
            return token, HTTPStatus.ACCEPTED

        return {"errors": "invalid password"}, HTTPStatus.FORBIDDEN
    
    # delete user token
    @token_required
    def delete(self, user_token):
        session = DBSession()
        token = BlackListToken(token=request.headers['Authorization'].split(" ")[1])
        session.add(token)
        return HTTPStatus.OK



