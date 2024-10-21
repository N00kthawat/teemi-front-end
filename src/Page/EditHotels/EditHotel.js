import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';

function EditHotel() {
    const { ID_hotel } = useParams();
    const navigate = useNavigate(); 
    const [hotelData, setHotelData] = useState({
        NameH: '',
        AddressH: '',
        Type_hotel: '',
        DetailH: ''
    });

    const [hotelTypes, setHotelTypes] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await axios.get(`${API_URL}/hotels/${ID_hotel}`);
                setHotelData({
                    NameH: response.data.NameH || '',
                    AddressH: response.data.AddressH || '',
                    Type_hotel: response.data.Type_hotel || '',
                    DetailH: response.data.DetailH || ''
                });
            } catch (error) {
                console.error('Error fetching hotel data:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('General error:', error.message);
                }
            }
        };

        const fetchHotelTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/typehotel-ed`);
                setHotelTypes(response.data);
            } catch (error) {
                console.error('Error fetching hotel types:', error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/typeroom-ed`);
                setRoomTypes(response.data);
            } catch (error) {
                console.error('Error fetching room types:', error);
            }
        };

        fetchHotelData();
        fetchHotelTypes();
        fetchRoomTypes();
    }, [ID_hotel]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setHotelData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/hotels/${ID_hotel}`, hotelData);
            navigate('/management_hotel'); 
        } catch (error) {
            console.error('Error updating hotel data:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('General error:', error.message);
            }
        }
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }}>Edit</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400"
                style={{ marginLeft: '50px' }}>Hotel</p>
            <form className="max-w-sm mx-auto" style={{ marginTop: '60px' }} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="NameH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                    <input type="text" id="NameH" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={hotelData.NameH} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="AddressH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                    <input type="text" id="AddressH" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={hotelData.AddressH} onChange={handleChange} required />
                </div>
                <label htmlFor="Type_hotel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hotel type</label>
                <select id="Type_hotel" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={hotelData.Type_hotel} onChange={handleChange} required>
                    <option value="" disabled>Choose</option>
                    {hotelTypes.map((type) => (
                        <option key={type.ID_Type_Hotel} value={type.ID_Type_Hotel}>
                            {type.NameTH}
                        </option>
                    ))}
                </select>
                {/* <label htmlFor="Type_room" style={{ marginTop: '20px' }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room type</label>
                <select id="Type_room" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={hotelData.Type_room} onChange={handleChange} required>
                    <option value="" disabled>Choose</option>
                    {roomTypes.map((type) => (
                        <option key={type.ID_Type_Room} value={type.ID_Type_Room}>
                            {type.NameTR}
                        </option>
                    ))}
                </select> */}
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="DetailH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detail</label>
                    <input type="text" id="DetailH" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={hotelData.DetailH} onChange={handleChange} required />
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

export default EditHotel;
