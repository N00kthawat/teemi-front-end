import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import HeaderUser from "../../components/HeadUser";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function ConcertAdd() {
    const [concertData, setConcertData] = useState({
        Show_secheduld: '',
        Poster: '',
        Name: '',
        LineUP: '',
        Con_type: '',
        Quantity_date: '',
        Address: '',
        Detail: '',
        Per_type: '',
        ID_user: '',
        StartDate: '',
        EndDate: ''
    });
    const [concertTypes, setConcertTypes] = useState([]);
    const [performanceTypes, setPerformanceTypes] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            console.log('Decoded Token:', decoded);
            const userId = decoded.id || decoded.userId || decoded.user_id;
            console.log('User ID:', userId);
            setUserId(userId);
            setConcertData(prevState => ({
                ...prevState,
                ID_user: userId
            }));

            const fetchConcertTypes = async () => {
                try {
                    const response = await axios.get(`${API_URL}/type-concert`);
                    setConcertTypes(response.data);
                } catch (error) {
                    console.error('Error fetching concert types:', error);
                }
            };

            const fetchPerformanceTypes = async () => {
                try {
                    const response = await axios.get(`${API_URL}/type-per`);
                    setPerformanceTypes(response.data);
                } catch (error) {
                    console.error('Error fetching performance types:', error);
                }
            };

            fetchConcertTypes();
            fetchPerformanceTypes();
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Update concertData when startDate or endDate changes
        setConcertData(prevState => ({
            ...prevState,
            StartDate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
            EndDate: endDate ? moment(endDate).format('YYYY-MM-DD') : ''
        }));
    }, [startDate, endDate]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setConcertData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Concert Data:', concertData);

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/concerts`, concertData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Concert added successfully');
            navigate('/chanelc');
        } catch (error) {
            console.error('Error adding concert:', error.response ? error.response.data : error.message);
            alert('Error adding concert. Please try again.');
        }
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Create</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>Concert</p>
            
            <div className="flex items-center justify-center min-h-screen" style={{ marginTop:"-70px", marginLeft:"-120px" }}>
            <form className="mt-36" style={{ width: '1280px', marginLeft: '120px', marginTop: '10px' }} onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="Show_secheduld" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Show scheduled
                        </label>
                        <input type="text" id="Show_secheduld" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Show scheduled" 
                                value={concertData.Show_secheduld}
                                onChange={handleInputChange}
                                required />
                    </div>
                    <div>
                        <label htmlFor="Poster" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Poster URL
                        </label>
                        <input type="text" id="Poster" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Poster URL" 
                                value={concertData.Poster}
                                onChange={handleInputChange}
                                required />
                    </div>
                    <div>
                        <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Concert name
                        </label>
                        <input type="text" id="Name" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Concert name" 
                                value={concertData.Name}
                                onChange={handleInputChange}
                                required />
                    </div>
                    <div>
                        <label htmlFor="Con_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Concert type
                        </label>
                        <select id="Con_type" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                value={concertData.Con_type}
                                onChange={handleInputChange}
                                required>
                            <option value="">Select a type</option>
                            {concertTypes.map(type => (
                                <option key={type.ID_Type_Con} value={type.ID_Type_Con}>
                                    {type.NameTC}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center mb-4">
                        <label htmlFor="Con_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Start Date
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center mb-4" style={{ marginLeft:"-300px" }}>
                    <label htmlFor="Con_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        End Date
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>

                    <div style={{ marginTop:"-25px" }}>
                        <label htmlFor="Quantity_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Number of dates
                        </label>
                        <input type="number" id="Quantity_date" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Number of dates" 
                                value={concertData.Quantity_date}
                                onChange={handleInputChange}
                                required />
                    </div>
                    <div style={{ marginTop:"-25px" }}>
                        <label htmlFor="Address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Address
                        </label>
                        <input type="text" id="Address" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Address" 
                                value={concertData.Address}
                                onChange={handleInputChange}
                                required />
                    </div>
                    <div style={{ marginTop:"-10px" }}>
                        <label htmlFor="Per_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Performance type
                        </label>
                        <select id="Per_type" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                value={concertData.Per_type}
                                onChange={handleInputChange}
                                required>
                            <option value="">Select a type</option>
                            {performanceTypes.map(type => (
                                <option key={type.ID_Type_Per} value={type.ID_Type_Show}>
                                    {type.NameTS}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginTop:"-10px" }}>
                        <label htmlFor="LineUP" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            LineUP
                        </label>
                        <textarea id="LineUP" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="LineUP" 
                                value={concertData.LineUP}
                                onChange={handleInputChange}
                                required />
                    </div>
                    <div style={{ marginTop:"-25px" }}>
                        <label htmlFor="Detail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Details
                        </label>
                        <textarea id="Detail" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Details" 
                                value={concertData.Detail}
                                onChange={handleInputChange}
                                required />
                    </div>
                </div>
                <button type="submit" style={{ marginLeft:"20px", marginTop:"-10px" }} 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit
                </button>
            </form>
            </div>
        </>
    );
}

export default ConcertAdd;
