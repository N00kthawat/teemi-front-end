import { useParams,useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CheckUser () {
    const API_URL = process.env.REACT_APP_API_URL; // Base API URL from environment variable
    const { Email } = useParams(); // Get the email from URL params
    const [user, setUser] = useState(null); // State to store user data
    const [error, setError] = useState(null); // State to store errors
    const [loading, setLoading] = useState(false); // Loading state for sending OTP
    const [otpSent, setOtpSent] = useState(false); // State to confirm OTP was sent
    const navigate = useNavigate();


    // Fetch user data when the component loads
    useEffect(() => {
        axios.get(`${API_URL}/check-user?Email=${Email}`)
            .then(response => {
                setUser(response.data); // Store user data
            })
            .catch(err => {
                setError(err.response?.data?.error || 'Error fetching data'); // Handle errors
            });
    }, [Email]);

    // Function to send OTP
    const handleSendOtp = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`${API_URL}/send-otp`, { email: Email })
            .then(() => {
                setOtpSent(true); // Set OTP sent state
                setLoading(false);
                navigate(`/pincode/${Email}`);
            })
            .catch(err => {
                setError('Error sending OTP.');
                setLoading(false);
            });
    };

    return (
        <section className="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
            <div className='px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-52' style={{ marginLeft:"500px", marginTop:"-50px" }}>
                <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700" style={{ width:"500px", marginTop:"-74px", marginLeft:"50px" }}>
                    <h5  style={{ marginTop:"10px" }} className="text-xl font-medium text-gray-900 dark:text-white">
                        Please check the information to see if it is correct or not.
                    </h5>

                    <form className="space-y-6" style={{ marginTop: '20px' }} onSubmit={handleSendOtp}>
                        {error ? (
                            <p className="text-red-500">Error: {error}</p>
                        ) : user ? (
                            <a style={{ marginTop:"38px" }} className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={user.img} alt={user.FL_name} />
                                <div className="flex flex-col justify-between p-4 leading-normal">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{user.FL_name}</h5>
                                </div>
                            </a>
                        ) : (
                            <p>Loading...</p>
                        )}

                        <div>
                            <label htmlFor="email" style={{ marginRight: "250px" }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={Email} 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                                placeholder="name@company.com" 
                                readOnly 
                            />
                        </div>

                        <button type="submit" className="w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800" disabled={loading || otpSent}>
                            {loading ? 'Sending OTP...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default CheckUser;
