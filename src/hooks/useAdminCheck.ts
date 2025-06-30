
import { useAuth } from './useAuth';

// Lista degli email amministratori - solo giordano.brunolucio@gmail.com è admin
const ADMIN_EMAILS = [
  'giordano.brunolucio@gmail.com'
];

export function useAdminCheck() {
  const { user } = useAuth();
  
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  
  return { isAdmin };
}
