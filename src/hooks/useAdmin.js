import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export const useAdmin = () => {
  const [data, setData] = useState({ topics: [], assignments: [], users: [] });
  const { callApi, loading } = useApi();

  const fetchData = useCallback(async (options = {}) => {
    const result = await callApi('getAdminData', options);
    if (result && (result.topics || result.assignments || result.users)) {
      setData({
        topics: result.topics || [],
        assignments: result.assignments || [],
        users: result.users || []
      });
    }
  }, [callApi]);

  const adminAction = async (subAction, payload) => {
    const result = await callApi('adminAction', {
      method: 'POST',
      payload: {
        subAction: subAction,
        ...payload
      },
      silent: true
    });

    if (result?.success) {
      fetchData({ silent: true });
      return true;
    }
    return false;
  };

  return { ...data, loading, fetchData, adminAction };
};
