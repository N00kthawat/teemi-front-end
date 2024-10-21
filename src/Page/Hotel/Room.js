import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import HeaderUser from "../../components/HeadUser";

function Room() {
    const { ID_hotel } = useParams();
    const hotelID = ID_hotel ? ID_hotel.split(',')[0] : null;
    const navigate = useNavigate();
    const [Type_view, setTypeView] = useState('');
    const [Type_room, setTypeRoom] = useState('');
    const [PriceH, setPriceH] = useState('');
    const [Status_room, setStatusRoom] = useState('');
    const [NRoom, setNRoom] = useState('');
    const [typeRoomOptions, setTypeRoomOptions] = useState([]);
    const [typeViewOptions, setTypeViewOptions] = useState([]);
    const [roomStatusOptions, setRoomStatusOptions] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        // Fetch TypeRoom options
        const fetchTypeRoomOptions = async () => {
            try {
                const response = await axios.get(`${API_URL}/typeroom`);
                setTypeRoomOptions(response.data);
            } catch (err) {
                console.error('Error fetching type room options:', err);
            }
        };
        

        // Fetch TypeView options
        const fetchTypeViewOptions = async () => {
            try {
                const response = await axios.get(`${API_URL}/typeview`);
                setTypeViewOptions(response.data);
            } catch (err) {
                console.error('Error fetching type view options:', err);
            }
        };

        // Fetch RoomStatus options
        const fetchRoomStatusOptions = async () => {
            try {
                const response = await axios.get(`${API_URL}/roomstatus`);
                setRoomStatusOptions(response.data);
            } catch (err) {
                console.error('Error fetching room status options:', err);
            }
        };

        fetchTypeRoomOptions();
        fetchTypeViewOptions();
        fetchRoomStatusOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert inputs to appropriate types
        const numericTypeView = Number(Type_view);
        const numericTypeRoom = Number(Type_room);
        const numericPriceH = Number(PriceH);
        const numericHotelID = Number(hotelID);
        const numericNRoom = Number(NRoom);

        // Validate numeric inputs
        if (
            isNaN(numericTypeView) || 
            isNaN(numericTypeRoom) || 
            isNaN(numericPriceH) || 
            isNaN(numericHotelID) || 
            isNaN(numericNRoom)
        ) {
            setResponseMessage('Please ensure all numeric fields are valid.');
            return;
        }


        try {
            const response = await axios.post(`${API_URL}/roomhotel`, {
                ID_hotel: numericHotelID,
                Type_view: numericTypeView,
                PriceH: numericPriceH,
                Status_room: Status_room,
                Type_room: numericTypeRoom,
                NRoom: numericNRoom,
            });

            const { ID_room } = response.data;
            if (ID_room) {
                navigate(`/imgroom/${ID_room}`);
            } else {
                setResponseMessage('Room created, but no ID_room was returned.');
            }
        } catch (err) {
            console.error('Error:', err);
            setResponseMessage('Error submitting the form. Please try again later.');
        }
    };

    

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>
                Room
            </h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>
                hotel
            </p>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto" style={{ marginTop: '10px' }}>
                <label htmlFor="Type_room" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room Type</label>
                <select 
                    id="Type_room" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={Type_room} 
                    onChange={(e) => setTypeRoom(e.target.value)} 
                    required
                >
                    <option value="" disabled>Choose</option>
                    {typeRoomOptions.map((option) => (
                        <option key={option.ID_Type_Room} value={option.ID_Type_Room}>{option.NameTR}</option>
                    ))}
                </select>

                <label htmlFor="Type_view" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{ marginTop: '10px' }}>View Type</label>
                <select 
                    id="Type_view" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={Type_view} 
                    onChange={(e) => setTypeView(e.target.value)} 
                    required
                >
                    <option value="" disabled>Choose</option>
                    {typeViewOptions.map((option) => (
                        <option key={option.id} value={option.ID_Type_Room}>{option.NameTV}</option>
                    ))}
                </select>

                <label htmlFor="Status_room" style={{ marginTop: '10px' }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status Room</label>
                <select 
                    id="Status_room" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={Status_room} 
                    onChange={(e) => setStatusRoom(e.target.value)} 
                    required
                >
                    <option value="" disabled>Choose</option>
                    {roomStatusOptions.map((option) => (
                        <option key={option.id} value={option.ID_Room_Status}>{option.NameRS}</option>
                    ))}
                </select>

                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="PriceH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input 
                        type="text" 
                        id="PriceH" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={PriceH}  
                        onChange={(e) => setPriceH(e.target.value)} 
                        required 
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="NRoom" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of room</label>
                    <input 
                        type="text" 
                        id="NRoom" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={NRoom}  
                        onChange={(e) => setNRoom(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" style={{ marginTop: '20px' }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
                        w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit
                </button>
            </form>

            {responseMessage && (
                <div className="mt-4 p-4 text-white bg-green-500 rounded-lg">
                    {responseMessage}
                </div>
            )}
        </>
    );
}

export default Room;
