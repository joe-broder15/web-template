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


# user details
class UserDetail(Resource):
    # get an individual post
    def get(self, username):
        # get post
        session = DBSession()
        try:
            profile=session.query(UserProfile).filter(UserProfile.username == username).one()
        except:
            return {"errors": "Post Not Found"}, HTTPStatus.NOT_FOUND
        
        # return serialized post
        return user_profile_serializer.dump(profile), HTTPStatus.OK

    # # update an individual post
    # @token_required
    # def put(self, post_id, user_token):
    #     # get post from db
    #     session = DBSession()
    #     try:
    #         post=session.query(Post).filter(Post.id == post_id).one()
    #     except:
    #         return {"errors": "Post Not Found"}, HTTPStatus.NOT_FOUND
        
    #     # check if post belongs to the authenticated user
    #     if post.user != user_token['username']:
    #         return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        
    #     # serialize inputs
    #     try:
    #         data = post_serializer.load(request.get_json())
    #     except ValidationError as err:
    #         return {"errors": err.messages}, 422

    #     # modify post
    #     post.title = data['title']
    #     post.text = data['text']
    #     session.commit()

    #     # return post
    #     return post_serializer.dump(post), HTTPStatus.CREATED
    
    # # delete a post
    # @token_required
    # def delete(self, post_id, user_token):

    #     # delete post
    #     session = DBSession()
    #     try:
    #         post=session.query(Post).filter(Post.id == post_id).one()
    #     except:
    #         return {"errors": "Post Not Found"}, HTTPStatus.NOT_FOUND
        
    #     # check if post belongs to the authenticated user
    #     if post.user != user_token['username']:
    #         return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED

    #     session.delete(post)
    #     session.commit()

    #     # return status
    #     return "success", HTTPStatus.OK