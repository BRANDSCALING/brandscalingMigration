import React from 'react';

// Brandscaling 2025 Brand System Components

interface BrandQuoteProps {
  children: React.ReactNode;
  attribution?: 'architect' | 'alchemist' | 'both';
  centered?: boolean;
}

export const BrandQuote: React.FC<BrandQuoteProps> = ({ 
  children, 
  attribution = 'both', 
  centered = true 
}) => {
  const getAttributionText = () => {
    switch (attribution) {
      case 'architect': return '— The Architect';
      case 'alchemist': return '— The Alchemist';
      case 'both': return '— The Architect & The Alchemist';
      default: return '';
    }
  };

  return (
    <blockquote className={`quote-reflection ${centered ? 'text-center' : ''}`}>
      <p className="mb-4 text-lg italic text-gray-700 dark:text-gray-300">
        {children}
      </p>
      {attribution && (
        <footer className={`text-sm font-medium ${
          attribution === 'architect' ? 'text-architect' : 
          attribution === 'alchemist' ? 'text-alchemist' : 
          'text-deep-plum'
        }`}>
          {getAttributionText()}
        </footer>
      )}
    </blockquote>
  );
};

interface BrandButtonProps {
  children: React.ReactNode;
  variant?: 'architect' | 'alchemist' | 'founder' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'architect': return 'btn-architect';
      case 'alchemist': return 'btn-alchemist';
      case 'founder': return 'btn-founder';
      case 'primary': return 'btn-architect'; // Default to architect
      default: return 'btn-architect';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2 text-sm';
      case 'md': return 'px-6 py-3 text-base';
      case 'lg': return 'px-8 py-4 text-lg';
      default: return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        font-medium rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:transform hover:scale-105
        ${className}
      `}
    >
      {children}
    </button>
  );
};

interface BrandSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'normal' | 'large';
}

export const BrandSection: React.FC<BrandSectionProps> = ({
  children,
  className = '',
  spacing = 'normal'
}) => {
  return (
    <section className={`
      container-brandscaling
      ${spacing === 'large' ? 'spacing-section' : 'spacing-component'}
      ${className}
    `}>
      {children}
    </section>
  );
};

interface BrandGradientTextProps {
  children: React.ReactNode;
  variant?: 'brandscaling' | 'architect' | 'alchemist';
  className?: string;
}

export const BrandGradientText: React.FC<BrandGradientTextProps> = ({
  children,
  variant = 'brandscaling',
  className = ''
}) => {
  const getGradientClass = () => {
    switch (variant) {
      case 'brandscaling': return 'bg-gradient-to-r from-architect-indigo to-scale-orange';
      case 'architect': return 'bg-gradient-to-r from-architect-indigo to-deep-plum';
      case 'alchemist': return 'bg-gradient-to-r from-precision-pink to-scale-orange';
      default: return 'bg-gradient-to-r from-architect-indigo to-scale-orange';
    }
  };

  return (
    <span className={`
      ${getGradientClass()}
      bg-clip-text text-transparent font-bold
      ${className}
    `}>
      {children}
    </span>
  );
};

interface PersonalityModeProps {
  mode: 'architect' | 'alchemist';
  children: React.ReactNode;
  showLabel?: boolean;
}

export const PersonalityMode: React.FC<PersonalityModeProps> = ({
  mode,
  children,
  showLabel = false
}) => {
  const modeStyles = {
    architect: {
      border: 'border-l-4 border-architect-indigo',
      bg: 'bg-blue-50 dark:bg-blue-950',
      text: 'text-architect',
      label: 'Architect Mode: Precise, Calm, Strategic'
    },
    alchemist: {
      border: 'border-l-4 border-scale-orange',
      bg: 'bg-orange-50 dark:bg-orange-950',
      text: 'text-alchemist',
      label: 'Alchemist Mode: Warm, Magnetic, Empowering'
    }
  };

  const style = modeStyles[mode];

  return (
    <div className={`${style.border} ${style.bg} p-6 rounded-r-lg`}>
      {showLabel && (
        <div className={`text-sm font-medium ${style.text} mb-3`}>
          {style.label}
        </div>
      )}
      <div className="prose prose-lg">
        {children}
      </div>
    </div>
  );
};

export const BrandSoundBites = {
  regulation: "Before you automate your funnel, regulate your energy.",
  scaling: "Scaling isn't about adding more. It's about becoming more of who you already are.",
  alignment: "You don't need another tactic. You need alignment—and a system that can hold it.",
  clarity: "Clarity is the real catalyst—internally and operationally.",
  energy: "People don't follow plans. They follow energy that's anchored—and decisions that hold."
};

// Positioning statements for each avatar
export const AvatarPositioning = {
  ideaStuck: "For dreamers whose brilliant ideas circle at 3 AM but never see daylight—we clear the invisible blocks that keep breakthrough thinking trapped in brilliant minds.",
  frameworkFrustrated: "For entrepreneurs who've followed every expert step and still hit walls—we build systems that bend to your personality type, not the other way around.",
  mastermindGraduate: "For founders who've outgrown the rooms that once stretched them—we create the next level of thinking when no one around you is thinking as big as you are.",
  successfulButStuck: "For leaders whose success has become the fog that clouds their next move—we restructure belief, capacity, and strategic clarity from the root."
};