import { useState } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Repeat,
    Wallet,
    Banknote,
} from "lucide-react";
import TransactionDetailDialog from "./TransactionDetailDialog";

const getIcon = (tx) => {
    if (tx.type === "TRANSFER") {
        return tx.direction === "IN" ? (
            <ArrowDownLeft className="text-green-600" />
        ) : (
            <ArrowUpRight className="text-red-600" />
        );
    }

    if (tx.type === "DEPOSIT") {
        return <Wallet className="text-green-600" />;
    }

    if (tx.type === "WITHDRAW") {
        return <Banknote className="text-red-600" />;
    }

    return <Repeat className="text-muted-foreground" />;
};

export default function TransactionList({ transactions, loading }) {
    const [selected, setSelected] = useState(null);

    if (loading) return <p>Đang tải...</p>;

    return (
        <>
            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div
                        key={tx.transactionId}
                        onClick={() => setSelected(tx)}
                        className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted cursor-pointer transition"
                    >
                        <div className="flex items-center gap-4">
                            {/* ICON */}
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                {getIcon(tx)}
                            </div>

                            {/* INFO */}
                            <div>
                                <p className="font-medium">
                                    {tx.type === "TRANSFER"
                                        ? tx.direction === "IN"
                                            ? "Nhận tiền"
                                            : "Chuyển tiền"
                                        : tx.type === "DEPOSIT"
                                            ? "Nạp tiền"
                                            : "Rút tiền"}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {new Date(tx.createdAt).toLocaleString("vi-VN")}
                                </p>
                            </div>
                        </div>

                        {/* AMOUNT */}
                        <div
                            className={`font-semibold ${tx.direction === "IN"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {tx.direction === "IN" ? "+" : "-"}
                            {tx.amount.toLocaleString("vi-VN")} ₫
                        </div>
                    </div>
                ))}
            </div>

            <TransactionDetailDialog
                open={!!selected}
                transaction={selected}
                onClose={() => setSelected(null)}
            />
        </>
    );
}
