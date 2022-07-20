from flask import Flask

import logging
import asyncio

import grpc
import sparsityscoregenerator_pb2
import sparsityscoregenerator_pb2_grpc

from enums import statusEnum, scopeTypeEnum

app = Flask(__name__)


@app.route("/")
@app.route("/connections")
def checkConnections():
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        serverResponse = stub.CheckServerConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        databaseResponse = stub.CheckDatabaseConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    return f"Server Connection: {statusEnum[serverResponse.status]}\nDatabase Connection: {statusEnum[databaseResponse.status]}"


@app.route("/sparsityScoreRequest")
async def sendSparsityScoreRequest(request):
    async with grpc.aio.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        results = []
        response_stream = stub.CalculateSparsityScores(sparsityscoregenerator_pb2.SSGRequest(
            collectionName = request['collectionName'], 
            spatialScope = request['spatialScope'], 
            spatialIdentifier = request['spatialIdentifier'],
            startTime = request['startTime'],
            endTime = request['endTime'],
            measurementTypes = request['measurementTypes']
            ))
        while True:
            response = await response_stream.read()
            if response == grpc.aio.EOF:
                break
            print(f"{response.siteSparsityData}")
            results.append(response.siteSparsityData)
        return results
        