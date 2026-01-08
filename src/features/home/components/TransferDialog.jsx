import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transfer, validateTransferAccount} from '@/api/endpoints/transactionApi';
import { useToast } from '@/components/ui/use-toast';

const TransferDialog = ({ open, onClose ,onSuccess}) => {
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [receiverName, setReceiverName] = useState('');
  const handleClose = () => {
  setStep(1);
  setError('');
  setToAccountNumber('');
  setAmount('');
  setNote('');
  setReceiverName('');
  setLoading(false);
  onClose();
};


  const handleValidate = async () => {
  setLoading(true);

  try {
    const res = await validateTransferAccount({
      toAccountNumber,
      amount: Number(amount),
    });

    const fullName = res?.data?.toUserFullName;

    if (!fullName) {
      throw new Error('Không tìm thấy người nhận');
    }

    setReceiverName(fullName);
    setStep(2);
  } catch (err) {
    toast({
      variant: 'destructive',
      title: 'Không thể xác nhận người nhận',
      description: err.message || 'Tài khoản không hợp lệ',
    });
  } finally {
    setLoading(false);
  }
};

const handleConfirmTransfer = async () => {
  setLoading(true);
  setError('');

  try {
    await transfer({
      toAccountNumber,
      amount: Number(amount),
      message: note,
    });

    toast({
      title: 'Chuyển khoản thành công',
      description: `Đã chuyển ${Number(amount).toLocaleString('vi-VN')} ₫ cho ${receiverName}`,
    });
    
    onSuccess?.(),
    handleClose();
  } catch (err) {
    toast({
      variant: 'destructive',
      title: 'Chuyển khoản thất bại',
      description:
        err?.response?.data?.message ||
        'Vui lòng kiểm tra lại thông tin',
    });

    
  }finally {
    setLoading(false); 
  }
};





  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Chuyển khoản' : 'Xác nhận chuyển khoản'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Số tài khoản người nhận</Label>
              <Input
                placeholder="ACC000008"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Số tiền (VND)</Label>
              <Input
                type="number"
                step={100000}
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Nội dung chuyển khoản</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Huỷ
              </Button>
              <Button
                 disabled={!toAccountNumber || !amount || loading}
                onClick={handleValidate}
                >
                {loading ? 'Đang kiểm tra...' : 'Tiếp tục'}
                </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-lg border p-4 space-y-3 text-sm">
  <div className="flex justify-between">
    <span className="text-muted-foreground">Người nhận</span>
    <span className="font-medium">{receiverName}</span>
  </div>

  <div className="flex justify-between">
    <span className="text-muted-foreground">Số tài khoản</span>
    <span className="font-medium">{toAccountNumber}</span>
  </div>

  <div className="flex justify-between">
    <span className="text-muted-foreground">Số tiền</span>
    <span className="font-semibold text-green-600">
      {Number(amount).toLocaleString('vi-VN')} ₫
    </span>
  </div>

  {note && (
    <div className="flex justify-between">
      <span className="text-muted-foreground">Nội dung</span>
      <span className="font-medium">{note}</span>
    </div>
  )}
  <Button variant="outline" onClick={() => setStep(1)}>
    Quay lại
  </Button>

  <Button
    className="bg-blue-600 hover:bg-blue-700"
    onClick={handleConfirmTransfer}
    disabled={loading}
  >
    {loading ? 'Đang chuyển...' : 'Đồng ý chuyển'}
  </Button>
</div>

        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransferDialog;
