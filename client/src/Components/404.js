import React from 'react';
import './404.css'
import ButtonComponent from './ButtonComponent';

const NotFound = ({history}) => {
    return (
        <div className='main-container not-found-container'>
                <img className='fof-plant' src='/plant.png' alt='plant'/> 
            <div className='form-container'>
                <div className='website-title' style={{marginBottom: '3vh'}}>
                    404
                </div>
                <div className='website-slogan'>Ooops!</div>
                <div className='noHover'>Seems like we can't find the content you're looking for.</div>
                <ButtonComponent onClick={() => history.push('./home')} label='Home' style={{margin: 'auto', marginTop: '6vh', zoom: '1.3'}}/>
            </div>

        </div>);
}

export default NotFound;