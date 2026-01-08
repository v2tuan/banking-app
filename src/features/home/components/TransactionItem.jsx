import { ArrowDownLeft, ArrowUpRight, RefreshCcw } from 'lucide-react';
import './transaction.css';

const TransactionItem = ({ tx }) => {
    const isIncome =
        tx.type === 'DEPOSIT' ||
        (tx.type === 'TRANSFER' && tx.direction === 'IN');

    const getIcon = () => {
        if (tx.type === 'DEPOSIT') {
            return <ArrowDownLeft className="tx-icon income" />;
        }

        if (tx.type === 'WITHDRAW') {
            return <ArrowUpRight className="tx-icon expense" />;
        }

        if (tx.type === 'TRANSFER') {
            return tx.direction === 'IN'
                ? <ArrowDownLeft className="tx-icon income" />
                : <ArrowUpRight className="tx-icon expense" />;
        }

        return <RefreshCcw className="tx-icon" />;
    };

    const getLabel = () => {
        switch (tx.type) {
            case 'DEPOSIT':
                return 'Nạp tiền';
            case 'WITHDRAW':
                return 'Rút tiền';
            case 'TRANSFER':
                return 'Chuyển khoản';
            default:
                return 'Giao dịch';
        }
    };

    return (
        <div className="tx-item">
            <div className="tx-left">
                {getIcon()}
                <div>
                    <p className="tx-title">{getLabel()}</p>
                    <p className="tx-date">
                        {new Date(tx.createdAt).toLocaleString('vi-VN')}
                    </p>
                </div>
            </div>

            <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
                {isIncome ? '+' : '-'}
                {tx.amount.toLocaleString('vi-VN')} ₫
            </div>
        </div>
    );
};

export default TransactionItem;
