import React, {  useContext, useEffect } from 'react';
import Loader from '../Components/Loader';
import LoadingContext from '../Providers/loadingContext';
import VirtualOfficeComponent from '../VirtualOfficeComponent/VirtualOfficeComponent';

const OfficeComponent = ({ history }) => {
    const { loading, setLoading } = useContext(LoadingContext)

    useEffect(() => {
        if(!loading){
       setLoading(true)
       setTimeout(() => {
           setLoading(false)
       }, 1000)
        }
    }, [])

    return (
        <div className='main-container' style={{overflow: 'scroll'}}>
            {loading && <Loader />}
            <div className='top-section'>
                <img src='/logo.png' alt='logo' className='logo' onClick={() => history.push('/login')} />
                <span className='home-nav-item home-nav-item2' onClick={() => history.goBack()}>BACK</span>

            </div>
            <div style={{ textAlign: 'center', marginTop: '-19vh'}}>
                <VirtualOfficeComponent legend='noflex'/>
            </div>
        </div>
    );
}

export default OfficeComponent;