import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, loading }) => {
    if (loading) return <p>Đang tải giao dịch...</p>;
    if (!transactions || transactions.length === 0)
        return <p className="text-muted-foreground">Chưa có giao dịch</p>;

    // ✅ CHỈ LẤY 5 GIAO DỊCH GẦN NHẤT
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="tx-list">
            {recentTransactions.map((tx) => (
                <TransactionItem key={tx.transactionId} tx={tx} />
            ))}
        </div>
    );
};

export default TransactionList;
