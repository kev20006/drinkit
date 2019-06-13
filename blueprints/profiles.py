from flask import Blueprint, session, render_template
from bson import ObjectId

from .utils import mongo_connect, get_user

profiles = Blueprint('profiles', __name__)


@profiles.route('/user_profile/<user_id>')
def view_user_profile(user_id):
    """
    route to view a users profile
    """
    if ObjectId.is_valid(user_id):
        connection = mongo_connect()
        user = connection["users"].find_one(
            {"_id": ObjectId(user_id)}
        )
        print(user)
        if user:
            return render_template('userprofile.html', user=user)
    return render_template('notfound.html'), 404


@profiles.route('/cocktails/<cocktail_id>')
def view_cocktail(cocktail_id):
    """
    route to view a specific cocktail
    """
    if ObjectId.is_valid(cocktail_id):
        connection = mongo_connect()
        cocktail = connection["cocktails"].find_one(
            {"_id": ObjectId(cocktail_id)}
        )
        if cocktail:
            user = get_user()
            return render_template(
                'viewcocktail.html',
                cocktail=cocktail,
                user=user
                )
    return render_template('notfound.html'), 404
