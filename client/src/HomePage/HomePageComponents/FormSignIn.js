import React, { useState } from 'react';
import Input from './Input';
import { useHistory } from "react-router-dom";
const BASE_URL = 'http://localhost:3000'

const FormSignIn = ({ className }) => {
    const history = useHistory();
    const [resultDropdown, setResultDropdown] = useState(false)
    const [foundContent, setFoundContent] = useState('')
    const [wrongConfirm, setWrongConfirm] = useState(false)
    const [wrongForm, setWrongForm] = useState(false)


    const [user, setUser] = useState({
        email: {
            value: '',
            touched: false,
            valid: undefined,
        },
        username: {
            value: '',
            touched: false,
            valid: undefined,
        },
        fullName: {
            value: '',
            touched: false,
            valid: undefined,
        },
        country: {
            value: '',
            touched: false,
            valid: undefined,
        },
        password: {
            value: '',
            touched: false,
            valid: undefined,
        },
        confirm: {
            value: '',
            touched: false,
            valid: undefined,
        }
    });

    const updateUser = (prop, value) => setUser({
        ...user,
        [prop]: {
            value,
            touched: true,
            valid: prop === 'country' || prop === 'confirm' ? true : userValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
        }
    });


    const getValidationErrors = (prop) => {
        return userValidators[prop].map((validatorFn) => validatorFn(user[prop].value))
            .filter(value => typeof value === 'string');
    }


    const handleKeyPress = (event) => {
        if (event.charCode === 13) {
            signUp()
        }
    }

    const validateForm = () => !Object
        .keys(user)
        .reduce((isValid, prop) => isValid && user[prop].valid && user[prop].touched, true)

    const signUp = () => {
        if (user.password.value !== user.confirm.value) {
            setWrongConfirm(true)
        } else {
            if (!validateForm()) {
                const fullName = `${user.fullName.value.split(' ')[0].charAt(0).toUpperCase() + user.fullName.value.split(' ')[0].slice(1)} ${user.fullName.value.split(' ')[1].charAt(0).toUpperCase() + user.fullName.value.split(' ')[1].slice(1)}`

                const userToSend = {
                    email: user.email.value,
                    username: user.username.value,
                    fullName: fullName,
                    password: user.password.value,
                    office: user.country.value,
                }

                fetch(`${BASE_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userToSend),
                })

                    .then(result => {
                        if (result.error) {
                            throw new Error(result.message);
                        } else {
                            history.push('/login');
                        }
                    })
                    .catch((er) => history.push('/error'))
            } else {
                setWrongForm(true)
            }
        }
        }

    

    const getClassNames = (prop) => {
        let classes = '';
        if (user[prop].touched) {
            classes += ' touched '
        }
        if (user[prop].valid) {
            classes += ' valid ';
        }
        if (user[prop].invalid) {
            classes += ' invalid ';
        } else {
            classes += ''
        }

        return classes
    }

    const userValidators = {
        username: [
            value => value?.length >= 4 || 'Username should be at least 4 characters',
            value => value?.length <= 12 || 'Username should be no more than 12 characters',
            value => /^[^<>%$#&@*-/@!?^=`'"]*$/.test(value) || 'Username can only contain "_"',

        ],
        password: [
            value => value?.length >= 4 || 'Password should be at least 4 characters',
            value => value?.length <= 12 || 'Password should be no more than 20 characters',
            value => /[a-z]/.test(value) || 'Password should contain at least 1 letter',
            value => /[0-9]/.test(value) || 'Password should contain at least 1 number',
            value => /^[^<>%$#&@*-/._@!?^=`'"]*$/.test(value) || 'Password can\'t contain special characters',
        ],
        email: [
            value => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Please enter a valid email address.',
        ],
        fullName: [
            value => /(\w.+\s).+/.test(value) || 'Please provide first and last name',
            value => /^[^<>%$#&@*-/._@!?^=`'"]*$/.test(value) || 'Full name can\'t contain special characters',
        ],
    };


    const manageLiveSearch = (searchParam) => {
        updateUser('country', searchParam)
        if (searchParam.length >= 1) {
            fetch(`http://localhost:3000/office`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
                .then(res => {
                    let found = res.filter(result => {
                        return (result.country.toLowerCase().includes(searchParam.toLowerCase()))
                    })
                    found = found.sort((a, b) => {
                        let textA = a.country.toLowerCase().indexOf(searchParam.toLowerCase());
                        let textB = b.country.toLowerCase().indexOf(searchParam.toLowerCase());;
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });;
                    if (found.length > 0) {
                        setFoundContent(found)
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


    return (
        <div className={`form-container ${className}`} style={{ padding: '2em 3.5em 2em 3.5em' }} onKeyPress={(ev) => handleKeyPress(ev)}>
            <div style={{ textAlign: 'left' }}>
                <Input className={getClassNames('email')} value={user.email.value} onChange={(ev) => updateUser('email', ev.target.value)} style={{ borderRadius: '100px', height: '2.2em', marginBottom: '0.8em' }} labelStyle={{ fontSize: '0.7em', color: 'var(--muave)' }} type='text' placeholder='Email'
                    label={user.email.touched && !user.email.valid
                        ? getValidationErrors('email').filter((er) => getValidationErrors('email').indexOf(er) === 0 && <div>{er}</div>)
                        : 'Email'} />


                <Input className={getClassNames('username')} value={user.username.value} onChange={(ev) => updateUser('username', ev.target.value)} style={{ borderRadius: '100px', height: '2.2em', marginBottom: '0.8em' }}
                    label={user.username.touched && !user.username.valid
                        ? getValidationErrors('username').filter((er) => getValidationErrors('username').indexOf(er) === 0 && <div>{er}</div>)
                        : 'Username'}
                    labelStyle={{ fontSize: '0.7em', color: 'var(--muave)' }} type='text' placeholder='Username' />


                <Input className={getClassNames('fullName')} value={user.fullName.value} onChange={(ev) => updateUser('fullName', ev.target.value)} style={{ borderRadius: '100px', height: '2.2em', marginBottom: '0.8em' }} labelStyle={{ fontSize: '0.7em', color: 'var(--muave)' }} type='text' placeholder='Full name'
                    label={user.fullName.touched && !user.fullName.valid
                        ? getValidationErrors('fullName').filter((er) => getValidationErrors('fullName').indexOf(er) === 0 && <div>{er}</div>)
                        : 'Full name'}
                />




                <span onMouseLeave={() => setResultDropdown(false)}>
                    <Input value={user.country.value} onChange={(ev) => manageLiveSearch(ev.target.value)} label='Country' style={{ borderRadius: '100px', height: '2.2em', marginBottom: '0.8em' }} labelStyle={{ fontSize: '0.7em', color: 'var(--muave)' }} type='text' placeholder='Country' />
                    <div className='live-search-result' style={{ marginTop: '-1.6em', boxShadow: '0 0 0 0.2px var(--muave)' }}>
                        {resultDropdown && foundContent !== '' &&
                            foundContent.map(obj => {
                                return <div key={obj.country} className='countries' onMouseOver={() => setResultDropdown(true)} style={{ width: '16em' }} onClick={() => {
                                    updateUser('country', obj.country)
                                    setResultDropdown(false)

                                }} >
                                    <div className='side-text country-suggestion'>{obj.country}</div>
                                </div>
                            })
                        }
                    </div>
                </span>


                <Input className={getClassNames('password')} value={user.password.value} onChange={(ev) => updateUser('password', ev.target.value)} style={{ borderRadius: '100px', height: '2.2em', marginBottom: '0.8em' }} labelStyle={{ fontSize: '0.7em', color: 'var(--muave)' }} type='password' placeholder='Password' label={user.password.touched && !user.password.valid
                    ? getValidationErrors('password').filter((er) => getValidationErrors('password').indexOf(er) === 0 && <div>{er}</div>)
                    : 'Password'}
                />



                <Input className={wrongConfirm ? 'invalid' : ''} value={user.confirm.value} onChange={(ev) => updateUser('confirm', ev.target.value)} style={{ borderRadius: '100px', height: '2.2em', marginBottom: '0.8em' }} label={wrongConfirm ? `You're passwords didn't match.` : `Confirm password`} labelStyle={{ fontSize: '0.7em', color: 'var(--muave)' }} type='password' placeholder='Confirm password' />
            </div>
            <div className='home-nav-item log-in-button' style={{ marginTop: '1em' }} onClick={() => signUp()}>SIGN UP</div>
            {wrongForm && <div className='small-text' style={{color: 'red', lineHeight: '0.1em', marginTop: '1.5vh', marginLeft: '0'}}>Please fill out all of the input fields!</div>}
        </div>
    );
}

export default FormSignIn;