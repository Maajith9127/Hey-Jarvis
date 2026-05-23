import AccountabilityCollection from "../models/AccountabilityCollection.js";

// ⬇ Save logic with user-based filtering
export const HandleSaveAccountability = async ({ added, updated, deleted }, userId, session) => {
  const ops = [];

  if (added.length > 0) {
    const enriched = added.map(item => ({ ...item, userId }));
    ops.push(AccountabilityCollection.insertMany(enriched));
  }

  if (updated.length > 0) {
    updated.forEach((item) => {
      ops.push(
        AccountabilityCollection.updateOne(
          { AccountabilityId: item.AccountabilityId, userId },
          { $set: { message: item.message, ToAddress: item.ToAddress } },
          { session }
        )
      );
    });
  }

  if (deleted.length > 0) {
    deleted.forEach((id) => {
      ops.push(
        AccountabilityCollection.deleteOne({ AccountabilityId: id, userId }, { session })
      );
    });
  }

  await Promise.all(ops);

  console.log('✅ Accountability ops complete for user:', userId, {
    added: added.length,
    updated: updated.length,
    deleted: deleted.length,
  });
};

// ⬇️ Fetch logic (user-specific)
export const GetAccountabilityMessages = async (userId) => {
  const messages = await AccountabilityCollection.find({ userId });
  return messages;
};
