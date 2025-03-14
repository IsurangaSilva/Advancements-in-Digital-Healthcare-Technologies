const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try {
        // Fetch MongoDB URI and DB name from environment variables
        const mongoURI = process.env.MONGODB_URL; 
        const dbName = process.env.MONGO_DB_NAME; 
        
        // Connect to the MongoDB server and specify the database name
        const conn = mongoose.connect(`${mongoURI}/${dbName}`);
        console.log("Database Connected Successfully to " + dbName);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.log("Database Error:", error);
    }
};

module.exports = dbConnect;
