// import { useEffect, useState } from 'react';
// import { fetchAllRandomisedSettings } from '../services/randomisedService.js';

// const useRandomisedSettings = () => {
//     const [data, setData] = useState(null); // single setting object
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSettings = async () => {
//             try {
//                 const res = await fetchAllRandomisedSettings(); // returns array
//                 if (Array.isArray(res) && res.length > 0) {
//                     setData(res[0]); //  just take the first setting
//                 } else {
//                     setData(null); // no setting exists
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch randomised settings:", err);
//                 setError(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchSettings();
//     }, []);

//     return { data, isLoading, error };
// };

// export default useRandomisedSettings;






import { useEffect, useState } from 'react';
import { fetchAllRandomisedSettings } from '../services/randomisedService.js';
import { fetchMessagesFromServer } from '../services/messageService.js';
import { getAllPayouts } from '../services/paymentService.js';
import { useDispatch } from 'react-redux';
import { addMessageToRedux } from '../ReduxToolkit/Slices/MessageSlice.jsx';
import { AddPayoutToRedux } from '../ReduxToolkit/Slices/PayoutSlice.jsx';

const useRandomisedSettings = () => {
    const [data, setData] = useState(null); // single setting object
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // 1. Randomised Settings
                const settingsRes = await fetchAllRandomisedSettings();
                if (Array.isArray(settingsRes) && settingsRes.length > 0) {
                    setData(settingsRes[0]);
                } else {
                    setData(null);
                }

                // 2. Messages
                const messages = await fetchMessagesFromServer();
                messages.forEach((msg) => {
                    dispatch(addMessageToRedux({ ...msg, fromDb: true }));
                });

                // 3. Payouts
                const payouts = await getAllPayouts();
                payouts.forEach((payout) => {
                    dispatch(AddPayoutToRedux({ ...payout, fromDb: true }));
                });

            } catch (err) {
                console.error("❌ Error loading data:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAll();
    }, []);

    return { data, isLoading, error };
};

export default useRandomisedSettings;
