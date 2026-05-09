import React, { useEffect, useState } from 'react';

/**
 * Lightweight page transition wrapper.
 * - Adds bb-reload animation on mount.
 * - Optionally staggers children when you pass `stagger`.
 */
const BBTransition = ({ children, stagger = false, className = '' }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Next frame so mount animation consistently triggers.
    const t = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`${className} ${ready ? 'bb-reload' : ''}`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className={stagger ? 'bb-stagger' : ''}>{children}</div>
    </div>
  );
};

export default BBTransition;

