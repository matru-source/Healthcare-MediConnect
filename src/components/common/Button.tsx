import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-[#146C94] hover:bg-[#0f5271] text-white shadow-md shadow-[#146C94]/20 focus:ring-[#146C94]',
    secondary: 'bg-[#19A7A1] hover:bg-[#148681] text-white shadow-md shadow-[#19A7A1]/20 focus:ring-[#19A7A1]',
    accent: 'bg-[#72D6CB] hover:bg-[#54c7ba] text-[#172B3A] font-semibold shadow-md shadow-[#72D6CB]/30 focus:ring-[#72D6CB]',
    outline: 'border border-[#146C94] text-[#146C94] hover:bg-[#146C94]/5 focus:ring-[#146C94]',
    ghost: 'text-[#172B3A] hover:bg-[#EEF4F8] focus:ring-slate-300',
    danger: 'bg-[#E05252] hover:bg-red-700 text-white shadow-md shadow-red-500/20 focus:ring-red-500'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};
