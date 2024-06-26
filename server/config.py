# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
import os
# Local imports

# Instantiate app, set attributes
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
    )
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI', "sqlite:///app.db")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["DEBUG"] = True
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
app.secret_key = os.environ.get('SECRET_KEY', "dev_key")
api = Api(app, prefix=os.environ.get('API_PREFIX', "/")) #should be "/api"
#here's the deal: my proxy automatically reads and removes the /api. 
# this line ensures flask needs the /api because otherwise front end endpoints would point to the backend
# I can't do a "/" because then flask would catch it and error out
# without the proxy nothing works locally
CORS(app)
bcrypt = Bcrypt(app)
