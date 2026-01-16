import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Layouts
import RootLayout from '@/components/layouts/RootLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
// import AuthLayout from '@/components/layouts/AuthLayout';

// Pages
import HomePage from '@/features/home/pages/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import TransactionDashboard from '@/features/transaction/pages/TransactionPage';
import UserManagementPage from '@/features/admin/pages/UserManagementPage';
// import RegisterPage from '@/features/auth/pages/RegisterPage';

// Protected Route Component
// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

// Public Route (redirect if authenticated)
// eslint-disable-next-line react-refresh/only-export-components
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      // Add more protected routes here
    ],
  },
  {
    path: '/auth',
    element: <Outlet />,
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
       {
         path: 'register',
         element: (
           <PublicRoute>
             <RegisterPage />
           </PublicRoute>
         ),
       },
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome to the admin dashboard.</p>
          </div>
        ),
      },
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'transactions',
        element: <TransactionDashboard />,
      },
      {
        path: 'settings',
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">Admin settings go here.</p>
          </div>
        ),
      },
    ],
  }
]);

export default router;