import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlight,
  subtitle,
  align = 'center',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`max-w-3xl mb-12 ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#e8f7f6] text-[#146C94] border border-[#72D6CB]/40 mb-3.5">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172B3A] tracking-tight leading-tight">
        {title}{' '}
        {highlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146C94] to-[#19A7A1]">
            {highlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
