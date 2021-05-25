from app import app, api, mail

# import views
from resources.Auth import UserResource, TokenResource, EmailVerify
from resources.Post import PostList, PostDetail, PostUser
from resources.User import UserDetail, UserList
from resources.Uploads import UserAvatar

# set up routes
api.add_resource(PostList, '/post')
api.add_resource(PostDetail,'/post/<post_id>')
api.add_resource(PostUser,'/post/user/<username>')
api.add_resource(UserResource, '/auth/user')
api.add_resource(TokenResource, '/auth/token')
api.add_resource(UserList, '/user')
api.add_resource(UserDetail, '/user/<username>')
api.add_resource(UserAvatar, '/upload/avatar/<username>')
api.add_resource(EmailVerify, '/auth/verify/<challenge>')

if __name__ == '__main__':
    app.run(debug=True)