import React, { useState } from 'react';
import  { CreateVirtualOffice, VirtualOffice, ManageProjects, UserVacationPage, ReportsPage, EmployeesPage } from './Pages/Pages';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom'
import HomePage from './HomePage/HomePage';
import NotFound from './Components/404';
import ErrorPage from './Components/ErrorPage';
import LoadingContext from './Providers/loadingContext';
import OfficeComponent from './HomePage/Office';
import GuardedRoute from './Providers/GuardedRouth';
import getLoggedUser from './Providers/getLoggedUser';


function App() {

  const [loading, setLoading] = useState(false)
  let user = getLoggedUser()
  
  return (
    <BrowserRouter>
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <Switch>
        <Redirect path="/" exact to="/login" />
        <Route path="/home" exact component={VirtualOffice} />
        <GuardedRoute path="/create" loggedUser={user} exact component={CreateVirtualOffice} />
        <GuardedRoute path="/projects" loggedUser={user} exact component={ManageProjects} />
        <Route path="/employees" exact component={EmployeesPage} />
        <Route path="/office" exact component={OfficeComponent} />
        <Route path="/pvl" exact component={UserVacationPage} />
        <Route path="/login" exact component={HomePage} />
        <Route path="/signin" exact component={HomePage} />
        <Route path="/reports" exact component={ReportsPage} />
        <Route path="/error" exact component={ErrorPage} />
        <Route path="*" component={NotFound} />
      </Switch>
      </LoadingContext.Provider>
    </BrowserRouter>
   
  );
}

export default App;
