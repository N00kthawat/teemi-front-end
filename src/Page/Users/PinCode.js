import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function PinCode() {
    const API_URL = process.env.REACT_APP_API_URL;
    const { Email } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const inputsRef = useRef([]);

    useEffect(() => {
        axios.get(`${API_URL}/check-user?Email=${Email}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(err => {
                setError(err.response?.data?.error || 'Error fetching data');
            });
    }, [Email]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === "") {
            let newPin = [...otp];
            newPin[index] = value;
            setOTP(newPin);
            if (value && index < inputsRef.current.length - 1) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    const isPinComplete = otp.every(p => p !== ""); // ตรวจสอบว่า pin ทุกช่องถูกกรอกครบหรือยัง

    const handleSend = () => {
        if (!isPinComplete) {
            alert("Please fill out all pin code fields.");
            return;
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setPasswordError('');
    };

    const handleConfirmPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
    
        try {
            const otpCode = otp.join(""); // Combine OTP digits into one string
            const response = await axios.post(`${API_URL}/reset-password`, {
                email: Email,
                otp: otpCode,
                newPassword: newPassword
            });
    
            if (response.status === 200) {
                alert("Password reset successfully!");
                navigate("/"); // Redirect to the login page or another appropriate route
            } else {
                setPasswordError("Failed to reset the password.");
            }
        } catch (error) {
            setPasswordError(error.response?.data || "Error resetting the password.");
        }
    };
    
    

    return (
        <>
            <section className="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
                <div className='px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-52' style={{ marginLeft:"550px", marginTop:"-50px" }}>
                    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <form className="space-y-6">
                            <h5 className="text-xl font-medium text-gray-900 dark:text-white" style={{ marginTop:"16px" }}>Pin code</h5>
                            {error ? (
                                <p className="text-red-500">Error: {error}</p>
                            ) : user ? (
                                <a style={{ marginTop:"20px" }} className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={user.img} alt={user.FL_name} />
                                    <div className="flex flex-col justify-between p-4 leading-normal">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{user.FL_name}</h5>
                                    </div>
                                </a>
                            ) : (
                                <p>Loading...</p>
                            )}

                            <div className="flex mb-2 space-x-2 rtl:space-x-reverse" style={{ marginLeft:"26px" }}>
                                {otp.map((_, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            value={otp[index]}
                                            onChange={(e) => handleChange(e, index)}
                                            ref={el => inputsRef.current[index] = el}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={handleSend}
                                className="w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800" 
                                type="button">
                                Send
                            </button>
                        </form>
                    </div>

                    {isModalOpen && (
                        <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50">
                            <div className="relative p-4 w-full max-w-md max-h-full">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Create New Password
                                        </h3>
                                        <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 1"/>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <form className="p-4 md:p-5" onSubmit={handleConfirmPassword}>
                                        <div className="grid gap-4 mb-4 grid-cols-2">
                                            <div className="col-span-2">
                                                <label htmlFor="Password" style={{ marginRight:"230px" }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    New Password
                                                </label>
                                                <input type="password"
                                                    name="Password"
                                                    id="Password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="*********"
                                                    required />
                                            </div>
                                            <div className="col-span-2">
                                                <label htmlFor="Confirm Password" style={{ marginRight:"180px" }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                    Confirm New Password
                                                </label>
                                                <input type="password"
                                                    name="ConfirmPassword"
                                                    id="ConfirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="*********"
                                                    required />
                                            </div>
                                            {passwordError && <p className="text-red-500">{passwordError}</p>}
                                        </div>
                                        <button type="submit" className="w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800">
                                            Confirm Password
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default PinCode;