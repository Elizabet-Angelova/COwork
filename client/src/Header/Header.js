import React, { useEffect, useState } from 'react';
import './Header.css'
import { NavLink, withRouter } from "react-router-dom";
import getLoggedUser from '../Providers/getLoggedUser';

const Header = ({ history, location }) => {
    const [showMenu, setShowMenu] = useState(false)
    const [user, setUser] = useState({})
    const [userName, setUserName] = useState('')
    const loggedUser = getLoggedUser()
    let userID = getLoggedUser().id

    const logout = () => {
        localStorage.clear()
        history.push('/login')
    }

    useEffect(() => {
        fetch(`http://localhost:3000/users/${userID}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                setUser(result)
                setUserName(result.fullName.split(' ')[0].toUpperCase())

            })
            .catch(er => history.push('/error'))
    }, [userID])


    return (
        <>
            <div className='header-container'>

                <span className='sandwich' style={{ zIndex: '10', color: `${showMenu ? 'var(--lightest)' : 'var(--dark)'}`, fontSize: '1.8em', margin: '0em 0em 0em 0.3em' }}>
                    <i onClick={() => setShowMenu(!showMenu)} className="fas fa-bars"></i>
                </span>

                <div className='marginAuto2' style={{ display: 'flex' }}>
                    {loggedUser.role === 'Admin' &&
                    <>
                        <div className='log-out' onClick={() => history.push('/create')}>ADD OFFICE</div>
                    <div className='log-out'>|</div>
                    </>}
                    <div className='log-out' onClick={logout}>LOG OUT</div>
                </div>
            </div>

            {showMenu &&
                <div className='menu-container2'>
                    <div style={{ display: 'grid', alignItems: 'center', gridGap: '1em', gridAutoFlow: 'column', marginTop: '3em', marginLeft: '0.1em', width: 'fit-content', paddingBottom: '1em' }}>
                        <img className='avatar' style={{ zoom: '1.3' }} alt='avatar' src={user.avatar} />
                        <div className='name-text'>{userName}</div>
                        <div className='active-dot'>•</div>
                    </div>
                    <NavLink style={{ textDecoration: 'none' }} exact to="/home"><div className={`menu-item ${location.pathname.includes('/home') ? 'active' : ''}`} >VIRTUAL OFFICE</div></NavLink>
                    <NavLink style={{ textDecoration: 'none' }} exact to="/pvl"><div className={`menu-item ${location.pathname.includes('/pvl') ? 'active' : ''}`}>PVL / VL</div></NavLink>
                    <div className='menu-item' style={{ borderBottom: '0.2vh solid var(--muave)' }}>MANAGE OFFICES</div>
                    <NavLink style={{ textDecoration: 'none' }} exact to="/projects"><div className={`menu-item ${location.pathname.includes('/projects') ? 'active' : ''}`}>MANAGE PROJECTS</div></NavLink>
                    <div className='menu-item'>REPORTS</div>


                </div>}
        </>
    );
}

export default withRouter(Header);