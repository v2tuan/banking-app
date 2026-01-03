import apiClient from '../client';

export const getMyTransactionHistory = () => {
    return apiClient.get('/transactions/history');
};
