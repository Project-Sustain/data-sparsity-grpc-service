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

import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.stub.StreamObserver;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;
import java.util.Iterator;
import java.lang.Long;

public class SparsityScoreGeneratorServer {
  private static final Logger logger = Logger.getLogger(SparsityScoreGeneratorServer.class.getName());

  private Server server;

  private void start() throws IOException {
    int port = grpcConstants.portNum;
    server = ServerBuilder.forPort(port)
        .addService(new FindSparsityScoresImpl())
        .build()
        .start();
    logger.info("Server started, listening on " + port);
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        System.err.println("*** shutting down gRPC server since JVM is shutting down");
        try {
          SparsityScoreGeneratorServer.this.stop();
        } catch (InterruptedException e) {
          e.printStackTrace(System.err);
        }
        System.err.println("*** server shut down");
      }
    });
  }

  private void stop() throws InterruptedException {
    if (server != null) {
      server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
    }
  }

  private void blockUntilShutdown() throws InterruptedException {
    if (server != null) {
      server.awaitTermination();
    }
  }

  public static void main(String[] args) throws IOException, InterruptedException {
    final SparsityScoreGeneratorServer server = new SparsityScoreGeneratorServer();
    server.start();
    server.blockUntilShutdown();
  }

  static class FindSparsityScoresImpl extends FindSparsityScoresGrpc.FindSparsityScoresImplBase {

    @Override
    public void checkServerConnection(ConnectionRequest req, StreamObserver<ConnectionReply> responseObserver) {
      String hash = req.getMessage();
      ConnectionStatus responseStatus;
      if(hash.equals("server")) {
        responseStatus = ConnectionStatus.SUCCESS;
      }
      else {
        responseStatus = ConnectionStatus.FAILURE;
      }
      ConnectionReply reply = ConnectionReply.newBuilder().setStatus(responseStatus).build();
      responseObserver.onNext(reply);
      responseObserver.onCompleted(); 
    }

    @Override
    public void checkDatabaseConnection(ConnectionRequest req, StreamObserver<ConnectionReply> responseObserver) {
      String hash = req.getMessage();
      ConnectionStatus responseStatus;
      MongoConnection mongoConnection = new MongoConnection();
      if(mongoConnection.getMongoConnection() == null) {
        responseStatus = ConnectionStatus.FAILURE;
      }
      else {
        responseStatus = ConnectionStatus.SUCCESS;
      }
      ConnectionReply reply = ConnectionReply.newBuilder().setStatus(responseStatus).build();
      responseObserver.onNext(reply);
      responseObserver.onCompleted(); 
    }

    @Override
    public void calculateSparsityScores(SSGRequest req, StreamObserver<SSGReply> responseObserver) {
      String collectionName = req.getCollectionName();
      SSGRequest.ScopeType spatialScope = req.getSpatialScope();
      String spatialIdentifier = req.getSpatialIdentifier();
      Long startTime = req.getStartTime();
      Long endTime = req.getEndTime();

      ArrayList<String> measurementTypes = new ArrayList<>();
      for(Object measurementType : Arrays.asList(req.getMeasurementTypesList().toArray())) {
        measurementTypes.add(measurementType.toString());
      }

      SparsityScoreGenerator ssg = new SparsityScoreGenerator(collectionName, startTime, endTime, spatialScope, spatialIdentifier, measurementTypes);
      ssg.streamSparsityData(responseObserver);
      
    }

  }
  
}
