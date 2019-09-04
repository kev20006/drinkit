import json

from datetime import datetime
from flask import Blueprint, session, render_template, request, jsonify
from bson import ObjectId

from .utils import mongo_connect, get_user
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
            {"_id": ObjectId(session["_id"])},
            {"$push": {
                favorite_things["type"]: ObjectId(favorite_things["item_id"])
            }
            }
        )
    else:
        connection["users"].update_one(
            {"_id": ObjectId(session["_id"])},
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


@update.route('/cocktail/edit/<cocktail_id>')
def update_cocktail(cocktail_id):
    """
    route to update a cocktails details
    """
    if "_id" in session:
        user = get_user()
        if ObjectId.is_valid(cocktail_id):
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
            if cocktail:
                cocktailDetails = {}
                for i in cocktail:
                    cocktailDetails = i
                if "creator" in cocktailDetails:
                    if cocktailDetails['creator'] == ObjectId(session["_id"]):
                        return render_template(
                            'editcocktail.html',
                            cocktail=cocktailDetails,
                            user=user
                        )
    return render_template('notfound.html'), 404


@update.route('/cocktail/edit/', methods=["POST"])
def update_drink_in_db():
    """
    function called from the cocktail form to add a drink to the
    database using AJAX
    """
    data = request.data
    data_dict = json.loads(data)

    # function returns an array
    # index 0: list of flavors
    # index 1: is a list of ingredients
    ingredients_and_flavors = get_ingredient_and_flavor_list(data_dict)
    print(data_dict)
    print(ingredients_and_flavors)
    connection = mongo_connect()
    connection["cocktails"].update_one(
        {"_id": ObjectId(data_dict["id"])},
        {"$set":
            {"name": data_dict["name"],
                "description": data_dict["description"],
                "flavor_tags": ingredients_and_flavors[0],
                "ingredients": ingredients_and_flavors[1],
                "method": data_dict["instructions"],
                "glass": data_dict["glass"],
                "equipment": data_dict["equipment"],
                "creator": ObjectId(session['_id']),
                "updated_at": str(datetime.now()),
                "image_url": data_dict["image_url"]}
         }
    )
    resp = jsonify(success=True)
    return resp


@update.route('/user/update/<user_id>', methods=["POST"])
def add_profile(user_id):
    data = request.data
    data_dict = dict(json.loads(data))
    connection = mongo_connect()
    try:
        connection["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "profile_pic": data_dict["profile_url"],
                "bio": data_dict["bio"]
            }
            }
        )
        resp = jsonify(success=True)
        return resp
    except:
        resp = jsonify(success=False)
        return resp
