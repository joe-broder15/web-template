from app import app, api, mail

# import views
from resources.Auth import UserResource, TokenResource, EmailVerify, ResetPasswordRequest, PasswordReset, GetUserCredentials, UserPermission
from resources.Post import PostList, PostDetail, PostUser
from resources.User import UserDetail, UserList
from resources.Uploads import UserAvatar

# set auth and profile routes
api.add_resource(UserResource, '/auth/user')
api.add_resource(GetUserCredentials, '/auth/user/<username>')
api.add_resource(UserPermission, '/auth/user/privilege/<username>')
api.add_resource(TokenResource, '/auth/token')
api.add_resource(EmailVerify, '/auth/verify/<challenge>')
api.add_resource(ResetPasswordRequest, '/auth/requestreset')
api.add_resource(PasswordReset, '/auth/reset/<challenge>')
api.add_resource(UserList, '/user')
api.add_resource(UserDetail, '/user/<username>')
api.add_resource(UserAvatar, '/upload/avatar/<username>')

# post routes (modify)
api.add_resource(PostList, '/post')
api.add_resource(PostDetail,'/post/<post_id>')
api.add_resource(PostUser,'/post/user/<username>')

# add routes here

if __name__ == '__main__':
    app.run(debug=True)