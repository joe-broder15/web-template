from app import app, api, mail

# import views
from resources.Auth import UserResource, TokenResource, EmailVerify, ResetPasswordRequest, PasswordReset, GetUserCredentials, UserPermission
from resources.Post import PostList, PostDetail, PostUser
from resources.User import UserDetail, UserList
from resources.Uploads import UserAvatar
from flask import render_template

import os

# set auth and profile routes
api.add_resource(UserResource, '/api/auth/user')
api.add_resource(GetUserCredentials, '/api/auth/user/<username>')
api.add_resource(UserPermission, '/api/auth/user/privilege/<username>')
api.add_resource(TokenResource, '/api/auth/token')
api.add_resource(EmailVerify, '/api/auth/verify/<challenge>')
api.add_resource(ResetPasswordRequest, '/api/auth/requestreset')
api.add_resource(PasswordReset, '/api/auth/reset/<challenge>')
api.add_resource(UserList, '/api/user')
api.add_resource(UserDetail, '/api/user/<username>')
api.add_resource(UserAvatar, '/api/upload/avatar/<username>')

# post routes (modify)
api.add_resource(PostList, '/api/post')
api.add_resource(PostDetail,'/api/post/<post_id>')
api.add_resource(PostUser,'/api/post/user/<username>')

# serve frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


if __name__ == "__main__":
    if os.getenv('DEV') == "0":
        print("running production")
        app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
    else:
        print("running dev")
        app.run(debug=True)