import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import chroma from 'chroma-js';

const PaletteDisplay = ({ paletteList, setPaletteList }) => {
  const [editing, setEditing] = useState({ paletteIndex: null, colorIndex: null });


  /// edit color w/ input
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  const [editingPaletteIndex, setEditingPaletteIndex] = useState(null);

  // sets active color editing to show input
  const handleColorClick = (paletteIndex, colorIndex, event) => {
    event.stopPropagation(); // Prevent event bubbling
    const isSameColor = editing.paletteIndex === paletteIndex && editing.colorIndex === colorIndex;
    if (isSameColor) {
      // Delay hiding to allow for other events to be cancelled
      setTimeout(() => setEditing({ paletteIndex: null, colorIndex: null }), 10);
    } else {
      setEditing({ paletteIndex, colorIndex });
    }
  };

  // Handle color change
  const handleColorChange = (e, paletteIndex, colorIndex) => {
    const newPaletteList = [...paletteList];
    newPaletteList[paletteIndex].palette[colorIndex] = e.target.value;
    setPaletteList(newPaletteList);
  };

    // Clicking away to close the input
    useEffect(() => {
      const closeInput = () => setEditing({ paletteIndex: null, colorIndex: null });
      document.addEventListener('click', closeInput);
      return () => document.removeEventListener('click', closeInput);
    }, []);
  

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
  //   setEditingColorIndex(index); // Set the currently editing color's index
  //   // setCurrentColor(color); // color is already a hex string
  //   // setCurrentId(id);
  //   // setShowPicker(true);
  // };

  const handleChangeComplete = (color) => {
    updateColor(currentId, color.hex); // Use the hex value directly
  };

  // Close the picker when clicking outside of it
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (showPicker && pickerRef.current && !pickerRef.current.contains(event.target)) {
  //       setShowPicker(false);
  //     }
  //   };

  //   // Add when the picker is shown and remove when it is hidden
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [showPicker]); // Re-run when showPicker changes

  const deletePalette = (indexToDelete) => {
    // Create a new array excluding the palette at indexToDelete
    const newPaletteList = paletteList.filter((_, index) => index !== indexToDelete);
    setPaletteList(newPaletteList); // Update the state in the parent component
  };

  return (
    <div>
      {paletteList.map((item, paletteIndex) => (
        <div className='flex flex-row' key={paletteIndex}>
          {}
          {item.palette.map((color, colorIndex) => (
            <div className="relative flex flex-col m-3">
              <div
              key={colorIndex} 
              className='relative'
              style={{ backgroundColor: color, width: '50px', height: '50px', margin: '5px' }} 
              onClick={(e) => handleColorClick(paletteIndex, colorIndex, e)}
              > </div>
              <div className='flex flex-row justify-around'>
                <div 
                  onClick={() => deleteColor(paletteIndex, colorIndex)} 
                  className="cursor-pointer"
                  style={{ paddingLeft:"4px", width: '10px', height: '10px', fontSize: '12px' }}
                >🗑️</div>
              <div 
                onClick={() => {
                  const newColor = chroma(color).brighten().hex();
                  const newPalette = [...paletteList];
                  newPalette[paletteIndex].palette.splice(colorIndex + 1, 0, newColor);
                  setPaletteList(newPalette);
                }} 
                className="cursor-pointer"
                style={{ paddingLeft:"4px", width: '10px', height: '10px', fontSize: '12px' }}
              >🔆</div>
              <div 
                onClick={() => {
                  const newColor = chroma(color).darken().hex();
                  const newPalette = [...paletteList];
                  newPalette[paletteIndex].palette.splice(colorIndex + 1, 0, newColor);
                  setPaletteList(newPalette);
                }} 
                className="cursor-pointer"
                style={{ paddingLeft:"4px", width: '10px', height: '10px', fontSize: '12px' }}
              >🌒</div>
            </div>
            {editing.paletteIndex === paletteIndex && editing.colorIndex === colorIndex && (
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(e, paletteIndex, colorIndex)}
                  className="mt-2 w-[100px]"
                  autoFocus
                />
              )}
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