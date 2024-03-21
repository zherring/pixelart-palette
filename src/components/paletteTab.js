import React, { useState } from 'react';
import EditPalette from '@/components/editPalette.js';
import RawPalette from '@/components/rawPalette.js';

const PaletteList = (paletteListBlob) => {
  const [activeTab, setActiveTab] = useState('edit');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'edit':
        return <EditPalette />;
      case 'raw':
        return <RawPalette />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <>
      <h2>Saved Palettes</h2>
      <div>
        <button onClick={() => handleTabChange('edit')}>Edit</button>
        <button onClick={() => handleTabChange('raw')}>Raw</button>
      </div>
      {renderTabContent()}
    </>
  );
};

export default PaletteList;