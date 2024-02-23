import React, { useState, useEffect } from 'react';

function ColorModelSelector({ onModelChange }) {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      const response = await fetch('http://colormind.io/list/');
      const data = await response.json();
      setModels(data.result);
      setSelectedModel(data.result[0]); // Set the first model as the default selected
    };

    fetchModels();
  }, []);

  return (
    <select value={selectedModel} onChange={(e) => {
      setSelectedModel(e.target.value);
      onModelChange(e.target.value);
    }}>
      {models.map((model, index) => (
        <option key={index} value={model}>{model}</option>
      ))}
    </select>
  );
}

export default ColorModelSelector;