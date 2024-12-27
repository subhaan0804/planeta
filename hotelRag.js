const { OpenAI } = require('openai');
const { encode } = require('gpt-3-encoder');
// const OPENAI_API_KEY="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";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: "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"
});

// Enhanced document preprocessing function to match your schema
const preprocessHotel = (hotel) => {
    // Calculate average review rating
    const averageRating = hotel.reviews.length > 0
        ? hotel.reviews.reduce((acc, review) => acc + review.rating, 0) / hotel.reviews.length
        : 0;

    // Combine relevant fields into a comprehensive text representation
    const combinedText = `
        Hotel Name: ${hotel.hotelName}
        Location: ${hotel.location.city}, ${hotel.location.country}
        Overview: ${hotel.description.overview}
        Amenities: ${hotel.description.amenities.join(', ')}
        Sustainability Features: ${hotel.description.sustainabilityFeatures.join(', ')}
        Sustainability Rating: ${hotel.sustainabilityRating}/5
        Carbon Offset Options: ${hotel.carbonOffsetOptions.map(option => 
            `${option.impact} (Cost: $${option.cost})`
        ).join(', ')}
        Average Review Rating: ${averageRating.toFixed(1)}/5
        Recent Reviews: ${hotel.reviews.slice(0, 3).map(review => 
            `"${review.comment}" - Rating: ${review.rating}/5`
        ).join(' | ')}
    `.trim().replace(/\s+/g, ' ');

    return combinedText;
};

// Update the hotel schema to include embedding fields
const updateHotelSchema = async (Hotel) => {
    // Add embedding fields to the schema if they don't exist
    if (!Hotel.schema.paths.embedding) {
        Hotel.schema.add({
            embedding: {
                type: [Number],
                index: true,
                sparse: true
            },
            processedText: {
                type: String
            }
        });
    }
};

// Generate embeddings using OpenAI
const generateEmbedding = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    return response.data[0].embedding;
};

// Index hotels with embeddings
const indexHotelsWithEmbeddings = async (Hotel) => {
    // First ensure the schema is updated
    await updateHotelSchema(Hotel);
    
    const hotels = await Hotel.find({});
    console.log(`Starting indexing for ${hotels.length} hotels...`);
    
    for (const hotel of hotels) {
        try {
            const processedText = preprocessHotel(hotel);
            const embedding = await generateEmbedding(processedText);
            
            await Hotel.updateOne(
                { _id: hotel._id },
                { 
                    $set: { 
                        embedding: embedding,
                        processedText: processedText
                    } 
                }
            );
            console.log(`Indexed hotel: ${hotel.hotelName}`);
        } catch (error) {
            console.error(`Error indexing hotel ${hotel.hotelName}:`, error);
        }
    }
    
    console.log('Indexing complete');
};

// Semantic search function using embeddings
const searchHotels = async (Hotel, userQuery, options = {}) => {
    const {
        limit = 5,
        minSustainabilityRating = 0,
        maxCarbonOffsetCost = Infinity
    } = options;

    // Generate embedding for the search query
    const queryEmbedding = await generateEmbedding(userQuery);
    
    // Find hotels with embeddings and apply filters
    const hotels = await Hotel.find({
        embedding: { $exists: true },
        sustainabilityRating: { $gte: minSustainabilityRating }
    }).lean();

    // Calculate similarities and apply additional filters
    const hotelsWithSimilarity = hotels
        .filter(hotel => {
            // Filter by carbon offset cost if specified
            if (maxCarbonOffsetCost < Infinity) {
                return hotel.carbonOffsetOptions.some(option => option.cost <= maxCarbonOffsetCost);
            }
            return true;
        })
        .map(hotel => ({
            ...hotel,
            similarity: cosineSimilarity(queryEmbedding, hotel.embedding)
        }));

    // Sort by similarity and return top results
    return hotelsWithSimilarity
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
};

// Cosine similarity calculation
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

// Generate natural language response with sustainability focus
const generateResponse = async (userQuery, hotels) => {
    const prompt = `Based on the user's query "${userQuery}", here are the best matching eco-friendly hotels:\n\n` +
        hotels.map(hotel => `
            ${hotel.hotelName} in ${hotel.location.city}, ${hotel.location.country}
            - Sustainability Rating: ${hotel.sustainabilityRating}/5
            - Key Features: ${hotel.description.sustainabilityFeatures.join(', ')}
            - Overview: ${hotel.description.overview}
            - Carbon Offset Options Available: ${hotel.carbonOffsetOptions.map(o => o.impact).join(', ')}
            - Average Rating: ${hotel.reviews.reduce((acc, r) => acc + r.rating, 0) / hotel.reviews.length}/5
        `).join('\n\n') +
        '\n\nPlease provide a detailed recommendation focusing on sustainability features and eco-friendly aspects of these hotels.';

    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
            {
                role: "system",
                content: "You are an expert in sustainable tourism and eco-friendly accommodations. Focus on environmental impact, sustainability features, and carbon offset options when making recommendations."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return completion.choices[0].message.content;
};

module.exports = {
    indexHotelsWithEmbeddings,
    searchHotels,
    generateResponse,
    updateHotelSchema
};