// const { default: mongoose} = require("mongoose");

// const dbConnect = () => {
//     try{
//         const conn = mongoose.connect(process.env.MONGODB_URL);
//         console.log("Database Connected Successfully!");
//     }
//     catch(error){
//         console.log("Database Error");
//     }
// }

// module.exports = dbConnect;
const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try {
        // Fetch MongoDB URI and DB name from environment variables
        const mongoURI = process.env.MONGODB_URL; // MongoDB URI, e.g., mongodb://localhost:27017
        const dbName = process.env.MONGO_DB_NAME; // Default to 'emootion_db' if not set
        
        // Connect to the MongoDB server and specify the database name
        const conn = mongoose.connect(`${mongoURI}/${dbName}`);
        console.log("Database Connected Successfully to " + dbName);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.log("Database Error:", error);
    }
};

module.exports = dbConnect;
