import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, CreditCard, ArrowUpRight } from 'lucide-react';
import TransactionList from '../components/TransactionList';
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import TransactionActionDialog from '../components/TransactionActionDialog';


const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const { transactions, loading } = useTransactionHistory();

  // ✅ ĐẶT Ở ĐÂY
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  const stats = [
    {
      title: 'Tổng số dư',
      value: '125,430,000 ₫',
      icon: Wallet,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Thu nhập tháng này',
      value: '45,230,000 ₫',
      icon: TrendingUp,
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Chi tiêu tháng này',
      value: '18,650,000 ₫',
      icon: CreditCard,
      trend: '-3.1%',
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Xin chào, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Đây là tổng quan tài chính của bạn
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs flex items-center gap-1 mt-2 ${stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                <ArrowUpRight
                  className={`h-3 w-3 ${!stat.trendUp && 'rotate-90'
                    }`}
                />
                {stat.trend} so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      {/* ACTION CARDS: NẠP / RÚT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* NẠP TIỀN */}
        <Card
          onClick={() => setOpenDeposit(true)}
          className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <CardContent className="flex items-center gap-5 p-6">
            <div className="bg-green-100 text-green-700 p-4 rounded-full">
              <ArrowUpRight className="h-7 w-7" />
            </div>

            <div>
              <p className="text-xl font-bold text-green-700">
                Nạp tiền
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Thêm tiền vào tài khoản
              </p>
            </div>
          </CardContent>
        </Card>


        {/* RÚT TIỀN */}
        <Card
          onClick={() => setOpenWithdraw(true)}
          className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <CardContent className="flex items-center gap-5 p-6">
            <div className="bg-red-100 text-red-700 p-4 rounded-full">
              <ArrowUpRight className="h-7 w-7 rotate-180" />
            </div>

            <div>
              <p className="text-xl font-bold text-red-700">
                Rút tiền
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Rút tiền khỏi tài khoản
              </p>
            </div>
          </CardContent>
        </Card>


      </div>


      {/* TRANSACTION LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
          <CardDescription>
            Các giao dịch của bạn trong 7 ngày qua
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TransactionList
            transactions={transactions}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* ✅ DIALOGS — ĐẶT CUỐI JSX */}
      <TransactionActionDialog
        open={openDeposit}
        onClose={() => setOpenDeposit(false)}
        type="deposit"
        onSuccess={() => window.location.reload()}
      />

      <TransactionActionDialog
        open={openWithdraw}
        onClose={() => setOpenWithdraw(false)}
        type="withdraw"
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default HomePage;
