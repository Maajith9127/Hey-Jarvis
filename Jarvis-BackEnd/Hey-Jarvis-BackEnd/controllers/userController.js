// controllers/userController.js
import UserCollection from "../models/UserCollection.js"; // Adjust the path as necessary

export const updateUserLocation = async (req, res) => {
    const userId = req.userId;
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        const updatedUser = await UserCollection.findByIdAndUpdate(
            userId,
            { location },
            { new: true }
        ).select("location");

        res.status(200).json({ message: "Location updated", location: updatedUser.location });
    } catch (err) {
        console.error("❌ Failed to update location:", err);
        res.status(500).json({ error: "Server error" });
    }
};
