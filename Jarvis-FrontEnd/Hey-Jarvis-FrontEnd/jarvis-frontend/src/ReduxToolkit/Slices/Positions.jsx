
// import { createSlice } from '@reduxjs/toolkit';
// import { v4 as uuidv4 } from 'uuid';

// const positionsSlice = createSlice({
//   name: 'positions',
//   initialState: {
//     items: []   // [{ photoId, changed, particularPhotos: [...] }]
//   },
//   reducers: {
//     // Add a new particularPhoto under a photoId
//     addPositionEntry: (state, { payload }) => {
//       // payload = { photoId }
//       let group = state.items.find(item => item.photoId === payload.photoId);

//       if (!group) {
//         // First time → create group with one particularPhoto
//         state.items.push({
//           photoId: payload.photoId,
//           changed: true,
//           particularPhotos: [
//             {
//               ParticularPhotoId: uuidv4(),
//               ParticularPhotoUrl: "",
//               changed: true,
//               positions: []
//             }
//           ]
//         });
//       } else {
//         // Already exists → add another particularPhoto
//         group.particularPhotos.push({
//           ParticularPhotoId: uuidv4(),
//           ParticularPhotoUrl: "",
//           changed: true,
//           positions: []
//         });
//         group.changed = true; // bubble up
//       }
//     },

//     // Add a new row inside a particularPhoto
//     addPositionRow: (state, { payload }) => {
//       // payload = { photoId, particularPhotoId }
//       const group = state.items.find(item => item.photoId === payload.photoId);
//       if (group) {
//         const pPhoto = group.particularPhotos.find(
//           p => p.ParticularPhotoId === payload.particularPhotoId
//         );
//         if (pPhoto) {
//           const newPos = {
//             positionid: uuidv4(),
//             position: "",
//             string: "",
//             changed: true
//           };
//           pPhoto.positions.push(newPos);
//           pPhoto.changed = true;
//           group.changed = true;
//         }
//       }
//     },

//     // Update a row inside positions
//     updatePositionRow: (state, { payload }) => {
//       // payload = { photoId, particularPhotoId, positionid, newPosition?, newString? }
//       const group = state.items.find(item => item.photoId === payload.photoId);
//       if (group) {
//         const pPhoto = group.particularPhotos.find(
//           p => p.ParticularPhotoId === payload.particularPhotoId
//         );
//         if (pPhoto) {
//           const pos = pPhoto.positions.find(p => p.positionid === payload.positionid);
//           if (pos) {
//             if (payload.newPosition !== undefined) pos.position = payload.newPosition;
//             if (payload.newString !== undefined) pos.string = payload.newString;

//             pos.changed = true;
//             pPhoto.changed = true;
//             group.changed = true;
//           }
//         }
//       }
//     },

//     // Delete a row
//     deletePositionRow: (state, { payload }) => {
//       // payload = { photoId, particularPhotoId, positionid }
//       const group = state.items.find(item => item.photoId === payload.photoId);
//       if (group) {
//         const pPhoto = group.particularPhotos.find(
//           p => p.ParticularPhotoId === payload.particularPhotoId
//         );
//         if (pPhoto) {
//           pPhoto.positions = pPhoto.positions.filter(
//             pos => pos.positionid !== payload.positionid
//           );
//           pPhoto.changed = true;
//           group.changed = true;
//         }
//       }
//     },

//     // Update photoUrl for a particularPhoto
//     updateParticularPhotoUrl: (state, { payload }) => {
//       // payload = { photoId, particularPhotoId, newUrl }
//       const group = state.items.find(item => item.photoId === payload.photoId);
//       if (group) {
//         const pPhoto = group.particularPhotos.find(
//           p => p.ParticularPhotoId === payload.particularPhotoId
//         );
//         if (pPhoto) {
//           pPhoto.ParticularPhotoUrl = payload.newUrl;
//           pPhoto.changed = true;
//           group.changed = true;
//         }
//       }
//     },

//     // Delete an entire particularPhoto
//     deleteParticularPhoto: (state, { payload }) => {
//       // payload = { photoId, particularPhotoId }
//       const group = state.items.find(item => item.photoId === payload.photoId);
//       if (group) {
//         group.particularPhotos = group.particularPhotos.filter(
//           p => p.ParticularPhotoId !== payload.particularPhotoId
//         );
//         group.changed = true;
//       }
//     },

//     // Clear all change flags after successful save
//     clearChanges: (state) => {
//       state.items.forEach(group => {
//         group.changed = false;
//         group.particularPhotos.forEach(p => {
//           p.changed = false;
//           p.positions.forEach(pos => {
//             pos.changed = false;
//           });
//         });
//       });
//     }
//   }
// });

// export const {
//   addPositionEntry,
//   addPositionRow,
//   updatePositionRow,
//   deletePositionRow,
//   deleteParticularPhoto,
//   updateParticularPhotoUrl,
//   clearChanges
// } = positionsSlice.actions;

// export default positionsSlice.reducer;




