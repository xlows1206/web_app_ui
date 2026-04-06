import React from "react";

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SlidingTabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: any) => void;
  className?: string;
}

export default function SlidingTabs({
  tabs,
  activeTab,
  onChange,
  className = ""
}: SlidingTabsProps) {
  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const tabWidthPercent = 100 / tabs.length;

  return (
    <div className={`bg-black/5 p-[1px] rounded-full flex relative ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 relative z-10 flex items-center justify-center gap-1.5 text-[11px] font-black tracking-widest uppercase transition-all ${
            activeTab === tab.id ? "text-primary" : "text-primary/30 hover:text-primary/50"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}

      {/* Indicator Wrapper */}
      <div
        className="absolute top-0 bottom-0 left-0 transition-all duration-300 ease-out z-0"
        style={{
          width: `${tabWidthPercent}%`,
          transform: `translateX(${activeIndex * 100}%)`
        }}
      >
        <div className="absolute inset-[1px] bg-white rounded-full shadow-sm border border-white/60" />
      </div>
    </div>
  );
}
