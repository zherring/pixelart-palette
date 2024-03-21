import React, { useState, useRef } from 'react';
  
const rawPalette = () => {
  const [indexStart, setIndexStart] = useState(0);
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
    return (
      <div>
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
  );
};


export default rawPalette;

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
