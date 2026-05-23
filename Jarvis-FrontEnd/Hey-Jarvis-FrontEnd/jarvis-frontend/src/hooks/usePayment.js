
import { useEffect, useState } from 'react';
import { getPayoutBalance, getAllPayouts } from '../services/paymentService';
import { useDispatch } from 'react-redux';
import { AddPayoutToRedux, RebuildAddedFromPayouts } from '../ReduxToolkit/Slices/PayoutSlice.jsx';
import { toast } from 'react-toastify';

export const usePayoutBalance = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await getPayoutBalance();
                setBalance(res?.availableBalance || '0.00');
            } catch (err) {
                console.error('Error fetching balance:', err);
                setError('Failed to load balance');
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);

    return { balance, loading, error };
};

// NEW HOOK: Fetch payouts and inject into Redux
export const useFetchPayouts = () => {
    const fetchPayouts = async () => {
        try {
            const entries = await getAllPayouts();
            return entries.map(entry => ({
                ...entry,
                fromDb: true
            }));
        } catch (err) {
            console.error('Failed to fetch payouts:', err);
            toast.error('Failed to load payouts from DB');
            return [];
        }
    };

    return fetchPayouts;
};

// export const useAutoLoadPayouts = () => {
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const fetchPayouts = async () => {
//             try {
//                 const entries = await getAllPayouts();

//                 const cleanEntries = entries.map(entry => ({
//                     ...entry,
//                     fromDb: true
//                 }));

//                 dispatch(RebuildAddedFromPayouts(cleanEntries));
//             } catch (err) {
//                 console.error('Failed to fetch payouts:', err);
//                 toast.error('Failed to load payouts from DB');
//             }
//         };
//         fetchPayouts();
//     }, [dispatch]); //  run once on mount
// };





export const useAutoLoadPayouts = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                const entries = await getAllPayouts();

                entries.forEach((entry) => {
                    dispatch(AddPayoutToRedux({
                        ...entry,
                        fromDb: true
                    }));
                });

            } catch (err) {
                console.error('Failed to fetch payouts:', err);
                toast.error('Failed to load payouts from DB');
            }
        };

        fetchPayouts();
    }, [dispatch]); // runs only on mount
};