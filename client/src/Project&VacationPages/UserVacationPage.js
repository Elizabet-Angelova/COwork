import React, { useEffect, useReducer, useState } from 'react';
import './UserVacationPage.css'
import ButtonComponent from '../Components/ButtonComponent'
import getLoggedUser from '../Providers/getLoggedUser';
import SingleVacation from '../Components/Vacation';

const UserVacationComponent = () => {
    const userId = getLoggedUser().id;
    const loggedUser = getLoggedUser();
    const [allUserVacations, setAllUserVacations] = useState([])
    const [allVacations, setAllVacations] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [user, setUser] = useState({})
    useEffect(() => {
        
        fetch(`http://localhost:3000/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
                .then(result => {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    
                    setUser(result);
                })
                .catch(error => console.log(error.message))
    },[])

    useEffect(() => {
        //get allVacation
        if (loggedUser.role === 'Admin') {
            fetch(`http://localhost:3000/vacation`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
                .then(result => {
                    if (result.error) {
                        throw new Error(result.message);
                    }

                    setAllVacations(result.reverse());
                })
                .catch(error => console.log(error.message))
        };
    }, [loggedUser, allVacations])


    useEffect(() => {
        fetch(`http://localhost:3000/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
                .then(result => {
                    if (result.error) {
                        throw new Error(result.message);
                    }

                    setUser(result);
                })
                .catch(error => console.log(error.message))

        fetch(`http://localhost:3000/vacation/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            }
        }).then(result => result.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }

                setAllUserVacations(result.reverse());
            })
            .catch(error => console.log(error.message))

    }, [userId, allUserVacations])

    const requestVacation = () => {
        const startDateArr = startDate.toString();
        const endDateArr = endDate.toString();

        const requestVacationDTO = {
            startDate: startDateArr,
            endDate: endDateArr,
            user: user,
        }
        fetch(`http://localhost:3000/vacation`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestVacationDTO),

        })
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }

            })
            .catch(error => console.log(error.message));
    }

    return (
        <div className='content'>
            {loggedUser.role === 'Basic'
                ? <>
                    <div className='request-vacation-container'>
                        <label className='side-text' style={{ display: 'inline-block', fontSize: '0.77em' }}>Start date
            <input value={startDate} onChange={(ev) => setStartDate(ev.target.value)} className='date-input' style={{ display: 'block' }} type='date' />
                        </label>

                        <label className='side-text' style={{ display: 'inline-block', fontSize: '0.77em' }}>End date
            <input value={endDate} onChange={(ev) => setEndDate(ev.target.value)} className='date-input' style={{ display: 'block' }} type='date' />
                        </label>

                        <ButtonComponent style={{ display: 'inline-block', marginLeft: '2vw' }} label='Request vacation' onClick={requestVacation} />
                    </div>
                    <div className='vacations-container'>
                        {allUserVacations !== [] &&
                            allUserVacations.map(vacation => {
                                return <SingleVacation key={vacation.id} vacation={vacation} startDate={vacation.startDate} endDate={vacation.endDate} status={vacation.status === 2 ? 'Pending' : vacation.status === 1 ? 'Approved' : 'Unapproved'} user={user} />
                            })
                        }

                    </div>
                </>

                : <>
                    <div style={{borderTop: '1px solid rgb(0, 0, 0, 0.1)'}}>
                        {allVacations !== [] &&
                            allVacations.map(vacation => {
                                return <SingleVacation key={vacation.id} vacation={vacation} startDate={vacation.startDate} endDate={vacation.endDate} status={vacation.status === 2 ? 'Pending' : vacation.status === 1 ? 'Approved' : 'Unapproved'} user={vacation.user} />
                            })
                        }
                    </div>

                </>
            }
        </div>
    );
}

export default UserVacationComponent;