import React, { useState, useEffect, useContext } from 'react';
import './HomePage.css'
import FormLogIn from './HomePageComponents/FormLogIn/FormLogIn';
import FormSignIn from './HomePageComponents/FormSignIn';

const HomePage = ({location, history}) => {
     const [form, setForm] = useState('')
     useEffect(() => {
          location.pathname.includes('login') ? setForm('login') : setForm('signin')
     }, [location])
     
     const navigateForm = () => {
          form === 'login' ?  history.push('/signin') : history.push('/login')
         
      }


     return (
          <div className='main-container' style={{overflowY: 'scroll'}}>
               <div className='top-section'>
                    <img src='/logo.png' alt='logo' className='logo' />
                    {/* <span className='home-nav-item'>ABOUT</span> */}
                    <span className='home-nav-item ' onClick={() => history.push('/office')}>VIRTUAL OFFICE</span>
                    <span onClick={navigateForm} className='home-nav-item home-nav-item2'> {form === 'login' 
                    ? 'SIGN UP'
                    : 'LOG IN'
                    }</span>
               </div>
               <div className='content-home'>
                    <div className='website-title'>COwork</div>
                    <div className='website-slogan'>Safe and happy at the office.</div>
                    {form === 'login' 
                    ? <FormLogIn className='form-login'/> 
                    : <FormSignIn className='form-signin'/>
                    }
                    <img className='plant' src='/plant.png' alt='plant'/>
               </div>


          </div>
     );
}

export default HomePage;