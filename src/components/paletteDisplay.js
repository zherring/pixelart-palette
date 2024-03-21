import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const PaletteDisplay = ({ paletteList, updateColor }) => {

  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('');
  const [currentId, setCurrentId] = useState(null);

  const handleColorClick = (color, id) => {
    setCurrentColor(color);
    setCurrentId(id);
    setShowPicker(true);
  };

  const handleChangeComplete = (color) => {
    updateColor(currentId, color.hex);
    setShowPicker(false);
  };

  return (
    <div>
      {paletteList.map((item, paletteIndex) => (
        <div className='flex flex-row' key={paletteIndex}>
          Day {paletteIndex}
          {item.palette.map((color, colorIndex) => (
            <div key={colorIndex} style={{ backgroundColor: `rgb(${color.join(',')})`, width: '50px', height: '50px', margin: '5px' }} onClick={() => handleColorClick(color, `${paletteIndex}-${colorIndex}`)}>
            </div>
          ))}
        </div>
      ))}
      {showPicker ? <SketchPicker color={currentColor} onChangeComplete={handleChangeComplete} /> : null}
    </div>
  );
};

export default PaletteDisplay;