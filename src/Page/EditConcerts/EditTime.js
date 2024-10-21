import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import default export correctly
import { useNavigate, useParams } from 'react-router-dom';
import HeaderUser from "../../components/HeadUser";

function EditTime() {
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showTime, setShowTime] = useState('');
    const navigate = useNavigate();
    const { CID } = useParams();
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
            setUserId(userId); // Set the userId state
            console.log("User ID set to:", userId); // Log user ID
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
        const fetchShowTime = async () => {
            try {
                const response = await axios.get(`${API_URL}/detailshowtime?CID=${CID}`);
                setShowTime(response.data.Time); // Set the showTime state with the data from the API
            } catch (error) {
                console.error('Error fetching show time data:', error);
            }
        };
        if (CID) {
            fetchShowTime();
        }
    }, [CID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/editshowtime`, {
                CID: CID,
                Time: showTime
            });
            console.log(response.data); // Handle success response
            navigate('/management'); // Redirect to success page or any other page
        } catch (error) {
            console.error('Error updating show time:', error);
        }
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>
                Edit
            </h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}> concert time </p>
            <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
                    style={{ marginLeft:"650px" }}>

                <form class="space-y-6" onSubmit={handleSubmit} >
                <h5 class="text-xl font-medium text-gray-900 dark:text-white" style={{ marginLeft:"20px" }}>Edit time</h5>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="Time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ShowTime</label>
                            <input
                                type="text"
                                id="Time"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={showTime}
                                onChange={(e) => setShowTime(e.target.value)}
                                placeholder=""
                                required
                            />
                        </div>
                    </div>
                    <button type="submit"  style={{ marginLeft:'20px', marginTop:"-20px" }}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            
        </>
    );
}

export default EditTime;
