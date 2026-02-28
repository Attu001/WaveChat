import { motion } from "framer-motion";

const tabVariants = {
    initial: {
        opacity: 0,
        x: 30,
    },
    animate: {
        opacity: 1,
        x: 0,
    },
    exit: {
        opacity: 0,
        x: -30,
    },
};

const tabTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.3,
};

const TabTransition = ({ tabKey, children }) => {
    return (
        <motion.div
            key={tabKey}
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={tabTransition}
            style={{ width: "100%", height: "100%" }}
        >
            {children}
        </motion.div>
    );
};

export default TabTransition;
