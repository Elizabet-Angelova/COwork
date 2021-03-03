import React, { useState, useEffect } from 'react';
import './ManageProjects.css'
import Dropdown from '../Components/Dropdown';
import '../Components/Dropdown.css'
import ButtonComponent from '../Components/ButtonComponent';
import Input from '../HomePage/HomePageComponents/Input';
import getLoggedUser from '../Providers/getLoggedUser';

const ManageProjectsComponent = () => {
    const [projects, setProjects] = useState([])
    const [addProject, setAddProject] = useState(false)
    const user = getLoggedUser();
    const [projectName, setProjectName] = useState('')
    const [projectOffice, setProjectOffice] = useState('')
    const [projectStart, setProjectStart] = useState('')
    const [projectEnd, setProjectEnd] = useState('')



    useEffect(() => {
        fetch(`http://localhost:3000/projects`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
                result.sort((a, b) => {
                    let textA = a.name.toUpperCase();
                    let textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                setProjects(result)
            })
            .catch(er => console.log(er.message))
    }, [projects])

    const createProject = () => {
        if (!(projectName && projectOffice && projectStart &&projectEnd)) {
            alert('please fill out all inputs')
            return;
        }
        fetch(`http://localhost:3000/projects`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: projectName,
                office: projectOffice,
                startDate: projectStart,
                endDate: projectEnd,
            }),
        }).then(result => {
                if (result.error) {
                    throw new Error(result.message);
                }
            })
            .catch(er => console.log(er.message))
    }


    return (
        <div className='content' style={{ paddingLeft: '2vw' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '1vh 0.3vh 0vh 0vh' }}>
                <span className='side-text' style={{ fontSize: '0.7em', marginLeft: '0.3vw' }}>Active Projects</span>
               <ButtonComponent onClick={() => setAddProject(!addProject)} label={addProject ? 'Close' : 'Add Project'} style={{ display: 'inline-block', marginLeft: 'auto' }} />
            </div>
            {addProject &&
                <div>
                    <div className='create-project-form'>
                        <Input value={projectName} onChange={(ev) => setProjectName(ev.target.value)} label='Project name' labelStyle={{ marginLeft: '1.3em', fontSize: '0.7em', marginTop: '1.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '17em', display: 'block', opacity: '0.7' }} />
                        <Input value={projectOffice} onChange={(ev) => setProjectOffice(ev.target.value)} label='Office' labelStyle={{ marginLeft: '1.3em', fontSize: '0.7em', marginTop: '1.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '17em', display: 'block', opacity: '0.7' }} />
                        <div>
                            <Input type='date' value={projectStart} onChange={(ev) => setProjectStart(ev.target.value)} label='Start date' labelStyle={{ marginLeft: '1.3em', marginTop: '1.7em', fontSize: '0.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '17em', display: 'block', opacity: '0.7' }} />
                            <Input type='date' value={projectEnd} onChange={(ev) => setProjectEnd(ev.target.value)} label='End date' labelStyle={{ marginLeft: '1.3em', marginTop: '1.7em', fontSize: '0.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '17em', display: 'block', opacity: '0.7' }} />
                        </div>
                        <ButtonComponent onClick={createProject} label='SAVE' style={{ marginLeft: '2em', marginTop: '3em', padding: '0.5em 1.5em 0.4em 1.5em' }} />
                    </div>
                </div>
            }

            <div className='projects-container'>
                <div>
                    {projects !== [] &&
                        projects.map((project => {
                            return <Dropdown key={project.id} project={project} workforce={project.workers} />
                        }))
                    }

                </div>


            </div>


        </div>
    );
}

export default ManageProjectsComponent;