import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Plane, LogOut, History, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/auth.api';
import { cn } from '@/lib/utils';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )
    }
  >
    <Icon className="h-4 w-4" />
    {label}
  </NavLink>
);

const Navbar = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => { clearAuth(); navigate('/'); },
  });

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to={user ? '/dashboard' : '/'}
          className="flex items-center gap-2 font-bold text-primary"
        >
          <Plane className="h-5 w-5" />
          TripCraft
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <NavItem to="/dashboard" icon={Upload} label="Upload" />
              <NavItem to="/history" icon={History} label="History" />
              <span className="mx-2 hidden sm:block text-sm text-muted-foreground">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
