from boto3.session import Session
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
ACCESS_KEY = app.config['S3_ACCESS_KEY']
SECRET_KEY = app.config['S3_SECRET_KEY']
BUCKET_NAME = app.config['S3_BUCKET_NAME']
# serializer for post class
user_profile_serializer = UserProfileSchema();
user_serializer = UserSchema();



# handles user avatars
class UserAvatar(Resource):
    
    # upload a new user avatar
    @token_required
    def post(self, user_token, username):
        # get user profile
        with DBSession() as session:
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
            s3.upload_fileobj(file, BUCKET_NAME, key)

            location = s3.get_bucket_location(Bucket=bucket_name)['LocationConstraint']
            url = "https://%s.s3-%s.amazonaws.com/%s" % (bucket_name, location, key)

            # delete old pfp
            if(profile.avatar!= None):
                s3.delete_object(Bucket = BUCKET_NAME,Key=profile.avatar.split("/")[-1])

            # set pfp
            profile.avatar = url
            session.commit()

            return HTTPStatus.OK


