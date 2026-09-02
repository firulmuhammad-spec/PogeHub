import React from 'react';
import { PokemonType } from '../../types/pokemon';
import { POKEMON_TYPE_DETAILS } from '../../data/pokemonTypes';
import { getMoveType } from '../../data/pokemonMoves';
import { TYPE_ICON_MAP } from './TypeBadge';
import { Circle } from 'lucide-react';

interface MoveBadgeProps {
  moveName: string;
  category?: 'Fast' | 'Charged';
  type?: PokemonType;
  size?: 'xs' | 'sm' | 'md';
  showCategoryTag?: boolean;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const MoveBadge: React.FC<MoveBadgeProps> = ({
  moveName,
  category,
  type,
  size = 'sm',
  showCategoryTag = false,
  className = '',
  onClick,
  selected = false,
}) => {
  const moveType = type || getMoveType(moveName);
  const details = POKEMON_TYPE_DETAILS[moveType] || POKEMON_TYPE_DETAILS.Normal;
  const IconComponent = TYPE_ICON_MAP[moveType] || Circle;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1.5 font-medium',
    sm: 'text-[11px] px-2.5 py-1 gap-1.5 font-semibold',
    md: 'text-xs px-3 py-1.5 gap-2 font-bold',
  };

  const iconContainerSizes = {
    xs: 'w-3.5 h-3.5 p-0.5',
    sm: 'w-4 h-4 p-0.5',
    md: 'w-5 h-5 p-1',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  };

  const commonClasses = `inline-flex items-center rounded-lg transition-all duration-200 shadow-sm font-mono ${
    sizeClasses[size]
  } ${
    onClick
      ? 'cursor-pointer hover:scale-105 active:scale-95'
      : 'cursor-default'
  } ${
    selected ? 'ring-2 ring-amber-400 shadow-amber-500/30 scale-105' : ''
  } ${className}`;

  const styleObj = {
    backgroundColor: details.color + '18', // ~10% tint
    borderColor: details.color + '60', // 38% border
    borderWidth: '1px',
  };

  const titleText = `Jurus: ${moveName} (${moveType}${category ? ` • ${category} Move` : ''})`;

  const content = (
    <>
      {/* Element Type Icon Box */}
      <span
        className={`inline-flex items-center justify-center rounded shrink-0 shadow-sm ${iconContainerSizes[size]}`}
        style={{ backgroundColor: details.color }}
      >
        <IconComponent className={`${iconSizes[size]} text-white`} strokeWidth={2.5} />
      </span>

      {/* Move Name */}
      <span className="text-slate-800 dark:text-slate-100 font-bold tracking-tight whitespace-nowrap">
        {moveName}
      </span>

      {/* Element Type Label */}
      <span
        className="text-[9px] uppercase font-mono px-1 rounded font-bold text-white shadow-xs"
        style={{
          backgroundColor: details.color,
        }}
      >
        {moveType}
      </span>

      {/* Optional Category Tag */}
      {showCategoryTag && category && (
        <span
          className={`text-[8px] uppercase tracking-wider px-1 py-0.2 rounded font-black ${
            category === 'Fast'
              ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
          }`}
        >
          {category}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={commonClasses}
        style={styleObj}
        title={titleText}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={commonClasses} style={styleObj} title={titleText}>
      {content}
    </span>
  );
};
