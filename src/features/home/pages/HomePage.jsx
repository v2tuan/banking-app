import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, CreditCard, ArrowUpRight } from 'lucide-react';

const HomePage = () => {
  const user = useAuthStore((state) => state.user);

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
      <div>
        <h1 className="text-3xl font-bold">
          Xin chào, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Đây là tổng quan tài chính của bạn
        </p>
      </div>

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
              <p className={`text-xs flex items-center gap-1 mt-2 ${
                stat.trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowUpRight className={`h-3 w-3 ${
                  !stat.trendUp && 'rotate-90'
                }`} />
                {stat.trend} so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
          <CardDescription>
            Các giao dịch của bạn trong 7 ngày qua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium">Chuyển khoản #{i}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <p className="font-semibold text-green-600">
                  +{(i * 1500000).toLocaleString('vi-VN')} ₫
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;