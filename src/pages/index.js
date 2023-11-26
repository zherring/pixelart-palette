import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import ExampleArt from '../components/ExampleArt';
 

const Home = () => {
  const [colors, setColors] = useState([]);
  const [paletteList, setPaletteList] = useState([]);
  const [indexStart, setIndexStart] = useState(0);

  const rgbaToCss = (rgba) => `rgba(${rgba.join(',')})`;

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
      model: "default",
      // input: [[44, 43, 44], [90, 83, 82], "N", "N", "N"]
    }
      // pull
      axios.post('/api/colormind', data)
        .then(response => {
          setColors(response.data.result);
        })
        .catch(error => {
          console.error('Error fetching color palette:', error);
        });
  }, []); 

  const transferColors = () => {
    setPaletteList([...paletteList, { theme: "null", palette: colors }]);
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
              <div key={index} style={{ backgroundColor: `rgb(${color.join(',')})`, height: '50px', width: '50px' }} />
            ))}
          </div>
          <div>
            <h3>Palette Preview</h3>
            <ExampleArt
                backgroundColor={colors[0] ? rgbaToCss(colors[0]) : '#A1ADFF'} // First color for background
                color1={colors[1] ? rgbaToCss(colors[1]) : '#ff3118'} // Second color for SVG paths
                color2={colors[2] ? rgbaToCss(colors[2]) : '#c66300'} // Third color for SVG paths
                color3={colors[3] ? rgbaToCss(colors[3]) : '#ff945a'} // Default color or third color from the palette
                color4={colors[4] ? rgbaToCss(colors[4]) : '#DE5918'} // Default color or fourth color from the palette

            />

          </div>
        </div>
      <div className='w-3/5'>
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
                {`${index + indexStart}: { theme: ${item.theme ? `'${item.theme}'` : null}, palette: [${item.palette.map(rgb => `'#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}'`).join(', ')}] },`}
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

