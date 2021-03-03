import React from 'react';
import './Report.css'

const Report = ({office, desks, employees, today, week, available, occupied, style}) => {
 



    return ( 
        <div className='report-container' style={style}>
            <div className='side-text report-item'>{office}</div>
            <div className='side-text report-item'>{desks}</div>
            <div className='side-text report-item'>{employees}</div>
            <div className='side-text report-item'>{today}</div>
            <div className='side-text report-item'>{week}</div>
            <div className='side-text report-item' >{available}</div>
            <div className='side-text report-item' style={{border: 'none'}}>{occupied}</div>


        </div>
     );
}
 
export default Report;