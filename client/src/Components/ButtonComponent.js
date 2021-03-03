import React from 'react';  
import './ButtonComponent.css'

const ButtonComponent = ({label, style, onClick}) => {
    return (
    <div className='button1' onClick={onClick} style={style}>{label}</div>
      );
}
 
export default ButtonComponent;