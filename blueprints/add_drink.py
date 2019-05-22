from datetime import datetime

from flask import Blueprint, session, render_template
from bson import ObjectId

from .utils import *
from .api import get_ingredients_by_type, get_flavors

add_drink = Blueprint('add_drink', __name__)


@add_drink.route('/add_cocktail/', methods=["GET", "POST"])
def new_drink():
    """
    render the form for adding a new cocktail to the database
    """
    if session['username']:
        return render_template('addcocktail.html')

    else:
        return redirect(url_for("index"))


@add_drink.route('/cocktail_processing/', methods=["POST"])
def add_new_drink_to_db():
    """
    function called from the cocktail form to add a drink to the
    database using AJAX
    """
    ingredients = json.loads(get_ingredients_by_type(None))
    flavors = json.loads(get_flavors())
    data = request.data
    dataDict = json.loads(data)
    # function returns an array
    # index 0: list of flavors
    # index 1: is a list of ingredients
    ingredients_and_flavors = get_ingredient_and_flavor_list(dataDict)
    connection = mongo_connect()
    connection["cocktails"].insert_one({
        "name": dataDict["name"],
        "description": dataDict["description"],
        "flavor_tags": flavorIds,
        "ingredients": ingredientIds,
        "method": dataDict["instructions"],
        "glass": dataDict["glass"],
        "equipment": dataDict["equipment"],
        "creator": ObjectId(session['_id']),
        "flagged": 0,
        "votes": {
            "upvotes": [],
            "downvotes": []
        },
        "created_at": str(datetime.now()),
        "preferred_spirits": [],
        "image_url": dataDict["image_url"]
    })
    return "success"

# Helper Funcitons to add new flavors and ingredients
# and return there ID's from the DB


def add_ingredient_return_id(name, type):
    connection = mongo_connect()
    ingredients = connection["ingredients"]
    ingredients.insert_one(
        {
            "name": name,
            "type": type,
        })
    newIngredient = ingredients.find_one({
        "name": name
    })
    return newIngredient["_id"]


def add_flavor_return_id(name):
    connection = mongo_connect()
    flavors = connection["flavors"]
    flavors.insert_one(
        {
            "name": name,
        })
    new_flavor = flavors.find_one({
        "name": name
    })
    return new_flavor["_id"]
