import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deposit, withdraw } from '@/api/endpoints/transactionApi';
import { numberToVndText } from '@/lib/numberToVndText';

const TransactionActionDialog = ({ open, onClose, type, onSuccess }) => {
    const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!amount || Number(amount) <= 0) {
            alert('Số tiền phải lớn hơn 0');
            return;
        }

        try {
            setLoading(true);

            if (type === 'deposit') {
                await deposit(Number(amount));
            } else {
                await withdraw(Number(amount));
            }

            onSuccess?.();
            onClose();
            setAmount('');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle>
                        {type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
                    </DialogTitle>
                </DialogHeader>

                {/* INPUT SỐ TIỀN */}
                <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                {/* MỆNH GIÁ NHANH */}
                <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((value) => (
                        <Button
                            key={value}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAmount(value)}
                        >
                            {value.toLocaleString('vi-VN')} ₫
                        </Button>
                    ))}
                </div>

                {/* SỐ TIỀN BẰNG CHỮ */}
                {amount > 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        {numberToVndText(Number(amount))}
                    </p>
                )}

                {/* SUBMIT */}
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionActionDialog;
