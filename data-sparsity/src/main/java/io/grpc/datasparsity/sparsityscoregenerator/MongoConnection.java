package io.grpc.datasparsity.sparsityscoregenerator;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import com.mongodb.MongoException;

public class MongoConnection {

    private String username = System.getenv("ROOT_MONGO_USER");
    private String password = System.getenv("ROOT_MONGO_PASS");
    private String address = "lattice-100";
    private String port = "27018";
    private String mongoUri = "mongodb://" + username + ":" + password + "@" + address + ":" + port + "/";

    private MongoDatabase mongoConnection;
    private MongoClient client;

    public MongoConnection() {
        connect();
    }

    public MongoConnection(boolean test) {
        mongoUri += "?serverSelectionTimeoutMS=10&connectTimeoutMS=20000";
        connect();
    }

    /*
     * Connect to the database
     */
    private void connect() {
        try {
            this.client = MongoClients.create(mongoUri);
            this.mongoConnection = this.client.getDatabase("sustaindb");
        } catch (MongoException me) {
            System.err.println("An error occurred: " + me);
            this.mongoConnection = null;
        }
    }

    /*
     * Explicitly closes the MongoDB connection
     */
    public void closeConnection() {
        this.client.close();
    }

    /*
     * Retreives a reference to the MongoDB connection
     * @Returns: Reference to a database
     */
    public MongoDatabase getMongoConnection() {
        return this.mongoConnection;
    }

    /*
     * Retreives a reference to a MongoDB collection
     * @Params: String, the name of a collection
     * @Returns: Reference to a collection
     */
    public MongoCollection<Document> getCollection(String collection) {
        return this.mongoConnection.getCollection(collection);
    }

}