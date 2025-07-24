import { ReactNode } from 'react';

export default function Table({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full text-left">{children}</table>
    </div>
  );
}