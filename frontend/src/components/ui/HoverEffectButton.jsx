import React from 'react';
import { motion } from 'framer-motion';

export function HoverEffectButton({ children, onClick, className, style }) {
  return (
    <motion.button
      onClick={onClick}
      className={className}
      style={style}
      whileHover={{ scale: 1.05, boxShadow: '0px 8px 15px rgba(0,0,0,0.15)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}
