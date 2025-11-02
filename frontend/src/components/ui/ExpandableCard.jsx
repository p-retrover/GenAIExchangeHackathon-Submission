import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Code, BarChart3, Palette } from "lucide-react";
import { Link } from "react-router-dom";

const getIconForCareer = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("developer") || lowerTitle.includes("engineer"))
    return <Code className="w-8 h-8 text-violet-400" />;
  if (lowerTitle.includes("analyst"))
    return <BarChart3 className="w-8 h-8 text-violet-400" />;
  if (lowerTitle.includes("designer"))
    return <Palette className="w-8 h-8 text-violet-400" />;
  return <BrainCircuit className="w-8 h-8 text-violet-400" />;
};

const ExpandableCard = ({ recommendation, handleGetRoadmap, loadingRoadmapFor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={`bg-slate-900/50 p-6 rounded-lg border border-slate-700 flex flex-col justify-between transform transition-all duration-300 cursor-pointer
        ${isExpanded ? "col-span-full" : "hover:scale-105 hover:shadow-2xl hover:shadow-violet-900/50"}
      `}
      style={{ minHeight: isExpanded ? "auto" : "256px" }} // Adjust minHeight as needed
    >
      <motion.div layout="position">
        <div className="flex items-center space-x-4 mb-4">
          {getIconForCareer(recommendation.title)}
          <h3 className="text-xl font-bold text-white">{recommendation.title}</h3>
        </div>
        {!isExpanded && (
          <p className="text-slate-400 mt-2 text-sm line-clamp-3">{recommendation.fit_reason}</p>
        )}
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-slate-400 mt-4 text-sm">{recommendation.fit_reason}</p>
            <h4 className="font-semibold text-slate-200 mt-4">Pros:</h4>
            <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 mt-1">
              {recommendation.pros.map((pro, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {pro}
                </motion.li>
              ))}
            </ul>
            <h4 className="font-semibold text-slate-200 mt-4">Cons:</h4>
            <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 mt-1">
              {recommendation.cons.map((con, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {con}
                </motion.li>
              ))}
            </ul>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleGetRoadmap(recommendation.title);
              }}
              disabled={loadingRoadmapFor !== null}
              className="mt-6 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loadingRoadmapFor === recommendation.title ? "Generating..." : "Get Roadmap"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExpandableCard;
