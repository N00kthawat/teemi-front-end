import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

function CMH() {
    const { ID_user, ID_hotel, HDID, S_datetimeHD, E_datetimeHD } = useParams();
    const [concertDeals, setConcertDeals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hotelDeals, setHotelDeals] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 6;
    const [numofrooms, setNumOfRooms] = useState({
        NumOfRooms: ''
    });
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    
    const navigateToCMHOtherPage = () => {
        navigate(`/cmhother/${ID_user}/${ID_hotel}/${HDID}/${S_datetimeHD}/${E_datetimeHD}`);
    };


    useEffect(() => {
        const fetchConcertDeals = async () => {
            try {
                const response = await axios.get(`${API_URL}/concertsdeals-you-status/1/${ID_user}`, {
                    params: { search: searchQuery }
                });
                setConcertDeals(response.data);
            } catch (error) {
                console.error("Error fetching the concert deals:", error);
            }
        };

        // Fetch deals whenever searchQuery changes
        fetchConcertDeals();
    }, [ID_user, searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/hoteldeals-not-approved-c/${HDID}`);
                const data = await response.json();
                console.log('Hotel deals data:', data); // Add console log
                setHotelDeals(data);

            } catch (error) {
                console.error("Error fetching the hotel deals:", error);
            }
        };

        fetchData();
    }, [HDID]);

    const handleAddDeal = async () => {
        if (!endDate || !selectedDeal) {
            alert("Please select a date and a deal.");
            return;
        }
    
        // ใช้ toISOString เพื่อให้ได้รูปแบบที่ถูกต้อง
        const formattedEndDate = endDate.toISOString().split('.')[0]; // ตัด milliseconds ออก
        const formattedStartDate = startDate instanceof Date && !isNaN(startDate) 
            ? startDate.toISOString().split('.')[0] // ตัด milliseconds ออก
            : new Date().toISOString().split('.')[0]; // ถ้าไม่ใช่ให้ใช้วันที่ปัจจุบัน
            const numberOfRooms = hotelDeals.length > 0 ? Number(hotelDeals[0].Number_of_room) : 0;
        // สร้าง object ข้อมูล
        const data = {
            HDID: Number(HDID), // แปลงเป็น Number
            CDID: Number(selectedDeal), // แปลงเป็น Number
            Datetime_match: formattedEndDate, // ใช้ formattedEndDate
            StatusD: 2,
            Deadline_package: formattedEndDate, // ใช้ formattedEndDate
            S_Deadline_package: formattedStartDate, // ใช้ formattedStartDate
            NumOfRooms: Number(numofrooms.NumOfRooms), // แปลงเป็น Number
            Number_of_room: numberOfRooms
        };
    
        console.log('Data to be sent:', data); // ตรวจสอบค่าที่ส่งไป
    
        try {
            const response = await axios.post(`${API_URL}/add-deals-update-insert-cdid`, data);
            if (response.status === 201) {
                alert('Deal added successfully');
                setShowModal(false);
            } else {
                alert('Failed to add deal');
            }
        } catch (error) {
            console.error('Error adding deal:', error.response ? error.response.data : error.message);
            alert('An error occurred while adding the deal.');
        }
    };
    

    // Calculate the index range for the current page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentConcerts = concertDeals.slice(indexOfFirstHotel, indexOfLastHotel);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Calculate total pages
    const totalPages = Math.ceil(concertDeals.length / hotelsPerPage);

    return (
        <>
            <HeaderUser />
            <form className="max-w-md mx-auto my-8" style={{ marginTop:"60px" }}>
                <h1 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '-490px' }}>
                    Matching 
                </h1>
                <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '-490px' }}>hotels with concerts.</p>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative" style={{ marginTop:"-60px" }}>
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
            <div class="text-center">
                <div class="inline-flex rounded-md shadow-sm" role="group">
                <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-s-lg hover:bg-gray-800 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-700">
                    ผู้ใช้เอง
                </button>
                <button type="button" onClick={navigateToCMHOtherPage}
                        class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    ผู้ใช้อื่น
                </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center" 
                    style={{ 
                                margin: '0 auto', 
                                maxWidth: '1100px', 
                                marginLeft:"200px" 
                        }}>
                {currentConcerts.map(deal => (
                    <div key={deal.DealID} className="flex flex-col max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" 
                        style={{ height: '800px' }}>
                        <a href={`/matallc/${deal.CID}`} style={{ flexGrow: 1, textDecoration: 'none' }}>
                            <div style={{ height: '55%' }}>
                                <img className="rounded-t-lg" style={{ height: '80%', display: 'block', margin: '0 auto', marginTop:'25px' }} src={deal.Poster} alt="" />
                            </div>
                            <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white" style={{ marginTop:'-70px' }}>
                                    {deal.Name}
                                </h5>
                                <p><strong>จำนวนบัตร:</strong> {deal.Number_of_ticket}</p>
                                <p><strong>ราคา:</strong> {deal.PriceCD}</p>
                                <p><strong>วันเริ่มต้น:</strong> {deal.S_datetime_TH}</p>
                                <p><strong>วันสิ้นสุด:</strong> {deal.E_datetime_TH}</p>
                            </div>
                        </a>
                        <div className="p-5" style={{ padding: '0 1rem 1rem 1rem' }}>
                            <button
                                onClick={() => {
                                    setSelectedDeal(deal.CDID);
                                    setShowModal(true);
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 
                                            focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 
                                            w-full justify-center"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && selectedDeal && hotelDeals.map(deal =>(
                <div id="default-modal" className="fixed inset-0 z-50 overflow-y-auto" >
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0" >
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div style={{ height: '500px' }}
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
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
                                        <div className="relative max-w-sm">
                                        <label className="block text-gray-700 font-bold mb-2">End Date:</label>
                                            <div className="flex justify-between px-4" style={{ marginLeft:"-15px" }}>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={(date) => setEndDate(date)}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                                                rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                                                                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                                                dark:focus:border-blue-500"
                                                    minDate={new Date(deal.S_datetimeHD)} // แปลงวันที่เริ่มต้น
                                                    maxDate={new Date(deal.E_datetimeHD)} // แปลงวันที่สิ้นสุด
                                                />
                                            </div>
                                            <p style={{ marginTop:"20px" }}><strong>{deal.NameH}</strong></p>
                                            <p ><strong></strong> {deal.NameTR} - {deal.NameTV}</p>
                                            <p ><strong>จำนวนห้อง:</strong> {deal.Number_of_room}</p>
                                            <p ><strong>วันเริ่มต้น:</strong> {deal.S_datetimeHD} - {deal.E_datetimeHD}</p>
                                            <input type="text" id="NumOfRooms" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                                            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                            dark:focus:border-blue-500" 
                                            placeholder="จำนวนห้องที่ต้องการ"
                                            value={numofrooms.NumOfRooms}
                                            onChange={(e) => setNumOfRooms({ ...numofrooms, NumOfRooms: e.target.value })}
                                            style={{  width:"180px", marginTop:"20px" }}
                                    required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" 
                                    style={{marginTop:'50px'}}>
                                <button
                                    type="button"
                                    onClick={handleAddDeal}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-4">
                <nav style={{ height:'35px' }}>
                    <ul className="flex list-none" style={{ marginTop:'-7px' }}>
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
    )
}

export default CMH;
