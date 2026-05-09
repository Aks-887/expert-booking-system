import React from 'react';

const BBGlitchButton = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bb-press relative overflow-hidden group ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <span className="absolute top-[-40%] left-[-20%] w-[140%] h-[80%] bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 blur-xl rotate-6" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ mixBlendMode: 'screen' }}
      >
        <span className="absolute -left-10 top-1/2 w-[60%] h-[2px] bg-white/30 rotate-12" />
        <span className="absolute -left-10 top-1/2 w-[60%] h-[2px] bg-white/20 -rotate-12" />
      </span>
    </button>
  );
};

export default BBGlitchButton;

