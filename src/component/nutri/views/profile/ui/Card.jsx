import React from 'react';

const Card = ({ children, title, icon: Icon, className = "" }) => (
  <div className={`bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mb-6 ${className}`}>
    {title && (
      <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
        {Icon && <Icon size={20} className="text-teal-600" />}
        <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Card;