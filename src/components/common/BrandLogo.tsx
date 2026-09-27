import React from 'react';
import { OFFICIAL_LOGO_URL } from '../../constants/assets';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textPosition?: 'right' | 'bottom';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textPosition = 'right',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: { img: 'w-7 h-7 sm:w-8 sm:h-8', text: 'text-sm sm:text-base', sub: 'text-[8px] sm:text-[9px]' },
    sm: { img: 'w-9 h-9 sm:w-11 sm:h-11', text: 'text-base sm:text-lg', sub: 'text-[9px] sm:text-[10px]' },
    md: { img: 'w-12 h-12 sm:w-14 sm:h-14', text: 'text-lg sm:text-xl', sub: 'text-[10px] sm:text-[11px]' },
    lg: { img: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { img: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-2xl sm:text-3xl', sub: 'text-xs sm:text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 ${
        textPosition === 'bottom' ? 'flex-col text-center' : 'flex-row'
      } ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      {/* Official Circular Gold Medallion Logo Image as Uploaded by User */}
      <div className={`relative ${currentSize.img} shrink-0 rounded-full overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.45)] border border-[#d4af37]/60 p-[1.5px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e]`}>
        <img
          src={OFFICIAL_LOGO_URL}
          alt="Online Dress Mart Official Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Brand Name Text (optional alongside or below) */}
      {showText && (
        <div className={textPosition === 'bottom' ? 'mt-1' : ''}>
          <span className={`font-serif-luxury font-black tracking-wider gold-gradient-text block leading-none ${currentSize.text}`}>
            ONLINE DRESS MART
          </span>
          <span className={`tracking-[0.2em] uppercase text-gray-400 font-medium block mt-0.5 ${currentSize.sub}`}>
            Curated Fashion · Luxury Boutique
          </span>
        </div>
      )}
    </div>
  );
};
