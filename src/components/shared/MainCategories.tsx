import { cn } from '@/libs';
import React from 'react';

interface Props {
  className?: string
}

export const MainCategories: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(["flex gap-8 items-center justify-center mt-5"], className)}>
      <h3 className="text-2xl underline">Популярное</h3>
      <h3 className="text-2xl">Свечи</h3>
      <h3 className="text-2xl">Аромасаше</h3>
      <h3 className="text-2xl">Аромадиффузоры</h3>
    </div>
  );
};