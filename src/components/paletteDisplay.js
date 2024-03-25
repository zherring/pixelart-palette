import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';

const PaletteDisplay = ({ paletteList, updateColor, setPaletteList }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('');
  const pickerRef = useRef(); // Ref to the SketchPicker or its container
  const [currentId, setCurrentId] = useState(null);


  const deleteColor = (paletteIndex, colorIndex) => {
    // Create a new array with the specific color removed
    const newPaletteList = paletteList.map((item, index) => {
      if (index === paletteIndex) {
        return {
          ...item,
          palette: item.palette.filter((_, idx) => idx !== colorIndex),
        };
      }
      return item;
    });
    setPaletteList(newPaletteList);
  };

  // const handleColorClick = (color, id) => {
  //   setCurrentColor(color); // color is already a hex string
  //   setCurrentId(id);
  //   setShowPicker(true);
  // };

  const handleChangeComplete = (color) => {
    updateColor(currentId, color.hex); // Use the hex value directly
  };

  // Close the picker when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPicker && pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    // Add when the picker is shown and remove when it is hidden
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]); // Re-run when showPicker changes

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
            <div className="relative">
              <div
              key={colorIndex} 
              className='relative'
              style={{ backgroundColor: color, width: '50px', height: '50px', margin: '5px' }} 
              onClick={() => handleColorClick(color, `${paletteIndex}-${colorIndex}`)}
            >
              </div>
               <div 
                onClick={() => deleteColor(paletteIndex, colorIndex)} 
                className="cursor-pointer"
                style={{ paddingLeft:"4px", width: '10px', height: '10px', fontSize: '12px' }}
              >🗑️</div>
            </div>
          ))}
            <button onClick={() => deletePalette(paletteIndex)} className="cursoml-4 py-2 px-4 bg-red-500 text-white rounded">Delete</button>
        </div>
      ))}
        {/* <SketchPicker color={currentColor} disableAlpha={true} /> */}
      {/* {showPicker ? 
        <SketchPicker 
          color={currentColor} 
          onChangeComplete={handleChangeComplete} 
          disableAlpha={true} /> : null}  */}
    </div>
  );
};

export default PaletteDisplay;