from flask import jsonify
from flask.ext import restful
import xwingmetadata
from persistence import PersistenceManager
from api import TourneyToJsonConverter

import myapp

def init(api):
    api.add_resource(MetadataSetsAPI, '/api/v2/metadata/sets')
    api.add_resource(MetadataFormatsAPI, '/api/v2/metadata/formats')
    api.add_resource(TournamentSummaryAPI, '/api/v2/tournaments')
    api.add_resource(VenuesAPI, '/api/v2/venues')

class MetadataSetsAPI(restful.Resource):
    def get(self):
        return jsonify(data=sorted(xwingmetadata.sets_and_expansions.keys()))

class MetadataFormatsAPI(restful.Resource):
    def get(self):
        # Sort reverse
        return jsonify(data=sorted(list(xwingmetadata.formats))[::-1])

class TournamentSummaryAPI(restful.Resource):
    def get(self):
        tourneys = PersistenceManager(myapp.db_connector).get_all_tourneys()
        converter = TourneyToJsonConverter()
        jsonTourneys = map(lambda t: converter.convert_shallow(t), tourneys)
        return jsonify(data=jsonTourneys)

class VenuesAPI(restful.Resource):
    def get(self):
        pm = PersistenceManager(myapp.db_connector)
        venues = pm.get_tourney_venues()
        return jsonify(data=venues)
