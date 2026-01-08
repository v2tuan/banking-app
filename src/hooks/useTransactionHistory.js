import { useEffect, useState , useCallback} from 'react';
import { getTransactionTimeline } from '@/api/endpoints/transactionApi';

export const useTransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchTimeline = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTransactionTimeline();
      setTransactions(res.data);
    } finally {
      setLoading(false);
    }
  }, []);
    useEffect(() => {
        getTransactionTimeline()
            .then((res) => {
                // timeline API: 1 hành động = 1 record
                setTransactions(res.data);
            })
            .finally(() => setLoading(false));
            
    }, []);
    useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

    return { transactions, loading,refetch: fetchTimeline, };
};
