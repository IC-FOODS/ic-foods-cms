import React from 'react';

const Conferences: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Simple title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-aggie-blue">Conferences</h1>
      </div>

      {/* Iframed Squarespace page - container to crop footer */}
      <div className="flex-grow relative" style={{ height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
        <iframe
          title="IC-FOODS Conferences"
          src="https://mateolan-ic-foods1.squarespace.com/confoverview"
          className="w-full"
          style={{ 
            border: 'none', 
            height: 'calc(100% + 150px)',
            marginBottom: '-150px',
            display: 'block'
          }}
          scrolling="auto"
        />
      </div>
    </div>
  );
};

export default Conferences;

