from flask import Blueprint, session, render_template
from bson import ObjectId
from bson.json_util import dumps


from .utils import mongo_connect

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


@api.route('/api/spirits/<type>')
def spirits_by_type(type):
    connection = mongo_connect()
    spirits = connection["spirits"].find({"typeof": type})
    return dumps(spirits)


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
