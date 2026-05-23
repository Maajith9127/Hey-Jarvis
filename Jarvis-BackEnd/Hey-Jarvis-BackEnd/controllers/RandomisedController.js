import Randomised from "../models/RandomisedCollection.js";

// CREATE
export const createRandomised = async (req, res) => {
  try {
    const {
      AccountabilityId,
      type,
      label,
      numberOfEvents,
      slotDuration,
      maxAccountabilities,
    } = req.body;

    const userId = req.userId;

    const existingStrict = await Randomised.findOne({
      userId: req.userId,
      StrictMode: { $gt: new Date() }
    });

    if (existingStrict) {
      return res.status(403).json({
        error: "Strict Mode is active for randomised settings.",
        blocked: [{ type: "randomised", id: existingStrict.AccountabilityId }]
      });
    }

    //  Step 1: Delete all existing randomised records for this user
    await Randomised.deleteMany({ userId });

    //  Step 2: Create the new record
    const newEntry = await Randomised.create({
      userId,
      AccountabilityId,
      type,
      label,
      numberOfEvents,
      slotDuration,
      maxAccountabilities,
    });

    res.status(201).json(newEntry);
  } catch (err) {
    console.error(" Error creating randomised setting:", err);
    res.status(500).json({ error: "Server error during creation." });
  }
};

// READ
export const getAllRandomised = async (req, res) => {
  try {
    const userId = req.userId; //  fixed from req.user.id
    const data = await Randomised.find({ userId });
    res.json(data);
  } catch (err) {
    console.error(" Error fetching randomised settings:", err);
    res.status(500).json({ error: "Server error during fetch." });
  }
};


// // UPDATE
// export const updateRandomised = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updated = await Randomised.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     if (!updated) return res.status(404).json({ error: "Not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error(" Error updating:", err);
//     res.status(500).json({ error: "Server error during update." });
//   }
// };

// // DELETE
// export const deleteRandomised = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deleted = await Randomised.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ error: "Not found" });
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     console.error(" Error deleting:", err);
//     res.status(500).json({ error: "Server error during delete." });
//   }
// };
