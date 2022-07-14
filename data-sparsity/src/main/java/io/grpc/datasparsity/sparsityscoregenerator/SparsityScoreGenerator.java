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

import java.util.logging.Logger;

public class SparsityScoreGenerator {
    private static final Logger logger = Logger.getLogger(SparsityScoreGenerator.class.getName());

    private Long startTime;
    private Long endTime;
    private ArrayList<String> measurementTypes;

    private MongoCollection<Document> collection;
    private ArrayList<String> siteList;

    private ArrayList<SSGReply.SiteSparsityData> sparsityData;

    public SparsityScoreGenerator(String collectionName, Long startTime, Long endTime, SSGRequest.ScopeType spatialScope, String spatialIdentifier, ArrayList<String> measurementTypes) {

        this.startTime = startTime;
        this.endTime = endTime;
        this.measurementTypes = measurementTypes;

        MongoConnection mongoConnection = new MongoConnection();
        this.siteList = generateSiteList(mongoConnection, spatialScope, spatialIdentifier);
        this.collection = mongoConnection.getCollection(collectionName);

        generateSparsityData();
    }

    private ArrayList<String> generateSiteList(MongoConnection mongoConnection, SSGRequest.ScopeType spatialScope, String spatialIdentifier) {
        switch(spatialScope) {
            case COUNTRY: return null;
            case STATE: return getSiteListFromGeoWitin(mongoConnection, "state_geo", spatialIdentifier);
            case COUNTY: return getSiteListFromGeoWitin(mongoConnection, "county_geo", spatialIdentifier);
            case SITE: return new ArrayList<String>(Arrays.asList(spatialIdentifier));
            default: 
                logger.info("Bad spatialScope type.");
                System.exit(1);
                return null;
        }
    }

    private ArrayList<String> getSiteListFromGeoWitin(MongoConnection mongoConnection, String collection, String spatialIdentifier) {
        Document shapefile = mongoConnection.getCollection(collection).find(eq("GISJOIN", spatialIdentifier)).first();
        Document geoDoc = shapefile.get("geometry", Document.class);
        String geoType = geoDoc.getString("type");
        List geoCoord = geoDoc.get("coordinates", List.class);
        BasicDBObject geometry = new BasicDBObject("type", geoType).append("coordinates", geoCoord);
        Bson match =  Aggregates.match(geoWithin("geometry.coordinates", geometry));

        Bson project = Aggregates.project(fields(excludeId(), include("MonitoringLocationIdentifier")));

        // REFACTOR: in the aggregation pipeline, change {"MonitoringLocationIdentifier": "21FLBFA_WQX-33010005"} 
        //      to "21FLBFA_WQX-33010005" to avoid creating another ArrayList

        // FIXME: `water_quality_sites` is hard-coded here
        ArrayList<Document> results = mongoConnection.getCollection("water_quality_sites").aggregate(
            Arrays.asList(match, project)).into(new ArrayList<>());

        ArrayList<String> siteList = new ArrayList<>();
        results.forEach(item -> siteList.add(item.getString("MonitoringLocationIdentifier")));

        return siteList;
    }

    private void generateSparsityData() {

        Bson sort = Aggregates.sort(ascending("epoch_time"));
        BsonField accumulator = new BsonField("epochTimes", new Document("$push", "$epoch_time"));
        Bson group = Aggregates.group("$MonitoringLocationIdentifier", accumulator);

        List<Bson> matchFilters = new ArrayList<>();
        matchFilters.add(gte("epoch_time", this.startTime));
        matchFilters.add(lte("epoch_time", this.endTime));

        if(this.measurementTypes.size() != 0) {
            List<Bson> dataConstraints = new ArrayList<>();
            this.measurementTypes.forEach(measurementType -> {
                dataConstraints.add(exists(measurementType));
            });
            matchFilters.add(or(dataConstraints));
        }

        if(this.siteList != null) {
            matchFilters.add(in("MonitoringLocationIdentifier", this.siteList));
        }

        Bson match = Aggregates.match(and(matchFilters));

        ArrayList<Document> results = this.collection.aggregate(Arrays.asList(
            match, sort, group)).into(new ArrayList<>());

        this.sparsityData = new ArrayList<>();

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

            this.sparsityData.add(ssd);
        });
    }

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

    public ArrayList<SSGReply.SiteSparsityData> getSparsityData() {
        return this.sparsityData;
    }

}