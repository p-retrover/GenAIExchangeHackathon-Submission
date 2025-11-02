import React, { useState } from "react";
import { motion } from "framer-motion";

const SlidingTabs = ({ tabs, children }) => {
  const [active, setActive] = useState(tabs[0].name);

  return (
    <div>
      <div className="relative flex space-x-4 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActive(tab.name)}
            className={`relative pb-2 text-sm font-medium transition ${
              active === tab.name ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            {tab.name}
            {active === tab.name && (
              <motion.div
                layoutId="indicator"
                className="absolute bottom-0 left-0 h-[2px] w-full bg-indigo-600"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="py-4">
        {children(active)}
      </div>
    </div>
  );
};

export default SlidingTabs;
