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
import cloudinary.uploader
from flask import jsonify
import random, string
import boto3



UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']

ALLOWED_EXTENSIONS = app.config['ALLOWED_EXTENSIONS']

# serializer for post class
user_profile_serializer = UserProfileSchema();
user_serializer = UserSchema();

ACCESS_KEY = app.config['S3_ACCESS_KEY']
SECRET_KEY = app.config['S3_SECRET_KEY']

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
        
      
        # get file  
        file = request.files['file'] 

        # check if file is of the allowed types
        if(file.filename.split(".")[1] not in ALLOWED_EXTENSIONS):
            return {"errors": "invalid file type"}, HTTPStatus.BAD_REQUEST
        
        # create filename
        bucket_name = "web-template-joebroder"
        key = ''.join(random.choice(string.ascii_letters) for _ in range(20)) + "." + file.filename.split(".")[1]

        # create aws client
        s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY)

        # upload file
        s3.upload_fileobj(file, bucket_name, key)

        location = s3.get_bucket_location(Bucket=bucket_name)['LocationConstraint']
        url = "https://s3-%s.amazonaws.com/%s/%s" % (location, bucket_name, key)

        # set pfp
        profile.avatar = url
        session.commit()

        return HTTPStatus.OK

class GetUserAvatar(Resource):
    def get(self, filename):
        return send_from_directory(os.path.join('images', 'avatars'), filename) 
