import React from "react";

const SkillForgePage = () => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Mini Breadcrumb for context */}
      <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
        <span className="text-indigo-600">InterviewX</span>
        <span>/</span>
        <span>SkillForge Module</span>
      </div>

      {/* Embedded SkillForge in a native-looking card */}
      <div className="flex-1 bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-xl relative min-h-[600px]">
        <iframe
          src="http://localhost:3000"
          title="SkillForge"
          width="100%"
          height="100%"
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Connection Status Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Active Connection</span>
        </div>
      </div>
    </div>
  );
};

export default SkillForgePage;
