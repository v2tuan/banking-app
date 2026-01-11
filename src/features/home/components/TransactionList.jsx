import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, loading }) => {
    if (loading) return <p>Đang tải giao dịch...</p>;
    if (!transactions || transactions.length === 0)
        return <p className="text-muted-foreground">Chưa có giao dịch</p>;

    return (
        <div className="tx-list">
            {transactions.map((tx) => (
                <TransactionItem key={tx.transactionId} tx={tx} />
            ))}
        </div>
    );
};

export default TransactionList;
