import React from 'react';
import './Pages.css'
import Header from '../Header/Header';
import MenuComponent from '../MenuComponent/MenuComponent';
import CreateOfficeComponent from '../CreateOfficeComponent/CreateOfficeComponent';
import VirtualOfficeComponent from '../VirtualOfficeComponent/VirtualOfficeComponent';
import ManageProjectsComponent from '../Project&VacationPages/ManageProjects';
import UserVacationComponent from '../Project&VacationPages/UserVacationPage';
import Reports from '../Reports/Reports';
import Employees from '../Project&VacationPages/Employees';

const Pages = ({content}) => {
    const ContentComponent = content;
    return (
       <>
          <div className='main-container main-grid'>
              <Header />
             <MenuComponent />
             <ContentComponent />
             </div>
       </>
    );
 }
 
 export const CreateVirtualOffice = () => {
    return  <Pages content={CreateOfficeComponent}/>
 }

 export const ReportsPage = () => {
   return  <Pages content={Reports}/>
}


 export const VirtualOffice = () => {
   return  <Pages content={VirtualOfficeComponent}/>
}

export const EmployeesPage = () => {
   return  <Pages content={Employees}/>
}

export const ManageProjects = () => {
   return  <Pages content={ManageProjectsComponent}/>
}

export const UserVacationPage = () => {
   return  <Pages content={UserVacationComponent}/>
}

 export default Pages;