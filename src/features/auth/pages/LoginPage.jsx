import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LoginForm } from '../components/login-form';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      const result = await login(data);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm 
          onSubmit={handleSubmit}
          error={error}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default LoginPage;