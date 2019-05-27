import json

from flask import Blueprint, session, render_template, request, redirect
from bson import ObjectId
from bson.json_util import dumps

from .utils import mongo_connect, aggregate_cocktail_previews

filters = Blueprint('index', __name__)


@filters.route('/filter/<type>/<keyword>')
@filters.route('/filter/<type>/<keyword>/<filter>')
def view_by_type(type_of_search, keyword, filter=None):
    """
    route to render a subsection of the cocktails
    """
    connection = mongo_connect()
    cocktails = connection["cocktails"]
    user = get_user()
    cocktail_previews = aggregate_cocktail_previews(cocktails, filter)
    outputCocktails = []
    for i in cocktailPreviews:
        if type_of_search == "ingredient":
            for ingredient in i["ingredient_list"]:
                if ingredient["name"] == keyword:
                    outputCocktails.append(i)
        elif type_of_search == "flavor":
            if any(flavor["name"] == keyword for flavor in i["flavors"]):
                outputCocktails.append(i)

    return render_template(
        'filtered.html',
        cocktails=outputCocktails,
        user=user,
        urlString="viewing > {} > {}".format(type_of_search, keyword)
    )


@filters.route('/advanced_filter/new', methods=["POST", "GET"])
@filters.route('/advanced_filter/new/<count>', methods=["POST", "GET"])
def advanced_filter(count=None):
    data = request.data
    data_dict = json.loads(data)
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
    # generate query
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
    connection = mongo_connect()
    resultCount = connection["cocktails"].find(query).count()
    if count is not None:
        return dumps({"count": resultCount})
    else:
        results = aggregate_cocktail_previews(
             connection["cocktails"],
             None,
             query
        )
        user = get_user
        return render_template(
            'filtered.html',
            cocktails=results,
            user=user,
            urlString="custom search"
        )


def get_user():
    user = None
    if session:
        user = connection["users"].find_one({"_id": ObjectId(session['_id'])})
    return user
