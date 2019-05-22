from flask import Blueprint, session, render_template
from bson import ObjectId

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
    user = None
    if session:
        user = connection["users"].find_one({"_id": ObjectId(session['_id'])})
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

    print(len(outputCocktails))
    return render_template(
        'filtered.html',
        cocktails=outputCocktails,
        user=user,
        urlString="v/{}/{}".format(type_of_search, keyword)
    )


@filters.route('/advanced_filter/', methods=["POST", "GET"])
@filters.route('/advanced_filter/<count>', methods=["POST", "GET"])
def advanced_filter(count=None):
    # change this so it happens programmatically not hard coded
    # data_dict = {}
    # data_dict["type"] = "and"
    # data_dict["ingredients"] = [
    #        ObjectId("5cab524eec4ad12098cc2807"),
    #        ObjectId("5c9b8df91c9d440000478c92")
    #    ]
    # data_dict["equipment"] = ["Shaker"]
    #
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
    print(query)
    cocktails = connection["cocktails"].find(query)
    if count:
        return "35 records"
    else:
        return "done"
