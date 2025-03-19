import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FormTransitionProps {
  children: ReactNode;
  show: boolean;
  direction?: "left" | "right";
}

const ModernFormTransition: React.FC<FormTransitionProps> = ({ 
  children, 
  show, 
  direction = "right" 
}) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      x: direction === "right" ? 20 : -20,
      scale: 0.98,
      position: "absolute" as const,
      width: "100%"
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      position: "relative" as const,
      width: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      x: direction === "right" ? -20 : 20,
      scale: 0.98,
      position: "absolute" as const,
      width: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate={show ? "visible" : "exit"}
      exit="exit"
      variants={variants}
      key={`form-${show ? "visible" : "hidden"}`}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default ModernFormTransition;