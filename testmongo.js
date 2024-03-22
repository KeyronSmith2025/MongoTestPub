const { MongoClient } = require("mongodb");

// The uri string must be the connection string for the database (obtained on Atlas).
const uri = "mongodb+srv://keyronsmith:ColetrainCTP@cluster0.3hmtsyu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const app = express();
const port = 3000;
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB client initialization
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');
});

// Default route:
app.get('/', function(req, res) {
    res.send('Starting...');
});

app.get('/say/:name', function(req, res) {
    res.send('Hello ' + req.params.name + '!');
});

// Route to access database:
app.get('/api/mongo/:item', function(req, res) {
    const searchKey = req.params.item; // No need to wrap in string and single quotes
    console.log("Looking for: " + searchKey);

    const database = client.db('415DBexample');
    const Users = database.collection('user ID/ Password and registration');

    const query = { UserID: searchKey }; // Query based on the parameter value

    Users.findOne(query)
        .then(User => {
            if (User) {
                console.log(User);
                res.send('Found this: ' + JSON.stringify(User));
            } else {
                res.send('User not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('An error occurred');
        });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Close MongoDB client when the app is terminated
process.on('SIGINT', () => {
    client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

