import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement
import { useNavigate } from 'react-router-dom';
import HeaderUser from '../../components/HeadUser';

const ChanelC = () => {
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [concerts, setConcerts] = useState([]);
    const [error, setError] = useState(null);
    const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
            return;
        }

        try {
            const decoded = jwtDecode(token); // Decode the token
            const userId = decoded.id; // Extract user ID from decoded token
            setUserId(userId);

            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/${userId}`);
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login'); // Redirect to login page if decoding fails
        }
    }, [navigate]);

    useEffect(() => {
        if (userId) {
            const fetchConcerts = async () => {
                try {
                    const response = await axios.get(`${API_URL}/concerts/${userId}`);
                    setConcerts(response.data);
                } catch (err) {
                    setError(err.response ? err.response.data : 'Server error. Please try again later.');
                }
            };

            fetchConcerts();
        }
    }, [userId]);

    const handleAddInput = () => {
        setInputs([...inputs, { id: inputs.length + 1, value: '' }]);
    };

    const handleInputChange = (id, event) => {
        const newInputs = inputs.map(input => {
            if (input.id === id) {
                return { ...input, value: event.target.value };
            }
            return input;
        });
        setInputs(newInputs);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const cid = concerts.length > 0 ? concerts[0].CID : null; // Use the first concert's CID

        if (cid === null) {
            setError('No concert found for this user.');
            return;
        }

        try {
            for (const input of inputs) {
                const response = await axios.post(`${API_URL}/addchanel`, {
                    CID: cid,
                    Url: input.value,
                });
                console.log('Data inserted successfully:', response.data);
            }

            // Reset form inputs
            setInputs([{ id: 1, value: '' }]);

            // Navigate to TimeC component
            navigate(`/timec/${cid}`); // Corrected here
        } catch (err) {
            console.error('Error inserting data:', err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }} >Chanels </h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400"
                style={{ marginLeft: '50px' }} > for booking concert tickets. </p>

            <div style={{ marginLeft: '630px' }}>
            </div>

            <form className="max-w-md mx-auto" style={{ marginTop: '20px' }} onSubmit={handleSubmit}>
                {inputs.map(input => (
                    <div className="relative mb-4" key={input.id}>
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                        <input
                            type="url"
                            id={`url-${input.id}`}
                            value={input.value}
                            onChange={e => handleInputChange(input.id, e)}
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
                                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Link Chanel"
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddInput}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                                rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Add
                </button>
                <button
                    type="submit"
                    className="ml-4 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-green-300 
                            font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    Next
                </button>
                
            </form>
        </div>
    );
};

export default ChanelC;
