const mongoose = require("mongoose")

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (err) {
        console.log("Error connecting to DB", err);
        process.exit(1);
    }
}

module.exports = connectToDB;