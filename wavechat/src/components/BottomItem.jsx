import { motion } from "framer-motion";

const BottomItem = ({ icon, activeIcon, label, active, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      className="relative flex flex-col items-center gap-0.5 py-1 px-3"
    >
      {/* Active pill background */}
      {active && (
        <motion.div
          layoutId="navPill"
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-purple-100"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Icon */}
      <motion.div
        className={`relative z-10 text-[22px] ${active ? "text-purple-600" : "text-gray-400"
          }`}
        animate={active ? { y: -2 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {active ? activeIcon || icon : icon}
      </motion.div>

      {/* Label */}
      <motion.span
        className={`relative z-10 text-[10px] font-semibold tracking-wide ${active ? "text-purple-600" : "text-gray-400"
          }`}
        animate={active ? { y: -1 } : { y: 0 }}
      >
        {label}
      </motion.span>

      {/* Active dot */}
      {active && (
        <motion.div
          layoutId="navDot"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-600"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

export default BottomItem;