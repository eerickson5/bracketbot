# Phase 4 Full-Stack Application Project Template

## Learning Goals

- Discuss the basic directory structure of a full-stack Flask/React application.
- Carry out the first steps in creating your Phase 4 project.

---

## Running the app

### Server
```console
source ~/.bash_profile
pipenv shell
cd server
python app.py
```

### Client
```console
cd client
npm start
```


---

## Setup

### `server/`

The `server/` directory contains all of your backend code.

`app.py` is your Flask application. You'll want to use Flask to build a simple
API backend like we have in previous modules. You should use Flask-RESTful for
your routes. You should be familiar with `models.py` and `seed.py` by now, but
remember that you will need to use Flask-SQLAlchemy, Flask-Migrate, and
SQLAlchemy-Serializer instead of SQLAlchemy and Alembic in your models.

The project contains a default `Pipfile` with some basic dependencies. You may
adapt the `Pipfile` if there are additional dependencies you want to add for
your project.

To download the dependencies for the backend server, run:

```console
pipenv install
pipenv shell
```

You can run your Flask API on [`localhost:5555`](http://localhost:5555) by
running:

```console
python server/app.py
```

Check that your server serves the default route `http://localhost:5555`. You
should see a web page with the heading "Project Server".

### `client/`

The `client/` directory contains all of your frontend code. The file
`package.json` has been configured with common React application dependencies,
include `react-router-dom`. The file also sets the `proxy` field to forward
requests to `"http://localhost:5555". Feel free to change this to another port-
just remember to configure your Flask app to use another port as well!

To download the dependencies for the frontend client, run:

```console
npm install --prefix client
```

You can run your React app on [`localhost:3000`](http://localhost:3000) by
running:

```sh
npm start --prefix client
```

Check that your the React client displays a default page
`http://localhost:3000`. You should see a web page with the heading "Project
Client".

## Generating Your Database

NOTE: The initial project directory structure does not contain the `instance` or
`migrations` folders. Change into the `server` directory:

```console
cd server
```

Then enter the commands to create the `instance` and `migrations` folders and
the database `app.db` file:

```
flask db init
flask db upgrade head
```

Type `tree -L 2` within the `server` folder to confirm the new directory
structure:

```console
.
├── app.py
├── config.py
├── instance
│   └── app.db
├── migrations
│   ├── README
│   ├── __pycache__
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
├── models.py
└── seed.py
```

Edit `models.py` and start creating your models. Import your models as needed in
other modules, i.e. `from models import ...`.

Remember to regularly run
`flask db revision --autogenerate -m'<descriptive message>'`, replacing
`<descriptive message>` with an appropriate message, and `flask db upgrade head`
to track your modifications to the database and create checkpoints in case you
ever need to roll those modifications back.

> **Tip: It's always a good idea to start with an empty revision! This allows
> you to roll all the way back while still holding onto your database. You can
> create this empty revision with `flask db revision -m'Create DB'`.**

If you want to seed your database, now would be a great time to write out your
`seed.py` script and run it to generate some test data. Faker has been included
in the Pipfile if you'd like to use that library.

---

#### `config.py`

When developing a large Python application, you might run into a common issue:
_circular imports_. A circular import occurs when two modules import from one
another, such as `app.py` and `models.py`. When you create a circular import and
attempt to run your app, you'll see the following error:

```console
ImportError: cannot import name
```

If you're going to need an object in multiple modules like `app` or `db`,
creating a _third_ module to instantiate these objects can save you a great deal
of circular grief. Here's a good start to a Flask config file (you may need more
if you intend to include features like authentication and passwords):

```py
# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

```

Now let's review that last line...

#### CORS

CORS (Cross-Origin Resource Sharing) is a system that uses HTTP headers to
determine whether resources from different servers-of-origin can be accessed. If
you're using the fetch API to connect your frontend to your Flask backend, you
need to configure CORS on your Flask application instance. Lucky for us, that
only takes one line:

```py
CORS(app)

```

By default, Flask-CORS enables CORS on all routes in your application with all
fetching servers. You can also specify the resources that allow CORS. The
following specifies that routes beginning with `api/` allow CORS from any
originating server:

```py
CORS(app, resources={r"/api/*": {"origins": "*"}})

```

You can also set this up resource-by-resource by importing and using the
`@cross_origin` decorator:

```py
@app.route("/")
@cross_origin()
def howdy():
  return "Howdy partner!"

```

---

## Updating Your README.md

`README.md` is a Markdown file that describes your project. These files can be
used in many different ways- you may have noticed that we use them to generate
entire Canvas lessons- but they're most commonly used as homepages for online
Git repositories. **When you develop something that you want other people to
use, you need to have a README.**

Markdown is not a language that we cover in Flatiron's Software Engineering
curriculum, but it's not a particularly difficult language to learn (if you've
ever left a comment on Reddit, you might already know the basics). Refer to the
cheat sheet in this lesson's resources for a basic guide to Markdown.

### What Goes into a README?

This README should serve as a template for your own- go through the important
files in your project and describe what they do. Each file that you edit (you
can ignore your migration files) should get at least a paragraph. Each function
should get a small blurb.

You should descibe your application first, and with a good level of detail. The
rest should be ordered by importance to the user. (Probably routes next, then
models.)

Screenshots and links to resources that you used throughout are also useful to
users and collaborators, but a little more syntactically complicated. Only add
these in if you're feeling comfortable with Markdown.

---

## Conclusion

A lot of work goes into a full-stack application, but it all relies on concepts
that you've practiced thoroughly throughout this phase. Hopefully this template
and guide will get you off to a good start with your Phase 4 Project.

Happy coding!

---

## Resources

- [Setting up a respository - Atlassian](https://www.atlassian.com/git/tutorials/setting-up-a-repository)
- [Create a repo- GitHub Docs](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Circular Imports - StackAbuse](https://stackabuse.com/python-circular-imports/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
