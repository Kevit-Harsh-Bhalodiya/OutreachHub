import { motion } from "motion/react";
type PrimaryButtonProps = {
  name: string;
  onClick: () => void;
};
const PrimaryButton = ({ name, onClick }:PrimaryButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`rounded-lg bg-purple-500 text-white hover:bg-purple-600 px-8 py-3 transition duration-200`}
    >
      {name}
    </motion.button>
  );
};

export default PrimaryButton;
