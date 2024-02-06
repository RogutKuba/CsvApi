'use client';
import { cn } from '@billing/ui/src';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const ContentHeader = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm sm:px-6 mx-64 my-4 rounded-xl border',
        className
      )}
    >
      {children}
    </div>
  );
};
