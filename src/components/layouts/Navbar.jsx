import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          FinTech App
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;