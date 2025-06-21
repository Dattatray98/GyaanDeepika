import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  iconColor?: string;
  barColor?: string;
}

const Loading = ({
  message = "Loading GyaanDeepika...",
  fullScreen = true,
  iconColor = "text-orange-500",
  barColor = "bg-orange-500"
}: LoadingProps) => {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "h-screen bg-[#0F0F0F]" : "py-20"}`}>
      <motion.div
        className="animate-pulse flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaGraduationCap className={`${iconColor} text-4xl mb-4`} />
        </motion.div>
        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </div>
        <motion.p
          className="mt-4 text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;