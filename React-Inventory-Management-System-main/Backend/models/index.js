const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/InventoryManagementApp";

function main() {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Successful");
        })
        .catch((err) => {
            console.log("Error:", err);
        });
}

module.exports = { main };
