import React from 'react';

const ColorSwatch = ({ color }) => {
  return (
    <div style={{ backgroundColor: color, height: '50px', width: '50px' }} />
  );
};

export default ColorSwatch;
