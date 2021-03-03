import React, { useContext, useEffect, useState } from 'react';
import './MenuComponent.css'
import TodaysRatesComponent from './TodaysRatesComponent/TodaysRatesComponent';
import LoadingContext from '../Providers/loadingContext';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import getLoggedUser from '../Providers/getLoggedUser';

const MenuComponent = ({ location, history }) => {
    const { loading, setLoading } = useContext(LoadingContext)
    const [user, setUser] = useState({})
    const [userName, setUserName] = useState('')



    let userID = getLoggedUser().id
    let logged = getLoggedUser();

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
            {!loading &&
                <div className='avatar-name-holder'>
                    <img className='avatar' alt='avatar' src={user.avatar} />
                    <div className='name-text'>{userName}</div>
                    <div className='active-dot'>•</div>
                </div>
            }
            <div className='menu-container'>
                <TodaysRatesComponent />
                <NavLink style={{ textDecoration: 'none' }} exact to="/home"><div className={`menu-item ${location.pathname.includes('/home') ? 'active' : ''}`} >VIRTUAL OFFICE</div></NavLink>
                <NavLink style={{ textDecoration: 'none' }} exact to="/reports"><div className={`menu-item ${location.pathname.includes('/reports') ? 'active' : ''}`}>REPORTS</div></NavLink>
                {logged.role === 'Admin' && <NavLink style={{ textDecoration: 'none' }} exact to="/projects"><div className={`menu-item ${location.pathname.includes('/projects') ? 'active' : ''}`}>MANAGE PROJECTS</div></NavLink>}
                {logged.role === 'Admin' && <NavLink style={{ textDecoration: 'none' }} exact to="/employees"><div className={`menu-item ${location.pathname.includes('/employees') ? 'active' : ''}`} >EMPLOYEES</div></NavLink>}
                <NavLink style={{ textDecoration: 'none' }} exact to="/pvl"><div style={{ borderBottom: '0.2vh solid var(--muave)' }} className={`menu-item ${location.pathname.includes('/pvl') ? 'active' : ''}`}>VACATIONS</div></NavLink>



            </div>


        </>
    );
}

export default withRouter(MenuComponent);