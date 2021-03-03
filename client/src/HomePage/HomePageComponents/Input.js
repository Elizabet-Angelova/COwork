import React from 'react';
import './Input.css'

const Input = ({className, value, onBlur, style,labelStyle,  placeholder, label, type, onChange}) => {
    return ( 
        <label className={`form-input-label `} style={labelStyle}>{label}
        <input value={value} onBlur={onBlur} onChange={onChange} className={`form-input ${className}`} style={style} placeholder={placeholder} type={type}/>
        </label>
     );
}
 
export default Input;