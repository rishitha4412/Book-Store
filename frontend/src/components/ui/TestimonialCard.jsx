import React from 'react';
import { FiStar } from 'react-icons/fi';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-bg-surface border border-border-main p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Decorative quotes graphic */}
      <span className="absolute -top-3 -left-3 text-7xl font-serif text-primary/5 select-none pointer-events-none">“</span>
      
      <div className="relative">
        {/* Stars */}
        <div className="flex gap-0.5 text-amber-500 mb-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <FiStar 
              key={idx} 
              className={`w-4 h-4 ${idx < Math.floor(testimonial.rating) ? 'fill-current' : 'text-border-main'}`} 
            />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-text-main text-sm sm:text-base leading-relaxed italic mb-6">
          "{testimonial.quote}"
        </p>
      </div>

      {/* User profile */}
      <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-border-main/50">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name} 
          className="w-10 sm:w-11 sm:h-11 h-10 rounded-xl object-cover border border-border-main" 
          loading="lazy"
        />
        <div className="min-w-0">
          <h4 className="font-extrabold text-sm text-text-main leading-tight truncate">
            {testimonial.name}
          </h4>
          <p className="text-xs text-text-muted truncate mt-0.5 font-medium">
            {testimonial.role} at <span className="text-primary font-semibold">{testimonial.company}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
