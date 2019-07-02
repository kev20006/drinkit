from flask import Blueprint, render_template
from bson import ObjectId

from .utils import mongo_connect, get_user, random_cocktail


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
        if user:
            return render_template('userprofile.html', user=user)
    return render_template('notfound.html', user=get_user()), 404


@profiles.route('/cocktails/<cocktail_id>')
def view_cocktail(cocktail_id):
    """
    route to view a specific cocktail
    """
    user = get_user()
    if ObjectId.is_valid(cocktail_id):
        connection = mongo_connect()
        cocktail = connection["cocktails"].find_one(
            {"_id": ObjectId(cocktail_id)}
        )
        if cocktail:

            return render_template(
                'viewcocktail.html',
                cocktail=cocktail,
                user=user
            )
    elif cocktail_id == "random":
        return render_template(
            'viewcocktail.html',
            cocktail=dict(random_cocktail()),
            user=user
        )
    return render_template('notfound.html', user=get_user()), 404
