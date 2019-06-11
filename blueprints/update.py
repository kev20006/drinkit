import json

from datetime import datetime
from flask import Blueprint, session, render_template, request, jsonify
from bson import ObjectId

from .utils import mongo_connect
from .api import get_ingredients_by_type, get_flavors
from .api import get_ingredient_and_flavor_list

update = Blueprint('update', __name__)


@update.route("/update/favorite_things/", methods=["POST"])
def update_favorite_things():
    """
    route to add or remove favorite ingredients or flavors to a user
    - favorite_things["type"] - determines if its an ingredient or a flavor
    """
    data = request.data
    favorite_things = json.loads(data)
    print(favorite_things)
    connection = mongo_connect()
    if(favorite_things["action"] == "add"):
        connection["users"].update_one(
            {"_id": ObjectId(favorite_things["user"])},
            {"$push": {
                favorite_things["type"]: ObjectId(favorite_things["item_id"])
            }
            }
        )
    else:
        connection["users"].update_one(
            {"_id": ObjectId(favorite_things["user"])},
            {"$pull":
                {
                    favorite_things["type"]:
                    ObjectId(favorite_things["item_id"])
                }
             }
        )
    resp = jsonify(success=True)
    return resp


@update.route("/update/like_dislike", methods=["POST"])
def like_dislike():
    "route to upvote and downvote drinks and comments"
    data = request.data
    new_like = json.loads(data)
    print(new_like)
    connection = mongo_connect()
    if new_like["type"] == "up":
        connection[new_like["collection"]].update_one(
            {"_id": ObjectId(new_like["object_id"])},
            {"$pull":
                {
                    "votes.downvotes": new_like["user_id"]
                },
             "$push":
                {
                    "votes.upvotes": new_like["user_id"]
                }
             }
        )
    elif new_like["type"] == "down":
        connection[new_like["collection"]].update_one(
            {"_id": ObjectId(new_like["object_id"])},
            {"$push":
                {
                    "votes.downvotes": new_like["user_id"]
                },
             "$pull":
                {
                    "votes.upvotes": new_like["user_id"]
                }
             }
        )
    else:
        connection[new_like["collection"]].update_one(
            {"_id": ObjectId(new_like["object_id"])},
            {"$pull":
                {
                    "votes.downvotes": new_like["user_id"],
                    "votes.upvotes": new_like["user_id"]
                },
             }
        )
    resp = jsonify(success=True)
    return resp


@update.route('/update/cocktail/<cocktail_id>')
def update_cocktail(cocktail_id):
    """
    route to update a cocktails details
    """
    connection = mongo_connect()
    cocktail = connection["cocktails"].aggregate([
        {"$match": {"_id": ObjectId(cocktail_id)}},
        {"$lookup": {
            "from": "ingredients",
            "localField": "ingredients.ingredient",
            "foreignField": "_id",
            "as": "ingredient-details"
        }
        },
        {"$limit": 1}
    ]
    )
    cocktailDetails = {}
    for i in cocktail:
        cocktailDetails = i
    return render_template('editcocktail.html', cocktail=cocktailDetails)


@update.route('/update/cocktail/', methods=["POST"])
def update_drink_in_db():
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
    connection["cocktails"].update_one(
        {"_id": ObjectId(dataDict["id"])},
        {"$set":
            {"name": dataDict["name"],
                "description": dataDict["description"],
                "flavor_tags": ingredients_and_flavors[0],
                "ingredients": ingredients_and_flavors[1],
                "method": dataDict["instructions"],
                "glass": dataDict["glass"],
                "equipment": dataDict["equipment"],
                "creator": ObjectId(session['_id']),
                "updated_at": str(datetime.now()),
                "preferred_spirits": [],
                "image_url": dataDict["image_url"]}
         }
    )
    resp = jsonify(success=True)
    return resp
