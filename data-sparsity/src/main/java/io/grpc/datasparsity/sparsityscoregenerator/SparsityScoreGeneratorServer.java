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

/**
 * Server that manages startup/shutdown of a {@code MongoTest} server.
 */
public class SparsityScoreGeneratorServer {
  private static final Logger logger = Logger.getLogger(SparsityScoreGeneratorServer.class.getName());

  private Server server;

  private void start() throws IOException {
    /* The port on which the server should run */
    int port = 50051;
    server = ServerBuilder.forPort(port)
        .addService(new FindSparsityScoresImpl())
        .build()
        .start();
    logger.info("Server started, listening on " + port);
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        // Use stderr here since the logger may have been reset by its JVM shutdown hook.
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

  /**
   * Await termination on the main thread since the grpc library uses daemon threads.
   */
  private void blockUntilShutdown() throws InterruptedException {
    if (server != null) {
      server.awaitTermination();
    }
  }

  /**
   * Main launches the server from the command line.
   */
  public static void main(String[] args) throws IOException, InterruptedException {
    final SparsityScoreGeneratorServer server = new SparsityScoreGeneratorServer();
    server.start();
    server.blockUntilShutdown();
  }

  static class FindSparsityScoresImpl extends FindSparsityScoresGrpc.FindSparsityScoresImplBase {

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


      /*
       * Temp Data
       */
      SSGReply.SiteSparsityData ssd1 = SSGReply.SiteSparsityData.newBuilder()
        .setMonitorId("FoCo")
        .setSparsityScore(42)
        .setCoordinates(SSGReply.Coordinates.newBuilder()
          .setLongitude(-105.072)
          .setLatitude(40.572))
        .setNumberOfMeasurements(513)
        .build();
      
      SSGReply.SiteSparsityData ssd2 = SSGReply.SiteSparsityData.newBuilder()
        .setMonitorId("Seattle")
        .setSparsityScore(206)
        .setCoordinates(SSGReply.Coordinates.newBuilder()
          .setLongitude(47.644)
          .setLatitude(-122.317))
        .setNumberOfMeasurements(2617)
        .build();
      /*
       * End Temp Data
       */


      ArrayList<SSGReply.SiteSparsityData> sparsityData = new ArrayList<>();
      sparsityData.add(ssd1);
      sparsityData.add(ssd2);

      for (SSGReply.SiteSparsityData data : sparsityData) {
        SSGReply reply = SSGReply.newBuilder().setSiteSparsityData(data).build();
        responseObserver.onNext(reply);
      }
      responseObserver.onCompleted();

    }

  }
  
}
