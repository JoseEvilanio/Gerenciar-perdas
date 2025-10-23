
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, description, children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="flex items-center">
        {children && <div className="mr-4 text-sky-500">{children}</div>}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default Card;
