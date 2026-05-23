import React, { useState } from 'react';
import {
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { load } from "@cashfreepayments/cashfree-js";
import { createPaymentSession, triggerWithdrawal } from '../../../services/paymentService.js';
import { usePayoutBalance } from '../../../hooks/usePayment.js';

const PaymentForm = () => {
    const [amount, setAmount] = useState('');
    const [action, setAction] = useState('pay');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);



    const { balance, loading: balanceLoading } = usePayoutBalance();

    const handleSubmit = async () => {
        const numericAmount = Number(amount.replace(/,/g, ''));

        if (!amount || isNaN(numericAmount) || numericAmount < 1) {
            setError('Please enter a valid amount (minimum ₹1)');
            return;
        }

        setError('');
        setIsProcessing(true);

        try {
            if (action === 'pay') {
                const { payment_session_id } = await createPaymentSession(
                    numericAmount,
                    'maajith@gmail.com',
                    '+919090407368'
                );

                const cashfree = await load({ mode: 'sandbox' });
                await cashfree.checkout({
                    paymentSessionId: payment_session_id,
                    redirectTarget: '_modal',
                });

            } else if (action === 'withdraw') {
                await triggerWithdrawal(numericAmount);
            }

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error('Transaction failed:', err);
            setError('Something went wrong during the transaction.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatAmount = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleAmountChange = (e) => {
        const formatted = formatAmount(e.target.value);
        setAmount(formatted);
        if (error) setError('');
    };

    return (
        <div className="md:w-[100%]">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => setAction('pay')}
                            className={`p-4 rounded-2xl border-2 transition-all duration-200 ${action === 'pay'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                        >
                            <ArrowUpRight className="w-5 h-5 mx-auto mb-2" />
                            <span className="text-sm font-medium">Pay to Jarvis</span>
                        </button>
                        <button
                            onClick={() => setAction('withdraw')}
                            className={`p-4 rounded-2xl border-2 transition-all duration-200 ${action === 'withdraw'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                        >
                            <ArrowDownLeft className="w-5 h-5 mx-auto mb-2" />
                            <span className="text-sm font-medium">Withdraw</span>
                        </button>
                    </div>

                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Enter Amount
                    </label>
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-lg font-medium">₹</span>
                        </div>
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0"
                            className="w-full pl-10 pr-4 py-4 text-xl font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        {error && (
                            <div className="mt-2 flex items-center text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {error}
                            </div>
                        )}
                    </div>

                    {amount && !error && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    {action === 'pay' ? 'Amount to Pay' : 'Amount to Withdraw'}
                                </span>
                                <span className="text-lg font-bold text-gray-900">₹{amount}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing || !amount || error}
                        className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-200 transform ${isProcessing || !amount || error
                            ? 'bg-gray-400 cursor-not-allowed'
                            : action === 'pay'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                                : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl hover:scale-105'
                            }`}
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Processing...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                {action === 'pay' ? (
                                    <>
                                        <ArrowUpRight className="w-5 h-5 mr-2" />
                                        Proceed to Pay
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownLeft className="w-5 h-5 mr-2" />
                                        Proceed to Withdraw
                                    </>
                                )}
                            </div>
                        )}
                    </button>

                    <div className="mt-4 text-center text-sm text-gray-700 font-semibold">
                        {balanceLoading ? 'Loading balance...' : `Amount Left: ₹${balance}`}
                    </div>

                </div>
            </div>

            {showSuccess && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center animate-bounce">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>
                        {action === 'pay' ? 'Payment' : 'Withdrawal'} of ₹
                        {Number(amount.replace(/,/g, '')).toLocaleString()} initiated successfully!
                    </span>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;
