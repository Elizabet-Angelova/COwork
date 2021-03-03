import React, { useContext, useEffect, useState } from 'react';
import '../Components/ButtonComponent'
import ButtonComponent from '../Components/ButtonComponent';
import Loader from '../Components/Loader';
import LoadingContext from '../Providers/loadingContext';
import Report from './Report';
import {withRouter} from 'react-router-dom'
import getLoggedUser from '../Providers/getLoggedUser';

const Reports = ({history}) => {
    const [reports, setReports] = useState([])
    const [office, setOffice] = useState('')
    const [refresh, setRefresh] = useState(false)
    const {loading, setLoading} = useContext(LoadingContext)
    const loggedUser = getLoggedUser()

    useEffect(() => {
        fetch(`http://localhost:3000/users/${loggedUser.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.message)
                } 
                setOffice(response.office.country)
            })
            .catch(error => history.push('/error'))
    }, [])

    useEffect(() => {
        if (office !== '') {
            console.log(office)
        setLoading(true)
        fetch(`http://localhost:3000/office/report/full`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(response => {
                if (response.error) {
                    throw new Error(response.message)
                } else {
                    if (loggedUser.role === 'Admin') {
                        setReports(response)
                        console.log(loggedUser)
                    } else {
                        response = response.filter(report => report.country === office )
                        setReports(response)
                    }
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                }
            })
            .catch(error => history.push('/error'))
        }
    }, [refresh, office])


    return (
        <>
        <div className='content ' >
            <ButtonComponent onClick={() => setRefresh(!refresh)} label='⟲ Refresh' style={{ marginBottom: '2vh', fontSize: '0.73em' }} />
            <div className='reports-container'>
                <Report style={{ background: 'rgba(63, 15, 63, 0.15)' }} office='Country' desks='Desks' employees='Employees' today={`Today's rates`} week='Weekly rates' available='Available desks' occupied={'Occupied Desks'}/>
           
            {reports !== [] &&
            reports.map(report => {
                return <Report key={report.country} office={report.country} desks={report.desks} employees={report.employees} today={report.todaysRate} week={report.weeklyRate} available={report.availableDesks} occupied={report.occupiedDesks}/>

            })} 
            </div>
        </div>
        </>
    );
}

export default withRouter(Reports);