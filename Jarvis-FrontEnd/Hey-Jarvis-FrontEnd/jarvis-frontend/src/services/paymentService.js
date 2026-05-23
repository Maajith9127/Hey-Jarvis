// src/services/paymentService.js
import axios from './axiosInstance';

export const createPaymentSession = async (amount, email, phone) => {
    const response = await axios.post('/payment/pay', {
        amount,
        email,
        phone,
    });
    return response.data;
};

export const triggerWithdrawal = async (amount) => {
    const response = await axios.post('/payment/withdraw', { amount });
    return response.data;
};

export const getPayoutBalance = async () => {
    const response = await axios.get('/payment/balance');
    return response.data; // { balance, availableBalance }
};

export const savePayoutsDelta = async (payload) => {
    const response = await axios.post('/payment/save-delta', payload);
    return response.data;
};

export const getAllPayouts = async () => {
    const response = await axios.get('/payment/all');
    return response.data.payouts; // returns array
};

