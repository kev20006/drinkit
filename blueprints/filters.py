import ast
import json

from flask import Blueprint, session, render_template, request, url_for
from flask import redirect

from bson import ObjectId
from bson.json_util import dumps

from .utils import (mongo_connect, aggregate_cocktail_previews,
                    get_user, genereate_mongo_query)

filters = Blueprint('index', __name__)


@filters.route('/filter/<type_of_search>/<keyword>')
@filters.route('/filter/<type_of_search>/<keyword>/<filter>')
def view_by_type(type_of_search, keyword, filter=None):
    """
    route to render a subsection of the cocktails
    """
    connection = mongo_connect()
    cocktails = connection["cocktails"]
    user = get_user()
    cocktail_previews = aggregate_cocktail_previews(cocktails, filter)
    output_cocktails = []
    for i in cocktail_previews:
        if type_of_search == "ingredient":
            for ingredient in i["ingredient_list"]:
                if ingredient["name"] == keyword:
                    output_cocktails.append(i)
        elif type_of_search == "flavor":
            if any(flavor["name"] == keyword for flavor in i["flavors"]):
                output_cocktails.append(i)

    return render_template(
        'filtered.html',
        cocktails=output_cocktails,
        user=user,
        urlString="viewing > {} > {}".format(type_of_search, keyword)
    )


@filters.route('/advanced_filter', methods=["POST"])
@filters.route('/advanced_filter/<count>', methods=["POST"])
def advanced_filter(count=None):
    connection = mongo_connect()
    data = request.data
    data_dict = json.loads(data)
    if count is not None:
        query = genereate_mongo_query(data_dict)
        resultCount = connection["cocktails"].find(query).count()
        return dumps({"count": resultCount})
    else:
        url = url_for(
            "index.filter_results",
            ingredients=data_dict["ingredient_list"],
            flavors=data_dict["flavor_list"],
            type_of_search=data_dict["type"]
        )
        return dumps({"url": url})


@filters.route('/results/<type_of_search>/<ingredients>/<flavors>')
def filter_results(type_of_search, ingredients, flavors):
    filter_dict = {
        "ingredient_list": ast.literal_eval(ingredients),
        "flavor_list": ast.literal_eval(flavors),
        "type": type_of_search
    }
    query = genereate_mongo_query(filter_dict)
    connection = mongo_connect()
    results = aggregate_cocktail_previews(
        connection["cocktails"],
        None,
        query
    )
    user = get_user()
    return render_template(
        'filtered.html',
        cocktails=results,
        user=user,
        urlString="custom filter",
        tags=filter_dict
    )

