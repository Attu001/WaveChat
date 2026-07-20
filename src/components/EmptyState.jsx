import { motion } from "framer-motion";

const illustrations = {
  messages: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <rect x="20" y="30" width="80" height="55" rx="12" fill="var(--color-border-light)" stroke="var(--color-border)" strokeWidth="2"/>
      <circle cx="40" cy="58" r="6" fill="var(--color-text-tertiary)" opacity="0.4"/>
      <circle cx="56" cy="58" r="6" fill="var(--color-text-tertiary)" opacity="0.4"/>
      <circle cx="72" cy="58" r="6" fill="var(--color-text-tertiary)" opacity="0.4"/>
      <rect x="30" y="38" width="60" height="4" rx="2" fill="var(--color-text-tertiary)" opacity="0.3"/>
      <rect x="30" y="46" width="40" height="4" rx="2" fill="var(--color-text-tertiary)" opacity="0.2"/>
      <path d="M40 100 L60 85" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      <circle cx="60" cy="85" r="4" fill="var(--color-primary)" opacity="0.3"/>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <circle cx="60" cy="45" r="22" stroke="var(--color-border)" strokeWidth="2.5" fill="var(--color-border-light)"/>
      <circle cx="60" cy="42" r="10" fill="var(--color-text-tertiary)" opacity="0.3"/>
      <path d="M30 100 Q30 75 60 75 Q90 75 90 100" stroke="var(--color-border)" strokeWidth="2.5" fill="var(--color-border-light)"/>
      <circle cx="85" cy="30" r="12" fill="var(--color-accent)" opacity="0.15"/>
      <path d="M80 30 L88 30 M85 25 L85 35" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <circle cx="52" cy="52" r="24" stroke="var(--color-border)" strokeWidth="2.5" fill="var(--color-border-light)"/>
      <circle cx="52" cy="52" r="10" fill="var(--color-text-tertiary)" opacity="0.2"/>
      <line x1="70" y1="70" x2="90" y2="90" stroke="var(--color-border)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="75" y1="75" x2="85" y2="85" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  notification: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <path d="M60 25 L60 30" stroke="var(--color-border)" strokeWidth="3" strokeLinecap="round"/>
      <rect x="40" y="30" width="40" height="50" rx="8" stroke="var(--color-border)" strokeWidth="2.5" fill="var(--color-border-light)"/>
      <rect x="44" y="34" width="32" height="30" rx="4" fill="var(--color-text-tertiary)" opacity="0.1"/>
      <rect x="46" y="38" width="28" height="3" rx="1.5" fill="var(--color-text-tertiary)" opacity="0.3"/>
      <rect x="46" y="44" width="20" height="3" rx="1.5" fill="var(--color-text-tertiary)" opacity="0.2"/>
      <circle cx="60" cy="85" r="8" fill="var(--color-primary)" opacity="0.15"/>
      <circle cx="60" cy="85" r="4" fill="var(--color-primary)" opacity="0.4"/>
      <path d="M35 80 L30 78 M85 80 L90 78" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  explore: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <circle cx="60" cy="60" r="35" stroke="var(--color-border)" strokeWidth="2.5" fill="var(--color-border-light)"/>
      <circle cx="60" cy="60" r="18" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" fill="var(--color-primary-bg)"/>
      <circle cx="60" cy="60" r="6" fill="var(--color-primary)" opacity="0.5"/>
      <line x1="60" y1="42" x2="60" y2="25" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <line x1="60" y1="78" x2="60" y2="95" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <line x1="42" y1="60" x2="25" y2="60" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <line x1="78" y1="60" x2="95" y2="60" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  posts: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <rect x="25" y="20" width="70" height="80" rx="10" stroke="var(--color-border)" strokeWidth="2.5" fill="var(--color-border-light)"/>
      <rect x="33" y="28" width="54" height="40" rx="6" fill="var(--color-text-tertiary)" opacity="0.1"/>
      <rect x="33" y="72" width="30" height="4" rx="2" fill="var(--color-text-tertiary)" opacity="0.3"/>
      <rect x="33" y="80" width="20" height="4" rx="2" fill="var(--color-text-tertiary)" opacity="0.2"/>
      <rect x="57" y="72" width="30" height="12" rx="6" fill="var(--color-primary-bg)" stroke="var(--color-primary-light)" strokeWidth="1.5"/>
      <path d="M66 78 L72 74 L78 80" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
      <circle cx="60" cy="60" r="30" stroke="var(--color-border)" strokeWidth="2.5" fill="var(--color-border-light)"/>
      <path d="M45 55 L55 65 L75 45" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  ),
};

const EmptyState = ({
  type = "default",
  title = "Nothing here yet",
  description = "It's quiet for now. Your content will appear here.",
  action,
  actionLabel,
  onAction,
}) => {
  const illustration = illustrations[type] || illustrations.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        className="mb-6"
      >
        {illustration}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold mb-1.5"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm max-w-xs leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {action && actionLabel && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;