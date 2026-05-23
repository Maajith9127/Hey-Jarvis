
// import AccountabilityCollection from "../../models/AccountabilityCollection.js";

// const HandleSaveAccountability = async ({ added, updated, deleted }, session) => {
//     const ops = [];

//     if (added.length > 0) {
//         ops.push(AccountabilityCollection.insertMany(added));
//     }

//     if (updated.length > 0) {
//         updated.forEach(item => {
//             ops.push(
//                 AccountabilityCollection.updateOne(
//                     { AccountabilityId: item.AccountabilityId },
//                     { $set: { message: item.message, ToAddress: item.ToAddress } },
//                     { session }
//                 )
//             );
//         });
//     }

//     if (deleted.length > 0) {
//         deleted.forEach(id => {
//             ops.push(
//                 AccountabilityCollection.deleteOne({ AccountabilityId: id }, { session })
//             );
//         });
//     }

//     await Promise.all(ops);

//     console.log('Accountabilities processed:', {
//         ToBeAdded: added.length,
//         ToBeUpdated: updated.length,
//         ToBeDeleted: deleted.length,
//     });
// };

// const GetAccountabilityMessages = async (session) => {
//     try {
//         const AccountabilittyMessages = await AccountabilityCollection.find({}).session(session).lean();
//         // console.log('Accountability Messages:', AccountabilittyMessages);
//         return AccountabilittyMessages;
//     } catch (error) {
//         console.log('Error Fetching the data from the Accountability Collection');
//         console.error('Error:', error);
//     }
// }
// export {
//     HandleSaveAccountability,
//     GetAccountabilityMessages
// }





