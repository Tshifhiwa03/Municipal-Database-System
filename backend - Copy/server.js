
const complaintRoutes =
    require("./routes/complaintRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");



const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/complaints", complaintRoutes);


// ======================================
// MONGODB CONNECTION
// ======================================

mongoose.connect("mongodb://127.0.0.1:27017/jhb_civic_report")

.then(() => {

    console.log("MongoDB Connected Successfully");

})

.catch((error) => {

    console.log("MongoDB Connection Error:", error);

});


app.get("/", (req, res) => {

    res.send("JHB Civic Report Backend Running");

});

app.get("/api/test", (req, res) => {

    res.json({

        success: true,
        message: "Backend API working successfully",
        project: "JHB Civic Report System"

    });

});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});