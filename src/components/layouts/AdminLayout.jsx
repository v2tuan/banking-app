import { Outlet, useLocation } from 'react-router-dom';
import { Users, LayoutDashboard, ArrowLeftRight, Settings } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: ArrowLeftRight, label: 'Transactions', path: '/admin/transactions' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-[172px] bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <a
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'text-gray-900 bg-gray-100 border-r-2 border-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
