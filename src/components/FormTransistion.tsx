import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FormTransitionProps {
  children: ReactNode;
  show: boolean;
}

const FormTransition: React.FC<FormTransitionProps> = ({ children, show }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      x: show ? -20 : 20,
      position: "absolute" as const,
      width: "100%"
    },
    visible: { 
      opacity: 1, 
      x: 0,
      position: "relative" as const,
      width: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: show ? 20 : -20,
      position: "absolute" as const,
      width: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate={show ? "visible" : "exit"}
      variants={variants}
      key={show ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

export default FormTransition;