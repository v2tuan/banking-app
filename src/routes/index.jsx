import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// Layouts
import RootLayout from '@/components/layouts/RootLayout';
// import AuthLayout from '@/components/layouts/AuthLayout';

// Pages
import HomePage from '@/features/home/pages/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import TransactionDashboard from '@/features/transaction/pages/TransactionPage';
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
    //   {
    //     path: 'register',
    //     element: (
    //       <PublicRoute>
    //         <RegisterPage />
    //       </PublicRoute>
    //     ),
    //   },
    ],
  },
  {
    path: 'admin',
    element: <Outlet />,
    children: [
      {
        path: 'transactions',
        element: <TransactionDashboard />,
      },
    ],
  }
]);

export default router;