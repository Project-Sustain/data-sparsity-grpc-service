# Copyright 2015 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import asyncio

import grpc
import sparsityscoregenerator_pb2
import sparsityscoregenerator_pb2_grpc

from enums import statusEnum, scopeTypeEnum


def checkServerConnection():
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        response = stub.CheckServerConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    print(f"Server Connection: {statusEnum[response.status]}")


def checkDatabaseConnection():
    with grpc.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
        response = stub.CheckDatabaseConnection(sparsityscoregenerator_pb2.ConnectionRequest())
    print(f"Database Connection: {statusEnum[response.status]}")


async def sendSparsityScoreRequest(request):
    async with grpc.aio.insecure_channel('localhost:50042') as channel:
        stub = sparsityscoregenerator_pb2_grpc.FindSparsityScoresStub(channel)
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

# NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
if __name__ == '__main__':
    logging.basicConfig()
    checkServerConnection()
    checkDatabaseConnection()
    tempData = {
        "collectionName": "water_quality_bodies_of_water",
        "spatialScope": scopeTypeEnum[2],
        "spatialIdentifier": "G080",
        "startTime": 946742626000,
        "endTime": 1577894626000,
        "measurementTypes": ["Ammonia", "Phosphate", "Sulphate", "Temperature, water"]
    }
    loop = asyncio.get_event_loop()
    loop.run_until_complete(sendSparsityScoreRequest(tempData))
