import { ReactNode } from 'react';
import clsx from 'clsx';

interface TableCellProps {
  children: ReactNode;
  header?: boolean;
  className?: string;
  colSpan?: number;
}

export default function TableCell({ 
  children, 
  header = false, 
  className = '',
  colSpan 
}: TableCellProps) {
  const Tag = header ? 'th' : 'td';
  
  return (
    <Tag 
      className={clsx(
        'p-3 text-left',
        {
          'font-semibold text-gray-700': header,
          'text-gray-600': !header
        },
        className
      )}
      colSpan={colSpan}
    >
      {children}
    </Tag>
  );
}