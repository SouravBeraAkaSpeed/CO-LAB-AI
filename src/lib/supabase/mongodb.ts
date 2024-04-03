const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017"; // Change this URI according to your MongoDB server configuration

// Database Name
const dbName = "your_database_name"; // Change this to your database name

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB server");

    // Specify the database to use
    const db = client.db(dbName);

    // Return the database object
    return db;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

export const db = async () => {
  return await connectDB();
};
// Usage example
async function exampleUsage() {
  try {
    // Connect to the database
    const db = await connectDB();

    // Example: Insert a document into a collection
    const collection = db.collection("your_collection_name");
    await collection.insertOne({ key: "value" });

    // Example: Find documents in a collection
    const documents = await collection.find({}).toArray();
    console.log("Documents:", documents);
  } catch (err) {
    console.error("Error in example usage:", err);
  } finally {
    // Close the connection when done
    await client.close();
    console.log("Connection closed");
  }
}

// Call the example
