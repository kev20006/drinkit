import os
import json

from bson import ObjectId
from pymongo import MongoClient

import pymongo

conString = ("mongodb+srv://kev:22c2c119f3" +
             "@cluster0-nnrmm.mongodb.net/bartendr?retryWrites=true")


def mongo_connect():
    """
    connect to db and return connection
    """
    try:
        conn = pymongo.MongoClient(conString)
        return conn["bartendr"]
    except pymongo.errors.ConnectionFailure as e:
        print("Could not connect to MongoDB: %s") % e


def aggregate_cocktail_previews(cocktails, page, filter, match=None):
    """
    function to aggregate information from all the tables
    to create the item previews used on the index page and
    in search results
    """
    page = (int(page) * 5)-5
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
         },
        {"$skip": page},
        {"$limit": 5}
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
