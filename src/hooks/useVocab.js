import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export const useVocab = () => {
  const [vocabs, setVocabs] = useState([]);
  const { callApi, loading } = useApi();

  const fetchVocab = useCallback(async (options = {}) => {
    const data = await callApi('getVocab', options);
    if (data) setVocabs(data);
  }, [callApi]);

  const addVocab = async (formData, userEmail) => {
    const result = await callApi('saveVocabulary', {
      method: 'POST',
      payload: {
        data: formData,
        email: userEmail
      },
      silent: true // Giữ silent vì thường Dashboard đã có overlay hoặc xử lý riêng
    });
    return result || { success: false, message: "Lỗi kết nối API" };
  };

  return { vocabs, loading, fetchVocab, addVocab };
};