package io.grpc.datasparsity.sparsityscoregenerator;

import java.util.ArrayList;
import java.util.List;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Aggregates;
import org.bson.Document;
import static com.mongodb.client.model.Filters.eq;
import io.grpc.stub.StreamObserver;
import java.util.logging.Logger;

public class SparsityScoreGenerator {

    private static final Logger logger = Logger.getLogger(SparsityScoreGenerator.class.getName());
    private ArrayList<Document> results; 

    public SparsityScoreGenerator() {}

    public void makeSparsityQuery(AggregateQuery aggregateQuery, String collectionName) {
        MongoConnection mongoConnection = new MongoConnection();
        MongoCollection<Document> collection = mongoConnection.getCollection(collectionName);
        ArrayList<Document> queryResults = collection.aggregate(aggregateQuery.getQuery()).allowDiskUse(true).into(new ArrayList<>());
        this.results = queryResults;
        mongoConnection.closeConnection();
    }

    /*
     * Streams query results back to the Client
     * @Params: Reference to a StreamObserver
     */
    public void streamSparsityData(StreamObserver<SSGReply> responseObserver) {
        MongoConnection mongoConnection = new MongoConnection();
        try {
            results.forEach(document -> {
                String monitorId = document.getString("_id");
                List<Long> timeList = document.getList("epochTimes", Long.class);
                int numberOfMeasurements = timeList.size();
                double sparsityScore = getSparsityScore(timeList);
                double[] coordinates = getCoordinates(monitorId, mongoConnection);

                SSGReply.SiteSparsityData ssd = SSGReply.newBuilder()
                    .setMonitorId(monitorId)
                    .setSparsityScore(sparsityScore)
                    .setCoordinates(SSGReply.Coordinates.newBuilder()
                        .setLongitude(coordinates[0])
                        .setLatitude(coordinates[1]))
                    .setNumberOfMeasurements(numberOfMeasurements)
                    .setAllEpochTimes(timeList) // FIXME Set a list syntax
                    .build();

                SSGReply reply = SSGReply.newBuilder().setSiteSparsityData(ssd).build();
                responseObserver.onNext(reply);
            });
        } catch(Exception e) {
            logger.warning(e.toString());
        } finally {
            mongoConnection.closeConnection();
            responseObserver.onCompleted();
        }
    }

    /*
     * Helper for streamSparsityData()
     * Calculates the sparsity score
     * @Params: List containing the sorted epoch_times for a given observation site
     * @Returns: Float representing the Sparsity Score for a given observation site
     */
    private Float getSparsityScore(List<Long> timeList) {
        try {  
            Long sumOfDifferences = new Long(0);
            if(timeList.size() > 1) {
                for(int i = 0; i < timeList.size()-1; i++) {
                    Long difference = timeList.get(i+1) - timeList.get(i);
                    sumOfDifferences += difference;
                }
                float meanDifference = sumOfDifferences / timeList.size()-1;
                int secondsInOneDay = 24 * 60 * 60;
                int secondsInOneWeek = 7 * 24 * 60 * 60;
                return (secondsInOneWeek/meanDifference) * 100;
            }
            else {
                return new Float(0);
            }
        } catch(Exception e) {
            return new Float(0);
        }
    }
    
    /*
     * Helper for streamSparsityData()
     * Queries MongoDB for the location of the observation site represented by the monitorId passed in
     * @Params: String representing a monitorId
     * @Returns: double[] containing [longitude, latitude] for a observation site
     */
    private double[] getCoordinates(String monitorId, MongoConnection mongoConnection) {
        Document siteDocument = mongoConnection.getCollection("water_quality_sites").find(eq("MonitoringLocationIdentifier", monitorId)).first();
        Document geoDoc = siteDocument.get("geometry", Document.class);
        List geoCoord = geoDoc.get("coordinates", List.class);
        double longitude = Double.parseDouble(geoCoord.get(0).toString());
        double latitude = Double.parseDouble(geoCoord.get(1).toString());
        double[] coordinates = {longitude, latitude};
        return coordinates;
    }

}