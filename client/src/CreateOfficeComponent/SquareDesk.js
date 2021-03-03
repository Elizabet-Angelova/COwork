import React, { useState } from 'react';
import './SquareDesk.css'

const SquareDesk = ({style, user, className, userDetails}) => {
    const [show, setShow] = useState(false)
    return ( 
        <div className={`desk-container`}  onMouseOut={() => setShow(false)} style={style}>
           <span className={`sth ${className} desk-details`} onMouseOver={() => setShow(true)}><span className={`${show ? 'small' : ''}`}>{show ? userDetails : user}</span><span style={{color: 'transparent'}}>.</span></span>            
        </div>
     );
}
 
export default SquareDesk;