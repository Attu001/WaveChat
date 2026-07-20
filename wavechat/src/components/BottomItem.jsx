import { motion } from "framer-motion";

const BottomItem = ({ icon, activeIcon, label, active, onClick, badge }) => {
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
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl"
          style={{ backgroundColor: 'var(--color-primary-bg)' }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Icon */}
      <motion.div
        className="relative z-10 text-[22px]"
        animate={active ? { y: -2 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}
      >
        {active ? activeIcon || icon : icon}

        {/* Badge */}
        {badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute -top-1.5 -right-2 z-20 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {badge > 99 ? "99+" : badge}
          </motion.span>
        )}
      </motion.div>

      {/* Label */}
      <motion.span
        className="relative z-10 text-[10px] font-semibold tracking-wide"
        animate={active ? { y: -1 } : { y: 0 }}
        style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}
      >
        {label}
      </motion.span>

      {/* Active dot */}
      {active && (
        <motion.div
          layoutId="navDot"
          className="absolute -bottom-1 w-1 h-1 rounded-full"
          style={{ backgroundColor: 'var(--color-primary)' }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

export default BottomItem;