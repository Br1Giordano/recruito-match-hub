
import { useAuth } from './useAuth';

// Lista degli email amministratori - puoi aggiungere altri email qui
const ADMIN_EMAILS = [
  'contact.recruito@gmail.com',
  'giordano.brunolucio@gmail.com'
];

export function useAdminCheck() {
  const { user } = useAuth();
  
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  
  return { isAdmin };
}
