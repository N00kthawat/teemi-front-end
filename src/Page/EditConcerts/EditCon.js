import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderUser from "../../components/HeadUser";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function EditCon() {
    const [userData, setUserData] = useState(null);
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
        StartDate: '',
        EndDate: ''
    });
    const [concertTypes, setConcertTypes] = useState([]);
    const [perTypes, setPerTypes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const [userId, setUserId] = useState(null);
    const { CID } = useParams();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    // Fetch user data and concert data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setUserId(userId);

            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/${userId}`);
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setError('Error fetching user data.');
                }
            };
            fetchUserData();

            const fetchConcertData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/detailconcerts/${userId}/${CID}`);
                    setConcertData(response.data[0]);
                } catch (error) {
                    console.error('Error fetching concert data:', error);
                    setError('Error fetching concert data.');
                } finally {
                    setLoading(false); // Set loading to false once data is fetched
                }
            };
            fetchConcertData();
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [navigate, CID]);

    // Fetch concert types
    useEffect(() => {
        const fetchConcertTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/type-concert`);
                setConcertTypes(response.data);
            } catch (error) {
                console.error('Error fetching concert types:', error);
                setError('Error fetching concert types.');
            }
        };
        fetchConcertTypes();
    }, []);

    useEffect(() => {
        // Update concertData when startDate or endDate changes
        setConcertData(prevState => ({
            ...prevState,
            StartDate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
            EndDate: endDate ? moment(endDate).format('YYYY-MM-DD') : ''
        }));
    }, [startDate, endDate]);

    // Fetch Per types
    useEffect(() => {
        const fetchPerTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/type-show`);
                setPerTypes(response.data);
            } catch (error) {
                console.error('Error fetching Per types:', error);
                setError('Error fetching Per types.');
            }
        };
        fetchPerTypes();
    }, []);

    // Fetch concert types based on the selected Con_type
    useEffect(() => {
        if (concertData.Con_type) {
            const fetchConcertTypes = async () => {
                try {
                    const response = await axios.get(`${API_URL}/type-concert`, {
                        params: { Con_type: concertData.Con_type }
                    });
                    setConcertTypes(response.data);
                } catch (error) {
                    console.error('Error fetching concert types:', error);
                    setError('Error fetching concert types.');
                }
            };
            fetchConcertTypes();
        }
    }, [concertData.Con_type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form data
        if (!concertData.Name || !concertData.Con_type) {
            setError('Please fill out all required fields.');
            return;
        }

        if (!window.confirm('Are you sure you want to update this concert?')) {
            return;
        }

        try {
            const numericCID = parseInt(CID, 10);
            const response = await axios.post(`${API_URL}/editconcerts`, {
                CID: numericCID,
                ID_user: userId,
                ...concertData
            });
            if (response.status === 200) {
                alert('Data updated successfully.');
                navigate('/management');
            } else {
                setError('Failed to update concert data.');
            }
        } catch (error) {
            console.error('Error updating concert data:', error);
            setError('Error updating concert data.');
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setConcertData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>
                Edit
            </h5>

            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}> concert information </p>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form className="mt-36" style={{ width: '1280px', marginLeft: '130px', marginTop: '10px' }} onSubmit={handleSubmit}>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="Show_secheduld" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Show scheduled
                            </label>
                            <input type="text" id="Show_secheduld" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Show scheduled" value={concertData.Show_secheduld} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="Poster" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Poster URL
                            </label>
                            <input type="text" id="Poster" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Poster URL" value={concertData.Poster} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Concert name
                            </label>
                            <input type="text" id="Name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name concert" value={concertData.Name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="LineUP" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                LineUP
                            </label>
                            <textarea id="LineUP" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="LineUP" value={concertData.LineUP} onChange={handleChange} required />
                        </div>
                        <div className="flex items-center mb-4">
                        <label htmlFor="Con_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Start Date
                        </label>
                        <DatePicker
                            value={concertData.StartDate}
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
                            value={concertData.EndDate}
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="ml-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                        <div>
                            <label htmlFor="Con_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Concert type
                            </label>
                            <select id="Con_type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={concertData.Con_type} onChange={handleChange} required>
                                <option value="">Select a type</option>
                                {concertTypes.map(type => (
                                    <option key={type.ID_Type_Con} value={type.ID_Type_Con}>
                                        {type.NameTC}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Quantity_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Quantity date
                            </label>
                            <input type="Quantity_date" id="Quantity_date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Quantity date" value={concertData.Quantity_date} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="Address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Address
                            </label>
                            <input type="Address" id="Address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Address" value={concertData.Address} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="Detail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Detail
                            </label>
                            <textarea id="Detail" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Detail" value={concertData.Detail} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="Per_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Per type
                            </label>
                            <select id="Per_type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={concertData.Per_type} onChange={handleChange} required>
                                <option value="">Select a type</option>
                                {perTypes.map(type => (
                                    <option key={type.ID_Type_Show} value={type.ID_Type_Show}>
                                        {type.NameTS}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" style={{ marginLeft:"25px" }}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                </form>
            )}
        </>
    );
}

export default EditCon;
