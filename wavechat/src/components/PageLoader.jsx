import React from "react";
import { motion } from "framer-motion";

const PageLoader = ({ message = "Loading..." }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
        >
            {/* Animated dots */}
            <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-purple-500"
                        animate={{
                            y: [0, -12, 0],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
            <p className="text-sm text-gray-400 font-medium">{message}</p>
        </motion.div>
    );
};

export default PageLoader;
