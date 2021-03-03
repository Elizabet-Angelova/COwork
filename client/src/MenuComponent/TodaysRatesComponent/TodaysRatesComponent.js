import React, { useState, useEffect, useContext } from 'react';
import './TodaysRatesComponent.css'
import getLoggedUser from '../../Providers/getLoggedUser';
import { withRouter } from 'react-router-dom'
import Loader from '../../Components/Loader';
import LoadingContext from '../../Providers/loadingContext';

const TodaysRatesComponent = ({ history }) => {
    const { loading, setLoading } = useContext(LoadingContext)
    const [todayPrimary, setTodayPrimary] = useState(null)
    const [weekPrimary, setWeekPrimary] = useState(null)
    const [compared, setCompared] = useState(null)
    const [office, setOffice] = useState('')
    const userID = getLoggedUser().id


    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:3000/users/office/${userID}`, {
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
            .catch(error => alert(error))
    }, [])

    
    useEffect(() => {
        fetch(`http://localhost:3000/records/today`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.message)
                }
                for (const el in response){
                    if (el === office) {
                        setTodayPrimary(response[el])
                    }
                }
            })
            .catch(error => alert(error.message))
       

        fetch(`http://localhost:3000/records/week`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.message)
                }
                response.forEach((report) => {
                    if (report.country === office) {
                        setWeekPrimary(report.weeklyAverage)
                    }
                })
            })
            .catch(error => { history.push('/error') })

            
        fetch(`http://localhost:3000/records/compare/two`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.message)
                }
                response.forEach((report) => {
                    if (report.country === office) {
                        setCompared(report.dailyRate)
                    }
                })
            })
            .catch(error => { history.push('/error') })

    }, [office])

    useEffect(() => {
        if (todayPrimary !== null && weekPrimary !== null && compared !== null) {
            setTimeout(() => {
                setLoading(false)
            }, 800)
        }
    }, [todayPrimary, weekPrimary, compared])

    return (
        <>
        {loading && <Loader />}
            <div className='todays-component-container'>
                <div className='small-text'>Covid cases rates</div>
                <div className='todaysrates-container'>
                <div className='small-text' style={{ marginBottom: '1vw' }}>
                    <span style={ { color: compared <= 0 ? 'rgb(123, 194, 52)' : 'coral',fontSize: '2em' }}>{compared < 0 ? '-' : '+'}</span>
                        <span style={{ fontSize: '2em', letterSpacing: '0.1em', margin: '0 0.4vw 0 0.3vw' }}>{compared < 0 ? compared * -1 : compared}%</span>
                today</div>

                <div className='small-text' style={{ marginBottom: '0.5vw' }}>
                        <span style={{ color: 'white', fontSize: '1.1em', letterSpacing: '0.1em', margin: '0 0.7vw 0 0vw' }}>{todayPrimary < 0 ? todayPrimary * -1 : todayPrimary}%</span>
                in {office} today</div>

                    <div className='small-text'>
                        <span style={{color: 'white', fontSize: '1.1em', letterSpacing: '0.1em', margin: '0 0.4vw 0 0vw' }}>{weekPrimary < 0 ? weekPrimary * -1 : weekPrimary}%</span>
                in {office} last week</div>
                </div>
            </div>
        </>
    );
}

export default withRouter(TodaysRatesComponent);