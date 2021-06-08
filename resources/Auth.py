
from flask_restful import Resource
from flask import request
from flask_mail import *
from marshmallow import ValidationError
from models.Models import User, UserProfile, BlackListToken, DBSession, EmailVerification, ResetPassword
from serializers.Serializers import UserSchema
from http import HTTPStatus
import jwt
from datetime import datetime, timedelta
from flask_bcrypt import generate_password_hash, check_password_hash
from functools import wraps
from app import mail, app
import hashlib
import random, string

SECRET_KEY = app.config['SECRET_KEY']
APP_URL = app.config['APP_URL']

# serializer for user class
user_serializer = UserSchema();

# decorator for verifying the JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        with DBSession() as session:
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
            
            if session.query(BlackListToken).filter(BlackListToken.token == token).first() != None:
                return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
            
            #try to decode token
            try:
                data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
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
        with DBSession() as session:

            # try to get a user
            try:
                user = session.query(User).filter(User.username == user_token['username']).one()
            except:
                return {"errors": "user not found"}, HTTPStatus.NOT_FOUND

            # close session and return
            return user_serializer.dump(user), HTTPStatus.OK

    # register a new user
    def post(self):
        # serialize request data
        with DBSession() as session:
            try:
                data = user_serializer.load(request.get_json())
            except ValidationError as err:
                return {"errors": err.messages}, HTTPStatus.BAD_REQUEST

            # create new User
            try:
                # hash serialized password using bcrypt
                pw_hash = generate_password_hash(data['password'], 10).decode('utf-8')
                user = User(username=data['username'], password_hash=pw_hash, email=data['email'])
                profile = UserProfile(username=data['username']);

            except:
                return {"errors": "bad credentials"}, HTTPStatus.BAD_REQUEST
            
            # add user to db
            session.add(user)
            session.add(profile)
            session.commit()
            
            # generate verification challenge by hashing a random string with the user's email
            salt = ''.join(random.choice(string.ascii_letters) for _ in range(10))
            challenge = hashlib.sha256(((user.email + salt)).encode('utf-8')).hexdigest()

            # create a verification challenge in the database
            ev = EmailVerification(username = user.username, challenge=challenge);
            session.add(ev)
            session.commit()

            # send an verification link to the user
            msg = Message('verify email',sender = app.config['MAIL_USERNAME'], recipients = [user.email])  
            msg.body = "http://"+APP_URL+"/#/verify/confirm/"+challenge  
            mail.send(msg)

            # return new ceated user
            return user_serializer.dump(user), HTTPStatus.CREATED

# issues and blacklists tokens
class TokenResource(Resource):

    # login with credentials and get a new token
    def post(self):
        # serialize request data
        with DBSession() as session:
            try:
                data = user_serializer.load(request.get_json())
            except ValidationError as err:
                return {"errors": err.messages}, HTTPStatus.BAD_REQUEST

            # fetch user data
            try:
                user = session.query(User).filter(User.email == data['email']).one()
            except:
                return {"errors": "user not found"}, HTTPStatus.NOT_FOUND

            # check if user is verified
            if(user.verified == False):
                return {"errors": "unverified"}, HTTPStatus.UNAUTHORIZED

            # check password hash and encode token
            if check_password_hash(user.password_hash, data['password']):
                token = jwt.encode({
                    'username': user.username,
                    'email': user.email,
                    'privilege': user.privilege,
                    'exp' : datetime.utcnow() + timedelta(minutes = 30)
                }, SECRET_KEY, algorithm="HS256")
                return token, HTTPStatus.ACCEPTED

            return {"errors": "invalid password"}, HTTPStatus.FORBIDDEN
    
    # delete user token
    @token_required
    def delete(self, user_token):
        with DBSession() as session:
            token = BlackListToken(token=request.headers['Authorization'].split(" ")[1])
            session.add(token)
            return HTTPStatus.OK

# get the credentials of a specific user
class GetUserCredentials(Resource):
    @token_required
    def get(self, user_token, username):
        with DBSession() as session:
            # check if the user owns the desired credentials or is an admin
            if(username != user_token['username'] and user_token['privilege'] <= 1):
                return {"errors": "unautnorized"}, HTTPStatus.UNAUTHORIZED
            
            # get credentials
            session = DBSession()
            try:
                user = session.query(User).filter(User.username == username).one()
            except:
                return {"errors": "user not found"}, HTTPStatus.NOT_FOUND

            return user_serializer.dump(user), HTTPStatus.OK

# used for email verification
class EmailVerify(Resource):
    def get(self, challenge):
        
        with DBSession() as session:

            # search db for the desired challenge
            try:
                ev = session.query(EmailVerification).filter(EmailVerification.challenge == challenge).one()
                user = session.query(User).filter(User.username == ev.username).one()
            except:
                return {"errors": "challenge or user not found"}, HTTPStatus.NOT_FOUND

            # set verified and delete record
            user.verified = True
            session.delete(ev)
            session.commit()
            
            return HTTPStatus.OK

# used to reset passwords
class ResetPasswordRequest(Resource):
    def post(self):
        with DBSession() as session:
            # check if user exists
            try:
                user = session.query(User).filter(User.email == request.get_json()['email']).one()
            except:
                {"errors": "email not found"}, HTTPStatus.NOT_FOUND

            # delete existing challenge if one exists
            try:
                resetPassword = session.query(ResetPassword).filter(ResetPassword.username == user.username).one()
                session.delete(resetPassword)
                session.commit()
            except:
                None
            
            # generate verification challenge
            salt = ''.join(random.choice(string.ascii_letters) for _ in range(10))
            challenge = hashlib.sha256(((user.email + salt)).encode('utf-8')).hexdigest()
            ev = ResetPassword(username = user.username, challenge=challenge);
            session.add(ev)
            session.commit()

            # send an email
            msg = Message('reset password link',sender = app.config['MAIL_USERNAME'], recipients = [user.email])  
            msg.body = "http://"+APP_URL+"/#/reset/"+challenge  
            mail.send(msg)  
            # return new ceated user
            return user_serializer.dump(user), HTTPStatus.OK

# resets a password and resolves a reset password request
class PasswordReset(Resource):
    def post(self, challenge):
        with DBSession() as session:

            # get the reset request from the database
            try:
                resetPassword = session.query(ResetPassword).filter(ResetPassword.challenge == challenge).one()
                user = session.query(User).filter(User.username == resetPassword.username).one()
                
            except:
                {"errors": "challenge or user not found"}, HTTPStatus.NOT_FOUND
            
            # make sure user is verified
            if(user.verified == False):
                return {"errors": "unverified"}, HTTPStatus.UNAUTHORIZED

            # set new password
            user.password_hash = generate_password_hash(request.get_json()['password'], 10).decode('utf-8')
            session.delete(resetPassword)
            session.commit()

            return HTTPStatus.OK

class UserPermission(Resource):
    @token_required
    def put(self, user_token, username):
        with DBSession() as session:
            # make sure user is verified
            if(user_token['privilege'] <= 1):
                return {"errors": "unauthorized"}, HTTPStatus.UNAUTHORIZED
            
            # get and return user data
            try:
                user = session.query(User).filter(User.username == username).one()
            except:
                {"errors": "user not found"}, HTTPStatus.NOT_FOUND
            
            # set new privilege
            user.privilege = request.get_json()['privilege'];
            session.commit()

            return HTTPStatus.OK




