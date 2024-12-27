const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const path = require('path');
const bodyParser = require("body-parser");
const {User, Hotel, Country, City} = require("./mongoDB");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
//const setupCalculatorRoutes = require('./carbon-calculators');
//setupCalculatorRoutes(app);
const port = process.env.PORT || 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// Set up session middleware
app.use(
    session({
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: true,
    })
);
app.use(express.json());  
// middleware to allow CORS 
app.use(cors());

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

// Home route
app.get("/", (req, res) => {
    res.render("home", { user: req.session.user });
});

//donation route
app.get("/donation", (req, res) => {
    res.render("donation", { user: req.session.user });
});

//partner route
app.get("/partner", (req, res) => {
    res.render("partner", { user: req.session.user });
});

// Login route
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = username;
            res.redirect("/");
        } else {
            res.send("Invalid credentials. Please try again.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during login.");
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect("/");
    });
});

// Signup route
app.get("/signup", (req, res) => {
    res.render('signup');
});

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username)
    console.log(email)
    console.log(password)

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.log("Username or email already exists. Please choose different credentials.");
            return res.send("Username or email already exists. Please choose different credentials.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        console.log("saved to db. signup done")
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during signup.");
    }
});



// distance calculator
app.get("/distance-calculator", (req, res) => {
    res.render("distance-calculator", { user: req.session.user });
});
// Carbon calculator route
app.get("/carbon-calculator", (req, res) => {
    res.render("carbon-calculator", { user: req.session.user });
});
// Hotel search page route
app.get("/hotelSearch", (req, res) => {
    res.render("hotelSearch", { user: req.session.user });
});

// Debug endpoint to see what's in the database
app.get("/api/hotels/debug", async (req, res) => {
    try {
        const allHotels = await Hotel.find({}).limit(20);
        console.log("Sample hotels:", allHotels); // Debug log
        res.json({
            totalCount: await Hotel.countDocuments({}),
            sampleHotels: allHotels
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update the GET endpoint for hotel search
app.get("/api/hotels", async (req, res) => {
    const { country, city } = req.query;
    try {
        let query = {};
        
        if (country && country.trim() !== '') {
            query['location.country'] = new RegExp(country.trim(), 'i');
        }
        if (city && city.trim() !== '') {
            query['location.city'] = new RegExp(city.trim(), 'i');
        }

        console.log("GET Search Query:", query); // Debug log
        
        const hotels = await Hotel.find(query).limit(10);
        console.log(`Found ${hotels.length} hotels`); // Debug log
        res.json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "An error occurred while fetching hotels." });
    }
});

// Update the POST endpoint for hotel search
app.post("/api/hotels", async (req, res) => {
    const { country, city } = req.body;
    console.log("Received search request:", { country, city });
    try {
        let query = {};
        
        if (country && country.trim() !== '') {
            query['location.country'] = new RegExp(country.trim(), 'i');
        }
        if (city && city.trim() !== '') {
            query['location.city'] = new RegExp(city.trim(), 'i');
        }
        
        console.log("POST Search Query:", query);
        
        const hotels = await Hotel.find(query).limit(10);
        console.log(`Found ${hotels.length} hotels`);
        console.log("First hotel:", hotels[0]); // Log the first hotel for debugging
        res.json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "An error occurred while fetching hotels." });
    }
});

app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
});