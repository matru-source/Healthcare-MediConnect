import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBg?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon,
  iconBg = 'bg-[#146C94]/10 text-[#146C94]',
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 24px -6px rgba(20, 108, 148, 0.08)' }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card flex flex-col justify-between cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${iconBg} shadow-xs`}>
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] tracking-tight">{value}</h3>
        
        <div className="flex items-center gap-2 mt-1">
          {change && (
            <span
              className={`inline-flex items-center text-xs font-bold ${
                isPositive ? 'text-[#22A06B]' : 'text-[#E05252]'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
