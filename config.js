const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "Login";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
    .then(() => {
        console.log("Database successfully connected");
    })
    .catch((err) => {
        console.log("Failed to connect to database", err);
    });
const db = client.db(dbName);
const collection = db.collection('users');


async function addUser(username, password) {
    try {
        const user = { name: username, password: password };
        const result = await collection.insertOne(user);
        console.log("User added:", result);
    } catch (err) {
        console.log("Error inserting user:", err);
    }
}

async function findUserByUsername(username) {
    try {
        const user = await collection.findOne({ name: username });
        if (!user) {
            console.log("User not found");
        } else {
            console.log("User found:", user);
        }
    } catch (err) {
        console.log("Error finding user:", err);
    }
}
async function authenticateUser(username, password) {
    try {
        const user = await collection.findOne({ name: username });
        if (!user) {
            console.log("User can't be found");
        } else if (user.password === password) {
            console.log("User authenticated successfully");
        } else {
            console.log("Wrong password");
        }
    } catch (err) {
        console.log("Error authenticating user:", err);
    }
}

