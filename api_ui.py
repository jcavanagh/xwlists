from flask import jsonify
from flask.ext import restful
import xwingmetadata

import myapp

def init(api):
    api.add_resource(MetadataSetsAPI, '/api/v1/metadata/sets')
    api.add_resource(MetadataFormatsAPI, '/api/v1/metadata/formats')
    api.add_resource(VenuesAPI, '/api/v1/venues')

class MetadataSetsAPI(restful.Resource):
    def get(self):
        return jsonify(data=sorted(xwingmetadata.sets_and_expansions.keys()))

class MetadataFormatsAPI(restful.Resource):
    def get(self):
        return jsonify(data=xwingmetadata.formats)

class VenuesAPI(restful.Resource):
    def get(self):
        pm = PersistenceManager(myapp.db_connector)
        venues = pm.get_tourney_venues()
        return jsonify(data=venues)
