import React, { useState, useEffect } from 'react';

export default function TocToggle({ children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    // Reserved space is controlled where mounted (min-height on container)
  }, []);

  return (
    <div className="w-full" data-toc-toggle>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-800 text-base font-semibold shadow-sm hover:bg-slate-50 focus:outline-none focus:ring focus:ring-slate-300 transition"
        style={{ minWidth: 246 }}
      >
        <svg
          className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
        <span>Table of Contents</span>
      </button>

      <div
        data-toc-panel
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out`}
        style={{ maxHeight: open ? '1200px' : '0px' }}
      >
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-[13px] md:text-[14px] leading-6">
          {children}
        </div>
      </div>
    </div>
  );
}
