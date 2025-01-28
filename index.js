const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const url = "mongodb://127.0.0.1:27017";
const dbName = "Login";
let db;
let collection;

MongoClient.connect(url)
    .then((client) => {
        console.log("Database connected successfully");
        db = client.db(dbName);
        collection = db.collection('users');
    })
    .catch((err) => {
        console.log("Database connection error:", err);
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("login");
});

app.post("/login", async function (req, res) {
    try {
        const user = await collection.findOne({ name: req.body.username });
        if (!user) {
            return res.send("User can't be found");
        }
        if (user.password === req.body.password) {
            res.render("home");
        } else {
            res.send("Wrong password");
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred");
    }
});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", async function (req, res) {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    try {
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.send("User already exists. Enter a different username");
        } else {
            const userData = {
                name: data.name,
                password: data.password
            };

            await collection.insertOne(userData);
            console.log(userData);
            res.send("User created successfully. You can now log in.");
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred during signup");
    }
});

const PORT = 5000;
app.listen(PORT, function () {
    console.log(`Server is active at http://localhost:${PORT}`);
});