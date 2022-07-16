package io.grpc.datasparsity.sparsityscoregenerator;

import java.util.*;

import java.io.FileWriter;
import java.io.IOException;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.BsonField;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.*;
import com.mongodb.MongoTimeoutException;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.xml.sax.SAXParseException;

import com.mongodb.client.MongoCursor;
import com.mongodb.BasicDBObject;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static com.mongodb.client.model.Accumulators.*;
import static com.mongodb.client.model.Aggregates.*;
import static com.mongodb.client.model.Updates.*;
import static com.mongodb.client.model.Sorts.ascending;
import javax.sql.rowset.spi.SyncResolver;

import io.grpc.stub.StreamObserver;
import java.util.logging.Logger;

public class SparsityScoreGenerator {

    // Logger
    private static final Logger logger = Logger.getLogger(SparsityScoreGenerator.class.getName());

    // Query Params
    // private Long startTime;
    // private Long endTime;
    // private ArrayList<String> measurementTypes;
    // private ArrayList<String> siteList;

    // Useful References
    // private MongoConnection mongoConnection; // So we can explicitly close the db connection
    private ArrayList<Document> results; // So we can stream results in a separate function

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
        try {
            results.forEach(document -> {
                String monitorId = document.getString("_id");
                List<Long> timeList = document.getList("epochTimes", Long.class);
                int numberOfMeasurements = timeList.size();
                double sparsityScore = getSparsityScore(timeList);
                double[] coordinates = getCoordinates(monitorId);

                SSGReply.SiteSparsityData ssd = SSGReply.SiteSparsityData.newBuilder()
                    .setMonitorId(monitorId)
                    .setSparsityScore(sparsityScore)
                    .setCoordinates(SSGReply.Coordinates.newBuilder()
                        .setLongitude(coordinates[0])
                        .setLatitude(coordinates[1]))
                    .setNumberOfMeasurements(numberOfMeasurements)
                    .build();

                SSGReply reply = SSGReply.newBuilder().setSiteSparsityData(ssd).build();
                responseObserver.onNext(reply);
            });
        } catch(Exception e) {
            logger.warning(e.toString());
        } finally {
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
    private double[] getCoordinates(String monitorId) {
        MongoConnection mongoConnection = new MongoConnection();
        Document siteDocument = mongoConnection.getCollection("water_quality_sites").find(eq("MonitoringLocationIdentifier", monitorId)).first();
        Document geoDoc = siteDocument.get("geometry", Document.class);
        List geoCoord = geoDoc.get("coordinates", List.class);
        double longitude = Double.parseDouble(geoCoord.get(0).toString());
        double latitude = Double.parseDouble(geoCoord.get(1).toString());
        double[] coordinates = {longitude, latitude};
        return coordinates;
    }


    // /*
    //  * Builds & stores data for the Query
    //  * Creates useful references
    //  */
    // public SparsityScoreGenerator(Long startTime, Long endTime, SSGRequest.ScopeType spatialScope, String spatialIdentifier, ArrayList<String> measurementTypes) {
    //     this.startTime = startTime;
    //     this.endTime = endTime;
    //     this.measurementTypes = measurementTypes;
    //     this.mongoConnection = new MongoConnection();
    //     this.siteList = generateSiteList(this.mongoConnection, spatialScope, spatialIdentifier);
    // }


    // /*
    //  * Queries MongoDB & stores the result of the query in @this.result
    //  * @Params: String collectionName representing the collection specified by the Client
    //  */
    // public void makeSparsityQuery(String collectionName) {
    //     Bson sort = Aggregates.sort(ascending("epoch_time"));
    //     BsonField accumulator = new BsonField("epochTimes", new Document("$push", "$epoch_time"));
    //     Bson group = Aggregates.group("$MonitoringLocationIdentifier", accumulator);
    //     Bson match = buildMatchFilters();
    //     ArrayList<Document> queryResults = this.mongoConnection.getCollection(collectionName).aggregate(Arrays.asList(
    //         match, sort, group)).into(new ArrayList<>());
    //     this.results = queryResults;
    //     this.mongoConnection.closeConnection();
    // }

    // /*
    //  * Helper for the Constructor
    //  * Generates the list of sites representing the Spatial Scope of the query
    //  */
    // private ArrayList<String> generateSiteList(MongoConnection mongoConnection, SSGRequest.ScopeType spatialScope, String spatialIdentifier) {
    //     switch(spatialScope) {
    //         case COUNTRY: return null;
    //         case STATE: return getSiteListFromGeoWitin(mongoConnection, "state_geo", spatialIdentifier);
    //         case COUNTY: return getSiteListFromGeoWitin(mongoConnection, "county_geo", spatialIdentifier);
    //         case SITE: return new ArrayList<String>(Arrays.asList(spatialIdentifier));
    //         default: 
    //             logger.info("Bad spatialScope type.");
    //             System.exit(1);
    //             return null;
    //     }
    // }

    // /*
    //  * Helper for generateSiteList
    //  * Builds & submits the $geoWithin query to MongoDB
    //  */
    // private ArrayList<String> getSiteListFromGeoWitin(MongoConnection mongoConnection, String collection, String spatialIdentifier) {
    //     Document shapefile = mongoConnection.getCollection(collection).find(eq("GISJOIN", spatialIdentifier)).first();
    //     Document geoDoc = shapefile.get("geometry", Document.class);
    //     String geoType = geoDoc.getString("type");
    //     List geoCoord = geoDoc.get("coordinates", List.class);
    //     BasicDBObject geometry = new BasicDBObject("type", geoType).append("coordinates", geoCoord);
    //     Bson match =  Aggregates.match(geoWithin("geometry.coordinates", geometry));

    //     Bson project = Aggregates.project(fields(excludeId(), include("MonitoringLocationIdentifier")));

    //     // REFACTOR: in the aggregation pipeline, change {"MonitoringLocationIdentifier": "21FLBFA_WQX-33010005"} 
    //     //      to "21FLBFA_WQX-33010005" to avoid creating another ArrayList

    //     // FIXME: `water_quality_sites` is hard-coded here
    //     ArrayList<Document> results = mongoConnection.getCollection("water_quality_sites").aggregate(
    //         Arrays.asList(match, project)).into(new ArrayList<>());

    //     ArrayList<String> siteList = new ArrayList<>();
    //     results.forEach(item -> siteList.add(item.getString("MonitoringLocationIdentifier")));

    //     return siteList;
    // }

    // /*
    //  * Helper for makeSparsityQuery()
    //  * Builds the match filters based off of client input
    //  */
    // private Bson buildMatchFilters() {
    //     List<Bson> matchFilters = new ArrayList<>();
    //     buildTemporalFilter(matchFilters);
    //     buildDataFilter(matchFilters);
    //     buildSpatialFilter(matchFilters);
    //     Bson match = Aggregates.match(and(matchFilters));
    //     return match;
    // }

    // /*
    //  * Helper for buildMatchFilters()
    //  * Builds the temporal filter
    //  */
    // private void buildTemporalFilter(List<Bson> matchFilters) {
    //     matchFilters.add(gte("epoch_time", this.startTime));
    //     matchFilters.add(lte("epoch_time", this.endTime));
    // }

    // /*
    //  * Helper for buildMatchFilters()
    //  * Builds the data filter
    //  */
    // private void buildDataFilter(List<Bson> matchFilters) {
    //     if(this.measurementTypes.size() != 0) {
    //         List<Bson> dataConstraints = new ArrayList<>();
    //         this.measurementTypes.forEach(measurementType -> {
    //             dataConstraints.add(exists(measurementType));
    //         });
    //         matchFilters.add(or(dataConstraints));
    //     }
    // }

    // /*
    //  * Helper for buildMatchFilters()
    //  * Builds the spatial filter
    //  */
    // private void buildSpatialFilter(List<Bson> matchFilters) {
    //     if(this.siteList != null) {
    //         matchFilters.add(in("MonitoringLocationIdentifier", this.siteList));
    //     }
    // }

}