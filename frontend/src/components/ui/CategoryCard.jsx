import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CategoryCard({ category, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/books?category=${category.slug}`}
        className="relative block overflow-hidden rounded-2xl aspect-[4/5] group cursor-pointer shadow-sm border border-border-main"
      >
        <img
          src={category.cover}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover/Standard gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-end text-white">
          <h4 className="font-extrabold text-sm sm:text-base leading-tight mb-1 group-hover:text-primary transition-colors">
            {category.name}
          </h4>
          <p className="text-[10px] sm:text-xs text-gray-300 font-medium">
            {category.count} Books
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
