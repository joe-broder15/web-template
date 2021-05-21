from flask_restful import Resource
from flask import request
from marshmallow import ValidationError
from sqlalchemy.sql.functions import user
from models.Models import User, UserProfile, DBSession
from serializers.Serializers import UserProfileSchema, UserSchema
from http import HTTPStatus
from .Auth import token_required

# serializer for post class
user_profile_serializer = UserProfileSchema();
user_serializer = UserSchema();

# get all users
class UserList(Resource):
    # get list of all user profiles
    def get(self):
        session = DBSession()
        users=session.query(UserProfile).all()
        return user_profile_serializer.dump(users,many=True), HTTPStatus.OK


# user details
class UserDetail(Resource):
    # get an individual post
    def get(self, username):
        # get post
        session = DBSession()
        try:
            profile=session.query(UserProfile).filter(UserProfile.username == username).one()
        except:
            return {"errors": "User Not Found"}, HTTPStatus.NOT_FOUND
        
        # return serialized post
        return user_profile_serializer.dump(profile), HTTPStatus.OK

    # update an individual user profile
    @token_required
    def put(self, username, user_token):
        # get post from db
        session = DBSession()
        try:
            profile=session.query(UserProfile).filter(UserProfile.username == user_token['username']).one()
        except:
            return {"errors": "User Not Found"}, HTTPStatus.NOT_FOUND
        
        # check if post belongs to the authenticated user
        if profile.username != user_token['username']:
            return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        
        # serialize inputs
        print(request.get_json())
        try:
            data = user_profile_serializer.load(request.get_json())
        except ValidationError as err:
            return {"errors": err.messages}, 422

        # modify post
        profile.name = data['name']
        profile.bio = data['bio']
        profile.gender = data['gender']
        profile.private = data['private']
        profile.birthday = data['birthday']
        session.commit()

        # return post
        return user_profile_serializer.dump(profile), HTTPStatus.OK
    
    # delete a user
    @token_required
    def delete(self, username, user_token):

        # get user
        session = DBSession()
        try:
            profile=session.query(UserProfile).filter(UserProfile.username == user_token['username']).one()
            user=session.query(User).filter(User.username == user_token['username']).one()
        except:
            return {"errors": "User Not Found"}, HTTPStatus.NOT_FOUND
        
        # delete
        session.delete(profile)
        session.delete(user)
        session.commit()

        # return status
        return "success", HTTPStatus.OK