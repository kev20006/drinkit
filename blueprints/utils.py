import os

from bson import ObjectId
from pymongo import MongoClient
import pymongo

conString = os.environ.get('MONGO_URI')


def mongo_connect():
    """
    connect to db and return connection
    """
    try:
        conn = pymongo.MongoClient(conString)
        return conn["bartendr"]
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to MongoDB: %s") % e


def aggregate_cocktail_previews(cocktails, filter, match=None):
    """
    function to aggregate information from all the tables
    to create the item previews used on the index page and
    in search results
    """
    if match is None:
        match = {"name": {"$ne": "null"}}
    if filter is None or filter == "recent":
        filter = "created_at"
    elif filter == "popular":
        filter = "noOfVotes"
    cocktail_details = cocktails.aggregate([
        {"$match": match},
        {"$lookup":
            {
                "from": "users",
                "foreignField": "_id",
                "localField": "creator",
                "as": "creator"
            }
         },
        {"$unwind":
            {
                'path': '$flavor_tags',
                'preserveNullAndEmptyArrays': True
            }
         },
        {"$lookup":
            {
                "from": "flavors",
                "foreignField": "_id",
                "localField": "flavor_tags",
                "as": "flavors"
            }
         },
        {"$unwind":
            {
                'path': '$flavors',
                'preserveNullAndEmptyArrays': True
            }
         },
        {"$unwind": "$creator"},
        {"$unwind": "$ingredients"},
        {"$lookup":
            {
                "from": "ingredients",
                "foreignField": "_id",
                "localField": "ingredients.ingredient",
                "as": "ingredient_list"
            }
         },
        {"$unwind": "$ingredient_list"},
        {"$group":
            {
                "_id": "$_id",
                "name": {"$min": "$name"},
                "description": {"$min": "$description"},
                "flavor_tags": {"$min": "$flavor_tags"},
                "ingredients": {"$min": "$ingredients"},
                "votes": {"$min": "$votes"},
                "noOfVotes": {"$min": {"$subtract": [
                    {"$size": "$votes.upvotes"},
                    {"$size": "$votes.downvotes"}
                ]}
                },
                "image_url": {"$min": "$image_url"},
                "creator": {"$min": "$creator"},
                "flavors": {"$addToSet": '$flavors'},
                "created_at": {"$min": "$created_at"},
                "ingredient_list":  {"$addToSet": '$ingredient_list'}
            }
         },
        {"$sort":
            {filter: -1}
         }
    ])

    return cocktail_details


def get_id(collection, name):
    """
    given a name and a collection returns the id
    """
    item = collection.find_one({"name": name})
    if item is not None:
        return item["_id"]
    return None


def get_ingredient_and_flavor_list(dataDict):
    """
    function take an array of flavor and ingredient names
    and returns arrays of the corresponding ids
    """
    ingredients = json.loads(utils.get_ingredients_by_type())
    flavors = json.loads(utils.get_flavors())
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
                    ingredient_ids = j["_id"]["$oid"]
        else:
                ingredient_ids = add_ingredient_return_id(i["name"], i["type"])

        ingredient_ids.append(
            {
                "ingredient": ObjectId(ingredients_id),
                "quantity": i['quantity'],
                "units": i['units'],
                "type": i['type']
            })
    return (flavor_ids, ingredient_ids)


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


def find(list, key, value):
    for i, item in enumerate(list):
        if dic[key] == value:
            return i
    return -1
