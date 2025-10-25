import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-8 h-8 bg-slate-700 rounded-md"></div>
        <div className="h-6 bg-slate-700 rounded w-3/4"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-full mt-4"></div>
        <div className="h-4 bg-slate-700 rounded w-4/6"></div>
      </div>
      <div className="mt-6 w-full h-10 bg-slate-700 rounded-lg"></div>
    </div>
  );
};

export default SkeletonCard;