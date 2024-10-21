import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { format } from 'date-fns';

function HotelDealsA() {
    const { ID_hotel, ID_room } = useParams();
    const navigate = useNavigate();
    const [numberOfTickets, setNumberOfTickets] = useState('');
    const [Total, setTotal] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [FDate, setFDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [hotelDeals, setHotelDeals] = useState([]);
    const hotelID = ID_hotel ? ID_hotel.split(',')[0] : null;
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/roomdeals/${ID_room}`);
                const data = await response.json();
                console.log('Hotel deals data:', data); // Add console log
                setHotelDeals(data);

            } catch (error) {
                console.error("Error fetching the hotel deals:", error);
            }
        };

        fetchData();
    }, [ID_room]);
    useEffect(() => {
        setFDate(new Date()); // กำหนดค่าเริ่มต้นให้ startDate เป็นวันที่ปัจจุบัน
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ID_room || !numberOfTickets || !startDate || !endDate) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');

        const data = {
            ID_room: ID_room,  // ใช้ ID_room จาก useParams
            Number_of_room: parseInt(numberOfTickets),  // แปลงค่าให้เป็นตัวเลข
            S_datetimeHD: formattedStartDate,
            E_datetimeHD: formattedEndDate,
            StatusHD: 1,
            Total: Total
        };

        // ตรวจสอบค่าที่จะส่ง
        console.log('Sending data:', data);

        try {
            const response = await fetch(`${API_URL}/hoteldeals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Insert successful');
                navigate('/management_hotel');
            } else {
                const errorText = await response.text();
                alert(`Failed to insert: ${errorText}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }}>Create</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400"
                style={{ marginLeft: '50px' }}>Hotel Deals</p>
            {hotelDeals.map(deal => (
            <div key={deal.HDID} class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                style={{ marginLeft:"500px", marginTop:"-20px" }}>
                <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={deal.MinImg_Url_Hotel} alt=""/>
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{deal.NameH}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{deal.NameTR}</p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{deal.NameTV}</p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">ราคา {deal.PriceH}</p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">จำนวนห้องทั้งหมด {deal.NRoom} </p>
                </div>
            </div>
            ))}
            <form className="max-w-sm mx-auto" onSubmit={handleSubmit} style={{ marginTop:"20px" }}>

                <div className="mb-4">
                    <label htmlFor="Number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Number of Room
                    </label>
                    <input
                        type="number"
                        id="Number"
                        min="1"
                        value={numberOfTickets}
                        onChange={(e) => setNumberOfTickets(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="Total" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Price
                    </label>
                    <input
                        type="Total"
                        id="Total"
                        value={Total}
                        onChange={(e) => setTotal(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <label htmlFor="Type_hotel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select Time Range
                </label>

                {/* จัด DatePicker ให้อยู่แนวนอนด้วย Flexbox */}
                <div className="flex space-x-4 mb-6">
                    <div className="relative w-1/2">
                        <DatePicker
                            selected={startDate}
                            onChange={setStartDate}
                            selectsStart
                            startDate={FDate}
                            endDate={endDate}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Start Date"
                            dateFormat="dd/MM/yyyy"
                            showTimeSelect={false}
                            minDate={FDate}
                        />
                    </div>

                    <div className="relative w-1/2">
                        <DatePicker
                            selected={endDate}
                            onChange={setEndDate}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="End Date"
                            dateFormat="dd/MM/yyyy"
                            showTimeSelect={false}
                            minDate={startDate}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium 
                    rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 
                    dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </form>
        
        </>
    )
}

export default HotelDealsA;
