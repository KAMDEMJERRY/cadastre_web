import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noPadding?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  noPadding = false,
  header,
  footer,
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200 overflow-hidden',
        {
          'transition-all duration-200 hover:shadow-md hover:border-gray-300': hoverEffect,
          'p-6': !noPadding,
        },
        className
      )}
    >
      {header && (
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          {header}
        </div>
      )}

      <div className={clsx({ 'p-6': !noPadding })}>{children}</div>

      {footer && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}