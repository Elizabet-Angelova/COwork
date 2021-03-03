import React, { useState, useEffect, useContext } from 'react';
import './CreateOfficeComponent.css'
import Header from '../Header/Header';
import MenuComponent from '../MenuComponent/MenuComponent';
import ButtonComponent from '../Components/ButtonComponent';
import Input from '../HomePage/HomePageComponents/Input';
import Square from './Square';
import SquareNoDesk from './SquareNoDesk';
import SquareDesk from './SquareDesk';
import LoadingContext from '../Providers/loadingContext';
import { withRouter } from 'react-router-dom'
import Loader from '../Components/Loader';


const CreateOfficeComponent = ({ history }) => {
    const { loading, setLoading } = useContext(LoadingContext)
    const [desks, setDesks] = useState(0)
    const [desksNum, setDesksNum] = useState(null)
    const [rowsNum, setRowsNum] = useState(0)
    const [desksPerRow, setDesksPerRow] = useState(0)
    const [office, setOffice] = useState('')
    const [officeToShow, setOfficeToShow] = useState({})
    const [positions, setPositions] = useState([])
    const [index, setIndex] = useState(0)
    const [pos, setpos] = useState(0)
    const [creatingSchema, setCreatingSchema] = useState(false)
    const [resultDropdown, setResultDropdown] = useState(false)
    const [foundContent, setFoundContent] = useState('')

    const manageLiveSearch = (searchParam) => {
        setOffice(searchParam)
        if (searchParam.length >= 1) {
            fetch(`https://coronavirus-19-api.herokuapp.com/countries`, {
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


    const getSchema = () => {
        let array = []
        let index = 0
        if (desksNum <= 10) index = 1
        if (desksNum > 10 && desksNum < 27) index = 2
        if (desksNum >= 27) index = 3
        if (desksNum > 39) index = 4
        if (desksNum > 52) index = 4
        if (desksNum > 70) index = 5
        if (desksNum > 91) index = 6
        if (desksNum > 108) index = 7
        if (desksNum > 126) index = 8
        if (desksNum > 144) index = 9
        if (desksNum > 162) index = 10
        if (desksNum > 180) index = 11
        if (desksNum > 198) index = 12
        if (desksNum > 215) index = Number((desksNum / 16.5).toFixed(0))



        let numberOfRows = Math.ceil((desksNum * 4) / Math.ceil(desksNum / index))
        let number = numberOfRows * Math.ceil(desksNum / index)
        for (let i = 1; i <= number; i++) {
            array.push(i)
        }
        setIndex(index)
        setDesks(array)
        setRowsNum(numberOfRows)
        setDesksPerRow((desksNum * 4) / numberOfRows)
        setCreatingSchema(false)

    }

    const remember = (position) => {
        if (positions.length === 0) {
            positions.push(position)
        } else if (positions.includes(position)) {
            positions.splice(positions.indexOf(position), 1)
        } else {
            positions.push(position)
        }
        setpos(positions.length)
    }

    const submit = () => {
        // setLoading(true)

        let matrix = []
        let lastJ = 0
        for (let i = 0; i < rowsNum; i++) {
            let row = []
            for (let j = lastJ + 1; j < lastJ + 1 + desksPerRow; j++) {
                row.push(j)
            }
            matrix.push(row)
            lastJ = row[row.length - 1]
        }

        fetch(`http://localhost:3000/office/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                matrix: matrix,
                positions: positions,
                country: office,
                desks: desksNum,
            }),
        }).then(result => {
            if (result.error) {
                throw new Error(result.message);
            }
            setPositions([])
            history.push('./home')
        })
            .catch(er => console.log(er.message))

    }


    return (
        <>
            
            <div className='content'>

                <span onMouseLeave={() => setResultDropdown(false)} >
                    <Input value={office} onChange={(ev) => manageLiveSearch(ev.target.value)} label='Country' labelStyle={{ marginLeft: '1.3em', fontSize: '0.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '13em', display: 'block', opacity: '0.7' }} />
                    <div className='live-search-result' style={{marginLeft: '0.9em', marginTop: '0.05em'}}>
                        {resultDropdown && foundContent !== '' &&
                            foundContent.map(obj => {
                                return <div key={obj.country} className='countries' style={{width: '11.8em'}} onClick={() => {
                                    setOffice(obj.country)
                                    setResultDropdown(false)
                                }} >
                                        <div className='side-text country-suggestion'>{obj.country}</div>
                                </div>
                            })
                        }
                    </div>
                </span>


                <Input label='Number of desks' value={desksNum} type='text' onChange={ev => {
                    setDesksNum(ev.target.value)
                    setCreatingSchema(true)
                }}labelStyle={{ marginLeft: '1.3em', fontSize: '0.7em', display: 'inline-block' }} style={{ marginLeft: '-0.2em', fontSize: '1.1em', marginTop: '0.4vh', height: '1.7em', width: '13em', display: 'block', opacity: '0.7' }} />
                <ButtonComponent onClick={getSchema} style={{ display: 'inline-block', marginLeft: '4em' }} label='View schema' />

                <div className='shcema' style={{ padding: '2em' }}>
                    <div>
                        {Array.isArray(desks) && !creatingSchema &&
                            <>
                                <div className='side-text'>Please select the squares where desks are situated, so that it resembles your office space.</div>
                                {desks.map(position => {
                                    if (position % (Math.ceil(desksNum / index)) === 1) {
                                        return <span key={position} onClick={(() => remember(position))}><br /><Square key={position} position={position} /> </span>
                                    } else {
                                        return <span key={position} onClick={(() => remember(position))}><Square key={position} position={position} /></span>
                                    }
                                })}
                                <div className='side-text'><span style={{ fontSize: '1.8em' }}>{pos}</span> desks selected</div>
                                <ButtonComponent onClick={submit} style={{ marginTop: '1.8em' }} label='Create office' />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(CreateOfficeComponent);