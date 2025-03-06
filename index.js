const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const fs = require("fs");
const ical = require("ical");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express(); // ✅ Define `app` before using it!
const PORT = process.env.PORT || 8088;

const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.PASSWORD || "test", 10);

// Configure Handlebars to use `.html` instead of `.hbs`
app.engine("html", engine({ extname: ".html", defaultLayout: false }));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
let currentImageId = 0;
let currentVideoId = 0;

const getMedia = () => {
    const filePath = path.join(__dirname, "public", "media.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!data.images || !data.videos) return { image1: "", image2: "", video: "" };
    const image1 = data.images[currentImageId] || data.images[0];
    const image2 = data.images[currentImageId + 2] || data.images[1] || data.images[0];
    //get next video
    const video = data.videos[currentVideoId] || data.videos[0];

    //increment
    currentImageId = (currentImageId + 2) % data.images.length;
    currentVideoId = (currentVideoId + 1) % data.videos.length;
    return {
        image1: image1.path,
        image1Creator: image1.creator,
        image2: image2.path,
        image2Creator: image2.creator,
        video: video.path,
        videoCreator: video.creator
    };
};
const parseCalendarEvents = () => {
    const filePath = path.join(__dirname, "public", "events.ics");
    const data = fs.readFileSync(filePath, "utf8");
    const events = ical.parseICS(data);

    const parsedEvents = Object.values(events)
        .filter((event) => event.type === "VEVENT")
        .map((event) => ({
            summary: event.summary || "No Title",
            location: event.location || "No Location",
            description: event.description || "No Description",
            start: event.start ? new Date(event.start).toDateString() : "Unknown",
            time: event.start
                ? new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Unknown",
            end: event.end
                ? new Date(event.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Unknown"
        }));

    return parsedEvents;
};

// Home Route
app.get("/", (req, res) => {
    const media = getMedia();
    res.render("index", {
        title: "LeftLane Community",
        video: media.video,
        image1: media.image1,
        Image2: media.image2
    });
});
app.get("/contact", (req, res) => res.render("contact", { title: "Contact Us" }));
app.get("/socials", (req, res) => res.render("socials"));

app.get("/events", (req, res) => {
    const events = parseCalendarEvents();
    res.render("events", { title: "Events", events });
});
app.get("/calendar.ics", (req, res) => {
    const filePath = path.join(__dirname, "public", "events.ics");
    res.download(filePath, "LeftLaneCommunity.ics");
});
// Vercel support: Export Express app
module.exports = app;

// Start server locally
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
