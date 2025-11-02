import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function StepFormTransition({ currentStep, children }) {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
