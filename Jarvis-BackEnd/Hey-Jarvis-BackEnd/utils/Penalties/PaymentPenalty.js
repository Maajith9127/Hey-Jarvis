import axios from 'axios';

//  Real test data mapped to acc1–acc6
const bankAccountMap = {
  acc1: {
    account_number: "026291800001191",
    ifsc: "YESB0000262",
    beneficiary_name: "JOHN DOE"
  },
  acc2: {
    account_number: "000100289877623",
    ifsc: "SBIN0008752",
    beneficiary_name: "JANE SMITH"
  },
  acc3: {
    account_number: "00011020001772",
    ifsc: "HDFC0000001",
    beneficiary_name: "BOB HOPE"
  },
  acc4: {
    account_number: "2640101002729",
    ifsc: "CNRR0002640", // Fails due to invalid IFSC
    beneficiary_name: "FAIL USER"
  },
  acc5: {
    account_number: "1234567890",
    ifsc: "ICIC0000001", // Fails due to mismatch
    beneficiary_name: "BAD IFSC"
  },
  acc6: {
    account_number: "007711000031",
    ifsc: "HDFC0000077", // Pending
    beneficiary_name: "WAITING USER"
  },
};

export const PaymentPenalty = async ({ amount, bankAccountId, AccountabilityId, userId }) => {
  try {
    const payoutClientId = process.env.CASHFREE_CLIENT_ID_PAYOUT;
    const payoutClientSecret = process.env.CASHFREE_CLIENT_SECRET_PAYOUT;

    if (!payoutClientId || !payoutClientSecret) {
      throw new Error("Missing payout credentials in .env");
    }

    const account = bankAccountMap[bankAccountId];

    if (!account) {
      throw new Error(`Invalid bankAccountId: ${bankAccountId}`);
    }

    const transferId = `${Date.now()}`;

    const payoutRes = await axios.post(
      'https://sandbox.cashfree.com/payout/transfers',
      {
        transfer_id: transferId,
        transfer_amount: amount,
        transfer_mode: 'imps',
        transfer_remarks: 'Jarvis Penalty Payout',
        beneficiary_details: {
          beneficiary_name: account.beneficiary_name,
          beneficiary_instrument_details: {
            bank_account_number: account.account_number,
            bank_ifsc: account.ifsc
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

    console.log(" Payout Triggered:", payoutRes.data);

    return {
      success: true,
      transferId,
      data: payoutRes.data,
    };

  } catch (err) {
    console.error("❌ Payout Error:", err.response?.data || err.message);

    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};
