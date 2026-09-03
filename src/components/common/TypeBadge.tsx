import React from 'react';
import { PokemonType } from '../../types/pokemon';
import { POKEMON_TYPE_DETAILS } from '../../data/pokemonTypes';
import {
  Flame,
  Droplets,
  Leaf,
  Zap,
  Snowflake,
  Swords,
  Skull,
  Mountain,
  Wind,
  Eye,
  Bug,
  Gem,
  Ghost,
  Sparkles,
  Moon,
  Shield,
  Heart,
  Circle,
} from 'lucide-react';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showIndonesian?: boolean;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const TYPE_ICON_MAP: Record<PokemonType, React.ElementType> = {
  Normal: Circle,
  Fire: Flame,
  Water: Droplets,
  Grass: Leaf,
  Electric: Zap,
  Ice: Snowflake,
  Fighting: Swords,
  Poison: Skull,
  Ground: Mountain,
  Flying: Wind,
  Psychic: Eye,
  Bug: Bug,
  Rock: Gem,
  Ghost: Ghost,
  Dragon: Sparkles,
  Dark: Moon,
  Steel: Shield,
  Fairy: Heart,
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  showIcon = true,
  showIndonesian = false,
  className = '',
  onClick,
  selected = false,
}) => {
  const details = POKEMON_TYPE_DETAILS[type] || POKEMON_TYPE_DETAILS.Normal;
  const IconComponent = TYPE_ICON_MAP[type] || Circle;

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1 font-medium',
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const commonClasses = `inline-flex items-center rounded-lg uppercase tracking-wider transition-all duration-200 shadow-sm font-bold ${
    sizeClasses[size]
  } ${
    onClick
      ? 'cursor-pointer hover:scale-105 active:scale-95'
      : 'cursor-default'
  } ${
    selected
      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg scale-105'
      : ''
  } ${className}`;

  const styleObj = {
    backgroundColor: details.color,
    borderColor: details.color,
    borderWidth: '1px',
    color: '#FFFFFF',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
  };

  const content = (
    <>
      <span
        className="inline-flex items-center justify-center p-0.5 rounded bg-black/20 text-white"
      >
        {showIcon && <IconComponent className={`${iconSizes[size]} text-white`} strokeWidth={2.5} />}
      </span>
      <span className="text-white font-bold">{type}</span>
      {showIndonesian && (
        <span className="text-[10px] lowercase tracking-normal text-white/90 font-medium">
          ({details.nameId})
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`Klik untuk melihat rekomendasi Pokémon tipe ${type}`}
        className={commonClasses}
        style={styleObj}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={commonClasses} style={styleObj}>
      {content}
    </span>
  );
};
