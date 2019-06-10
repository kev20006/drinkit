import json

from flask import Blueprint, session, render_template
from bson import ObjectId
from bson.json_util import dumps


from .utils import mongo_connect, add_flavor_return_id
from .utils import add_ingredient_return_id

api = Blueprint('api', __name__)


@api.route('/api/ingredients/')
@api.route('/api/ingredients/<type>')
def get_ingredients_by_type(type=None):
    connection = mongo_connect()
    if not type:
        ingredients = connection["ingredients"].find({})
    else:
        ingredients = connection["ingredients"].find({"type": type})
    return dumps(ingredients)


@api.route('/api/flavors/')
@api.route('/api/flavors/<id>')
def get_flavors(id=None):
    connection = mongo_connect()
    if id:
        flavors = connection["flavors"].find({"_id": ObjectId(id)})
    else:
        flavors = connection["flavors"].find({})
    return dumps(flavors)


@api.route('/api/comments/<cocktail_id>')
def get_comments(cocktail_id):
    connection = mongo_connect()
    comments = connection["comments"].aggregate(
        [
            {"$match": {"cocktail_id": ObjectId(cocktail_id)}},
            {"$lookup":
                {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user_info"
                }
             },
            {"$project":
                {"user_info._id": 0,
                    "user_info.passhash": 0,
                    "user_info.starred_cocktails": 0,
                    "user_info.favorite_flavors": 0,
                    "user_info.favorite_ingredients": 0
                 }
             }
        ]
    )
    return dumps(comments)


@api.route('/api/cocktails/<user_id>')
def get_cocktails_by_user(user_id):
    connection = mongo_connect()
    cocktails = connection["cocktails"].find({
        "creator": ObjectId(user_id)
    })
    return dumps(cocktails)


@api.route('/api/cocktail/<cocktail_id>')
def get_cocktails_by_id(cocktail_id):
    connection = mongo_connect()
    cocktail = connection["cocktails"].find_one({
        "_id": ObjectId(cocktail_id)
    })
    return dumps(cocktail)


@api.route('/api/check_user/<name>')
def check_user_exists(name):
    """
    takes a name and checks if a user exists
    """
    connection = mongo_connect()
    user = connection["users"].find_one({
        "username": name
    })
    if user:
        return "True"
    else:
        return "False"


def get_ingredient_and_flavor_list(dataDict):
    """
    function take an array of flavor and ingredient names
    and returns arrays of the corresponding ids
    """
    ingredients = json.loads(get_ingredients_by_type())
    flavors = json.loads(get_flavors())
    flavor_ids = []
    for i in dataDict["flavors"]:
        if any(j["name"] == i for j in flavors):
            for j in flavors:
                if j["name"] == i:
                    flavor_ids.append(ObjectId(j["_id"]["$oid"]))
        else:
            flavor_ids.append(
                ObjectId(add_flavor_return_id(i))
            )

    ingredient_ids = []
    for i in dataDict["ingredients"]:
        if any(j["name"] == i["name"] for j in ingredients):
            for j in ingredients:
                if j["name"] == i["name"]:
                    new_ingredient_id = j["_id"]["$oid"]
        else:
            new_ingredient_id = add_ingredient_return_id(i["name"], i["type"])

        ingredient_ids.append(
            {
                "ingredient": ObjectId(new_ingredient_id),
                "quantity": i['quantity'],
                "units": i['units'],
                "type": i['type']
            })
    return (flavor_ids, ingredient_ids)
