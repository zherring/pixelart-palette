import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import chroma from 'chroma-js';

const PaletteDisplay = ({ paletteList, setPaletteList, onPreview, deletePalette }) => {
  const [editing, setEditing] = useState({ paletteIndex: null, colorIndex: null });

  // Handle color click
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
    newPaletteList[paletteIndex] = {
      ...newPaletteList[paletteIndex],
      palette: newPaletteList[paletteIndex].palette.map((color, idx) =>
        idx === colorIndex ? e.target.value : color
      ),
    };
    setPaletteList(newPaletteList);
  };

  // Clicking away to close the input
  useEffect(() => {
    const closeInput = () => setEditing({ paletteIndex: null, colorIndex: null });
    document.addEventListener('click', closeInput);
    return () => document.removeEventListener('click', closeInput);
  }, []);

  const deleteColor = (paletteIndex, colorIndex) => {
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

  return (
    <div>
      {paletteList.map((item, paletteIndex) => (
        <div className='flex flex-row' key={paletteIndex}>
          {item.palette.map((color, colorIndex) => (
            <div className="relative flex flex-col m-3" key={colorIndex}>
              <div
                className='relative'
                style={{ backgroundColor: color, width: '50px', height: '50px', margin: '5px' }} 
                onClick={(e) => handleColorClick(paletteIndex, colorIndex, e)}
              ></div>
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
                    newPalette[paletteIndex] = {
                      ...newPalette[paletteIndex],
                      palette: [
                        ...newPalette[paletteIndex].palette.slice(0, colorIndex + 1),
                        newColor,
                        ...newPalette[paletteIndex].palette.slice(colorIndex + 1),
                      ],
                    };
                    setPaletteList(newPalette);
                  }} 
                  className="cursor-pointer"
                  style={{ paddingLeft:"4px", width: '10px', height: '10px', fontSize: '12px' }}
                >🔆</div>
                <div 
                  onClick={() => {
                    const newColor = chroma(color).darken().hex();
                    const newPalette = [...paletteList];
                    newPalette[paletteIndex] = {
                      ...newPalette[paletteIndex],
                      palette: [
                        ...newPalette[paletteIndex].palette.slice(0, colorIndex + 1),
                        newColor,
                        ...newPalette[paletteIndex].palette.slice(colorIndex + 1),
                      ],
                    };
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
          <button onClick={() => deletePalette(paletteIndex)} className="ml-4 py-2 px-4 bg-red-500 text-white rounded">Delete</button>
          <button onClick={() => onPreview(item.palette)} className="ml-4 py-2 px-4 bg-blue-500 text-white rounded">Preview</button>
        </div>
      ))}
    </div>
  );
};

export default PaletteDisplay;