import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`py-2 px-4 text-sm font-medium transition-colors duration-300 ${activeTab === tab.name ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {tabs.map((tab) =>
          activeTab === tab.name ? (
            <motion.div
              key={tab.name}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              {tab.content}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileTabs;
