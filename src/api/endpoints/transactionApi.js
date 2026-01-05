import apiClient from '../client';

export const getMyTransactionHistory = () => {
    return apiClient.get('/transactions/history');
};

export const transactionApi = {
    getTransactions: (filter) => {
        return apiClient.get("/admin/transactions", { params: filter } );
    },

    getTransactionById: (id) => {
        return apiClient.get(`/admin/transactions/${id}`)
    },

    getStatistics: () => {
        return apiClient.get("/admin/transactions/statistics")
    }
}
