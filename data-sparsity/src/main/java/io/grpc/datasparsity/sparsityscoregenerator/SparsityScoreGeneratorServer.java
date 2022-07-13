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
      String spatialScope = req.getSpatialScope();
      String spatialIdentifier = req.getSpatialIdentifier();
      Long startTime = req.getStartTime();
      Long endTime = req.getEndTime();
      // ArrayList<String> measurementTypes = req.getMeasurementTypes();

      // For initial setup testing only!
      // SiteSparsityData tss1 = new SiteSparsityData("test1", 1.12, 5, 50.41, -111.56);
      // SiteSparsityData tss2 = new SiteSparsityData("test2", 5.81, 17, 85.87, 99.26);
      // SiteSparsityData tss3 = new SiteSparsityData("test3", 0.57, 2, 42.75, -120.79);
      // ArrayList<SiteSparsityData> testReply = new ArrayList<SiteSparsityData>();
      // testReply.add(tss1);
      // testReply.add(tss2);
      // testReply.add(tss3);
      // SSGReply reply = SSGReply.newBuilder().setSparsityScores(testReply).build();
      // End initial setup test section

      SSGReply reply = SSGReply.newBuilder().setMonitorId("example_monitor_id").setSparsityScore(42.42).setLongitude(101.45).setLatitude(-140.21).setNumberOfMeasurements(15).build();
      responseObserver.onNext(reply);
      responseObserver.onCompleted();
    }

    private class SiteSparsityData {
      String monitorId;
      double sparsityScore;
      double[] coordinates = new double[2];
      int numberOfMeasurements;

      public SiteSparsityData(String monitorId, double sparsityScore, int numberOfMeasurements, double lng, double lat) {
        this.monitorId = monitorId;
        this.sparsityScore = sparsityScore;
        this.coordinates[0] = lng;
        this.coordinates[1] = lat;
        this.numberOfMeasurements = numberOfMeasurements;
      }
    }
  }
}
