const mongoose = require("mongoose");
const app = require("./app");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const port = 8080;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.log(err));
