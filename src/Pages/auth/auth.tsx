import { useParams } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';

const Auth = () => {
  const { type } = useParams();

  return (
    <div className="h-[100vh] flex justify-center bg-[#000000] border-red-700 border-2 items-center">
      {type === 'login' && <Login />}
      {type === 'signup' && <SignUp />}
    </div>
  );
};

export default Auth;
