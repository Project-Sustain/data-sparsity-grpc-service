from flask import Flask, make_response, stream_with_context
from flask_cors import CORS

import json
from http import HTTPStatus

import grpc
import sparsityscoregenerator_pb2
import sparsityscoregenerator_pb2_grpc

from google.protobuf.json_format import MessageToDict, MessageToJson

from enums import scopeTypeEnum

app = Flask(__name__)
CORS(app)

@app.route("/")
def checkConnections():
    return "Flask Server Home"


@app.route("/serverConnection")
def checkServerConnection():
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        serverResponse = stub.CheckServerConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    response = serverResponse.status
    return json.dumps(response)


@app.route("/dbConnection")
def checkDbConnection():
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        databaseResponse = stub.CheckDatabaseConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    response = databaseResponse.status
    return json.dumps(response)


@app.route("/sparsityScores", methods=["POST", "GET"]) # Is this the right method??
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

            for stream_response in stub.CalculateSparsityScores(request):
                yield MessageToJson(stream_response, preserving_proto_field_name=True)

            response = json.dumps({"ok": True}, indent=None), HTTPStatus.OK
            return response
    
    return app.response_class(stream_with_context(generate()))
