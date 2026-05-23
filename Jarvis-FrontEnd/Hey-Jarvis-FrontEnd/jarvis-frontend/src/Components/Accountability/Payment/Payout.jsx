
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
    AddPayoutToRedux,
    DeletePayoutFromRedux,
    UpdatePayoutFromRedux,
    ClearPayoutDeltas,
    RebuildAddedFromPayouts
} from '../../../ReduxToolkit/Slices/PayoutSlice.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { savePayoutsDelta } from '../../../services/paymentService.js';
import { useFetchPayouts,useAutoLoadPayouts } from '../../../hooks/usePayment.js';


const Payout = () => {
    const dispatch = useDispatch();
    const fetchPayouts = useFetchPayouts(); //  Custom fetch hook
    useAutoLoadPayouts()

    const payouts = useSelector((state) => state.payout.Payouts);
    const { added, updated, deleted } = useSelector((state) => state.payout);
    const [isSavingPayout, setIsSavingPayout] = useState(false);

    const handleAdd = () => {
        const AccountabilityId = uuidv4();
        dispatch(
            AddPayoutToRedux({
                AccountabilityId,
                name: '',
                amount: '',
                bankAccountId: '',
                fromDb: false
            })
        );
    };

    const handleDelete = (AccountabilityId) => {
        dispatch(DeletePayoutFromRedux(AccountabilityId));
    };

    const handleChange = (AccountabilityId, key, value) => {
        dispatch(UpdatePayoutFromRedux({ AccountabilityId, key, value }));
    };

    const handleSave = async () => {
        if (isSavingPayout) return;
        setIsSavingPayout(true);

        const payload = { added, updated, deleted };

        try {
            const res = await savePayoutsDelta(payload);
            toast.success(res.message || 'Payouts saved successfully!');

            //  Clear deltas first
            dispatch(ClearPayoutDeltas());

            //  Fetch fresh payouts and dispatch rebuild
            const freshPayouts = await fetchPayouts(); // comes from useFetchPayouts
            dispatch(RebuildAddedFromPayouts(freshPayouts));
        } catch (err) {
            console.error('Save error:', err);
            toast.error(err?.response?.data?.error || 'Failed to save payouts');
        } finally {
            setIsSavingPayout(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            {/* ADD + SAVE CONTROLS */}
            <div className="flex justify-between mb-4">
                <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
                    Add
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSavingPayout}
                    className={`${isSavingPayout ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-4 py-2 rounded`}
                >
                    {isSavingPayout ? 'Saving...' : 'Save'}
                </button>
            </div>

            {/* PAYOUT ENTRY CARDS */}
            <div className="space-y-4">
                {payouts.map((entry) => (
                    <div key={entry.AccountabilityId} className="bg-white p-4 rounded shadow flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Name"
                            value={entry.name}
                            onChange={(e) => handleChange(entry.AccountabilityId, 'name', e.target.value)}
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={entry.amount}
                            onChange={(e) => handleChange(entry.AccountabilityId, 'amount', e.target.value)}
                            className="border px-3 py-2 rounded"
                        />
                        <select
                            value={entry.bankAccountId}
                            onChange={(e) => handleChange(entry.AccountabilityId, 'bankAccountId', e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">Select Bank Account</option>
                            <option value="acc1">YES Bank - 111XXX</option>
                            <option value="acc2">SBI - 222XXX</option>
                            <option value="acc3">HDFC - 333XXX</option>
                        </select>
                        <button
                            onClick={() => handleDelete(entry.AccountabilityId)}
                            className="text-red-600 hover:text-red-800 self-end"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <ToastContainer position="top-center" theme="colored" autoClose={2500} />
        </div>
    );
};

export default Payout;
