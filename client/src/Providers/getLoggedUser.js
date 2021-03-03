import jwtDecode from 'jwt-decode'

 const getLoggedUser = () => {
    try {
        return jwtDecode(localStorage.getItem('token') || '');
    } catch (e) {
        localStorage.removeItem('token');
        return null;
    }
}


export default getLoggedUser;