import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const positionsSlice = createSlice({
  name: 'positions',
  initialState: {
    items: []
  },
  reducers: {
    // Add a new particularPhoto under a photoId
    addPositionEntry: (state, { payload }) => {
      // payload = { photoId }
      let group = state.items.find(item => item.photoId === payload.photoId);

      if (!group) {
        // First time → create group with one particularPhoto
        state.items.push({
          photoId: payload.photoId,
          changed: true,
          particularPhotos: [
            {
              ParticularPhotoId: uuidv4(),
              ParticularPhotoUrl: "",
              changed: true,
              positions: []
            }
          ]
        });
      } else {
        // Already exists → add another particularPhoto
        group.particularPhotos.push({
          ParticularPhotoId: uuidv4(),
          ParticularPhotoUrl: "",
          changed: true,
          positions: []
        });
        group.changed = true;
      }
    },

    // Add a new row inside a particularPhoto
    addPositionRow: (state, { payload }) => {
      // payload = { photoId, particularPhotoId }
      const group = state.items.find(item => item.photoId === payload.photoId);
      if (group) {
        const pPhoto = group.particularPhotos.find(
          p => p.ParticularPhotoId === payload.particularPhotoId
        );
        if (pPhoto) {
          pPhoto.positions.push({
            positionid: uuidv4(),
            position: "",
            string: "",
            changed: true
          });
          pPhoto.changed = true;
          group.changed = true;
        }
      }
    },

    // Update a row inside positions
    updatePositionRow: (state, { payload }) => {
      // payload = { photoId, particularPhotoId, positionid, newPosition?, newString? }
      const group = state.items.find(item => item.photoId === payload.photoId);
      if (group) {
        const pPhoto = group.particularPhotos.find(
          p => p.ParticularPhotoId === payload.particularPhotoId
        );
        if (pPhoto) {
          const pos = pPhoto.positions.find(p => p.positionid === payload.positionid);
          if (pos) {
            if (payload.newPosition !== undefined) pos.position = payload.newPosition;
            if (payload.newString !== undefined) pos.string = payload.newString;
            pos.changed = true;
            pPhoto.changed = true;
            group.changed = true;
          }
        }
      }
    },

    // Delete a row
    deletePositionRow: (state, { payload }) => {
      // payload = { photoId, particularPhotoId, positionid }
      const group = state.items.find(item => item.photoId === payload.photoId);
      if (group) {
        const pPhoto = group.particularPhotos.find(
          p => p.ParticularPhotoId === payload.particularPhotoId
        );
        if (pPhoto) {
          const pos = pPhoto.positions.find(p => p.positionid === payload.positionid);
          if (pos) {
            pos.changed = "deleted"; // mark delete
          }
          pPhoto.changed = true;
          group.changed = true;
        }
      }
    },

    // Update photoUrl for a particularPhoto
    updateParticularPhotoUrl: (state, { payload }) => {
      // payload = { photoId, particularPhotoId, newUrl }
      const group = state.items.find(item => item.photoId === payload.photoId);
      if (group) {
        const pPhoto = group.particularPhotos.find(
          p => p.ParticularPhotoId === payload.particularPhotoId
        );
        if (pPhoto) {
          pPhoto.ParticularPhotoUrl = payload.newUrl;
          pPhoto.changed = true;
          group.changed = true;
        }
      }
    },

    // Delete an entire particularPhoto
    deleteParticularPhoto: (state, { payload }) => {
      // payload = { photoId, particularPhotoId }
      const group = state.items.find(item => item.photoId === payload.photoId);
      if (group) {
        // 🔥 mark the entire photo group as deleted
        group.changed = "deleted";

        const pPhoto = group.particularPhotos.find(
          p => p.ParticularPhotoId === payload.particularPhotoId
        );

        if (pPhoto) {
          pPhoto.changed = "deleted";

          // mark all positions under this pPhoto too
          pPhoto.positions.forEach(pos => {
            pos.changed = "deleted";
          });
        }
      }
    },

    // Clear all flags after save
    clearChanges: (state) => {
      state.items.forEach(group => {
        group.changed = false;
        group.particularPhotos.forEach(p => {
          if (p.changed !== "deleted") {
            p.changed = false;
          }
          p.positions.forEach(pos => {
            if (pos.changed !== "deleted") {
              pos.changed = false;
            }
          });
        });
      });
    },
    setPositionsFromDb: (state, { payload }) => {
      // payload = { positions: [...] } (from backend)
      state.items = payload.positions.map(group => ({
        photoId: group.photoId,
        changed: false,   // 👈 fresh from DB, untouched
        particularPhotos: group.particularPhotos.map(pPhoto => ({
          ParticularPhotoId: pPhoto.ParticularPhotoId,
          ParticularPhotoUrl: pPhoto.ParticularPhotoUrl,
          changed: false,
          positions: pPhoto.positions.map(pos => ({
            positionid: pos.positionid,
            position: pos.position,
            string: pos.string,
            changed: false
          }))
        }))
      }));
    },
    deletePhotoPositions: (state, { payload }) => {
      // payload = { photoId }
      const group = state.items.find(item => item.photoId === payload.photoId);
      if (group) {
        group.changed = "deleted"; // mark the group deleted
        group.particularPhotos.forEach(p => {
          p.changed = "deleted";
          p.positions.forEach(pos => {
            pos.changed = "deleted";
          });
        });
      }
    }


  }
});

export const {
  addPositionEntry,
  addPositionRow,
  updatePositionRow,
  deletePositionRow,
  deleteParticularPhoto,
  updateParticularPhotoUrl,
  clearChanges,
  setPositionsFromDb,
  deletePhotoPositions
} = positionsSlice.actions;

export default positionsSlice.reducer;
