import json

from datetime import datetime

from passlib.hash import sha256_crypt
from flask import Blueprint, session, redirect, request, url_for
from bson.json_util import dumps

from .utils import mongo_connect

login_logout = Blueprint('login_logout', __name__)


@login_logout.route('/login/', methods=["GET", "POST"])
def login():
    """
    route to process logins for existing users
    """
    data = request.data
    login_details = json.loads(data)
    connection = mongo_connect()
    user_collection = connection["users"]
    user_details = user_collection.find_one(
        {"username": login_details["username"]}
    )
    if user_details is not None:
        if sha256_crypt.verify(
            login_details["password"],
            user_details["passhash"]
        ):
            session['username'] = login_details["username"]
            session['_id'] = str(user_details["_id"])
            return dumps({"message": "Successful Login"})
    return dumps({"message": "username or password in correct"})


@login_logout.route('/logout/')
def logout():
    """
    route to end current login session for a user
    """
    session.pop('username', None)
    session.pop('id', None)
    return redirect(url_for('home.index'))


@login_logout.route('/new_account/', methods=["GET", "POST"])
def new_user():
    """
    Add a New User to the database and Hashes their password
    """
    connection = mongo_connect()
    user_collection = connection["users"]
    fields = [k for k in request.form]
    values = [request.form[k] for k in request.form]
    print(fields)
    print(values)
    hash = sha256_crypt.hash(request.form["newpassword1"])
    user_collection.insert_one(
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
    # get new user's id
    user_details = user_collection.find_one(
        {"username": request.form["newusername"]}
    )
    session['_id'] = str(user_details["_id"])
    return redirect(url_for("home.index"))
