import os
import json

from flask import session
from bson import ObjectId
from pymongo import MongoClient

import pymongo


def mongo_connect():
    """
    connect to db and return connection
    """
    try:
        if 'TEST_URI' in os.environ:
            conn = pymongo.MongoClient(os.environ["TEST_URI"])
            return conn[os.environ["TEST_DB"]]
        else:
            conn = pymongo.MongoClient(os.environ["MONGO_URI"])
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


def get_user():
    user = None
    if '_id' in session:
        connection = mongo_connect()
        user = connection["users"].find_one({"_id": ObjectId(session['_id'])})
    return user


def genereate_mongo_query(data_dict):
    if len(data_dict["ingredient_list"]):
        data_dict["ingredients"] = []
    if len(data_dict["flavor_list"]):
        data_dict["flavor_tags"] = []
    for i in data_dict["ingredient_list"]:
        data_dict["ingredients"].append(ObjectId(str(i)))
    for i in data_dict["flavor_list"]:
        data_dict["flavor_tags"].append(ObjectId(str(i)))
        data_dict.pop("ingredient_list", None)
        data_dict.pop("flavor_list", None)
    query = {"${}".format(data_dict["type"]): []}
    for key in data_dict.keys():
        if key == "ingredients":
            queryString = {
                "ingredients":
                    {"$elemMatch":
                        {"ingredient":
                            {"$in": data_dict[key]}
                         }
                     }
            }
        elif key == "flavor_tags" or key == "equipment":
            queryString = {key: {"$in": data_dict[key]}}
        else:
            queryString = {key: data_dict[key]}
        if key != "type":
            query["${}".format(data_dict["type"])].append(queryString)
    return query
