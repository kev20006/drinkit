from flask import Blueprint, session, render_template
from bson import ObjectId

from .utils import mongo_connect

profiles = Blueprint('profiles', __name__)


@profiles.route('/user_profile/<user_id>')
def view_user_profile(user_id):
    """
    route to view a users profile
    """
    connection = mongo_connect()
    user = connection["users"].find_one(
        {"_id": ObjectId(user_id)}
    )
    print(user)
    return render_template('userprofile.html', user=user)


@profiles.route('/cocktails/<cocktail_id>')
def view_cocktail(cocktail_id):
    """
    route to view a specific cocktail
    """
    connection = mongo_connect()
    cocktail = connection["cocktails"].find_one(
        {"_id": ObjectId(cocktail_id)}
    )
    user = ""
    if session.get('_id'):
        user = connection["users"].find_one(
            {"_id": ObjectId(session['_id'])}
        )
    return render_template('viewcocktail.html', cocktail=cocktail, user=user)
