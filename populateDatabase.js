const mongoose = require('mongoose');
const { Country, City } = require('./mongoDB');  // Adjust the path as needed
const sampleData = require('./sampleData');  // Adjust the path as needed

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

async function populateDatabase() {
  try {
    for (const data of sampleData) {
      console.log(`Processing country: ${data.country}`);
      
      // Check if the country already exists
      let country = await Country.findOne({ name: data.country });
      
      if (!country) {
        // If the country doesn't exist, create it
        country = new Country({ name: data.country });
        await country.save();
        console.log(`Created new country: ${country.name}`);
      } else {
        console.log(`Country already exists: ${country.name}`);
      }

      for (const cityName of data.cities) {
        console.log(`Processing city: ${cityName}`);
        
        // Check if the city already exists
        const existingCity = await City.findOne({ name: cityName, country: country._id });
        
        if (!existingCity) {
          // If the city doesn't exist, create it
          const cityData = { 
            name: cityName, 
            country: country._id  // Ensure we're setting the country field
          };
          console.log('City data:', cityData);
          
          const city = new City(cityData);
          
          try {
            await city.save();
            console.log(`Created new city: ${city.name}`);
          } catch (cityError) {
            console.error(`Error saving city ${cityName}:`, cityError);
            console.error('Validation errors:', cityError.errors);
          }
        } else {
          console.log(`City already exists: ${existingCity.name}`);
        }
      }
    }

    console.log('Database population completed');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateDatabase().catch(console.error);