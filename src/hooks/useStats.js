import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export const useStats = () => {
  const [dashboard, setDashboard] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sharedSubmissions, setSharedSubmissions] = useState({ speaking: [], reading: [], writing: [] });
  const [users, setUsers] = useState([]);
  const { callApi, loading } = useApi();

  const refresh = useCallback(async (options = {}) => {
    const data = await callApi('getStats', options);

    if (data) {
      setDashboard(data.dashboard || []);
      setActivities(data.activities || []);
      setSharedSubmissions(data.sharedSubmissions || { speaking: [], reading: [], writing: [] });
      setUsers(data.users || []);
    }
  }, [callApi]);

  return { dashboard, activities, sharedSubmissions, users, loading, refresh };
};