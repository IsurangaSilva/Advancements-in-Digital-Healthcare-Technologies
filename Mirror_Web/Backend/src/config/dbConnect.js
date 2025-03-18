const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();


const dbConnect = () => {
    try {
        // Fetch MongoDB URI and DB name from environment variables
        const mongoURI =  "mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection"; 
        const dbName =   "emotionDB";
        
        // Connect to the MongoDB server and specify the database name
        const conn = mongoose.connect(`${mongoURI}/${dbName}`);
        console.log("Database Connected Successfully to " + dbName);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.log("Database Error:", error);
    }
};

module.exports = dbConnect;
