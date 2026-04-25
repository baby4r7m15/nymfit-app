import React from 'react';

export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div>
        {eyebrow && (
          <div className="text-[11px] tracking-[0.25em] uppercase text-primary/80 mb-3">
            {eyebrow}
          </div>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-3 max-w-xl text-[15px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}