import apiClient from '../client';

export const getMyTransactionHistory = () => {
    return apiClient.get('/transactions/history');
};
export const getTransactionTimeline = () => {
    return apiClient.get('/transactions/timeline');
};
export const transfer = ({ toAccountNumber, amount, message }) => {
  return apiClient.post('/transactions/transfer', {
    toAccountNumber,
    amount,
    message,
  });
};
export const validateTransferAccount = ({ toAccountNumber, amount }) => {
  return apiClient.post('/transactions/transfer/validate', {
    toAccountNumber,
    amount,
  });
};




export const transactionApi = {
    getTransactions: (filter) => {
        return apiClient.get("/admin/transactions", { params: filter });
    },

    getTransactionById: (id) => {
        return apiClient.get(`/admin/transactions/${id}`)
    },

    getStatistics: () => {
        return apiClient.get("/admin/transactions/statistics")
    }
}
export const deposit = (amount) => {
    return apiClient.post('/transactions/deposit', { amount });
};

export const withdraw = (amount) => {
    return apiClient.post('/transactions/withdraw', { amount });
};

