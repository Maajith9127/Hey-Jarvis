import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDateToAMPM } from './HelperFunctions/TimeFormatter';
import { getBackgroundColor } from './HelperFunctions/TimeFormatter';
import { getAccountabilitiesInCollisionWithTodo } from '../../../../services/calendarService';
import { useDispatch } from 'react-redux';
import { setSelectedAccountability } from '../../../../ReduxToolkit/Slices/ChallengeSlice.jsx';

const AccountabilitiesToVerify = ({ onSelect }) => {
    const dispatch = useDispatch();

    const [selectedId, setSelectedId] = useState(null);
    const [AccountabilitiesToVerify, setAccountabilitiesToVerify] = useState([]);

    const handleClick = (accId, accKey) => {
        if (selectedId === accId) {
            setSelectedId(null); // remove highlight
            onSelect(null); // clear selection
        }
    };

    const handleDoubleClick = (accId, accKey) => {
        setSelectedId(accId); // add highlight
        onSelect(accKey);
        dispatch(setSelectedAccountability(accKey));
    };

    const Accountabilities = useSelector((state) => state.challenge.data);
    const TodoId = Accountabilities?.Todoid;
    const SpecificEventId = Accountabilities?.SpecificEventid;

    const FetchAccountabilities = async () => {
        if (!TodoId || !SpecificEventId) return;

        try {
            const fetchedAccountabilities = await getAccountabilitiesInCollisionWithTodo({
                TodoId,
                SpecificEventId
            });
            setAccountabilitiesToVerify(fetchedAccountabilities);
        } catch (error) {
            console.error("Error fetching accountabilities:", error);
            setAccountabilitiesToVerify([]);
        }
    };

    useEffect(() => {
        FetchAccountabilities();
    }, []);

    return (
        <div className='borde w-[100%] scroll min-h-[20%] overflow-y-scroll'>
            {
                AccountabilitiesToVerify.map((accountability, index) => {
                    const bg = getBackgroundColor(accountability.verified, accountability.start, accountability.end);
                    const accId = accountability.AccountabilityId + accountability.SpecificEventId;
                    const accKey = {
                        AccountabilityId: accountability.AccountabilityId,
                        SpecificEventId: accountability.SpecificEventId
                    };
                    const isSelected = selectedId === accId;
                    const withinTime = new Date(accountability.start) <= new Date() && new Date() <= new Date(accountability.end);

                    //  Format date for display
                    const dateOnly = new Date(accountability.start).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    });

                    return (
                        <div
                            onClick={withinTime ? () => handleClick(accId, accKey) : undefined}
                            onDoubleClick={withinTime ? () => handleDoubleClick(accId, accKey) : undefined}
                            key={index}
                            className={`${bg} ${isSelected ? 'borde border-red-700 text-white' : 'borde'} p-5 rounded-2xl m-5 cursor-pointer transition-all`}
                            style={{ cursor: withinTime ? 'pointer' : 'not-allowed' }}
                        >
                            <h1 className=''>
                                {accountability.title}
                                <p className="text"> {dateOnly}</p>
                                <p>{formatDateToAMPM(accountability.start)} - {formatDateToAMPM(accountability.end)}</p>
                            </h1>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default AccountabilitiesToVerify;
