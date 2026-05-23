import React from 'react';
import PaymentForm from './PaymentForm';
import Payout from './Payout';

const Payment = () => {
    return (
        <div className="relative border flex flex-col justify-center   p-5">
            <PaymentForm />
            <Payout/>
        </div>
    );
};

export default Payment;
