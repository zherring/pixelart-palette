import React, { useState } from 'react';

const JsonModal = ({ isOpen, onClose, onSave }) => {
  const [inputData, setInputData] = useState('');

  const handleSave = () => {
    try {
      const parsedData = parseCustomFormat(inputData);
      onSave(parsedData);
      onClose();
    } catch (error) {
      alert('Invalid input data. Please ensure it is in the correct format.');
    }
  };

  const parseCustomFormat = (data) => {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
      const match = line.match(/^\d+:\s*\{\s*theme:\s*(null|'[^']*'),\s*palette:\s*\[([^\]]+)\]\s*\},?$/);
      if (!match) {
        throw new Error('Invalid format');
      }
      const theme = match[1] === 'null' ? null : match[1].replace(/'/g, '');
      const palette = match[2].split(',').map(color => color.trim().replace(/'/g, ''));
      return { theme, palette };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <h2 className="text-xl mb-4">Copy/Paste Data</h2>
        <textarea
          className="w-full h-40 p-2 border border-gray-300 rounded"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder={`Paste data here. Example:\n0: { theme: null, palette: ['#481d24', '#831525', '#b76a3b', '#cea83d', '#875c0f'] },`}
        />
        <div className="flex justify-end mt-4">
          <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default JsonModal;