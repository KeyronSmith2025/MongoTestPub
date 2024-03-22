const express = require('express');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = "mongodb+srv://keyronsmith:ColetrainCTP@cluster0.3hmtsyu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Default endpoint
app.get('/', (req, res) => {
    if (req.cookies.authCookie) {
        res.send(`Authentication cookie exists with value: ${req.cookies.authCookie}`);
    } else {
        res.send(`
            <h2>Login or Register</h2>
            <a href="/login">Login</a> | <a href="/register">Register</a>
        `);
    }
});

// Registration form
app.get('/register', (req, res) => {
    res.send(`
        <h2>Register</h2>
        <form action="/register" method="post">
            <input type="text" name="UserId" placeholder="User ID" required><br>
            <input type="password" name="UserPass" placeholder="Password" required><br>
            <button type="submit">Register</button>
        </form>
    `);
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { UserId, UserPass } = req.body;
    const usersCollection = client.db('415DBexample').collection('user ID/ Password and registration');

    try {
        await usersCollection.insertOne({ UserId, UserPass });
        res.send('Registration successful!');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Registration failed');
    }
});

// Login form
app.get('/login', (req, res) => {
    res.send(`
        <h2>Login</h2>
        <form action="/login" method="post">
            <input type="text" name="UserID" placeholder="User ID" required><br>
            <input type="password" name="UserPass" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { UserId, UserPass } = req.body;
    const usersCollection = client.db('415DBexample').collection('user ID/ Password and registration');

    const user = await usersCollection.findOne({ UserId, UserPass });
    if (user) {
        res.cookie('authCookie', UserId, { maxAge: 60000 }); // Set authentication cookie for 1 minute
        res.send('Login successful!');
    } else {
        res.send('Invalid credentials. <a href="/">Go back</a>');
    }
});

// Endpoint to report active cookies
app.get('/cookies', (req, res) => {
    res.send(`Active cookies: ${JSON.stringify(req.cookies)}`);
});

// Endpoint to clear cookies
app.get('/clear-cookies', (req, res) => {
    res.clearCookie('authCookie');
    res.send('Cookies cleared. <a href="/">Go back</a>');
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

