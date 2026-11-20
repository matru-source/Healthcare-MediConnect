import React, { useState } from 'react';
import { User, Building2, Stethoscope, Activity, ShieldCheck } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'doctor' | 'hospital' | 'avatar' | 'hero' | 'general';
  name?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = '',
  className = '',
  fallbackType = 'general',
  name = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If image fails or src is empty, render an industry-grade medical SVG avatar, facility banner, or hero graphic
  if (error || !src) {
    if (fallbackType === 'doctor') {
      const initials = name
        ? name.replace(/^Dr\.\s*/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'DR';

      return (
        <div
          className={`flex flex-col items-center justify-center bg-gradient-to-tr from-[#146C94] via-[#105676] to-[#19A7A1] text-white select-none ${className}`}
          role="img"
          aria-label={alt || name || 'Doctor Profile'}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-1">
            <Stethoscope className="w-4 h-4 text-[#72D6CB]" />
          </div>
          <span className="text-xs font-black tracking-wider text-white drop-shadow-xs">{initials}</span>
        </div>
      );
    }

    if (fallbackType === 'hero') {
      return (
        <div
          className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#0c394e] via-[#146C94] to-[#19A7A1] text-white overflow-hidden select-none ${className}`}
          role="img"
          aria-label={alt || 'Clinical Specialist'}
        >
          {/* Subtle medical ambient wave */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#72D6CB_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-lg">
              <Activity className="w-8 h-8 text-[#72D6CB] animate-pulse" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#72D6CB] mb-1">MediConnect Clinical Staff</span>
            <span className="text-base font-extrabold text-white line-clamp-1">{name || 'Board-Certified Specialists'}</span>
          </div>
        </div>
      );
    }

    if (fallbackType === 'hospital') {
      return (
        <div
          className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#103b4f] via-[#146C94] to-[#19A7A1] text-white p-4 select-none ${className}`}
          role="img"
          aria-label={alt || name || 'Hospital Facility'}
        >
          <Building2 className="w-10 h-10 text-[#72D6CB] mb-2" />
          <span className="text-xs font-bold text-center text-white/90 line-clamp-1">{name || 'Medical Center'}</span>
        </div>
      );
    }

    if (fallbackType === 'avatar') {
      const initials = name
        ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'PT';

      return (
        <div
          className={`flex items-center justify-center bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold select-none ${className}`}
          role="img"
          aria-label={alt || name || 'User Profile'}
        >
          <span className="text-xs tracking-wider">{initials}</span>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 select-none ${className}`}
        role="img"
        aria-label={alt || 'Medical Graphic'}
      >
        <ShieldCheck className="w-6 h-6 text-[#146C94]/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${!loaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};
