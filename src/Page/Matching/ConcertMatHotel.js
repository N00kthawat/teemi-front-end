import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function ConcertMatHotel() {
    const { ID_user, CID, CDID, S_datetime, E_datetime} = useParams();  
    const [hotelDeals, setHotelDeals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Add search query state
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDealData, setSelectedDealData] = useState(null);
    const [statusCD, setStatusCD] = useState('');
    const [minDate, setMinDate] = useState(new Date());
    const [maxDate, setMaxDate] = useState(new Date());
    const hotelsPerPage = 9;
    const [numofroom, setNumOfRoom] = useState({
        Con_NumOfRooms: ''
    });
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // เรียก API สองตัวพร้อมกัน
                const [hotelResponse, concertResponse] = await Promise.all([
                    fetch(`${API_URL}/hoteldeals-notyou-status/1/${ID_user}?search=${searchQuery}`),
                    fetch(`${API_URL}/concertsdeals-not-approved/${CID}`)
                ]);
    
                if (!hotelResponse.ok || !concertResponse.ok) {
                    throw new Error('Network response was not ok');
                }
    
                // แปลง response เป็น JSON
                const hotelData = await hotelResponse.json();
                const concertData = await concertResponse.json();
    
                // เก็บข้อมูลทั้งสองอย่างใน state
                setHotelDeals(hotelData);
    
                // ตรวจสอบว่ามีข้อมูลเพียงพอที่จะคำนวณ minDate และ maxDate
                if (hotelData.length > 0 && concertData.length > 0) {
                    // ตรวจสอบให้แน่ใจว่า S_datetimeHD และ E_datetimeHD มีอยู่
                    const minDateHD = new Date(hotelData[0].S_datetimeHD).getTime();
                    const maxDateHD = new Date(hotelData[0].E_datetimeHD).getTime();
                    const minDateConcert = new Date(concertData[0].S_datetime).getTime();
                    const maxDateConcert = new Date(concertData[0].E_datetime).getTime();
    
                    const newMinDate = new Date(Math.min(minDateHD, minDateConcert));
                    const newMaxDate = new Date(Math.max(maxDateHD, maxDateConcert));
    
                    setMinDate(newMinDate);
                    setMaxDate(newMaxDate);
    
                    console.log("Min Date:", newMinDate);
                    console.log("Max Date:", newMaxDate);
                }
            } catch (error) {
                console.error('Error fetching deals:', error);
            }
        };
    
        fetchDeals();
    }, [ ID_user, searchQuery, CID]);
    
    

    const handleAddDeal = async () => {
        if (!endDate || !selectedDeal) {
            alert("Please select a date and a deal.");
            return;
        }
    
        const data = {
            HDID: selectedDeal?.HDID,
            CDID: CDID,
            Datetime_match: endDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            StatusD: 1,
            Con_NumOfRooms: parseInt(numofroom.Con_NumOfRooms) || 0, // Ensure this is a number
            Number_of_room: selectedDeal?.Number_of_room
        };
    
        console.log('Payload:', data); // Log payload to debug
    
        try {
            const response = await axios.post(`${API_URL}/add-deals-update-cdid`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status === 201) {
                alert('Deal added successfully');
                setShowModal(false);
            } else {
                alert('Failed to add deal');
            }
        } catch (error) {
            console.error('Error adding deal:', error.response?.data || error.message);
            alert(`An error occurred: ${error.response?.data?.message || error.message}`);
        }
    };
    

    // Calculate the index range for the current page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    // Add current hotels
    const currentHotels = hotelDeals.slice(indexOfFirstHotel, indexOfLastHotel);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(hotelDeals.length / hotelsPerPage);

    return (
        <>
            <HeaderUser />
            <h1 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>
                Matching 
            </h1>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>
                concerts with hotels.
            </p>
            
            <form className="max-w-md mx-auto my-8">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input 
                    type="search" 
                    id="default-search" 
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Search..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
            </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
            {currentHotels.map(deal => (
                <div key={deal.ID}  
                    className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    style={{ height: '700px' }}>
                    <a href={`/matallh/${deal.ID_hotel}`}>
                        <img className="rounded-t-lg w-full h-48 object-cover" src={deal.Img_Url_room} alt="" />
                        <div className="p-5">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{deal.NameH}</h5>
                            <p><strong>จำนวนห้อง:</strong> {deal.Number_of_room}</p>
                            <p><strong>ราคา:</strong> {deal.Total}</p>
                            <p><strong>ประเภทห้อง:</strong> {deal.NameTR}</p>
                            <p><strong>ประเภทวิว:</strong> {deal.NameTV}</p>
                            <p><strong>ที่อยู่:</strong> {deal.AddressH}</p>
                            <p><strong>วันเริ่มต้น:</strong> {deal.S_datetimeHD_TH}</p>
                            <p><strong>วันสิ้นสุด:</strong> {deal.E_datetimeHD_TH}</p>
                        </div>
                    </a>
                    <div className="p-5 flex justify-center">
                        <button onClick={() => {
                            setSelectedDeal(deal);
                            setSelectedDealData(deal);
                            setShowModal(true);
                        }}
                        style={{ width: "60px" }}
                        className="w-full max-w-xs inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Send
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {showModal && selectedDeal && (
            <div id="default-modal" className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0" >
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full"
                        style={{ height:"480px" }}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Deals
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Want to submit a proposal?
                                        </p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            End date set 
                                        </p>
                                    </div>
                                    <div className="relative mt-4">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6 1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0V1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                            </svg>
                                        </div>
                                        <DatePicker 
                                            selected={endDate} 
                                            onChange={(date) => setEndDate(date)} 
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="Select date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            

                                            minDate={new Date(Math.max(new Date(selectedDeal.S_datetimeHD), new Date(S_datetime)))}  // คำนวณวันที่เริ่มต้น

                                            maxDate={new Date(selectedDeal.E_datetimeHD) > new Date(E_datetime) ? new Date(E_datetime) : new Date(selectedDeal.E_datetimeHD)} // Max date logic

                                        />
                                    </div>
                                    <p style={{ marginTop:"10px" }}><strong>จำนวนห้อง:</strong> {selectedDeal.Number_of_room}</p>
                                    <p><strong>ราคา:</strong> {selectedDeal.PriceH}</p>
                                    <p><strong>ประเภทห้อง:</strong> {selectedDeal.NameTR}</p>
                                    <p><strong>ประเภทวิว:</strong> {selectedDeal.NameTV}</p>
                                    <input type="text" id="Con_NumOfRooms" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                                            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                            dark:focus:border-blue-500" 
                                            placeholder="จำนวนห้อง"
                                            value={numofroom.Con_NumOfRooms}
                                            onChange={(e) => setNumOfRoom({ ...numofroom, Con_NumOfRooms: e.target.value })}
                                            style={{  width:"200px", marginTop:"20px" }}
                                    required />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                                style={{ marginTop:"60px" }}>
                            <button
                                onClick={() => setShowModal(false)}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddDeal}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="flex justify-center mt-8">
            <nav>
                <ul className="flex list-none">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <li key={number} className="mx-1">
                            <button 
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>

        </>
    );
}

export default ConcertMatHotel;
