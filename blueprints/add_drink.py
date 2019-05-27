from datetime import datetime

from flask import Blueprint, session, render_template
from bson import ObjectId

from .utils import get_ingredient_and_flavor_list, mongo_connect
from .api import get_ingredients_by_type, get_flavors

add_drink = Blueprint('add_drink', __name__)


@add_drink.route('/cocktails/new', methods=["GET", "POST"])
def new_drink():
    """
    render the form for adding a new cocktail to the database
    """
    if session['username']:
        return render_template('addcocktail.html')

    else:
        return redirect(url_for("index"))


@add_drink.route('/cocktails/', methods=["POST"])
def add_new_drink_to_db():
    """
    function called from the cocktail form to add a drink to the
    database using AJAX
    """

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
        "flavor_tags": ingredients_and_flavors[0],
        "ingredients": ingredients_and_flavors[1],
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
    resp = jsonify(success=True)
    return resp

# Helper Funcitons to add new flavors and ingredients
# and return there ID's from the DB
