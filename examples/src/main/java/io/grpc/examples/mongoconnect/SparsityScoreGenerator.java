package mongo;

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

public class SparsityScoreGenerator {

    private String collectionName;
    private Long startTime;
    private Long endTime;
    // private ArrayList<String> measurementNames;

    private MongoCollection<Document> collection;
    private ArrayList<String> siteList;

    public SparsityScoreGenerator(String collectionName, Long startTime, Long endTime, String spatialScope, String statialIdentifier) {
        
        this.collectionName = collectionName;
        this.startTime = startTime;
        this.endTime = endTime;
        // this.measurementNames = measurementNames;

        MongoConnection mongoConnection = new MongoConnection();
        this.siteList = generateSiteList(mongoConnection, spatialScope, statialIdentifier);
        this.collection = mongoConnection.getCollection(collectionName);
    }

    private ArrayList<String> generateSiteList(MongoConnection mongoConnection, String spatialScope, String statialIdentifier) {
        if(spatialScope.equals("COUNTRY")) {
            return null;
        }
        else if(spatialScope.equals("STATE")) {
            return getSiteListFromGeoWitin(mongoConnection, "state_geo", statialIdentifier);
        }
        else if(spatialScope.equals("COUNTY")) {
            return getSiteListFromGeoWitin(mongoConnection, "county_geo", statialIdentifier);
        }
        else {
            ArrayList<String> siteList = new ArrayList<>();
            siteList.add(statialIdentifier);
            return siteList;
        }
    }

    private ArrayList<String> getSiteListFromGeoWitin(MongoConnection mongoConnection, String collection, String statialIdentifier) {
        Document shapefile = mongoConnection.getCollection(collection).find(eq("GISJOIN", statialIdentifier)).first();
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

    public String getCollectionName() {
        return this.collectionName;
    }

    public Long getStartTime() {
        return this.startTime;
    }

    public Long getEndTime() {
        return this.endTime;
    }

    public MongoCollection<Document> getCollection() {
        return this.collection;
    }

    // public ArrayList<String> getMeasurementNames() {
    //     return this.measurementNames;
    // }

    public ArrayList<String> getSiteList() {
        return this.siteList;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public static void main(String[] args) {

        // FRONTEND: If the user does not provide a temporal contraint, just use -2524517939000 as startTime, <current_time_in_millis> as endTime.

        if(args.length != 5) {
            System.out.println("Invalid Args.\nUsage: `./gradlew run <collection> <startTime> <endTime> <spatialScope> <statialIdentifier>`");
            System.exit(1);
        }

        String collectionName = args[0];
        Long startTime = Long.parseLong(args[1]);
        Long endTime = Long.parseLong(args[2]);
        String spatialScope = args[3];
        String statialIdentifier = args[4];

        // FIXME this needs to come in as an arg
        ArrayList<String> measurementNames = new ArrayList<>(Arrays.asList("Ammonia", "Phosphate", "Sulphate", "Temperature, water"));

        SparsityScoreGenerator ssg = new SparsityScoreGenerator(collectionName, startTime, endTime, spatialScope, statialIdentifier);

        Bson sort = Aggregates.sort(ascending("epoch_time"));
        BsonField accumulator = new BsonField("epochTimes", new Document("$push", "$epoch_time"));
        Bson group = Aggregates.group("$MonitoringLocationIdentifier", accumulator);

        List<Bson> matchFilters = new ArrayList<>();
        matchFilters.add(gte("epoch_time", ssg.getStartTime()));
        matchFilters.add(lte("epoch_time", ssg.getEndTime()));

        if(measurementNames.size() != 0) {
            List<Bson> dataConstraints = new ArrayList<>();
            measurementNames.forEach(measurementName -> {
                dataConstraints.add(exists(measurementName));
            });
            matchFilters.add(or(dataConstraints));
        }

        if(ssg.getSiteList() != null) {
            matchFilters.add(in("MonitoringLocationIdentifier", ssg.getSiteList()));
        }

        Bson match = Aggregates.match(and(matchFilters));

        ArrayList<Document> results = ssg.getCollection().aggregate(Arrays.asList(
            match, sort, group)).into(new ArrayList<>());

        try (FileWriter writer = new FileWriter("serverOutput.txt"); FileWriter intermediateWriter = new FileWriter("intermediateOutput.txt")) {
            results.forEach(doc -> {
                try {
                    intermediateWriter.write(doc.toJson() + "\n");
                    SiteData site = new SiteData(doc);
                    writer.write(site.toString());
                } catch (IOException e) {
                    System.out.println("An error occurred.");
                    e.printStackTrace();
                }
            });
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

    }

}
