const mongoose = require('mongoose');
const hotel = require('./mongoDB'); // Import the hotel model

// Your MongoDB connection string
const dbURI = 'mongodb+srv://demo:demomongoDBuser@cluster0.uqhte.mongodb.net/Planeta?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        insertHotels();
    })
    .catch(err => console.log('Error connecting to MongoDB', err));

// The hotel data batch
const hotelData = [
    {
      "hotelName": "Eco Lodge Petra",
      "hotelType": "Lodge",
      "country": "Jordan",
      "city": "Petra",
      "address": "10 Petra Road, Wadi Musa, Ma'an",
      "description": "An eco-lodge near Petra focusing on sustainable tourism and local culture.",
      "rating": 5
    },
    {
      "hotelName": "Sustainable Desert Camp",
      "hotelType": "Camp",
      "country": "Jordan",
      "city": "Wadi Rum",
      "address": "5 Desert Trail, Wadi Rum, Ma'an",
      "description": "A desert camp promoting eco-friendly tourism and conservation in Wadi Rum.",
      "rating": 5
    },
    {
      "hotelName": "Green Mountain Lodge",
      "hotelType": "Lodge",
      "country": "Jordan",
      "city": "Ajloun",
      "address": "33 Nature View Drive, Ajloun, Ajloun",
      "description": "A lodge in Ajloun focusing on sustainability and community engagement.",
      "rating": 5
    },
    {
      "hotelName": "Eco-Friendly Hotel Amman",
      "hotelType": "Hotel",
      "country": "Jordan",
      "city": "Amman",
      "address": "44 City Center Road, Amman, Amman",
      "description": "A hotel in Amman promoting eco-friendly practices and local culture.",
      "rating": 5
    },
    {
      "hotelName": "Nature's Retreat Madaba",
      "hotelType": "Retreat",
      "country": "Jordan",
      "city": "Madaba",
      "address": "22 Mosaic Avenue, Madaba, Madaba",
      "description": "A retreat in Madaba focusing on local heritage and sustainability.",
      "rating": 5
    },
    {
      "hotelName": "Wadi Mujib Eco Lodge",
      "hotelType": "Lodge",
      "country": "Jordan",
      "city": "Mujib",
      "address": "12 Mujib Road, Mujib, Madaba",
      "description": "A lodge near Wadi Mujib promoting eco-tourism and conservation efforts.",
      "rating": 5
    },
    {
      "hotelName": "Sustainable Oasis Resort",
      "hotelType": "Resort",
      "country": "Jordan",
      "city": "Dead Sea",
      "address": "88 Beach Lane, Dead Sea, Madaba",
      "description": "A resort at the Dead Sea focusing on wellness and environmental conservation.",
      "rating": 5
    },
    {
      "hotelName": "Eco Village Ma'in",
      "hotelType": "Village",
      "country": "Jordan",
      "city": "Ma'in",
      "address": "33 Springs Road, Ma'in, Madaba",
      "description": "An eco-village in Ma'in promoting sustainable practices and local culture.",
      "rating": 4
    },
    {
      "hotelName": "Green Valley Homestay",
      "hotelType": "Homestead",
      "country": "Jordan",
      "city": "Kerak",
      "address": "10 Valley Road, Kerak, Karak",
      "description": "A homestay in Kerak emphasizing local traditions and sustainability.",
      "rating": 5
    },
    {
      "hotelName": "Nature's Haven Resort",
      "hotelType": "Resort",
      "country": "Jordan",
      "city": "Aqaba",
      "address": "66 Coral Beach Road, Aqaba, Aqaba",
      "description": "A resort in Aqaba promoting marine conservation and eco-friendly practices.",
      "rating": 5
    },
    {
      "hotelName": "Sustainable Eco Retreat",
      "hotelType": "Retreat",
      "country": "Jordan",
      "city": "Irbid",
      "address": "22 Green Lane, Irbid, Irbid",
      "description": "A retreat in Irbid focusing on sustainability and local culture.",
      "rating": 4
    },
    {
      "hotelName": "Wildlife Conservation Lodge",
      "hotelType": "Lodge",
      "country": "Jordan",
      "city": "Zarqa",
      "address": "99 Wildlife Drive, Zarqa, Zarqa",
      "description": "A lodge in Zarqa promoting wildlife conservation and community engagement.",
      "rating": 5
    },
    {
      "hotelName": "Eco-Friendly Guesthouse",
      "hotelType": "Guesthouse",
      "country": "Jordan",
      "city": "Salt",
      "address": "44 Community Road, Salt, Balqa",
      "description": "A guesthouse in Salt focusing on eco-friendly practices and local traditions.",
      "rating": 5
    },
    {
      "hotelName": "Green Lodge Petra",
      "hotelType": "Lodge",
      "country": "Jordan",
      "city": "Petra",
      "address": "55 Eco Road, Petra, Ma'an",
      "description": "A lodge near Petra emphasizing sustainability and local culture.",
      "rating": 5
    },
    {
      "hotelName": "Nature's Paradise Resort",
      "hotelType": "Resort",
      "country": "Jordan",
      "city": "Wadi Rum",
      "address": "11 Desert View Lane, Wadi Rum, Ma'an",
      "description": "A resort in Wadi Rum promoting sustainable practices and conservation.",
      "rating": 5
    },
    {
      "hotelName": "Eco Lodge Aqaba",
      "hotelType": "Lodge",
      "country": "Jordan",
      "city": "Aqaba",
      "address": "88 Red Sea Road, Aqaba, Aqaba",
      "description": "An eco-lodge in Aqaba focusing on marine conservation and local culture.",
      "rating": 5
    },
    {
      "hotelName": "Sustainable Nature Retreat",
      "hotelType": "Retreat",
      "country": "Jordan",
      "city": "Madaba",
      "address": "33 Heritage Way, Madaba, Madaba",
      "description": "A retreat in Madaba emphasizing sustainability and heritage preservation.",
      "rating": 5
    },
    {
      "hotelName": "Green Valley Hotel",
      "hotelType": "Hotel",
      "country": "Jordan",
      "city": "Amman",
      "address": "44 Valley Road, Amman, Amman",
      "description": "A hotel in Amman focusing on eco-friendly practices and local cuisine.",
      "rating": 5
    }
  ];     
// Function to insert hotel data into the database
async function insertHotels() {
    try {
        await hotel.insertMany(hotelData);
        console.log('Hotels successfully inserted!');
        mongoose.disconnect(); // Disconnect from the database once insertion is complete
    } catch (error) {
        console.error('Error inserting hotels:', error);
    }
}
