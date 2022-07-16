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


/*
 * This class builds & contains a query for use in an aggregation pipeline.
 * Takes Client-defined params, exposes a getQuery() method.
 * All logic for building the query is contained here.
 */
public class AggregateQuery {
    private static final Logger logger = Logger.getLogger(AggregateQuery.class.getName());
    private List<Bson> query;

    public AggregateQuery(Long startTime, Long endTime, ArrayList<String> measurementTypes, SSGRequest.ScopeType spatialScope, String spatialIdentifier) {
        Bson sort = Aggregates.sort(ascending("epoch_time"));

        BsonField accumulator = new BsonField("epochTimes", new Document("$push", "$epoch_time"));
        Bson group = Aggregates.group("$MonitoringLocationIdentifier", accumulator);

        ArrayList<String> siteList = generateSiteList(spatialScope, spatialIdentifier);
        Bson match = buildMatchFilters(startTime, endTime, measurementTypes, siteList);

        this.query = Arrays.asList(match, sort, group);
    }

    /*
     * Helper for the Constructor
     * Routes execution flow based off of used defined spatialScope & spatialIdentifier
     * @Params: 
     *      1: enum type spatialScope(COUNTRY, STATE, COUNTY, SITE)
     *      2: spatialIdentifier is a GISJOIN `if` spatialScope is STATE or COUNTY, `else an empty string`
     * @Returns List of observation site ID's
     */
    private ArrayList<String> generateSiteList(SSGRequest.ScopeType spatialScope, String spatialIdentifier) {
        MongoConnection mongoConnection = new MongoConnection();
        switch(spatialScope) {
            case STATE: return getSiteListFromGeoWitin(mongoConnection, "state_geo", spatialIdentifier);
            case COUNTY: return getSiteListFromGeoWitin(mongoConnection, "county_geo", spatialIdentifier);
            case SITE: return new ArrayList<String>(Arrays.asList(spatialIdentifier));
            default: return null;
        }
    }

    /*
     * Helper for generateSiteList
     * Builds & submits the $geoWithin query to MongoDB. This is only called if spatialScope is STATE or COUNTY
     * @Params:
     *      1: Connection to MongoDB
     *      2: Name of either the state or county collection in MongoDB
     *      3: GISJOIN
     * @Returns List of observation site ID's
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
     * @Params: All Client-defined specs needed to build match query - temporal, data, spatial
     * @Returns: Bson object representing a match query
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
     * Updates list of match filters with temporal constraints
     * @Params: Reference to list of match filters, temporal constraints defined by user
     */
    private void buildTemporalFilter(List<Bson> matchFilters, Long startTime, Long endTime) {
        matchFilters.add(gte("epoch_time", startTime));
        matchFilters.add(lte("epoch_time", endTime));
    }

    /*
     * Helper for buildMatchFilters()
     * Updates list of match filters with data constraints
     * @Params: Reference to list of match filters, list of data constraints
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
     * Updates list of match filters with spatial constraints
     * @Params: Reference to list of match filters, list of observation site id's
     */
    private void buildSpatialFilter(List<Bson> matchFilters, ArrayList<String> siteList) {
        if(siteList != null) {
            matchFilters.add(in("MonitoringLocationIdentifier", siteList));
        }
    }

    /*
     * Getter for the query that has been built. The only publicly exposed non-ctor method
     */
    public List<Bson> getQuery() {
        return this.query;
    }
    
}
