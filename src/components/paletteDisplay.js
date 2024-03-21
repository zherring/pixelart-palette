import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const PaletteDisplay = ({ paletteList, updateColor, setPaletteList }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('');
  const [currentId, setCurrentId] = useState(null);

  const handleColorClick = (color, id) => {
    setCurrentColor(color); // color is already a hex string
    setCurrentId(id);
    setShowPicker(true);
  };

  const handleChangeComplete = (color) => {
    updateColor(currentId, color.hex); // Use the hex value directly
    setShowPicker(false);
  };

  const deletePalette = (indexToDelete) => {
    // Create a new array excluding the palette at indexToDelete
    const newPaletteList = paletteList.filter((_, index) => index !== indexToDelete);
    setPaletteList(newPaletteList); // Update the state in the parent component
  };

  return (
    <div>
      {paletteList.map((item, paletteIndex) => (
        <div className='flex flex-row' key={paletteIndex}>
          {item.palette.map((color, colorIndex) => (
            <div 
              key={colorIndex} 
              style={{ backgroundColor: color, width: '50px', height: '50px', margin: '5px' }} 
              onClick={() => handleColorClick(color, `${paletteIndex}-${colorIndex}`)}
            >
            </div>
          ))}
            <button onClick={() => deletePalette(paletteIndex)} className="ml-4 py-2 px-4 bg-red-500 text-white rounded">Delete Palette</button>
        </div>
      ))}
      {showPicker ? <SketchPicker color={currentColor} onChangeComplete={handleChangeComplete} /> : null}
      <button></button>
    </div>
  );
};

export default PaletteDisplay;