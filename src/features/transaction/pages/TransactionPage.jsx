import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight, DollarSign, TrendingUp, Filter, Download, Eye, Search } from 'lucide-react';
import { transactionApi } from '@/api/endpoints/transactionApi';

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0,
    totalAmount: 0,
    byType: {
      TRANSFER: 0,
      DEPOSIT: 0,
      WITHDRAW: 0
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const filter = {
          searchTerm: searchTerm || undefined,
          type: filterType,
          status: filterStatus,
          page: currentPage - 1, // API uses 0-based index
          size: itemsPerPage
        };
        
        const response = await transactionApi.getTransactions(filter);
        setTransactions(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [searchTerm, filterType, filterStatus, currentPage]);

  // Fetch statistics from API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await transactionApi.getStatistics();
        setStatistics({
          total: response.data.total || 0,
          success: response.data.success || 0,
          failed: response.data.failed || 0,
          pending: response.data.pending || 0,
          totalAmount: response.data.totalAmount || 0,
          byType: {
            TRANSFER: response.data.byType?.transfer || 0,
            DEPOSIT: response.data.byType?.deposit || 0,
            WITHDRAW: response.data.byType?.withdraw || 0
          }
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      SUCCESS: 'default',
      FAILED: 'destructive',
      PENDING: 'secondary'
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'TRANSFER': return <ArrowLeftRight className="w-4 h-4" />;
      case 'DEPOSIT': return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'WITHDRAW': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Từ tài khoản', 'Đến tài khoản', 'Số tiền', 'Loại', 'Trạng thái', 'Ngày tạo'];
    const rows = transactions.map(t => [
      t.transactionId,
      t.fromAccount || 'N/A',
      t.toAccount || 'N/A',
      t.amount,
      t.type,
      t.status,
      formatDate(t.createdAt)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Giao Dịch</h1>
            <p className="text-gray-500 mt-1">Theo dõi và quản lý tất cả giao dịch trong hệ thống</p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng Giao Dịch</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-gray-500 mt-1">
                Thành công: {statistics.success} | Thất bại: {statistics.failed}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng Giá Trị</CardTitle>
              <DollarSign className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(statistics.totalAmount)}</div>
              <p className="text-xs text-gray-500 mt-1">Chỉ tính giao dịch thành công</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chuyển Khoản</CardTitle>
              <ArrowLeftRight className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.byType.TRANSFER}</div>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.total > 0 ? ((statistics.byType.TRANSFER / statistics.total) * 100).toFixed(1) : 0}% tổng số
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nạp/Rút Tiền</CardTitle>
              <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.byType.DEPOSIT + statistics.byType.WITHDRAW}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Nạp: {statistics.byType.DEPOSIT} | Rút: {statistics.byType.WITHDRAW}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Bộ Lọc & Tìm Kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo ID hoặc tài khoản..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại giao dịch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả loại</SelectItem>
                  <SelectItem value="TRANSFER">Chuyển khoản</SelectItem>
                  <SelectItem value="DEPOSIT">Nạp tiền</SelectItem>
                  <SelectItem value="WITHDRAW">Rút tiền</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                  <SelectItem value="SUCCESS">Thành công</SelectItem>
                  <SelectItem value="FAILED">Thất bại</SelectItem>
                  <SelectItem value="PENDING">Đang xử lý</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('ALL');
                  setFilterStatus('ALL');
                  setCurrentPage(1);
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Giao Dịch</CardTitle>
            <CardDescription>
              Hiển thị {transactions.length} / {totalElements} giao dịch
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ TK</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến TK</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.transactionId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">#{transaction.transactionId}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(transaction.type)}
                              <span className="text-sm">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{transaction.fromAccount || '-'}</td>
                          <td className="px-4 py-3 text-sm">{transaction.toAccount || '-'}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(transaction.status)}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedTransaction(transaction)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Chi Tiết Giao Dịch #{transaction.transactionId}</DialogTitle>
                                  <DialogDescription>
                                    Thông tin chi tiết về giao dịch
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Loại giao dịch</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        {getTypeIcon(transaction.type)}
                                        <span className="font-medium">{transaction.type}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                                      <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Từ tài khoản</p>
                                      <p className="mt-1 font-medium">{transaction.fromAccount || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500">Đến tài khoản</p>
                                      <p className="mt-1 font-medium">{transaction.toAccount || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-gray-500">Số tiền</p>
                                      <p className="mt-1 text-2xl font-bold text-green-600">
                                        {formatCurrency(transaction.amount)}
                                      </p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                                      <p className="mt-1">{formatDate(transaction.createdAt)}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    Trang {currentPage} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDashboard;