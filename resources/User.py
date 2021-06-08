from flask_restful import Resource
from flask import request
from marshmallow import ValidationError
from sqlalchemy.sql.functions import user
from models.Models import User, UserProfile, Post, DBSession
from serializers.Serializers import UserProfileSchema, UserSchema
from http import HTTPStatus
from .Auth import token_required

# serializer for user and profiles
user_profile_serializer = UserProfileSchema();
user_serializer = UserSchema();

# get all user profiles
class UserList(Resource):
    # get list of all user profiles
    def get(self):
        with DBSession() as session:
            users=session.query(UserProfile).all()
            return user_profile_serializer.dump(users,many=True), HTTPStatus.OK


# handles public profile informatiom
class UserDetail(Resource):
    # get an individual post
    def get(self, username):
        # get post
        with DBSession() as session:
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
        with DBSession() as session:
            try:
                profile=session.query(UserProfile).filter(UserProfile.username == username).one()
            except:
                return {"errors": "User Not Found"}, HTTPStatus.NOT_FOUND
            
            # check if post belongs to the authenticated user
            if profile.username != user_token['username'] and  user_token['privilege'] <= 1:
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
        with DBSession() as session:
            try:
                profile=session.query(UserProfile).filter(UserProfile.username == username).one()
                user=session.query(User).filter(User.username == username).one()
                posts = session.query(Post).filter(Post.user == username).all()
            except:
                return {"errors": "User Not Found"}, HTTPStatus.NOT_FOUND
            
            # check if post belongs to the authenticated user
            if profile.username != user_token['username'] and  user_token['privilege'] <= 1:
                return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED

            # delete posts, profile, and credentials
            for p in posts:
                session.delete(p)
            session.commit()
            session.delete(profile)
            session.commit() 
            session.delete(user)
            session.commit()

            # return status
            return "success", HTTPStatus.OK