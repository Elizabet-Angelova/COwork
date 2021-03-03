import React from 'react';
import ButtonComponent from '../Components/ButtonComponent';

const Employee = ({ avatar, userName, projectName, worksFrom, title, style, office, isOnVacation, id }) => {

    const deleteUser = (id) => {
        fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.error) {
                    throw new Error(response.message)
                } 
            })
            .catch(error => alert(error))
    }

    return (
        <div className='single-employee-container' style={style}>
            {title ? <div className='side-text report-item2'>{title}</div> :
                <div style={{ display: 'flex', flexDirection: 'row', borderRight: '1px solid var(--dark)' }}>
                    <img className='avatar' style={{ alignSelf: 'center' }} alt='avatar' src={avatar} />
                    <div className='side-text' style={{ alignSelf: 'center', marginLeft: '1vw' }}>{userName}</div>
                </div>}
            <div className='side-text report-item2' style={{ alignSelf: 'center' }} >{projectName ? projectName : 'Unassigned'}</div>
            <div className='side-text report-item2' style={{ alignSelf: 'center' }} >{office}</div>
            {isOnVacation ?
                <div className='side-text report-item2' style={{ alignSelf: 'center', textAlign: 'center'}} ><span className={`pending1`}>{'On vacation'}</span></div>
                : <div className='side-text report-item2' style={{ alignSelf: 'center', textAlign: 'center'}} ><span className={`${!title ? worksFrom ? (worksFrom === 1 ? 'home' : 'office') : 'unapproved1' : ''}`}>{!title ? worksFrom ? (worksFrom === 1 ? 'Home' : 'Office') : 'Unassigned' : 'Works from'}</span></div>
            }
            {!title && <ButtonComponent onClick={() => deleteUser(id)} style={{ margin: '1.5vh 0vh 0vh 2vh', padding: '0.6vh' }} label='✖ DELETE' />}

        </div>
    );
}

export default Employee;