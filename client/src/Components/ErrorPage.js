import React from 'react';
import './404.css'
import ButtonComponent from './ButtonComponent';

const ErrorPage = ({history}) => {
    return (
        <div className='main-container not-found-container'>
                <img className='fof-plant' style={{marginLeft: '11vw'}} src='/plant.png' alt='plant'/> 
            <div className='form-container'>
                <div className='website-slogan' style={{color: 'var(--dark)', fontSize: '7em', marginBottom: '4vh'}}>Ooops!</div>
                <div className='noHover' style={{marginBottom: '1vh', letterSpacing: '0.1em'}}>An error occurred!</div>
                <div className='noHover' style={{letterSpacing: '0.1em'}}>Try refreshing the page or reaching it later.</div>
                <ButtonComponent onClick={() => history.push('./home')} label='Home' style={{margin: 'auto', marginTop: '6vh', zoom: '1.3'}}/>
            </div>

        </div>);
}

export default ErrorPage;