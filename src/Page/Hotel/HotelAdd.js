import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected the import
import { useNavigate } from 'react-router-dom';
import HeaderUser from "../../components/HeadUser";

function HotelAdd() {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        Type_hotel: '',
        NameH: '',
        AddressH: '',
        DetailH: ''
    });
    const [hotelTypes, setHotelTypes] = useState([]);

    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

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
                }
            };
            fetchUserData();
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hotelResponse = await axios.get(`${API_URL}/typehotel`);
                setHotelTypes(hotelResponse.data);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            console.error('User ID is missing.');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/hotels`, {
                ID_user: userId,
                ...formData
            });
    
            if (response.data && response.data.ID_hotel) {
                const { ID_hotel } = response.data;
                console.log('Data inserted successfully:', response.data);
                navigate(`/chanelh/${ID_hotel}`); // Redirect to imghotel page with ID_hotel
            } else {
                console.error('ID_hotel is missing in the response data.');
            }
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    return (
        <>
            <HeaderUser />
            <h5
                className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }} >
                Hotel
            </h5>
            <form className="max-w-sm mx-auto" style={{ marginTop: '60px' }} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="NameH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" id="NameH" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={formData.NameH} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="AddressH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                    <input type="text" id="AddressH" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={formData.AddressH} onChange={handleChange} required />
                </div>
                <label htmlFor="Type_hotel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hotel type</label>
                <select id="Type_hotel" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={formData.Type_hotel} onChange={handleChange} required>
                    <option value="" disabled>Choose</option>
                    {hotelTypes.map((type) => (
                        <option key={type.ID_type} value={type.ID_Type_Hotel}>{type.NameTH}</option>
                    ))}
                </select>
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="DetailH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detail</label>
                    <input type="text" id="DetailH" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData.DetailH} onChange={handleChange} required />
                </div>
                <button type="submit" style={{ marginTop: '20px' }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
                        w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit
                </button>
            </form>
        </>
    );
}

export default HotelAdd;
