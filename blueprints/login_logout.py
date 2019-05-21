from passlib.hash import sha256_crypt
from flask import Blueprint, session, redirect, request, url_for

from .utils import mongo_connect

login_logout = Blueprint('login_logout', __name__)


@login_logout.route('/login/', methods=["GET", "POST"])
def login():
    """
    route to process logins for existing users
    """
    connection = mongo_connect()
    user_collection = connection["users"]
    user_details = user_collection.find_one(
        {"username": request.form["username"]}
    )
    if user_details is not None:
        if sha256_crypt.verify(
            request.form["password"],
            user_details["passhash"]
        ):
            session['username'] = request.form["username"]
            session['_id'] = str(user_details["_id"])
    return redirect(url_for("index.index"))


@login_logout.route('/logout/')
def logout():
    """
    route to end current login session for a user
    """
    session.pop('username', None)
    return redirect(url_for('index'))


@login_logout.route('/new_account/', methods=["GET", "POST"])
def new_user():
    """
    Add a New User to the database and Hashes their password
    """
    hash = sha256_crypt.hash(request.form["newpassword1"])
    connection = mongo_connect(mongo_uri)
    userCollection = connection["users"]
    userCollection.insert_one(
        {
            "username": request.form["newusername"],
            "passhash": hash,
            "date_joined": str(datetime.now()),
            "starred_cocktails": [],
            "favorite_ingredients": [],
            "favorite_flavors": []
        }
    )
    session['username'] = request.form["newusername"]
    session['_id'] = str(userdetails["_id"])
    return redirect(url_for("index"))
