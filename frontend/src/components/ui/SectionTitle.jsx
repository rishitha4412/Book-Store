import React from 'react';
import { motion } from 'framer-motion';

export default function SectionTitle({ title, subtitle, align = 'center' }) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl mb-8 sm:mb-12 ${isCenter ? 'mx-auto text-center' : 'text-left'}`}
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-main tracking-tight leading-tight mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full mt-4 ${isCenter ? 'mx-auto' : 'mr-auto'}`} />
    </motion.div>
  );
}
