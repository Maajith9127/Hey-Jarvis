import { useEffect, useState } from 'react';
import { getUpcomingTodoEvents } from '../services/calendarService';

export const useUpcomingTodoEvents = (photoId, limit = 1) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const data = await getUpcomingTodoEvents(photoId, limit, skip);

      //  If we get fewer items than limit, no more items
      if (data.length < limit) setHasMore(false);

      //Append if loadMore, replace otherwise
      setEvents(prev =>
        isLoadMore ? [...prev, ...data] : data
      );
    } catch (err) {
      console.error("useUpcomingTodoEvents error", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setSkip(prev => prev + limit);
  };

  useEffect(() => {
    if (photoId) {
      fetchEvents(skip !== 0); // only true if it's a loadMore
    }
  }, [photoId, skip]);

  return { events, loading, error, loadMore, hasMore };
};
