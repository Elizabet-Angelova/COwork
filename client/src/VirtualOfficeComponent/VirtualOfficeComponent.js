import React, { useEffect, useState } from 'react';
import './VirtualOfficeComponent.css'
import SquareDesk from '../CreateOfficeComponent/SquareDesk';
import SquareNoDesk from '../CreateOfficeComponent/SquareNoDesk';
import getLoggedUser from '../Providers/getLoggedUser';
import { withRouter } from 'react-router-dom'

const VirtualOfficeComponent = ({ legend, history }) => {
    const [office, setOffice] = useState('')
    const [officeCapacity, setOfficeCapacity] = useState(0)
    const [offices, setOffices] = useState()
    const [officeToShow, setOfficeToShow] = useState({})
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [availableDesks, setAvailableDesks] = useState(0)

    let user = getLoggedUser()


    useEffect(() => {
        if (!user) {
            fetch(`http://localhost:3000/office`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(response => {
                    if (response.error) {
                        throw new Error(response.message)
                    } else {
                        setOffices(response)
                        setOffice(response[0].country)
                    }
                })
                .catch(error => history.push('/error'))
        } else {

            fetch(`http://localhost:3000/users/office/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(response => {
                    if (response.error) {
                        throw new Error(response.message)
                    } else {
                        setOffice(response.country)
                    }
                })
                .catch(error => history.push('/error'))
        }
    }, [])


    useEffect(() => {
        if (office !== '') {
            fetch(`http://localhost:3000/office/${office}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(response => {
                    if (response.error) {
                        throw new Error(response.message)
                    } else {
                        setOfficeToShow(response[0])
                    }
                })
                .catch(error => history.push('/error'))


            fetch(`http://localhost:3000/office`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(response => {
                    if (response.error) {
                        throw new Error(response.message)
                    } else {
                        setOffices(response)
                    }
                })
                .catch(error => history.push('/error'))

            fetch(`http://localhost:3000/office/capacity/${office}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(response => {
                    if (response.error) {
                        throw new Error(response.message)
                    } else {
                        setOfficeCapacity(response)
                    }
                })
                .catch(error => history.push('/error'))

                fetch(`http://localhost:3000/office/desks/available/${office}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                }).then(response => response.json())
                    .then(response => {
                        if (response.error) {
                            throw new Error(response.message)
                        } else {
                            setAvailableDesks(response)
                        }
                    })
                    .catch(error => history.push('/error'))
        }
    }, [office])



    return (
        <>
            <div className='content'>
                <div className={`header-office ${legend ? legend : 'flex'}`}>
                    <label style={{ display: 'inline-block', marginRight: '2vw' }}> <span className='side-text' style={{ fontSize: '0.7em', marginLeft: '0.3vw' }}>Office</span>
                        <div className='dropdown-size'>
                            <div className='dropdown' onClick={() => setDropdownVisible(!dropdownVisible)} >
                                <span className='side-text' style={{ fontSize: '0.73em' }}>{office}</span>
                                <span className='side-text chevron'>▼</span>
                            </div>
                            {dropdownVisible &&
                                <div className='dropdown-window' onMouseLeave={() => setDropdownVisible(!dropdownVisible)}>
                                    {offices.map(office => {
                                        return <div key={office.id} onClick={() => setOffice(office.country)} className='dropdown-text side-text'>{office.country}</div>
                                    })}
                                </div>}
                        </div>
                    </label>

                    <label style={{ display: 'inline-block', marginRight: '2vw' }}> <span className='side-text' style={{ fontSize: '0.7em', marginLeft: '0.3vw' }}>Available desks</span>
                        <div className='dropdown-size'>
                            <div className='dropdown' >
                                <span className='side-text' style={{ fontSize: '0.73em' }}>{availableDesks}</span>
                            </div>
                        </div>
                    </label>
                    <label style={{ display: 'inline-block', marginRight: '2vw' }}> <span className='side-text' style={{ fontSize: '0.7em', marginLeft: '0.3vw' }}>Capacity</span>
                        <div className='dropdown-size'>
                            <div className='dropdown' >
                                <span className='side-text' style={{ fontSize: '0.73em' }}>{typeof (officeCapacity) === 'number' ? officeCapacity : ''}</span>
                            </div>
                        </div>
                    </label>


                    <div className='marginAuto' style={legend ? { display: 'block', marginTop: '2vh' } : { display: 'inline-block', alignSelf: 'center' }}>
                        <span className='small-text' style={{ color: 'var(--dark)', marginRight: '0.8em' }}><span style={{ fontSize: '1.9em', marginRight: '0.2em', color: 'rgb(242, 184, 167)' }}>■</span>Forbidden</span>
                        <span className='small-text' style={{ color: 'var(--dark)', marginRight: '0.8em' }}><span style={{ fontSize: '1.9em', marginRight: '0.2em', color: 'rgb(205, 232, 176)' }}>■</span>Available</span>
                        <span className='small-text' style={{ color: 'var(--dark)', marginRight: '0.8em' }}><span style={{ fontSize: '1.9em', marginRight: '0.2em', color: 'rgb(255, 240, 147)' }}>■</span>Taken</span>
                    </div>
                </div>
                <div className='office-container' style={{ margin: '4vh' }}>
                    {officeToShow && officeToShow.rows
                        ? officeToShow.rows.map(row => {
                            return <div key={row.id}> {row.squares.map(square => {
                                return square.isDesk ? <SquareDesk key={square.id} style={
                                    square.forbidden ? { background: 'rgb(242, 184, 167)' } : { background: 'rgb(205, 232, 176)' }} className={square.user ? 'occupied' : ''}
                                    user={square.user ? `${square.user.fullName.split(' ')[0][0].toUpperCase()}${square.user.fullName.split(' ')[1][0].toUpperCase()}` : ''}
                                    userDetails={square.user ? `${square.user.fullName}` : ''} />
                                    : <SquareNoDesk key={square.id} />
                            })} </div>
                        })
                        : ''}
                </div>
            </div>
        </>
    );
}

export default withRouter(VirtualOfficeComponent);