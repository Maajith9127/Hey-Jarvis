// // import React from 'react';
// // import VerfiyList from './PhotoCardComponenents/VerfiyList.jsx';
// // import PhotoUpload from './PhotoCardComponenents/PhotoUpload.jsx';
// // import { addPositionEntry } from '../../../ReduxToolkit/Slices/Positions.jsx';
// // import { useDispatch, useSelector } from 'react-redux';
// // import Positions from './PhotoCardComponenents/Positions.jsx';

// // const PhotoCard = ({ photo: photoid }) => {

// //   const dispatch = useDispatch();
// //   const positions = useSelector((state) =>
// //     state.positions.items.filter((pos) => pos.photoId === photoid)
// //   );

// //   const handleAdd = () => {
// //     dispatch(addPositionEntry({ photoId: photoid }));
// //   };

// //   return (
// //     <div className='Positions'>
// //       <div className='borde ' >
// //         <div  className="borde flex gap-1" >
// //           <button className='px-3  bg-blue-600 text-white border text-sm py-1 rounded-[5px]' onClick={handleAdd}>Add</button>
// //           <button className='px-3 bg-blue-600 text-white border text-sm py-1 rounded-[5px]' >Delete</button>
// //         </div>
// //         <div className='1 overflow-y-scroll h-[300px]' >
// //           {/* Render one PhotoUpload for each item in positions */}
// //           {positions.map((pos, index) => (
// //             <div
// //               key={index}
// //               className='bg-gray-50 flex flex-col  rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200 mb-4'
// //             >
// //               <PhotoUpload photoid={photoid} />
// //               <Positions/>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* VERIFICATION EVENTS SECTION */}
// //       <div className='space-y-4'>
// //         <div className='flex items-center gap-2'>
// //           <div className='w-5 h-5 rounded-full bg-green-100 flex items-center justify-center'>
// //             <svg className='w-3 h-3 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
// //               <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
// //             </svg>
// //           </div>
// //           <h3 className='text-lg font-medium text-gray-800'>Verification Events</h3>
// //         </div>
// //         <VerfiyList photoid={photoid} />
// //       </div>

// //     </div>
// //   );
// // };

// // export default PhotoCard;



// import React from 'react';
// import VerfiyList from './PhotoCardComponenents/VerfiyList.jsx';
// import PhotoUpload from './PhotoCardComponenents/PhotoUpload.jsx';
// import { addPositionEntry, deleteParticularPhoto } from '../../../ReduxToolkit/Slices/Positions.jsx';
// import { useDispatch, useSelector } from 'react-redux';
// import Positions from './PhotoCardComponenents/Positions.jsx';

// const PhotoCard = ({ photo: photoid }) => {
//   const dispatch = useDispatch();

//   //  Get the group for this photoId
//   const photoGroup = useSelector((state) =>
//     state.positions.items.find((pos) => pos.photoId === photoid)
//   );

//   const handleAdd = () => {
//     dispatch(addPositionEntry({ photoId: photoid }));
//   };

//   return (
//     <div className="Positions">
//       <div className="borde ">
//         <div className="borde flex gap-1">
//           <button
//             className="px-3  bg-blue-600 text-white border text-sm py-1 rounded-[5px]"
//             onClick={handleAdd}
//           >
//             Add
//           </button>

//         </div>

//         <div className=" overflow-y-scroll h-[300px]">
//           {/*Render each ParticularPhoto under this photoId */}
//           {photoGroup?.particularPhotos?.map((pPhoto, index) => (
//             <div
//               key={pPhoto.ParticularPhotoId}
//               className="bg-gray-50 flex flex-col  rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200 mb-4"
//             >
//               {/* Pass down the ParticularPhotoId */}
//               <PhotoUpload photoid={photoid} particularPhotoId={pPhoto.ParticularPhotoId} />
//               <Positions
//                 photoid={photoid}
//                 particularPhotoId={pPhoto.ParticularPhotoId}
//                 pPhoto={pPhoto}
//               />

//               <button
//                 onClick={() =>
//                   dispatch(deleteParticularPhoto({ photoId: photoid, particularPhotoId: pPhoto.ParticularPhotoId }))
//                 }
//                 className="px-3 mt-3 bg-red-600 text-white border text-sm py-1 rounded-[5px]"
//               >
//                 Delete
//               </button>

//             </div>
//           ))}
//         </div>
//       </div>

//       {/* VERIFICATION EVENTS SECTION */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2">
//           <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
//             <svg
//               className="w-3 h-3 text-green-600"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-800">Verification Events</h3>
//         </div>
//         <VerfiyList photoid={photoid} />
//       </div>
//     </div>
//   );
// };
// export default PhotoCard;




import React from 'react';
import VerfiyList from './PhotoCardComponenents/VerfiyList.jsx';
import PhotoUpload from './PhotoCardComponenents/PhotoUpload.jsx';
import { addPositionEntry, deleteParticularPhoto } from '../../../ReduxToolkit/Slices/Positions.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Positions from './PhotoCardComponenents/Positions.jsx';

const PhotoCard = ({ photo: photoid }) => {
  const dispatch = useDispatch();

  //  Get the group for this photoId
  const photoGroup = useSelector((state) =>
    state.positions.items.find((pos) => pos.photoId === photoid)
  );

  const handleAdd = () => {
    dispatch(addPositionEntry({ photoId: photoid }));
  };

  return (
    <div className="Positions">
      <div className="borde ">
        <div className="borde flex gap-1">
          <button
            className="px-3 bg-blue-600 text-white border text-sm py-1 rounded-[5px]"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>

        <div className="overflow-y-scroll h-[300px]">
          {/*Render each ParticularPhoto under this photoId */}
          {photoGroup?.particularPhotos
            ?.filter((p) => p.changed !== "deleted")   // 🚀 ignore deleted ones
            .map((pPhoto) => (
              <div
                key={pPhoto.ParticularPhotoId}
                className="bg-gray-50 flex flex-col rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200 mb-4"
              >
                {/* Pass down the ParticularPhotoId */}
                <PhotoUpload
                  photoid={photoid}
                  particularPhotoId={pPhoto.ParticularPhotoId}
                />
                <Positions
                  photoid={photoid}
                  particularPhotoId={pPhoto.ParticularPhotoId}
                  pPhoto={pPhoto}
                />

                <button
                  onClick={() =>
                    dispatch(
                      deleteParticularPhoto({
                        photoId: photoid,
                        particularPhotoId: pPhoto.ParticularPhotoId
                      })
                    )
                  }
                  className="px-3 mt-3 bg-red-600 text-white border text-sm py-1 rounded-[5px]"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* VERIFICATION EVENTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800">Verification Events</h3>
        </div>
        <VerfiyList photoid={photoid} />
      </div>
    </div>
  );
};

export default PhotoCard;
