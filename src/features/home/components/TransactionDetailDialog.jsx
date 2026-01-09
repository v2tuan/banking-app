import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    Banknote,
    Repeat,
} from "lucide-react";

const formatMoney = (amount) =>
    Number(amount).toLocaleString("vi-VN") + " ₫";

const formatDate = (date) =>
    new Date(date).toLocaleString("vi-VN");

const statusColor = {
    SUCCESS: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
};

const getHeaderInfo = (type, direction) => {
    if (type === "TRANSFER") {
        return direction === "IN"
            ? {
                title: "Nhận tiền",
                icon: <ArrowDownLeft className="h-7 w-7 text-green-600" />,
                bg: "bg-green-100",
            }
            : {
                title: "Chuyển tiền",
                icon: <ArrowUpRight className="h-7 w-7 text-red-600" />,
                bg: "bg-red-100",
            };
    }

    if (type === "DEPOSIT") {
        return {
            title: "Nạp tiền",
            icon: <Wallet className="h-7 w-7 text-green-600" />,
            bg: "bg-green-100",
        };
    }

    if (type === "WITHDRAW") {
        return {
            title: "Rút tiền",
            icon: <Banknote className="h-7 w-7 text-red-600" />,
            bg: "bg-red-100",
        };
    }

    return {
        title: "Giao dịch",
        icon: <Repeat className="h-7 w-7" />,
        bg: "bg-muted",
    };
};

export default function TransactionDetailDialog({ open, onClose, transaction }) {
    if (!transaction) return null;

    const {
        type,
        direction,
        amount,
        message,
        fromUserFullName,
        toUserFullName,
        fromUserEmail,
        toUserEmail,
        status,
        createdAt,
    } = transaction;

    const header = getHeaderInfo(type, direction);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                {/* HEADER */}
                <div className={`flex items-center gap-4 p-5 ${header.bg}`}>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
                        {header.icon}
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Chi tiết giao dịch
                        </p>
                        <h2 className="text-lg font-semibold">
                            {header.title}
                        </h2>
                    </div>
                </div>

                {/* BODY */}
                <div className="p-5 space-y-4 text-sm">
                    <Row label="Số tiền">
                        <span
                            className={`text-lg font-bold ${direction === "IN"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {direction === "IN" ? "+" : "-"} {formatMoney(amount)}
                        </span>
                    </Row>

                    <Row
                        label="Người gửi"
                        value={
                            fromUserFullName
                                ? `${fromUserFullName} (${fromUserEmail})`
                                : "—"
                        }
                    />

                    <Row
                        label="Người nhận"
                        value={
                            toUserFullName
                                ? `${toUserFullName} (${toUserEmail})`
                                : "—"
                        }
                    />

                    <Row label="Nội dung" value={message || "—"} />

                    <Row label="Trạng thái">
                        <Badge className={statusColor[status]}>
                            {status}
                        </Badge>
                    </Row>

                    <Row
                        label="Thời gian"
                        value={formatDate(createdAt)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

const Row = ({ label, value, children }) => (
    <div className="flex justify-between items-start gap-4">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-right">{value || children}</span>
    </div>
);
