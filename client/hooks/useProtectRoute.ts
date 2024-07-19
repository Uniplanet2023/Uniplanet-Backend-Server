import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth_provider';


export const useProtectRoute = (redirectTo: string) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, redirectTo, router]);

  return isLoggedIn;
};