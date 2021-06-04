from flask_restful import Resource
from flask import request, send_from_directory
from marshmallow import ValidationError
from sqlalchemy.sql.functions import user
from werkzeug.wrappers import Response
from models.Models import User, UserProfile, DBSession
from serializers.Serializers import UserProfileSchema, UserSchema
from werkzeug.utils import secure_filename
from http import HTTPStatus
from .Auth import token_required
import os;
from app import app


UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']

ALLOWED_EXTENSIONS = app.config['ALLOWED_EXTENSIONS']

# serializer for post class
user_profile_serializer = UserProfileSchema();
user_serializer = UserSchema();

# handles user avatars
class UserAvatar(Resource):
    
    # upload a new user avatar
    @token_required
    def post(self, user_token, username):
        # get user profile
        session = DBSession()
        try:
            profile=session.query(UserProfile).filter(UserProfile.username == username).one()
        except:
            return {"errors": "User Not Found"}, HTTPStatus.NOT_FOUND
        
        # check if post belongs to the authenticated user
        if profile.username != user_token['username'] and  user_token['privilege'] <= 1:
            return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        
        # check that upload folder exists
        target=os.path.join(UPLOAD_FOLDER, "avatars")
        if not os.path.isdir(target):
            os.mkdir(target)
        
        file = request.files['file'] 

        # check if file is of the allowed types
        if(file.filename.split(".")[1] not in ALLOWED_EXTENSIONS):
            return {"errors": "invalid file type"}, HTTPStatus.BAD_REQUEST

        # save file
        filename = secure_filename(file.filename)
        destination=os.path.join(target, filename)
        file.save(destination)

        # set pfp
        profile.avatar = destination
        session.commit()

        return HTTPStatus.OK

class GetUserAvatar(Resource):
    def get(self, filename):
        return send_from_directory(os.path.join('images', 'avatars'), filename) 
