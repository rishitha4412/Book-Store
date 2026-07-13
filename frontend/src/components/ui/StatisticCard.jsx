import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

export default function StatisticCard({ value, suffix = '', label, icon: Icon }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      // Smoothly animate counting numbers
      const controls = animate(0, value, {
        duration: 1.5,
        ease: 'easeOut',
        onUpdate: (latest) => setCount(Math.floor(latest))
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  // Format value to locale string (e.g. 48,000)
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-bg-surface border border-border-main p-6 sm:p-8 rounded-2xl shadow-sm flex items-center gap-4 sm:gap-6 hover:shadow-md transition-shadow"
    >
      {Icon && (
        <div className="p-3.5 bg-primary/10 text-primary rounded-xl sm:rounded-2xl shrink-0">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight leading-none">
          {formatNumber(count)}
          <span className="text-primary">{suffix}</span>
        </p>
      </div>
    </motion.div>
  );
}
