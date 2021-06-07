from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from flask_mail import * 
from flask_bcrypt import Bcrypt
from flask_restful.utils import cors
import os
from dotenv import load_dotenv

load_dotenv()

# create app
app = Flask(__name__, static_url_path="/", static_folder='build', template_folder='build')

# mail config
app.config["MAIL_SERVER"]='smtp.gmail.com'  
app.config["MAIL_PORT"] = 465      
app.config["MAIL_USERNAME"] = os.getenv('MAIL_USERNAME')
app.config["MAIL_PASSWORD"] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False  
app.config['MAIL_USE_SSL'] = True  
mail = Mail(app) 

# upload config
app.config['UPLOAD_FOLDER'] = "images";
app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'gif'])

# auth config
app.config["SECRET_KEY"] = os.getenv('SECRET_KEY')
bcrypt = Bcrypt(app)

# cors config
CORS(app)
# app.config['CORS_HEADERS'] = 'application/json'
app.config['DATABASE_URL'] = os.getenv('DATABASE_URL')
app.config['APP_URL'] = os.getenv('APP_URL')

app.config['S3_ACCESS_KEY'] = os.getenv('S3_ACCESS_KEY')
app.config['S3_SECRET_KEY'] = os.getenv('S3_SECRET_KEY')
app.config['S3_BUCKET_NAME'] = os.getenv('S3_BUCKET_NAME')

api = Api(app)




