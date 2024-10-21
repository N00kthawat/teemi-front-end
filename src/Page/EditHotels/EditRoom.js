import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';

function EditRoom() {
    const { ID_room } = useParams();
    const navigate = useNavigate(); // For navigation after successful update
    const [roomData, setRoomData] = useState({
        Type_view: '',
        Status_room: '',
        PriceH: '',
        NRoom: ''
    });
    const [typeViewOptions, setTypeViewOptions] = useState([]);
    const [statusRoomOptions, setStatusRoomOptions] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // ดึงข้อมูลห้องจาก API
        const fetchRoomData = async () => {
            try {
                const response = await axios.get(`${API_URL}/roomhotel/${ID_room}`);
                const data = response.data[0];
                // ตรวจสอบค่า EndRoom หากไม่มี ให้เป็น null (เพื่อรองรับ DatePicker)
                setRoomData({
                    ...data,
                });
            } catch (error) {
                console.error("There was an error fetching the room data!", error);
            }
        };

        const fetchTypeViewOptions = async () => {
            try {
                const response = await axios.get(`${API_URL}/typeview-ed`);
                setTypeViewOptions(response.data);
            } catch (error) {
                console.error("There was an error fetching the type view options!", error);
            }
        };

        const fetchStatusRoomOptions = async () => {
            try {
                const response = await axios.get(`${API_URL}/roomstatus-ed`);
                setStatusRoomOptions(response.data);
            } catch (error) {
                console.error("There was an error fetching the status room options!", error);
            }
        };

        fetchRoomData();
        fetchTypeViewOptions();
        fetchStatusRoomOptions();
    }, [ID_room]);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setRoomData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`${API_URL}/roomhotel/${ID_room}`, {
                ...roomData,
            });
            alert('Room updated successfully!');
            navigate('/management_hotel');
        } catch (error) {
            console.error("There was an error updating the room data!", error);
            alert('Failed to update the room. Please try again.');
        }
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }}>Edit</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400"
                style={{ marginLeft: '50px' }}>Room</p>
            <form className="max-w-sm mx-auto" style={{ marginTop: '60px' }} onSubmit={handleSubmit}>
                <label htmlFor="Type_view" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">View type</label>
                <select 
                    id="Type_view" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={roomData.Type_view}
                    onChange={handleInputChange}
                    required
                >
                    <option value="" disabled>Choose</option>
                    {typeViewOptions.map(option => (
                        <option key={option.ID_Type_Room} value={option.ID_Type_Room}>
                            {option.NameTV} {/* Assuming the table has a NameTV column */}
                        </option>
                    ))}
                </select>
                <label htmlFor="Status_room" style={{ marginTop: '20px' }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status room</label>
                <select 
                    id="Status_room" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                    dark:focus:border-blue-500"
                    value={roomData.Status_room}
                    onChange={handleInputChange}
                    required
                >
                    <option value="" disabled>Choose</option>
                    {statusRoomOptions.map(option => (
                        <option key={option.ID_Room_Status} value={option.ID_Room_Status}>
                            {option.NameRS} {/* Assuming the table has a StatusName column */}
                        </option>
                    ))}
                </select>
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="PriceH" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input 
                        type="text" 
                        id="PriceH" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={roomData.PriceH}
                        onChange={handleInputChange}
                        required 
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="NRoom" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of Room</label>
                    <input 
                        type="text" 
                        id="NRoom" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={roomData.NRoom}
                        onChange={handleInputChange}
                        required 
                    />
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

export default EditRoom;
