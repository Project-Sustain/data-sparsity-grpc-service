package io.grpc.datasparsity.sparsityscoregenerator;

import java.util.ArrayList;
import java.util.List;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Aggregates;
import org.bson.Document;
import static com.mongodb.client.model.Filters.eq;
import io.grpc.stub.StreamObserver;
import java.util.logging.Logger;
import java.text.DecimalFormat;
import java.util.stream.Collectors;

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
                List<Long> timeList = (document.getList("epochTimes", Long.class)).stream().distinct().collect(Collectors.toList());
                int numberOfMeasurements = timeList.size();
                double sparsityScore = getSparsityScore(timeList);
                SiteInfo site = new SiteInfo(monitorId, mongoConnection);
                double[] coordinates = site.getCoordinates();

                SSGReply reply = SSGReply.newBuilder()
                    .setMonitorId(monitorId)
                    .setSparsityScore(sparsityScore)
                    .setCoordinates(SSGReply.Coordinates.newBuilder()
                        .setLongitude(coordinates[0])
                        .setLatitude(coordinates[1]))
                    .setNumberOfMeasurements(numberOfMeasurements)
                    .addAllEpochTimes(timeList)
                    .setOrganizationFormalName(site.getFormalName())
                    .setMonitoringLocationTypeName(site.getLocationType())
                    .build();

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
        DecimalFormat df = new DecimalFormat("#.###");
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
                return Float.parseFloat(df.format((secondsInOneWeek/meanDifference) * 100));
            }
            else {
                return new Float(0);
            }
        } catch(Exception e) {
            return new Float(0);
        }
    }
    
    /*
     * Internal class holding data for getSparsityScore
     * Queries MongoDB for the location of the observation site represented by the monitorId passed in
     *  and gets the coordinates, formal name, and location type
     */
    private class SiteInfo {

        private String formalName;
        private String locationType;
        private double[] coordinates = new double[2];

        public SiteInfo(String monitorId, MongoConnection mongoConnection) {
            
            Document siteDocument = mongoConnection.getCollection("water_quality_sites").find(eq("MonitoringLocationIdentifier", monitorId)).first();
            
            Document propertyDoc = siteDocument.get("properties", Document.class);
            this.formalName = propertyDoc.getString("OrganizationFormalName");
            this.locationType = propertyDoc.getString("MonitoringLocationTypeName");

            Document geoDoc = siteDocument.get("geometry", Document.class);
            List geoCoord = geoDoc.get("coordinates", List.class);
            double longitude = Double.parseDouble(geoCoord.get(0).toString());
            double latitude = Double.parseDouble(geoCoord.get(1).toString());

            this.coordinates[0] = longitude;
            this.coordinates[1] = latitude;
        }

        public String getFormalName() {
            return this.formalName;
        }

        public String getLocationType() {
            return this.locationType;

        }
        public double[] getCoordinates() {
            return this.coordinates;
        }

    }

}