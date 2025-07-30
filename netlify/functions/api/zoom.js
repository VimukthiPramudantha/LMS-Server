const axios = require("axios");
const base64 = require("base-64");
// require("dotenv").config();

// const zoomAccountId = `N_ux-rFDR3OO7Jy_5aOlSw`;
// const zoomClientId = `MEiSxPA5Rc2kWtewpcPnLw`;
// const zoomClientSecret = `fl6Yy7zAyy3Strfzap17opVV9VFLmfvh`;

const zoomAccountId = `Hz26jS03QmC7sJHaypz-Sw`;
const zoomClientId = `680B54HKTmuqJtsUryvwUg`;
const zoomClientSecret = `sy0WPzRUvh4z8qG0vTjz7B8CDd5aZoJF`;

const zoomAccountId_PCFour = `lwsl-OftTlq9yxN54zF8Qw`;
const zoomClientId_PCFour = `twv1OQ2SQSmNgKhpeZDGLQ`;
const zoomClientSecret_PCFour = `KpLzvVHRoUeXh7lq3EmUq4VCzcc7m8zg`;


// const zoomAccountId = process.env.ZOOM_ACCOUNT_ID;
// const zoomClientId = process.env.ZOOM_CLIENT_ID;
// const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;

const getAuthHeaders = () => ({
    Authorization: `Basic ${base64.encode(`${zoomClientId}:${zoomClientSecret}`)}`,
    "Content-Type": "application/json",
});

const generateZoomAccessToken = async () => {
    try {
        const response = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
            {},
            { headers: getAuthHeaders() }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Error generating Zoom access token:", error.response?.data || error);
        throw new Error("Failed to generate Zoom access token");
    }
};

const createMeeting = async (req, res) => {
    try {
        const token = await generateZoomAccessToken();                 
const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
        topic: req.body.topic || "LMS Online Class",
        type: 2,
        start_time: req.body.start_time || new Date().toISOString(),
        password: req.body.password || "365456",  // ✅ Password inside "settings"
        duration: req.body.duration || 60,
        timezone: "Asia/Colombo",
        agenda: req.body.agenda || "LMS Scheduled Meeting",
        settings: {
            host_video: true,
            participant_video: false,
            join_before_host: true,
            mute_upon_entry: true,
            waiting_room: true,
            meeting_authentication: false,  // ❌ If true, password might be ignored
            email_notification: true,
        },
    },
    {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
);


        res.status(200).json({ meetingDetails: response.data });
    } catch (error) {
        console.error("Error creating Zoom meeting:", error.response?.data || error);
        res.status(500).json({ message: "Failed to create meeting." });
    }
};

module.exports = { createMeeting };
