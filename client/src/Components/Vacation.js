import React from 'react';
import '../Project&VacationPages/UserVacationPage.css'
import getLoggedUser from '../Providers/getLoggedUser';
import ButtonComponent from './ButtonComponent';

const SingleVacation = ({ startDate, endDate, user, status, vacation }) => {
    let loggedUser = getLoggedUser();

    const declineVacation = () => {
        fetch(`http://localhost:3000/admin/vacation/decline/${user.id}/${vacation.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        })
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
            })
            .catch(error => console.log(error.message));
    
}

const approveVacation = () => {
    fetch(`http://localhost:3000/admin/vacation/approve/${user.id}/${vacation.id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
        },
    })
        .then(result => {
            if (result.error) {
                throw new Error(result.message);
            }
        })
        .catch(error => console.log(error.message));

}




return (
    <div className='single-vacation'>

        <div className='user-holder-mini' style={{ border: 'none', justifySelf: 'center' }}>
            <img className='avatar' style={{ boxShadow: '0 0 0 1px #b8a5a5' }} alt='avatar' src={user.avatar} />
            <div className='employee-info' style={{ border: 'none' }}>
                <div className='side-text' style={{ marginBottom: '0.5vh', fontSize: '1em' }}>{user.fullName}</div>
                <div className='small-text' style={{ color: 'var(--muave)', margin: 0 }}>{user.rang}</div>
            </div>
        </div>

        <div className='separator'></div>

        <div style={{ padding: '3vh 3vh 3vh 1vh' }}>
            <span className='side-text marked'>From:</span><span className='side-text'>{startDate}</span>
            <span style={{ color: 'rgba(0, 0, 0, 0.1)', marginLeft: '1.5vw', fontSize: '1.2em' }}>►</span>
            <span className='side-text marked'>To:</span><span className='side-text'>{endDate}</span>
        </div>
        <div className='separator'></div>
        <div style={{ padding: '3vh 3vh 3vh 1vh' }} >
            <span style={{marginLeft: '1vw'}} className='side-text'>Status:</span><div className={`${status === 'Approved' ? 'approved' : 'unapproved'} side-text ${status === 'Pending' && 'pending'}`}>{status}</div>
        </div>
        {loggedUser.role === 'Admin' && status === 'Pending' &&
        <div>
            <ButtonComponent label='✔ APPROVE' style={{ marginTop: '1vh' }} onClick={approveVacation} />
            <ButtonComponent label='✖ DECLINE' style={{ marginTop: '1vh', marginBottom: '1vh' }} onClick={declineVacation} />
        </div>
        }
    </div>

);
    }

export default SingleVacation;