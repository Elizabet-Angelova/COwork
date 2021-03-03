import React, { useState } from 'react';
import './Square.css'

const Square = ({position}) => {
    const [color, setColor] = useState(false)

    const change = () => {
        setColor(!color)
    }

    return ( 
        <div onClick={change} className={color ? 'change' : 'white'} style={{color: 'white', display: 'inline-block', width: '2.7em', height: '2em', borderRadius: '6px', boxShadow: '-2px 2px 2px rgba(0, 0, 0, 0.28)', marginRight: '0.5em',  marginBottom: '0.5em'}}>
          
        </div>
     );
}
 
export default Square;