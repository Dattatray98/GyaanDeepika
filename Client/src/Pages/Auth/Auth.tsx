import { useParams } from 'react-router-dom';
import Login from './Login.tsx';
import SignUp from './SignUp.tsx';
import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';

const Auth = () => {
  const { type } = useParams();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:60px_60px]"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500/20"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              opacity: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Holographic card effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-75 blur-lg"></div>
        
        <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Animated header */}
          <div className="p-8 text-center border-b border-gray-700/50 relative overflow-hidden">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 opacity-50"></div>
            <div className="flex justify-center items-center space-x-3 relative z-10">
              <FaGraduationCap className="text-indigo-400 text-4xl animate-float" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Gyaan<span className="text-white">Deepika</span>
              </h1>
            </div>
            <p className="text-gray-400 mt-3 text-sm font-light">
              {type === 'login' ? 'Welcome to the future of learning' : 'Join the education revolution'}
            </p>
          </div>

          {type === 'login' ? <Login /> : <SignUp />}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;