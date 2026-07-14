import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

export default function StatisticCard({ value, suffix = '', label, icon: Icon }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: 'easeOut',
        onUpdate: (latest) => setCount(Math.floor(latest))
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  const formatNumber = (num) => num.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-bg-surface border border-border-main p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col items-center text-center gap-2 sm:gap-3 hover:shadow-md transition-shadow"
    >
      {Icon && (
        <div className="p-2.5 sm:p-3.5 bg-primary/10 text-primary rounded-xl shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}
      <div className="min-w-0 w-full">
        <p className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider mb-0.5 leading-tight line-clamp-2">
          {label}
        </p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight leading-none">
          {formatNumber(count)}
          <span className="text-primary">{suffix}</span>
        </p>
      </div>
    </motion.div>
  );
}
