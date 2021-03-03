import React, { useState } from 'react';
import Input from '../Input';
import jwtDecode from 'jwt-decode'
import {withRouter} from 'react-router-dom'


const FormLogIn = ({className, history}) => {

    const [user, setUserObject] = useState({
        emailOrUsername: '',
        password: ''
    });


    const logIn = () => {

        fetch(`http://localhost:3000/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        })
            .then(r => r.json())
            .then(result => {
                if (result.error) {
                    return alert(result.message);
                }
                try {
                    const payload = jwtDecode(result.token);
                } catch (e) {
                    return alert(e.message);
                }
                localStorage.setItem('token', result.token);
                history.push('/home')
            })
            .catch((error) => console.log(error));
    }

    const updateUser = (prop, value) => {
        setUserObject({ ...user, [prop]: value });
    }

    const handleKeyPress = (event) => {
        if (event.charCode === 13) {
           logIn()
        }
    }

    return ( 
        <div className={`form-container ${className}`} onKeyPress={(ev) => handleKeyPress(ev)}>
            <div style={{textAlign: 'left'}}>
            <Input style={{borderRadius: '100px', marginBottom: '3vh'}}  label='Email / Username' value={user.emailOrUsername} onChange={(ev) => updateUser('emailOrUsername', ev.target.value)} labelStyle={{fontSize: '0.7em', color: 'var(--muave)'}}type='text' placeholder='Email / Username' />
            <Input style={{borderRadius: '100px'}}  label='Password' value={user.password} onChange={(ev) => updateUser('password', ev.target.value)} labelStyle={{fontSize: '0.7em', color: 'var(--muave)'}} type='password' placeholder='Password'/>
            </div>
            <div className='home-nav-item log-in-button'  onClick={() => logIn()} >LOG IN</div>
        </div>
     );
}
 
export default withRouter(FormLogIn);