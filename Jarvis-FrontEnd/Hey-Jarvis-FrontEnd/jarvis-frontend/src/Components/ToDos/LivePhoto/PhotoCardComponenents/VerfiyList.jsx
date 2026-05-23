
import React from 'react';
import { useDispatch } from 'react-redux';
import { setChallengeData } from '../../../../ReduxToolkit/Slices/ChallengeSlice';
import { useUpcomingTodoEvents } from '../../../../hooks/useUpcomingTodoEvents'; // ✅ adjust path if needed

const VerifyList = ({ photoid }) => {
  const dispatch = useDispatch();
  const { events, loading, error, loadMore, hasMore } = useUpcomingTodoEvents(photoid); // 🔄 added pagination controls

  const VerifyPhoto = (event) => {
    const data = JSON.parse(event.target.dataset.id);
    dispatch(setChallengeData(data));
  };

  if (loading && events.length === 0) {
    return <p className="text-center text-sm text-gray-500 py-6">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center text-sm text-red-500 py-6">Failed to load events.</p>;
  }

  if (!events || events.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>
        <div className='w-12 h-12 mx-auto mb-4 text-gray-300'>
          <svg fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
          </svg>
        </div>
        <p>No verification events scheduled</p>
      </div>
    );
  }

  return (
    <div className='space-y-3 max-h-96 overflow-y-auto px-2'>
      {events.map((event) => {
        const startDate = new Date(event.start);
        const endDate = event.end ? new Date(event.end) : null;

        const dateFormatted = startDate.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        const startTime = startDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        const endTime = endDate
          ? endDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
          : 'TBD';

        return (
          <div
            key={event.SpecificEventId}
            className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200'
          >
            <div className='mb-3'>
              <h4 className='font-medium text-gray-900 mb-1'>Morning Gym Session</h4>
              <p className='text-sm text-gray-500'>
                {dateFormatted} | {startTime} - {endTime}
              </p>
            </div>

            <button
              onClick={VerifyPhoto}
              data-id={JSON.stringify({
                Todoid: event.TodoId,
                SpecificEventid: event.SpecificEventId,
                CollectionToCeck: 'Live Photos'
              })}
              className='w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium'
            >
              Verify Now
            </button>
          </div>
        );
      })}

      {/* Load More Button */}
      {hasMore && (
        <div className='text-center pt-4 pb-2'>
          <button
            onClick={loadMore}
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyList;
