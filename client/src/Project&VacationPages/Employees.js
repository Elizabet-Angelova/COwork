import React, { useEffect, useReducer, useState } from 'react';
import Employee from './Employee';

const Employees = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3000/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.message)
                } else {
                    setUsers(response)
                }
            })
            .catch(error => alert(error))
    }, [])

    return (
        <div className='content' >
            <div className='employees-container' style={{ borderTop: '1px solid var(--dark)' }}>
                <Employee style={{ background: 'rgba(63, 15, 63, 0.15)' }} office='Office' title='Employee' projectName='Project name' worskFrom='Works from' />
                {users !== [] &&
                    users.map((user, index) => {
                        return <Employee id ={user.id} style={{ background: `${index % 2 === 0 ? 'transparent' : 'rgba(63, 15, 63, 0.05)'}` }} isOnVacation={user.isOnVacation} key={user.id} office={user.office.country} avatar={user.avatar} userName={user.fullName} projectName={user.project ? user.project.name : undefined} worksFrom={user.project && user.project.worksFrom} />
                    })}
            </div>

        </div>
    );
}

export default Employees;