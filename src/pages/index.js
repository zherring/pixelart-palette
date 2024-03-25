import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import ExampleArt from '../components/ExampleArt';
// import ColorModelSelector from '@/components/colorModelSelector';
// import PaletteTab from '@/components/paletteTab';
import PaletteDisplay from '@/components/paletteDisplay'; 
import { rgbArrayToHex } from '../utils/colorUtils';


const Home = () => {
  const [colors, setColors] = useState([]);
  const [paletteList, setPaletteList] = useState([]);
  const [indexStart, setIndexStart] = useState(0);
  const [model, setModel] = useState('default');

  const rgbaToCss = (rgba) => `rgba(${rgba.join(',')})`;

  const updateColor = (id, newColor) => {
    const [paletteIndex, colorIndex] = id.split('-').map(Number);
    const newPaletteList = [...paletteList];
    newPaletteList[paletteIndex].palette[colorIndex] = newColor;
    setPaletteList(newPaletteList);
  };
  
  // dynamic index set
  const handleIndexChange = (event) => {
    setIndexStart(Number(event.target.value));
  };

  // copy button
  const jsonRef = useRef(null);
  const copyToClipboard = () => {
    const text = jsonRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      // Notify the user that the text has been copied
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  };

  const fetchPalette = useCallback(() => {
    const data = {
      model: model
    }
      // pull
      axios.post('/api/colormind', data)
      .then(response => {
        const hexColors = response.data.result.map(rgbArray => rgbArrayToHex(rgbArray));
        setColors(hexColors); // Assuming setColors updates state with hex color values
      })
      .catch(error => {
        console.error('Error fetching color palette:', error);
      });
  }, [model]);

  const transferColors = () => {
    setPaletteList([...paletteList, { theme: null, palette: colors }]);
  };

  // hotkeys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        fetchPalette();
      } else if (event.shiftKey && event.code === 'KeyS') {
        transferColors();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fetchPalette, copyToClipboard]);

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='md:flex md:flex-row flex-wrap justify-around'>
        <div className='w-2/5'>
          <h2>Generate Palette</h2>
          {/* <ColorModelSelector onModelChange={setModel} /> */}
          <div id="controls" className='flex flex-row justify-between'>
            <div className='flex flex-col'>
              <button onClick={fetchPalette}>Generate</button>
              <small>Spacebar</small>
            </div>
            <div className='flex flex-col align-center'>
              <button onClick={transferColors}>Save Palette</button>
              <small>Shift + S</small>
            </div>

          </div>
          <div className='flex flex-row'>
            {colors.map((color, index) => (
              <div key={index} style={{ backgroundColor: color, height: '50px', width: '50px' }} />
            ))}
          </div>
          <div>
            <h3>Palette Preview</h3>
            <ExampleArt
                backgroundColor={colors[0] ? colors[0] : '#A1ADFF'} // First color for background
                color1={colors[1] ? colors[1] : '#ff3118'} // Second color for SVG paths
                color2={colors[2] ? colors[2] : '#c66300'} // Third color for SVG paths
                color3={colors[3] ? colors[3] : '#ff945a'} // Default color or third color from the palette
                color4={colors[4] ? colors[4] : '#DE5918'} // Default color or fourth color from the palette

            />

          </div>
        </div>
      <div className='w-3/5 h-screen overflow-y-auto'>
      <PaletteDisplay paletteList={paletteList} updateColor={updateColor} setPaletteList={setPaletteList} />

        <h2>JSON Output</h2>
        <p>Starting Row</p>
          <input
            className='border border-sky-500'
            type="number" 
            value={indexStart} 
            onChange={handleIndexChange} 
            placeholder="Enter a number"
          >
          </input>
        <button className="border border-sky-500" onClick={copyToClipboard}>Copy JSON</button>        
        <pre style={codeBlockStyles}>
          <code>
            <div ref={jsonRef}>
              {paletteList.map((item, index) => (
                <div key={index}>
                {`${index + indexStart}: { theme: ${item.theme ? `'${item.theme}'` : null}, palette: [${item.palette.map(rgb => `'${rgb}'`).join(', ')}] },`}
              </div>
              ))}
            </div>
          </code>
        </pre>

        </div>
        
      </div>
    </div>
  );
};

export default Home;

// Optional: Styles for the code block
const codeBlockStyles = {
  backgroundColor: "#1f1f1f", // Light gray background
  color: "#FFF",
  border: "1px solid #ddd",    // Light border for contrast
  padding: "10px",             // Some padding for spacing
  overflowX: "auto",           // Handle horizontal overflow
  whiteSpace: "pre-wrap",      // Wrapping for long lines
  wordBreak: "break-all",
  width: "100%",
  overflow: "scroll",

};

