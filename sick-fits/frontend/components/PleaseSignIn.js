import { useUser } from './User';
import SignIn from './SignIn';

export default function PleaseSignIn({ children }) {
  // todo use in other components!
  const me = useUser();
  if (!me) return <SignIn />;
  return children;
}
