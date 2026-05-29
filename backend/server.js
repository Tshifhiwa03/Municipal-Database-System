const express = require("express");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");
const imageRoutes = require("./routes/imageRoutes");
const communityMemberRoutes = require("./routes/communityMemberRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/maintenance-requests", complaintRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/community_member", communityMemberRoutes);

app.get("/", (req, res) => {
    res.send("JHB Civic Report Backend Running");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend API working successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});