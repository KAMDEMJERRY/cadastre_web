import { ReactNode } from 'react';
import clsx from 'clsx';

interface TableRowProps {
  children: ReactNode;
  header?: boolean;
  className?: string;
}

export default function TableRow({ 
  children, 
  header = false, 
  className = '' 
}: TableRowProps) {
  return (
    <tr className={clsx(
      {
        'bg-gray-100': header,
        'border-b border-gray-200 hover:bg-gray-50': !header
      },
      className
    )}>
      {children}
    </tr>
  );
}