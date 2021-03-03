import React, { useReducer, useState } from 'react';
import './Dropdown.css'
import './ButtonComponent.js'
import ButtonComponent from './ButtonComponent.js';
import Input from '../HomePage/HomePageComponents/Input';

const Dropdown = ({ project, workforce }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [willDisappear, setWillDesappear] = useState(false)
    const [contentVisible, setContentVisible] = useState(false)
    const [dropdown2Visible, setDropdown2Visible] = useState(false)
    const [employeeName, setEmployeeName] = useState('')
    const [rang, setRang] = useState('')
    const [searchString, setSearchString] = useState('')
    const [resultDropdown, setResultDropdown] = useState(false)
    const [foundContent, setFoundContent] = useState('')

    const manageLiveSearch = (searchParam) => {
        setEmployeeName(searchParam)
        if (searchParam.length > 1) {
            fetch(`http://localhost:3000/users/name/${searchParam}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
                .then(result => {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    if (result.length !== 0) {
                        setFoundContent(result)
                        setResultDropdown(true)
                    } else {
                        setFoundContent('')
                    }
                })
                .catch(er => console.log(er.message))
        } else {
            setFoundContent('')
        }
    }



    const removeUser = (id, project) => {
        fetch(`http://localhost:3000/admin/project/${project}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        }).then(result => {
            if (result.error) {
                throw new Error(result.message);
            }
        })
            .catch(er => console.log(er.message))
    }

    const addEmployee = (projectID, id, rang) => {
        if (employeeName !== '' && rang !== '') {
            fetch(`http://localhost:3000/admin/project/${projectID}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    rang: rang,
                }),
            }).then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                setEmployeeName('')
                setRang('')
            })
                .catch(er => console.log(er.message))
        } else {
            return;
        }
    }


    const manage = () => {
        if (!dropdownVisible) {
            setDropdownVisible(!dropdownVisible)
            setWillDesappear(false)
            setTimeout(() => {
                setContentVisible(true)

            }, 400)

        } else {
            setWillDesappear(true)
            setContentVisible(false)
            setTimeout(() => {
                setDropdownVisible(!dropdownVisible)

            }, 550)
            if (dropdown2Visible) {
                setDropdown2Visible(!dropdown2Visible)
            }
        }
    }


    return (
        <div style={{ width: '100%', marginTop: '0.7vh' }} >
            <div className='dropdown dropdown-projects' onClick={manage} >
                <span className='side-text' > {project.name} </span>
                <span className='side-text chevron' >▼</span>
            </div>
            {dropdownVisible &&
                <div className={`dropdown-window-projects ${willDisappear ? 'hide' : 'show'} ${dropdown2Visible ? 'fit' : ''}`} >
                    <div className={`${contentVisible ? 'appear' : ' '}`} > {!willDisappear && contentVisible &&
                        <div className='dropdown-content-container' >
                            <div className='side-text project-item' >Workforce</div>
                            <div className='side-text project-data' onClick={() => setDropdown2Visible(!dropdown2Visible)} >{project.workers.length}
                                <span className='side-text chevron' style={{ fontSize: '1em' }}> ▼ </span>
                            </div>
                            {dropdown2Visible &&
                                <>
                                    <div className='add-worker-container'>
                                        <span onMouseLeave={() => setResultDropdown(false)}>
                                        <Input value={employeeName}  onChange={(ev) => manageLiveSearch(ev.target.value)} label='Empolyee name' labelStyle={{ marginLeft: '1.3em', fontSize: '0.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '13em', display: 'block', opacity: '0.7' }} />
                                        <div className='live-search-result' style={{marginLeft: '0.95em'}}>
                                            {resultDropdown && foundContent !== '' &&
                                                foundContent.map(user => {
                                                    return <div key={user.id} className='user-holder-mini' onClick={() => {
                                                        setEmployeeName(user.fullName)
                                                        setResultDropdown(false)
                                                    }} >
                                                        <img className='avatar' style={{ boxShadow: '0 0 0 1px #b8a5a5' }} alt='avatar' src={user.avatar} />
                                                        <div className='employee-info' style={{ border: 'none' }}>
                                                            <div className='side-text' style={{ marginBottom: '0.5vh' }}>{user.fullName}</div>
                                                            <div className='small-text' style={{ color: 'var(--muave)', margin: 0 }}>{user.rang}</div>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                        </span>
                                        <Input value={rang} onChange={(ev) => setRang(ev.target.value)} label='Rang' labelStyle={{ marginLeft: '1.3em', fontSize: '0.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '13em', display: 'block', opacity: '0.7' }} />
                                        <ButtonComponent onClick={() => addEmployee(project.id, employeeName, rang)} style={{ display: 'inline-block', marginLeft: '3vw' }} label='Add to project' />
                                    </div>
                                    <div className='workforce-holder'>
                                        {workforce.map(employee => {
                                            return <div key={employee.id} className='user-holder'>
                                                <img className='avatar' style={{ boxShadow: '0 0 0 1px #b8a5a5', justifySelf: 'left', zoom: '1.4' }} alt='avatar' src={employee.avatar} />
                                                <div className='employee-info'>
                                                    <div className='side-text' style={{ marginBottom: '0.8vh' }}>{employee.fullName}</div>
                                                    <div className='small-text' style={{ color: 'var(--muave)', margin: 0 }}>{employee.rang}</div>
                                                </div>
                                                <ButtonComponent key={employee.id} onClick={() => removeUser(employee.id, project.id)} label='Remove' />
                                            </div>
                                        })}
                                    </div >
                                </>
                            }

                            <div className='side-text project-item' >Office</div>
                            <div className='side-text project-data' >{project.office.country}</div>
                            <div className='side-text project-item' >Start date</div>
                            <div className='side-text project-data' >{new Date(project.startDate).toLocaleDateString()}</div>
                            <div className='side-text project-item' style={{ borderBottom: 'none' }} >End date</div>
                            <div className='side-text project-data' style={{ borderBottom: 'none' }} >{new Date(project.endDate).toLocaleDateString()}</div>
                        </div>
                    } </div>
                </div>
            }
        </div>
    );
}

export default Dropdown;