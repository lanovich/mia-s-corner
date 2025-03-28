import React from 'react';

interface Props {
  className?: string
}

export const ProductInformationPanel: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}></div>
  );
};  