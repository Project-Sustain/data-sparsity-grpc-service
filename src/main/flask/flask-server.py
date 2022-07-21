from flask import Flask, make_response, stream_with_context

import json
from http import HTTPStatus

import grpc
import sparsityscoregenerator_pb2
import sparsityscoregenerator_pb2_grpc

from google.protobuf.json_format import MessageToDict

from enums import statusEnum, scopeTypeEnum

app = Flask(__name__)


@app.route("/")
def checkConnections():
    return "Flask Server Home"


@app.route("/serverConnection")
def checkServerConnection():
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        serverResponse = stub.CheckServerConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    server_response = serverResponse.status
    response = make_response(json.dumps(server_response))
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/dbConnection")
def checkDbConnection():
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        databaseResponse = stub.CheckDatabaseConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    server_response = databaseResponse.status
    response = make_response(json.dumps(server_response))
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/sparsityScoreRequest", methods=['GET'])
def sendSparsityScoreRequest():

    def generate():
        with grpc.insecure_channel('localhost:50042') as channel:
            stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
            request = sparsityscoregenerator_pb2.SSGRequest(
                collectionName = "water_quality_bodies_of_water", 
                spatialScope = scopeTypeEnum[2], 
                spatialIdentifier = "G080",
                startTime = 946742626000,
                endTime = 1577894626000,
                measurementTypes = ["Ammonia", "Phosphate", "Sulphate", "Temperature, water"]
                )

            for response in stub.CalculateSparsityScores(request):
                dict_response = MessageToDict(response, preserving_proto_field_name=True)
                yield json.dumps(dict_response, indent=4) + "\n"

            # response = make_response(json.dumps({"ok": True}, indent=None), HTTPStatus.OK)
            # response.headers["Access-Control-Allow-Origin"] = "*"
            # return response
            return json.dumps({"ok": True}, indent=None), HTTPStatus.OK
    
    return app.response_class(stream_with_context(generate()))
