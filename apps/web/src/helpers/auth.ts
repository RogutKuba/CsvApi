import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuthHelpers = () => {
  const router = useRouter();
  return {
    logout: () => {
      console.log('logout');
      // remove cookie and redirect to login page
      Cookies.remove('x-auth-token');
      router.push('/app/login');
    },
  };
};
