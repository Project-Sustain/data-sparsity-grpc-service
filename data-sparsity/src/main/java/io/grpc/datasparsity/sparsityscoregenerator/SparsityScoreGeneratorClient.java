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

  public void sendClientData(String collectionName, SSGRequest.ScopeType spatialScope, String spatialIdentifier, Long startTime, Long endTime, ArrayList<String> measurementTypes) {
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
        response = blockingStub.checkServerConnection(request);
      }
      connectionStatus = response.getStatus();
      logger.info(type + " connection: " + connectionStatus);
    } catch (StatusRuntimeException e) {
      logger.log(Level.WARNING, "RPC failed: {0}", e.getStatus());
      connectionStatus = ConnectionStatus.FAILURE;
    }
    if(connectionStatus == ConnectionStatus.SUCCESS) return true;
    else return false;
  }

  public static void main(String[] args) throws Exception {
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
    String target = grpcConstants.ipAddress + ":" + grpcConstants.portNum;
    // Allow passing in the user and target strings as command line arguments
    if (args.length > 0) {
      if ("--help".equals(args[0])) {
        System.err.println("Usage: [name [target]]");
        System.err.println("");
        System.err.println("  name    The collection you want a Monitor ID for. Defaults to " + collectionName);
        System.err.println("  target  The server to connect to. Defaults to " + target);
        System.exit(1);
      }
      collectionName = args[0];
    }
    if (args.length > 1) {
      target = args[1];
    }

    ManagedChannel channel = ManagedChannelBuilder.forTarget(target)
        .usePlaintext()
        .build();
    try {
      SparsityScoreGeneratorClient client = new SparsityScoreGeneratorClient(channel);
      if(client.sendConnectionCheck("server")) {
        logger.info("Server is responsive, checking Database connection");
        if(client.sendConnectionCheck("database")) {
          logger.info("Database is responsive, sending Sparsity Query");
          client.sendClientData(collectionName, spatialScope, spatialIdentifier, startTime, endTime, measurementTypes);
        }
        else logger.warning("***Database is NOT Responding***");
      }
      else logger.warning("***Server is NOT Responding***");
    } finally {
      channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
    }
  }
}
