import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "./useApi";

export const useUserTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [topics, setTopics] = useState([]);
  const [submissions, setSubmissions] = useState(null); // null means not fetched yet
  const { callApi, loading, setLoading } = useApi();

  const fetchTasks = useCallback(
    async (options = {}) => {
      const { silent = false } = options;
      if (!silent) setLoading(true);

      try {
        // 1. Fetch Assignments, Topics and Submissions in parallel or sequence
        const [adminResult, subData] = await Promise.all([
          callApi("getAdminData", { silent: true }),
          user?.email
            ? callApi("getUserSubmissions", {
              params: { email: user.email },
              silent: true,
            })
            : Promise.resolve({}),
        ]);

        if (adminResult) {
          setTasks(adminResult.assignments || []);
          setTopics(adminResult.topics || []);
        }
        setSubmissions(subData || {});
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [user?.email, callApi, setLoading],
  );

  return { tasks, topics, submissions, loading, fetchTasks };
};
