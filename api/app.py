from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from flask_mail import * 
from flask_bcrypt import Bcrypt
from flask_restful.utils import cors

# create app
app = Flask(__name__, static_folder="images")

# mail config
app.config["MAIL_SERVER"]='smtp.gmail.com'  
app.config["MAIL_PORT"] = 465      
app.config["MAIL_USERNAME"] = 'joebroderwebtemplate@gmail.com'  
app.config['MAIL_PASSWORD'] = 'your password'
app.config['MAIL_USE_TLS'] = False  
app.config['MAIL_USE_SSL'] = True  
mail = Mail(app) 

# upload config
app.config['UPLOAD_FOLDER'] = "images";
app.config['ALLOWED_EXTENSIONS'] = set(['png', 'jpg', 'jpeg', 'gif'])

# auth config
app.config['SECRET_KEY'] = 'your secret key'
bcrypt = Bcrypt(app)

# cors config
CORS(app)
api = Api(app)
# api.decorators=[cors.crossdomain(origin='*')]




