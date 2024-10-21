import { useState, useEffect } from "react";
import HeaderUser from "../../components/HeadUser";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { useNavigate,useParams } from 'react-router-dom';

function TimeC() {
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [concerts, setConcerts] = useState([]);
    const [error, setError] = useState(null);
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("00:00");
    const [timeRange, setTimeRange] = useState("00:00-00:00");
    const { CID } = useParams(); // Get CID from URL parameters
    const [selectedCID, setSelectedCID] = useState(null);
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

    useEffect(() => {
        setTimeRange(`${startTime}-${endTime}`);
    }, [startTime, endTime]);

    const handleSubmit = async () => {
        if (!CID) {
            setError('Please select a concert.');
            return;
        }

        try {
            await axios.post(`${API_URL}/showtime`, {
                CID: CID,
                Time: timeRange,
            });
            alert('Showtime added successfully.');
            navigate(`/ticketinform/${CID}`); // Navigate to ticketinform page upon successful submission
        } catch (error) {
            console.error('Error adding showtime:', error);
            setError(error.response ? error.response.data : 'Server error. Please try again later.');
        }
    };

    return (
        <div>
            <HeaderUser />
            <h5
                className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }} >
                Concerts
            </h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" 
                style={{ marginLeft: '70px' }}> booking show time </p>
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
                    style={{ marginLeft:"570px" }}>

            <form className="max-w-[16rem] mx-auto grid grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div>
                    <label htmlFor="start-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start time:</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input
                            type="time"
                            id="start-time"
                            className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            min="00:00"
                            max="23:59"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="end-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End time:</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <input
                            type="time"
                            id="end-time"
                            className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            min="00:00"
                            max="23:59"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >Submit</button>
            </form>

            </div>

            <p className="text-center mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                Selected Time Range: {timeRange}
            </p>
        </div>
    );
}

export default TimeC;
