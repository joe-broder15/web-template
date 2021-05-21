from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
# import views
from resources.Post import PostList, PostDetail, PostUser
from resources.Auth import UserResource, TokenResource
from resources.User import UserDetail, UserList
from flask_bcrypt import Bcrypt
from flask_restful.utils import cors

# create app
app = Flask(__name__)
# app.config['SECRET_KEY'] = 'your secret key'
CORS(app)
api = Api(app)
# api.decorators=[cors.crossdomain(origin='*')]
bcrypt = Bcrypt(app)

# set up routes
api.add_resource(PostList, '/post')
api.add_resource(PostDetail,'/post/<post_id>')
api.add_resource(PostUser,'/post/user/<username>')
api.add_resource(UserResource, '/auth/user')
api.add_resource(TokenResource, '/auth/token')
api.add_resource(UserList, '/user')
api.add_resource(UserDetail, '/user/<username>')
if __name__ == '__main__':
    app.run(debug=True)