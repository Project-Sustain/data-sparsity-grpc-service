package mongo;

import java.util.ArrayList;
import java.util.List;
import java.lang.Long;
import java.lang.Double;

import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

public class SiteData {
    private String monitorId;
    private Float sparsityScore;
    private double longitude;
    private double latitude;
    private int numberOfMeasurements;

    public SiteData(Document document) {
        this.monitorId = document.getString("_id");
        List<Long> timeList = document.getList("epochTimes", Long.class);
        this.numberOfMeasurements = timeList.size();
        this.sparsityScore = getSparsityScore(timeList);
        setLngLat(monitorId);
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

    private void setLngLat(String monitorId) {
        MongoConnection mongoConnection = new MongoConnection();
        Document siteDocument = mongoConnection.getCollection("water_quality_sites").find(eq("MonitoringLocationIdentifier", monitorId)).first();
        Document geoDoc = siteDocument.get("geometry", Document.class);
        List geoCoord = geoDoc.get("coordinates", List.class);
        this.longitude = Double.parseDouble(geoCoord.get(0).toString());
        this.latitude = Double.parseDouble(geoCoord.get(1).toString());
    }

    public Float getSparsityScore() {
        return this.sparsityScore;
    }

    public double getLatitude() {
        return this.latitude;
    }

    public double getLongitude() {
        return this.longitude;
    }

    public int getNumberOfMeasurements() {
        return this.numberOfMeasurements;
    }

    public String getMonitorId() {
        return this.monitorId;
    }

    @Override
    public String toString() {
        return "{\"" + this.getMonitorId() + "\": " +
            "{\"Sparsity Score\": " + this.getSparsityScore() +
            ", \"Coordinates\": [" + this.getLongitude() + ", " + this.getLatitude() + "]" +
            ", \"Number of Measurements\": " + this.getNumberOfMeasurements() + "}}\n";
    }

}
