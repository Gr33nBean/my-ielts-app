import { useState, useCallback } from 'react';
import { API_URL } from '../utils/constants';

/**
 * useApi Hook - Chuẩn hóa việc gọi API tới Google Apps Script
 * Hỗ trợ GET (mặc định) và POST (cho các hành động ghi dữ liệu)
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (action, options = {}) => {
    const {
      method = 'GET',
      payload = null,
      silent = false,
      params = {}
    } = options;

    if (!silent) setLoading(true);
    setError(null);

    try {
      let url = API_URL;

      // Build query params cho GET hoặc fallback cho POST (nếu GAS yêu cầu action trong URL)
      const queryParams = new URLSearchParams({ action, ...params }).toString();

      let fetchOptions = {
        method: method,
      };

      if (method === 'POST') {
        // Google Apps Script yêu cầu Content-Type: text/plain để tránh lỗi CORS phức tạp
        fetchOptions.headers = { 'Content-Type': 'text/plain;charset=utf-8' };
        fetchOptions.body = JSON.stringify({ action, ...payload });
      } else {
        url += (url.includes('?') ? '&' : '?') + queryParams;
      }

      const response = await fetch(url, fetchOptions);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      return result;
    } catch (err) {
      console.error(`[API Error] Action: ${action} |`, err);
      setError(err.message);
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  return { callApi, loading, error, setLoading };
};
