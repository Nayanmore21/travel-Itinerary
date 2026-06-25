import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../store/authStore';
import * as authApi from '../api/auth.api';

export const useAuth = () => {
  const { user, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.accessToken);
      navigate('/dashboard');
    },
    onError: (err) => {
      if (err.response?.status === 401) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else {
        toast.error('Something went wrong on our end. Please try again later.');
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.accessToken);
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
      navigate('/login');
    },
  });

  return { user, loginMutation, registerMutation, logoutMutation };
};
