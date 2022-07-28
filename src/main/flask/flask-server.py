from flask import Flask, request, stream_with_context
from flask_cors import CORS

import json
from http import HTTPStatus

import grpc
import sparsityscoregenerator_pb2
import sparsityscoregenerator_pb2_grpc

from google.protobuf.json_format import MessageToJson, MessageToDict

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


@app.route("/testDataTransfer", methods=["POST", "GET"])
def testDataTransfer():
    if request.method == 'POST':
        body = request.json
        return json.dumps(body + " RESPONSE")


@app.route("/temporalRange", methods=["POST", "GET"])
def getTemporalRange():
    if request.method == 'POST':
        body = request.json
        if 'collectionName' in body:
            collectionName = body['collectionName']
            with grpc.insecure_channel('localhost:50042') as channel:
                stub = sparsityscoregenerator_pb2_grpc.GetRequestParamsStub(channel)
                response = stub.TemporalRange(sparsityscoregenerator_pb2.TRRequest(
                    collectionName = collectionName
                ))
            return json.dumps(MessageToDict(response, preserving_proto_field_name=True))
        else: return json.dumps({'measurementTypes':[]})


@app.route("/measurementTypes", methods=["POST", "GET"])
def getMeasurementTypes():
    if request.method == 'POST':
        body = request.json
        if 'collectionName' in body:
            collectionName = body['collectionName']
            with grpc.insecure_channel('localhost:50042') as channel:
                stub = sparsityscoregenerator_pb2_grpc.GetRequestParamsStub(channel)
                response = stub.AllMeasurementTypes(sparsityscoregenerator_pb2.AMTRequest(
                    collectionName = collectionName
                ))
            return json.dumps(MessageToDict(response, preserving_proto_field_name=True))
        else: return json.dumps({'measurementTypes':[]})


@app.route("/sparsityScores", methods=["POST", "GET"])
def sendSparsityScoreRequest():
    if request.method == 'POST': body = request.json
    else: body = {}

    def generate():
        with grpc.insecure_channel('localhost:50042') as channel:
            stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
            request = sparsityscoregenerator_pb2.SSGRequest(
                collectionName = body['collectionName'], 
                spatialScope = body['spatialScope'], 
                spatialIdentifier = body['spatialIdentifier'],
                startTime = body['startTime'],
                endTime = body['endTime'],
                measurementTypes = body['measurementTypes']
            )

            for stream_response in stub.CalculateSparsityScores(request):
                dict_message = MessageToDict(stream_response, preserving_proto_field_name=True)
                yield json.dumps(dict_message, indent=None) + '\n'

            response = json.dumps({"ok": True}, indent=None), HTTPStatus.OK
            return response
    
    return app.response_class(stream_with_context(generate()))
