import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = 'http://localhost:8080';

export const useAccountBalance = () => {
  const logout = useAuthStore((state) => state.logout);

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/accounts/me/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }

      if (!res.ok) return;

      const b = json?.data?.balance ?? json?.balance;
      if (b !== undefined && b !== null) {
        setBalance(b);
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    formattedBalance:
      balance === null
        ? '—'
        : new Intl.NumberFormat('vi-VN').format(balance) + ' ₫',
    loading,
    refetch: fetchBalance,
  };
};
