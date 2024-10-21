import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditUser() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        Nickname: '',
        img: '',
        FL_name: '',
        Province: '',
        Phone: '',
        Birthday: '',
        Facebook: '',
        ID_Line: ''
    });
    const API_URL = process.env.REACT_APP_API_URL;
    const [provinces, setProvinces] = useState([]);  // State for storing province data

    useEffect(() => {
        // Fetch provinces data when the component mounts
        axios.get(`${API_URL}/province`)
            .then(response => {
                setProvinces(response.data);
            })
            .catch(error => {
                console.error('Error fetching provinces:', error);
                alert('Error fetching provinces. Please try again later.');
            });
    }, [API_URL]);

    useEffect(() => {
        // Fetch user data by ID
        fetch(`${API_URL}/users/${userId}`)
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, [userId]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                alert('Update successful');
                navigate('/homeen'); // Redirect to home or any other page after successful update
            } else {
                alert('Update failed');
            }
        })
        .catch(error => {
            console.error('Error updating user data:', error);
            alert('An error occurred');
        });
    };

    return (
        <>
            <HeaderUser />
            <div className="register-page w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700" 
                style={{ display: 'flex', justifyContent: 'center', 
                        alignItems: 'center', padding: '20px', 
                        marginTop:"120px", marginLeft:"550px" }}>
                <form class="space-y-6" onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                <h5 style={{ marginLeft:"20px" }} class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Edit user</h5>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="Nickname" className="block mb-2 text-sm font-medium dark:text-white">Nick name</label>
                            <input type="text" id="Nickname" value={userData.Nickname} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John" required />
                        </div>
                        <div>
                            <label htmlFor="img" className="block mb-2 text-sm font-medium dark:text-white">Img</label>
                            <input type="text" id="img" value={userData.img} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Url" required />
                        </div>
                        <div>
                            <label htmlFor="FL_name" className="block mb-2 text-sm font-medium dark:text-white">First name / Last name</label>
                            <input type="text" id="FL_name" value={userData.FL_name} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John Red" required />
                        </div>
                        <div>
                            <label htmlFor="Province" style={{ marginTop:"20px" }} className="block mb-2 text-sm font-medium dark:text-white">Province</label>
                            <select id="Province" value={userData.Province} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                required>
                                <option value="">{userData.Province}</option>
                                {provinces.map(province => (
                                    <option key={province.ID} value={province.PName}>
                                        {province.PName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="Phone" className="block mb-2 text-sm font-medium dark:text-white">Phone number</label>
                            <input type="tel" id="Phone" value={userData.Phone} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="12345678" required />
                        </div>
                        <div>
                            <label htmlFor="Birthday" className="block mb-2 text-sm font-medium dark:text-white">Birthday</label>
                            <input type="date" id="Birthday" value={userData.Birthday} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                required />
                        </div>
                        <div>
                            <label htmlFor="Facebook" className="block mb-2 text-sm font-medium dark:text-white">Facebook</label>
                            <input type="text" id="Facebook" value={userData.Facebook} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="name" required />
                        </div>
                        <div>
                            <label htmlFor="ID_Line" className="block mb-2 text-sm font-medium dark:text-white">Line</label>
                            <input type="text" id="ID_Line" value={userData.ID_Line} onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="id" required />
                        </div>
                    </div>
                    <button type="submit" style={{ marginTop: '20px'}}
                        className="w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800"
                        >Submit</button>
                </form>
            </div>
        </>
    );
}

export default EditUser;
