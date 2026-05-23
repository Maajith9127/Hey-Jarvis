
// import React from "react";
// import { useDispatch } from "react-redux";
// import {
//     addPositionRow,
//     updatePositionRow,
//     deletePositionRow
// } from "../../../../ReduxToolkit/Slices/Positions.jsx";

// const Positions = ({ photoid, particularPhotoId, pPhoto }) => {
//     const dispatch = useDispatch();

//     const handleAdd = () => {
//         dispatch(addPositionRow({ photoId: photoid, particularPhotoId }));
//     };

//     const handleDelete = (positionid) => {
//         dispatch(deletePositionRow({ photoId: photoid, particularPhotoId, positionid }));
//     };

//     const handleChange = (positionid, field, value) => {
//         dispatch(
//             updatePositionRow({
//                 photoId: photoid,
//                 particularPhotoId,
//                 positionid,
//                 [field]: value
//             })
//         );
//     };

//     return (
//         <>
//             <div>
//                 <button
//                     onClick={handleAdd}
//                     className="px-2 py-1 bg-blue-500 text-white rounded"
//                 >
//                     +
//                 </button>
//             </div>
//             <div className="borde mt-2 overflow-y-scroll h-[100px]">
//                 {pPhoto.positions.map((pos) => (
//                     <div key={pos.positionid} className="flex gap-2 h-[30px] mb-1">
//                         <div className="w-[30%]">
//                             <input
//                                 placeholder="P"
//                                 value={pos.position}
//                                 onChange={(e) =>
//                                     handleChange(pos.positionid, "newPosition", e.target.value)
//                                 }
//                                 className="w-full h-full border"
//                                 type="text"
//                             />
//                         </div>
//                         <div className="w-[70%]">
//                             <input
//                                 placeholder="String"
//                                 value={pos.string}
//                                 onChange={(e) =>
//                                     handleChange(pos.positionid, "newString", e.target.value)
//                                 }
//                                 className="w-full h-full border"
//                                 type="text"
//                             />
//                         </div>
//                         <button
//                             onClick={() => handleDelete(pos.positionid)}
//                             className="text-2xl flex justify-center items-center text-red-500"
//                         >
//                             -
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// };

// export default Positions;





import React from "react";
import { useDispatch } from "react-redux";
import {
  addPositionRow,
  updatePositionRow,
  deletePositionRow
} from "../../../../ReduxToolkit/Slices/Positions.jsx";

const Positions = ({ photoid, particularPhotoId, pPhoto }) => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addPositionRow({ photoId: photoid, particularPhotoId }));
  };

  const handleDelete = (positionid) => {
    dispatch(deletePositionRow({ photoId: photoid, particularPhotoId, positionid }));
  };

  const handleChange = (positionid, field, value) => {
    dispatch(
      updatePositionRow({
        photoId: photoid,
        particularPhotoId,
        positionid,
        [field]: value
      })
    );
  };

  return (
    <>
      <div>
        <button
          onClick={handleAdd}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          +
        </button>
      </div>
      <div className=" mt-2 overflow-y-scroll h-[100px]">
        {pPhoto.positions
          .filter((pos) => pos.changed !== "deleted") // 🚀 ignore deleted ones
          .map((pos) => (
            <div key={pos.positionid} className="flex   gap-2 mb-1">

              <div className="flex borde mt-5 flex-col ">
                <div className="w-[100%]">
                  <input
                    placeholder="P"
                    value={pos.position}
                    onChange={(e) =>
                      handleChange(pos.positionid, "newPosition", e.target.value)
                    }
                    className="w-full h-[30px] border"
                    type="text"
                  />
                </div>
                <div className="w-[100%]">
                  <input
                    placeholder="String"
                    value={pos.string}
                    onChange={(e) =>
                      handleChange(pos.positionid, "newString", e.target.value)
                    }
                    className="w-full h-[30px] border"
                    type="text"
                  />
                </div>

              </div>

              <button
                onClick={() => handleDelete(pos.positionid)}
                className="text-2xl flex justify-center items-center text-red-500"
              >
                -
              </button>


            </div>
          ))}
      </div>
    </>
  );
};

export default Positions;
