import { useEffect, useState } from 'react';
import { getMyTransactionHistory } from '@/api/endpoints/transactionApi';

export const useTransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyTransactionHistory()
            .then((res) => {
                // res chính là ApiResponse
                setTransactions(res.data);
            })
            .finally(() => setLoading(false));
    }, []);

    return { transactions, loading };
};

