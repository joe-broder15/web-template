from flask_restful import Resource
from flask import request
from marshmallow import ValidationError
from sqlalchemy.sql.functions import user
from models.Models import Post, DBSession
from serializers.Serializers import PostSchema
from http import HTTPStatus
from .Auth import token_required

# serializer for post class
post_serializer = PostSchema();

# get list of all posts or add a new post
class PostList(Resource):
    # get list of posts
    def get(self):
        session = DBSession()
        posts=session.query(Post).all()
        session.close()
        return post_serializer.dump(posts,many=True), HTTPStatus.OK
    
    # create new post
    @token_required
    def post(self, user_token):
        # serialize request
        try:
            data = post_serializer.load(request.get_json())
        except ValidationError as err:
            session.close()
            return {"errors": err.messages}, HTTPStatus.BAD_REQUEST

        # create new Post
        session = DBSession()
        post = Post(text=data['text'], title=data['title'], user=user_token['username'])
        session.add(post)
        session.commit()
        session.close()
        # return post to user
        return post_serializer.dump(post), HTTPStatus.CREATED

# get all posts belonging to a user
class PostUser(Resource):
    def get(self, username):
        # get posts
        session = DBSession()
        try:
            post=session.query(Post).filter(Post.user == username).all()
        except:
            session.close()
            return {"errors": "Post Not Found"}, HTTPStatus.NOT_FOUND
        
        # return serialized posts
        session.close()
        return post_serializer.dump(post, many=True), HTTPStatus.OK

# get, modify or delete an individual post
class PostDetail(Resource):
    # get an individual post
    def get(self, post_id):
        # get post
        session = DBSession()
        try:
            post=session.query(Post).filter(Post.id == post_id).one()
        except:
            session.close()
            return {"errors": "Post Not Found"}, HTTPStatus.NOT_FOUND
        
        # return serialized post
        return post_serializer.dump(post), HTTPStatus.OK

    # update an individual post
    @token_required
    def put(self, post_id, user_token):
        # get post from db
        session = DBSession()
        try:
            post=session.query(Post).filter(Post.id == post_id).one()
        except:
            session.close()
            return {"errors": "Post Not Found"}, HTTPStatus.NOT_FOUND
        
        # check if post belongs to the authenticated user
        if post.user != user_token['username'] and user_token['privilege'] <= 1:
            session.close()
            return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        
        # serialize inputs
        try:
            data = post_serializer.load(request.get_json())
        except ValidationError as err:
            session.close()
            return {"errors": err.messages}, 422

        # modify post
        post.title = data['title']
        post.text = data['text']
        session.commit()
        session.close()
        # return post
        return post_serializer.dump(post), HTTPStatus.CREATED
    
    # delete a post
    @token_required
    def delete(self, post_id, user_token):

        # delete post
        session = DBSession()
        try:
            post=session.query(Post).filter(Post.id == post_id).one()
        except:
            session.close()
            return {"errors": "Post Not Found"}, HTTPStatus.NOT_FOUND
        
        # check if post belongs to the authenticated user or admin
        if post.user != user_token['username'] and user_token['privilege'] <= 1:
            session.close()
            return {"errors": "Unauthorized"}, HTTPStatus.UNAUTHORIZED

        session.delete(post)
        session.commit()
        session.close()
        # return status
        return "success", HTTPStatus.OK