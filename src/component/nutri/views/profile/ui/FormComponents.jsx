import React from 'react';

export const CheckboxGroup = ({ label, options, values, onChange }) => (
  <div className="mb-4">
    <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase block">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label key={opt} className={`inline-flex items-center px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${values.includes(opt) ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-400' : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-300 hover:bg-gray-100'}`}>
          <input
            type="checkbox"
            className="hidden"
            checked={values.includes(opt)}
            onChange={(e) => {
              const newValues = e.target.checked
                ? [...values, opt]
                : values.filter(v => v !== opt);
              onChange(newValues);
            }}
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export const InputGroup = ({ label, type = "text", value, onChange, placeholder, suffix, options, name, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase">{label}</label>
    <div className="relative">
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 appearance-none"
        >
          <option value="">Seleccione...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5"
        />
      )}
      {suffix && (
        <span className="absolute right-3 top-2.5 text-gray-400 text-sm pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);