import { useState } from 'react'
import { CreditCard, Send, ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Wallet, TrendingUp, Bell, Settings } from 'lucide-react'

function App() {
  const [showBalance, setShowBalance] = useState(true)
  const balance = 245678900 // VND

  const transactions = [
    { id: 1, type: 'receive', name: 'Nguyễn Văn A', amount: 5000000, date: '26/12/2025' },
    { id: 2, type: 'send', name: 'Shopee', amount: 450000, date: '25/12/2025' },
    { id: 3, type: 'receive', name: 'Lương tháng 12', amount: 15000000, date: '25/12/2025' },
    { id: 4, type: 'send', name: 'Grab', amount: 125000, date: '24/12/2025' },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">MyBank</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-2">Số dư khả dụng</p>
              <div className="flex items-center space-x-3">
                <h2 className="text-4xl font-bold">
                  {showBalance ? formatCurrency(balance) : '••••••••'}
                </h2>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <CreditCard className="w-12 h-12 text-blue-200" />
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+2.5% so với tháng trước</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center space-y-3">
            <div className="bg-blue-100 p-4 rounded-full">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-800">Chuyển tiền</span>
          </button>
          
          <button className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center space-y-3">
            <div className="bg-green-100 p-4 rounded-full">
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-semibold text-gray-800">Nạp tiền</span>
          </button>
          
          <button className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center space-y-3">
            <div className="bg-purple-100 p-4 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-800">Thẻ</span>
          </button>
          
          <button className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center space-y-3">
            <div className="bg-orange-100 p-4 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="font-semibold text-gray-800">Đầu tư</span>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Giao dịch gần đây</h3>
            <button className="text-blue-600 font-semibold hover:text-blue-700">
              Xem tất cả
            </button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    tx.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'receive' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{tx.name}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <p className={`font-bold ${
                  tx.type === 'receive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.type === 'receive' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App