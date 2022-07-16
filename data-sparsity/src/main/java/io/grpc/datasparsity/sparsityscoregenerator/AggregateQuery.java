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

public class AggregateQuery {
    private static final Logger logger = Logger.getLogger(AggregateQuery.class.getName());
    Bson sort;
    Bson group;
    Bson match;

    public AggregateQuery(Long startTime, Long endTime, ArrayList<String> measurementTypes, SSGRequest.ScopeType spatialScope, String spatialIdentifier) {
        this.sort = Aggregates.sort(ascending("epoch_time"));

        BsonField accumulator = new BsonField("epochTimes", new Document("$push", "$epoch_time"));
        this.group = Aggregates.group("$MonitoringLocationIdentifier", accumulator);

        ArrayList<String> siteList = generateSiteList(spatialScope, spatialIdentifier);
        this.match = buildMatchFilters(startTime, endTime, measurementTypes, siteList);
    }

    /*
     * Helper for the Constructor
     * Generates the list of sites representing the Spatial Scope of the query
     */
    private ArrayList<String> generateSiteList(SSGRequest.ScopeType spatialScope, String spatialIdentifier) {
        MongoConnection mongoConnection = new MongoConnection();
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

    /*
     * Helper for generateSiteList
     * Builds & submits the $geoWithin query to MongoDB
     */
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


    /*
     * Helper for makeSparsityQuery()
     * Builds the match filters based off of client input
     */
    private Bson buildMatchFilters(Long startTime, Long endTime, ArrayList<String> measurementTypes, ArrayList<String> siteList) {
        List<Bson> matchFilters = new ArrayList<>();
        buildTemporalFilter(matchFilters, startTime, endTime);
        buildDataFilter(matchFilters, measurementTypes);
        buildSpatialFilter(matchFilters, siteList);
        Bson match = Aggregates.match(and(matchFilters));
        return match;
    }

    /*
     * Helper for buildMatchFilters()
     * Builds the temporal filter
     */
    private void buildTemporalFilter(List<Bson> matchFilters, Long startTime, Long endTime) {
        matchFilters.add(gte("epoch_time", startTime));
        matchFilters.add(lte("epoch_time", endTime));
    }

    /*
     * Helper for buildMatchFilters()
     * Builds the data filter
     */
    private void buildDataFilter(List<Bson> matchFilters, ArrayList<String> measurementTypes) {
        if(measurementTypes.size() != 0) {
            List<Bson> dataConstraints = new ArrayList<>();
            measurementTypes.forEach(measurementType -> {
                dataConstraints.add(exists(measurementType));
            });
            matchFilters.add(or(dataConstraints));
        }
    }

    /*
     * Helper for buildMatchFilters()
     * Builds the spatial filter
     */
    private void buildSpatialFilter(List<Bson> matchFilters, ArrayList<String> siteList) {
        if(siteList != null) {
            matchFilters.add(in("MonitoringLocationIdentifier", siteList));
        }
    }

    public List<Bson> getQuery() {
        return Arrays.asList(sort, group, match);
    }
    
}
