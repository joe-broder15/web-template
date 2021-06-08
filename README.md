# Web Template

This is my personal full-stack web template. The frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses [React Bootstrap](https://react-bootstrap.github.io/). The backend uses [Flask](https://palletsprojects.com/p/flask/) as well as [Marshmallow](https://marshmallow.readthedocs.io/en/stable/) and [SQLAlchemy](https://www.sqlalchemy.org/). The backend uses JWT and Bcrypt for authentication and features email verification as well as password reset via email links.

## Config

This template requires environment variables in order to work properly, make a .env file in the project root and be sure to add the following variables:

Variable Name | Description
------------ | -------------
MAIL_USERNAME | email address that the backend will send reset and verification requests from
MAIL_PASSWORD | email password
SECRET_KEY | secret key for signing JWTs
DATABASE_URL | SQL database url
APP_URL | URL that the frontend is served from
S3_ACCESS_KEY | your aws access key
S3_SECRET_KEY | your aws secret key
S3_BUCKET_NAME | name of the s3 bucket you wish to store static files in
DEV | set this to 1

## Available Scripts

In the project directory, you can run:

### `npm run start`

Creates a static build of the frontend and serves it locally from the flask server.

### `npm run build`

Builds the app for production to the `build` folder.
