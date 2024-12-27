const mongoose = require("mongoose");


// User Schema
const userDetails = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// Country Schema
const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

// City Schema
const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    }
});

// Hotel Schema
const hotelDetails = new mongoose.Schema({
    hotelName: {
        type: String,
        required: true,
    },
    location: {
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        }
    },
    description: {
        overview: {
            type: String,
            required: true,
        },
        amenities: {
            type: [String],
            required: true,
        },
        sustainabilityFeatures: {
            type: [String],
            required: true,
        },
    },
    sustainabilityRating: {
        type: Number,
        required: true,
    },
    carbonOffsetOptions: [
        {
            cost: {
                type: Number,
                required: true,
            },
            impact: {
                type: String,
                required: true,
            },
        },
    ],
    reviews: [
        {
            reviewer: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
});


// Create models
const User = mongoose.model("login_details", userDetails);
const Hotel = mongoose.model("hotel_details", hotelDetails);
const Country = mongoose.model("country", countrySchema);
const City = mongoose.model("city", citySchema);

// Export only what you need
module.exports = {
    User,
    Hotel,
    Country,
    City
};
