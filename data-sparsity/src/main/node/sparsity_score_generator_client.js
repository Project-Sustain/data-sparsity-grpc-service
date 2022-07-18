/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = __dirname + '/../proto/sparsityscoregenerator.proto';

// var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var datasparsity_proto = grpc.loadPackageDefinition(packageDefinition).sparsityscoregenerator;

async function checkConnection(client, type) {
  if(type === "server") {
    await client.checkServerConnection({message: "server"}, function(err, response) {
      if(response.status === "SUCCESS") {
        return true;
      }
      else return false;
    });
  }
  else {
    await client.checkDatabaseConnection({message: "database"}, function(err, response) {
      if(response.status === "SUCCESS") {
        return true;
      }
      else return false;
    });
  }
}

async function sendSparsityScoreRequest(client, collectionName, spatialScope, spatialIdentifier, startTime, endTime, measurementTypes) {
  await client.calculateSparsityScores({
      collectionName: collectionName, 
      spatialScope: spatialScope, 
      spatialIdentifier: spatialIdentifier, 
      startTime: startTime, 
      endTime: endTime, 
      measurementTypes: measurementTypes
    }, function(err, response) {
    console.log({response});
  });
}

function main() {

  target = 'localhost:50042';

  var collectionName = "water_quality_bodies_of_water";
  var spatialScope = "STATE";
  var spatialIdentifier = "G080";
  var startTime = 946742626000;
  var endTime = 1577894626000;
  var measurementTypes = ["Ammonia", "Phosphate", "Sulphate", "Temperature, water"]

  var client = new datasparsity_proto.FindSparsityScores(target, grpc.credentials.createInsecure());

  var serverConnection = checkConnection(client, "server");
  var databaseConnection = checkConnection(client, "database");

  if(serverConnection) {
    console.log("Server Connected");
    if(databaseConnection) {
      console.log("Database Connected");
      // sendSparsityScoreRequest(collectionName, spatialScope, spatialIdentifier, startTime, endTime, measurementTypes);
    }
    else {
      console.log("Database Connection ERROR");
    }
  }
  else {
    console.log("Server Connection ERROR");
  }
}

main();
