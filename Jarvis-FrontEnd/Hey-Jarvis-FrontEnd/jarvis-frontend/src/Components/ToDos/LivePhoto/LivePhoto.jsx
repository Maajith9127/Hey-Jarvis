
import React, { useState, useEffect } from 'react';
import PhotoCard from './PhotoCards';
import Challenge from './PhotoCardComponenents/Challenge.jsx';
import HeaderSection from './PhotoCardComponenents/HelperFunctions/HeaderSection.jsx';
import Randomised from '../Randomised/Randomised.jsx';

import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

import {
  AddPhotoToRedux,
  DeletePhotoFromRedux,
  UpdatePhotoFromRedux,
  ClearPhotoDeltas,
  RebuildAddedFromPhotos
} from '../../../ReduxToolkit/Slices/PhotoSlice';

import { deleteEventFromRedux } from '../../../ReduxToolkit/Slices/CalendarSlice';
import { fetchLivePhotos, saveLivePhotos, savePositions, fetchPositions } from '../../../services/photoServices.js';
import { setPositionsFromDb, deletePhotoPositions } from '../../../ReduxToolkit/Slices/Positions.jsx';

const Photo = () => {
  const dispatch = useDispatch();
  const [PhotosFromDb, setPhotosFromDb] = useState([]);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const location = useLocation();
  const isRandomisedRoute = location.pathname === '/randomised';
  const positions = useSelector((state) => state.positions.items);
  console.log("Hey it is ", isRandomisedRoute)


  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetchLivePhotos();
        setPhotosFromDb(res.data.Photos);
      } catch (error) {
        console.error(" Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (PhotosFromDb.length > 0) {
      dispatch(ClearPhotoDeltas());
      PhotosFromDb.forEach(photo => {
        dispatch(AddPhotoToRedux({ ...photo, fromDb: true }));
      });
    }

    dispatch(RebuildAddedFromPhotos());
  }, [PhotosFromDb]);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await fetchPositions();
        dispatch(setPositionsFromDb({ positions: data.positions }));
        console.log(" Hydrated positions into Redux:", data.positions);
      } catch (err) {
        console.error(" Failed to fetch positions:", err);
      }
    };

    loadPositions();
  }, [dispatch]);




  const photos = useSelector((state) => state.photo.Photos);
  const { added, updated, deleted } = useSelector((state) => state.photo);

  const addPhoto = () => {
    const uniqueId = uuidv4();
    const newPhoto = { id: uniqueId, photoName: "Photo Name", PhotoUrl: "", CollectionType: "LivePhotos" };
    dispatch(AddPhotoToRedux(newPhoto));
  };

  const deletePhoto = (id) => {
    dispatch(deletePhotoPositions({ photoId: id }));
    dispatch(DeletePhotoFromRedux(id));
    dispatch(deleteEventFromRedux({ TodoIdToDeleteAllSuchEventsFromCalendar: id }));
  };

  const handleChange = (id, value) => {
    dispatch(UpdatePhotoFromRedux({ id, newName: value }));
  };

  const SavePhoto = async () => {
    console.log(" Saving delta...");
    if (isSavingPhoto) return;
    setIsSavingPhoto(true);
    const payload = { added, updated, deleted };

    try {
      const res = await saveLivePhotos(payload);
      const resPositions = await savePositions({ positions });
      console.log(" Delta save successful:", res.data);

      toast.success(res?.data?.message || " Photos saved successfully!");
      dispatch(ClearPhotoDeltas());
    } catch (err) {
      console.error(" Save request failed:", err.response?.data || err.message);

      const errorMsg = err?.response?.data?.error || err?.message || "Something went wrong while saving.";
      toast.error(` ${errorMsg}`);
    } finally {
      setIsSavingPhoto(false);
    }
  };
  return (
    <>


      <Challenge />
      <div className='min-h-screen  bg-gray-50  py-8'>
        <HeaderSection
          onAddPhoto={addPhoto}
          onSavePhoto={SavePhoto}
          isSavingPhoto={isSavingPhoto}
        />

        {isRandomisedRoute && <Randomised />}

        <div className='max-w-4xl  mx-auto mt-1'>
          <div className='space-y-6'>
            {photos.map((photo) => (
              <div key={photo.id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <div className='p-6'>
                  <div className='flex  mb-4'>
                    <input
                      placeholder='Enter Photo Name'
                      type="text"
                      value={photo.photoName}
                      onChange={(event) => handleChange(photo.id, event.target.value)}
                      className='text-lg font-semibold text-gray-800 bg-transparent border-none  outline-none focus:bg-gray-50 focus:px-2 focus:py-1 focus:rounded-md transition-all duration-200 flex-1'
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-all duration-200 text-sm font-medium"
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                  </div>
                  <PhotoCard photo={photo.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" theme="colored" autoClose={3000} />

    </>

  );
};

export default Photo;






