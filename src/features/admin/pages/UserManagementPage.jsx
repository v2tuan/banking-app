import { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Eye, Ban, CheckCircle, X } from 'lucide-react';
import { getUsers, getUserDetail, lockUser, activateUser } from '@/api/endpoints/userApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Action Menu State
  const [actionMenuId, setActionMenuId] = useState(null);
  const menuRef = useRef(null);

  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters.status, pagination.page]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };

      if (filters.status !== 'ALL') {
        params.status = filters.status;
      }

      if (filters.search) {
        params.email = filters.search;
        params.fullName = filters.search;
      }

      const response = await getUsers(params);
      
      if (response.success) {
        setUsers(response.data.content);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 0 }));
    fetchUsers();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status) => {
    if (status === 'ACTIVE') {
      return (
        <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
          active
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
        blocked
      </span>
    );
  };

  const handleViewDetails = async (userId) => {
    setActionMenuId(null); // Close menu if open
    setDetailLoading(true);
    setIsDetailOpen(true);
    try {
      const response = await getUserDetail(userId);
      if (response.success) {
        setSelectedUser(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    setActionMenuId(null);
    try {
      if (user.status === 'ACTIVE') {
        const confirmLock = window.confirm(`Are you sure you want to block ${user.fullName}?`);
        if (!confirmLock) return;
        await lockUser(user.userId);
      } else {
        await activateUser(user.userId);
      }
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Failed to update user status:", err);
      alert("Failed to update user status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">User Management</h1>
          <p className="text-sm text-gray-500">Manage and monitor user accounts</p>
        </div>

        {/* Search & Filter Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Search & Filter</h2>
          </div>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Search by Name or Email
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="w-64">
              <label className="block text-xs font-medium text-gray-600 mb-2">Status</label>
              <div className="flex gap-2">
                {['ALL', 'ACTIVE', 'LOCKED'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setFilters({ ...filters, status });
                      setPagination((prev) => ({ ...prev, page: 0 }));
                    }}
                    className={`
                      px-4 py-2 text-xs font-medium rounded-md transition-colors
                      ${
                        filters.status === status
                          ? status === 'ALL'
                            ? 'bg-blue-600 text-white'
                            : status === 'ACTIVE'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {status === 'ALL' ? 'All' : status === 'ACTIVE' ? 'Active' : 'Blocked'}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative" style={{ minHeight: '400px' }}>
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto pb-32"> {/* Added padding bottom to accommodate dropdowns */}
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        USR{String(user.userId).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button 
                          onClick={() => handleViewDetails(user.userId)}
                          className="hover:text-blue-600 font-medium hover:underline text-left"
                        >
                          {user.fullName}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(Math.random() * 100000)} {/* Placeholder as per original */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 relative">
                        <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             setActionMenuId(actionMenuId === user.userId ? null : user.userId);
                          }}
                          className="hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {actionMenuId === user.userId && (
                          <div ref={menuRef} className="absolute right-8 top-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(user.userId)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                              <button
                                onClick={() => handleToggleStatus(user)}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 ${
                                  user.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'
                                }`}
                              >
                                {user.status === 'ACTIVE' ? (
                                  <>
                                    <Ban size={16} />
                                    Block User
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={16} />
                                    Active User
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && users.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {pagination.page * pagination.size + 1} to{' '}
                {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                {pagination.totalElements} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: Math.max(0, prev.page - 1) }))
                  }
                  disabled={pagination.page === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages - 1, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          
          {detailLoading ? (
             <div className="py-8 text-center text-gray-500">Loading details...</div>
          ) : selectedUser ? (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="text-base font-semibold text-gray-900">{selectedUser.fullName}</p>
                 </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-base text-gray-900">{selectedUser.email}</p>
                 </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-base text-gray-900">{selectedUser.phone || 'N/A'}</p>
                 </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                 </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="text-base text-gray-900 px-2 py-0.5 bg-gray-100 rounded inline-block text-sm">{selectedUser.role}</p>
                 </div>
                 <div>
                    <h3 className="text-sm font-medium text-gray-500">Join Date</h3>
                    <p className="text-base text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                 </div>
              </div>

              {selectedUser.accounts && selectedUser.accounts.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Bank Accounts</h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                     {selectedUser.accounts.map((acc, idx) => (
                       <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                          <div>
                            <span className="font-semibold text-gray-700">{acc.accountNumber}</span>
                            <span className="ml-2 text-gray-500 text-xs">({acc.accountType})</span>
                          </div>
                          <div className="font-medium text-gray-900">
                             {formatCurrency(acc.balance || 0)}
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-red-500">Failed to load user information</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
