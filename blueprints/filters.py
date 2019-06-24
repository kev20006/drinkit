import ast
import json
import math

from flask import Blueprint, render_template, request, url_for

from bson.json_util import dumps

from .utils import (mongo_connect, aggregate_cocktail_previews,
                    get_user, genereate_mongo_query)

filters = Blueprint('index', __name__)


@filters.route('/filter/<type_of_search>/<keyword>')
@filters.route('/filter/<type_of_search>/<keyword>/<filter>/<page>')
def view_by_type(type_of_search, keyword, filter=None, page=1):
    """
    route to render a subsection of the cocktails
    """
    query_terms = {"ingredient_list": [], "flavor_list": [], "type": "or"}
    search_id = mongo_connect()["{}s".format(type_of_search)].find_one(
        {"name": keyword}
    )
    key = "ingredient_list" if type_of_search == "ingredient" else "flavor_list"
    query_terms[key] = [str(search_id["_id"])]
    query = genereate_mongo_query(query_terms)

    connection = mongo_connect()
    cocktails = connection["cocktails"]
    user = get_user()
    cocktail_previews = aggregate_cocktail_previews(
        cocktails,
        page,
        filter,
        query
    )
    total_results = connection["cocktails"].find(query).count()

    max_pages = math.ceil(total_results/5)
    return render_template(
        'filtered.html',
        cocktails=list(cocktail_previews),
        user=user,
        url_string="viewing > {} > {}".format(type_of_search, keyword),
        current_page=page,
        pages=max_pages,
        type_of_search=type_of_search,
        keyword=keyword,
        filter=filter
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
            type_of_search=data_dict["type"],
            page=1
        )
        return dumps({"url": url})


@filters.route('/results/<type_of_search>/<ingredients>/<flavors>/')
@filters.route('/results/<type_of_search>/<ingredients>/<flavors>/<page>/<filter>')
def filter_results(type_of_search, ingredients, flavors, filter=None, page=1):
    filter_dict = {
        "ingredient_list": ast.literal_eval(ingredients),
        "flavor_list": ast.literal_eval(flavors),
        "type": type_of_search
    }
    query = genereate_mongo_query(filter_dict)
    connection = mongo_connect()
    results = aggregate_cocktail_previews(
        connection["cocktails"],
        page,
        filter,
        query
    )
    resultCount = connection["cocktails"].find(query).count()
    pages = math.ceil(resultCount/5)
    user = get_user()
    return render_template(
        'filtered.html',
        type_of_search=type_of_search,
        cocktails=list(results),
        user=user,
        url_string="custom filter",
        tags=filter_dict,
        current_page=page,
        pages=pages,
        ingredients=ingredients,
        flavors=flavors,
        filter=filter
    )
