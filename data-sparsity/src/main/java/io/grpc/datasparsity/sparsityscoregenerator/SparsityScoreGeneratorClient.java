/*
 * Copyright 2015 The gRPC Authors
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
 */

package io.grpc.datasparsity.sparsityscoregenerator;

import io.grpc.Channel;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import io.grpc.datasparsity.sparsityscoregenerator.SSGReply.SiteSparsityData;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.lang.Long;
import java.util.Iterator;

public class SparsityScoreGeneratorClient {
  private static final Logger logger = Logger.getLogger(SparsityScoreGeneratorClient.class.getName());

  private final FindSparsityScoresGrpc.FindSparsityScoresBlockingStub blockingStub;

  public SparsityScoreGeneratorClient(Channel channel) {
    blockingStub = FindSparsityScoresGrpc.newBlockingStub(channel);
  }

  /*
   * Sends client-defined data to the server for Sparsity data calculation
   */
  public void sendSparsityScoreRequest(String collectionName, SSGRequest.ScopeType spatialScope, String spatialIdentifier, Long startTime, Long endTime, ArrayList<String> measurementTypes) {
    logger.info("Will try to get Sparsity Scores for " + collectionName + "...");
    SSGRequest request = SSGRequest.newBuilder()
        .setCollectionName(collectionName)
        .setSpatialScope(spatialScope)
        .setSpatialIdentifier(spatialIdentifier)
        .setStartTime(startTime)
        .setEndTime(endTime)
        .addAllMeasurementTypes(measurementTypes)
        .build();

    Iterator<SSGReply> response;

    try {
      response = blockingStub.calculateSparsityScores(request);
      for (int i = 0; response.hasNext(); i++) {
        SSGReply.SiteSparsityData data = response.next().getSiteSparsityData();
        logger.info(data.toString());
      }
    } catch (StatusRuntimeException e) {
      logger.log(Level.WARNING, "RPC failed: {0}", e.getStatus());
      return;
    }
  }

  /*
   * Checks to see if their the server or database are responding
   */
  public boolean sendConnectionCheck(String type) {
    logger.info("Checking " + type + " connection");
    ConnectionRequest request = ConnectionRequest.newBuilder().setMessage(type).build();
    ConnectionReply response;
    ConnectionStatus connectionStatus;
    try {
      if(type.equals("server")) {
        response = blockingStub.checkServerConnection(request);
      }
      else {
        response = blockingStub.checkDatabaseConnection(request);
      }
      connectionStatus = response.getStatus();
    } catch (StatusRuntimeException e) {
      logger.log(Level.WARNING, "RPC failed: {0}", e.getStatus());
      connectionStatus = ConnectionStatus.FAILURE;
    }
    if(connectionStatus == ConnectionStatus.SUCCESS) return true;
    else return false;
  }

  public static void main(String[] args) throws Exception {

    // Temporary, hard-coded values
    String collectionName = "water_quality_bodies_of_water";
    SSGRequest.ScopeType spatialScope = SSGRequest.ScopeType.COUNTY;
    String spatialIdentifier = "G0800690";
    Long startTime = 946742626000L;
    Long endTime = 1577894626000L;
    ArrayList<String> measurementTypes = new ArrayList<String>();
    measurementTypes.add("Ammonia");
    measurementTypes.add("Phosphate");
    measurementTypes.add("Sulphate");
    measurementTypes.add("Temperature, water");
    // END Temporary, hard-coded values

    // Boiler-plate Client setup
    String target = grpcConstants.ipAddress + ":" + grpcConstants.portNum;
    ManagedChannel channel = ManagedChannelBuilder.forTarget(target)
        .usePlaintext()
        .build();
    try {
      SparsityScoreGeneratorClient client = new SparsityScoreGeneratorClient(channel);

      // Check if Server is responding
      if(client.sendConnectionCheck("server")) {
        logger.info("Server is responsive, checking Database connection");

        // Check if Database is responding
        if(client.sendConnectionCheck("database")) {
          logger.info("Database is responsive, sending Sparsity Query");

          // Send Sparsity Score Request
          client.sendSparsityScoreRequest(collectionName, spatialScope, spatialIdentifier, startTime, endTime, measurementTypes);
        }

        else logger.warning("***Database is NOT Responding***");
      }

      else logger.warning("***Server is NOT Responding***");

    } finally {
      channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
    }
  }
}
