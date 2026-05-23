import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AddPhotoToRedux } from '../ReduxToolkit/Slices/PhotoSlice';
import { addEventsToRedux } from '../ReduxToolkit/Slices/CalendarSlice';
import { addMessageToRedux } from '../ReduxToolkit/Slices/MessageSlice';
import { getAllDataFromServer } from '../services/getAllDataFromServer';
import { AddPayoutToRedux } from '../ReduxToolkit/Slices/PayoutSlice';

const useFetchAllData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const FetchAllData = async () => {
      try {
        const data = await getAllDataFromServer();
        console.log(" All data fetched from server:", data);

        const accountabilityMessages = data?.Accountability || [];
        const livePhotos = data?.LivePhotos || [];
        const calendarEvents = data?.Calendar || [];
        const payouts = data?.Payouts || [];


        accountabilityMessages.forEach((msg) => {
          dispatch(addMessageToRedux({ ...msg, fromDb: true }));
        });

        calendarEvents.forEach((event) => {
          dispatch(addEventsToRedux({ ...event, fromDb: true }));
        });

        livePhotos.photos?.forEach((photo) => {
          dispatch(AddPhotoToRedux({ ...photo, fromDb: true }));
        });

        payouts.forEach((payout) => {
          dispatch(AddPayoutToRedux({ ...payout, fromDb: true }));
        });


      } catch (error) {
        console.error("Error fetching all data:", error);
      }
    };

    FetchAllData();
  }, [dispatch]);
};

export default useFetchAllData;
