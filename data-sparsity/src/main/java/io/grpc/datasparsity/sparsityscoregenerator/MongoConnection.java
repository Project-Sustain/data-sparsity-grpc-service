package io.grpc.datasparsity.sparsityscoregenerator;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.mongodb.MongoException;

public class MongoConnection {

    private MongoDatabase mongoConnection;
    private MongoClient client;

    public MongoConnection() {

        String username = System.getenv("ROOT_MONGO_USER");
        String password = System.getenv("ROOT_MONGO_PASS");
        String address = "lattice-100";
        String port = "27018";
        String mongoUri = "mongodb://" + username + ":" + password + "@" + address + ":" + port + "/";

        try {
            this.client = MongoClients.create(mongoUri);
            this.mongoConnection = this.client.getDatabase("sustaindb");
        } catch (MongoException me) {
            System.err.println("An error occurred: " + me);
            this.mongoConnection = null;
        }
    }

    public void closeConnection() {
        this.client.close();
    }

    public MongoDatabase getMongoConnection() {
        return this.mongoConnection;
    }

    public MongoCollection<Document> getCollection(String collection) {
        return this.mongoConnection.getCollection(collection);
    }

}