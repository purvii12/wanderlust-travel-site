const mongoose = require("mongoose");
const initData = require("../data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Data initialized successfully!");
    } catch (error) {
        console.log("Error initializing data:", error);
    }
};

initDB();
