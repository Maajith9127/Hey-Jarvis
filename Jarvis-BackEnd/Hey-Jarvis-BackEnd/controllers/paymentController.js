import { Cashfree, CFEnvironment } from 'cashfree-pg';
import Payout from '../models/Payout.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

export const handlePayment = async (req, res) => {
  try {
    const { amount, email, phone } = req.body;


    console.log('Holaaaaa');

    const response = await cashfree.PGCreateOrder({
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: req.userId,
        customer_name: 'Jarvis User',
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: 'http://localhost:5173/payment-success?order_id={order_id}',
      },
    });

    const { payment_session_id } = response.data;
    res.status(200).json({ payment_session_id });
  } catch (err) {
    console.error('Payment Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const handleWithdrawal = async (req, res) => {
  const { amount } = req.body;
  console.log(`[Mock] User ${req.userId} requesting ₹${amount} withdrawal`);

  setTimeout(() => {
    res.status(200).json({
      success: true,
      message: `₹${amount} withdrawal triggered for user ${req.userId}`,
    });
  }, 1000);
};

export const getBalance = async (req, res) => {
  try {
    const payoutClientId = process.env.CASHFREE_CLIENT_ID_PAYOUT;
    const payoutClientSecret = process.env.CASHFREE_CLIENT_SECRET_PAYOUT;

    console.log('Payout Client ID:', payoutClientId);
    console.log('Payout Client Secret:', payoutClientSecret);

    if (!payoutClientId || !payoutClientSecret) {
      console.error("❌ Missing Cashfree env variables!");
      return res.status(500).json({ error: 'Missing payout credentials in env' });
    }

    //  Step 1: Get Auth Token (pass credentials in HEADERS, not BODY)
    const authResponse = await axios.post(
      'https://sandbox.cashfree.com/payout/v1/authorize',
      {},
      {
        headers: {
          'x-client-id': payoutClientId,
          'x-client-secret': payoutClientSecret,
          'Content-Type': 'application/json'
        }
      }
    );



    // console.log('Auth Response:', authResponse.data);
    const token = authResponse.data.data?.token;
    console.log('token ', token);


    if (!token) {
      console.error(" Token missing in auth response", authResponse.data);
      return res.status(500).json({ error: 'Token not received from Cashfree' });
    }

    // Step 2: Fetch Balance using token
    const balanceResponse = await axios.get(
      'https://sandbox.cashfree.com/payout/v1/getBalance',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Balance Response:', balanceResponse.data);

    if (balanceResponse.data.status === 'SUCCESS') {
      return res.status(200).json(balanceResponse.data.data);
    } else {
      return res.status(500).json({
        error: 'Failed to fetch payout balance',
        details: balanceResponse.data
      });
    }

  } catch (error) {
    console.error('Balance API Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const triggerPayoutPenalty = async (req, res) => {
  try {
    const payoutClientId = process.env.CASHFREE_CLIENT_ID_PAYOUT;
    const payoutClientSecret = process.env.CASHFREE_CLIENT_SECRET_PAYOUT;

    if (!payoutClientId || !payoutClientSecret) {
      return res.status(500).json({ error: " Missing payout credentials in env" });
    }

    const transferId = `tx_${Date.now()}`;

    const payoutRes = await axios.post(
      'https://sandbox.cashfree.com/payout/transfers', //  correct endpoint
      {
        transfer_id: transferId,
        transfer_amount: 100,
        transfer_mode: 'imps', //  lowercase
        transfer_remarks: 'Jarvis Penalty Payout',
        beneficiary_details: {
          beneficiary_name: 'Test User',
          beneficiary_instrument_details: {
            bank_account_number: '026291800001191',
            bank_ifsc: 'YESB0000262'
          }
        }
      },
      {
        headers: {
          'x-client-id': payoutClientId,
          'x-client-secret': payoutClientSecret,
          'x-api-version': '2024-01-01',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(' Payout Initiated:', payoutRes.data);

    return res.status(200).json({
      message: ' Payout triggered successfully',
      transferId,
      cashfreeResponse: payoutRes.data,
    });

  } catch (err) {
    console.error(' Payout Error:', err.response?.data || err.message);
    return res.status(500).json({
      error: 'Failed to trigger payout',
      details: err.response?.data || err.message,
    });
  }
};

export const savePayoutsDelta = async (req, res) => {
  try {
    const userId = req.userId;
    const { added = [], updated = [], deleted = [] } = req.body;

    //  ADD
    if (added.length > 0) {
      const newDocs = added.map(item => ({
        ...item,
        userId
      }));
      await Payout.insertMany(newDocs);
    }

    //  UPDATE
    for (const item of updated) {
      const { AccountabilityId, ...rest } = item;
      await Payout.updateOne({ AccountabilityId, userId }, { $set: rest });
    }

    //  DELETE
    if (deleted.length > 0) {
      await Payout.deleteMany({ AccountabilityId: { $in: deleted }, userId });
    }

    return res.status(200).json({ message: ' Payout deltas saved successfully' });
  } catch (err) {
    console.error('Error saving payout deltas:', err);
    return res.status(500).json({ error: 'Failed to save payout deltas' });
  }
};

export const SavePayoutDeltas = async ({ added = [], updated = [], deleted = [] }, userId, session = null) => {
  try {
    //  ADD
    if (added.length > 0) {
      const newDocs = added.map(item => ({
        ...item,
        userId
      }));
      await Payout.insertMany(newDocs, session ? { session } : {});
    }

    //  UPDATE
    for (const item of updated) {
      const { AccountabilityId, ...rest } = item;
      await Payout.updateOne({ AccountabilityId, userId }, { $set: rest }, session ? { session } : {});
    }

    // DELETE
    if (deleted.length > 0) {
      await Payout.deleteMany({ AccountabilityId: { $in: deleted }, userId }, session ? { session } : {});
    }

    console.log(" SavePayoutDeltas: delta save complete.");
  } catch (err) {
    console.error('SavePayoutDeltas error:', err);
    throw new Error("SavePayoutDeltas failed");
  }
};


export const getAllPayouts = async (req, res) => {
  try {
    const userId = req.userId;
    const payouts = await Payout.find({ userId });

    return res.status(200).json({ payouts });
  } catch (err) {
    console.error('Error fetching payouts:', err);
    return res.status(500).json({ error: 'Failed to fetch payouts' });
  }
};

export const GetAllPayouts = async (userId) => {
  try {
    const payouts = await Payout.find({ userId });
    return payouts; //  just return the array directly
  } catch (err) {
    console.error('Error fetching payouts:', err);
    throw new Error('Failed to fetch payouts'); //  throw for Promise.all
  }
};












