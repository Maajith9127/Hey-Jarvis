
import mongoose from "mongoose";
import CollisionCollection from "../../../models/CollisionCollection.js";

export const getNextUpcomingAccountabilities = async (userId) => {
  const currentTime = new Date(Date.now()); // Make sure it's explicit UTC

  if (!userId) {
    console.error(" userId missing in getNextUpcomingAccountabilities");
    return [];
  }

  try {
    console.log('userId in getNextUpcomingAccountabilities:', userId);

    const userObjectId = new mongoose.Types.ObjectId(String(userId));

    const allDocsForUser = await CollisionCollection.find({
      userId: userObjectId,
    }).lean();

    console.log(" All Collision records for user:", JSON.stringify(allDocsForUser, null, 2));

    //  Step 1: Find the earliest upcoming end time (UTC-safe now)
    const firstMatch = await CollisionCollection.aggregate([
      { $match: { userId: userObjectId } },
      { $unwind: "$OtherAccountabilitiesInCollisionWith" },
      {
        $match: {
          "OtherAccountabilitiesInCollisionWith.end": { $gt: currentTime }
        }
      },
      { $sort: { "OtherAccountabilitiesInCollisionWith.end": 1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          minEndTime: "$OtherAccountabilitiesInCollisionWith.end"
        }
      }
    ]);

    console.log(' First match found for user:', userId, firstMatch);

    if (firstMatch.length > 0) {
      const minEnd = firstMatch[0].minEndTime;

      //  Step 2: Find all entries with that minEnd
      const result = await CollisionCollection.aggregate([
        { $match: { userId: userObjectId } },
        { $unwind: "$OtherAccountabilitiesInCollisionWith" },
        {
          $match: {
            "OtherAccountabilitiesInCollisionWith.end": minEnd
          }
        },
        {
          $project: {
            _id: 0,
            accountability: "$OtherAccountabilitiesInCollisionWith",
            parentTodo: "$Todo"
          }
        }
      ]);

      return result;
    }

    return [];

  } catch (err) {
    console.error("Error in getNextUpcomingAccountabilities():", err);
    return [];
  }
};
