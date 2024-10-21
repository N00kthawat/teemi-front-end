import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function HotelMatConcert() {
    const { ID_user, ID_hotel, HDID, S_datetimeHD, E_datetimeHD } = useParams();
    const hotelID = ID_hotel ? ID_hotel.split(',')[0] : null;
    const [concertDeals, setConcertDeals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [hotelDeals, setHotelDeals] = useState([]);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [selectedDealData, setSelectedDealData] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 6;
    const [search, setSearch] = useState('');

    const [numofroom, setNumOfRoom] = useState({
        NumOfRoom: ''
    });
    
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchConcertDeals = async () => {
        try {
            const response = await axios.get(`${API_URL}/concertsdeals-notyou-status?ID_user=${ID_user}&search=${search}`);
            setConcertDeals(response.data);
        } catch (error) {
            console.error('Error fetching concert offers:', error);
        }
    };

    useEffect(() => {
        fetchConcertDeals();
    }, [ID_user, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value); // Update search term
    };


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
        if (!endDate || !selectedDeal || !hotelDeals) {
            alert("Please select a date and a deal.");
            return;
        }

        const data = {
            HDID: Number(HDID), // แปลงเป็นตัวเลข
            CDID: selectedDeal,
            Datetime_match: endDate.toISOString().split('T')[0], // รูปแบบวันที่ถูกต้อง
            StatusD: 1,
            NumOfRoom: Number(numofroom?.NumOfRoom || 0) // ตรวจสอบและแปลงเป็นตัวเลข
        };
        

        try {
            const response = await axios.post(`${API_URL}/add-deals-update-hdid`, data);
            if (response.status === 201) {
                alert('Deal added successfully');
                setShowModal(false);
            } else {
                alert('Failed to add deal');
            }
        } catch (error) {
            console.error('Error adding deal:', error);
            alert('An error occurred while adding the deal.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDeal(null);  // ล้าง selected deal
        setEndDate(null);       // ล้าง end date
    };
    

    // Calculate the index range for the current page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    // Add current hotels
    const currentHotels = concertDeals.slice(indexOfFirstHotel, indexOfLastHotel);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(concertDeals.length / hotelsPerPage);

    return (
        <>
            <HeaderUser />
            <form className="max-w-md mx-auto" style={{ marginTop:"100px" }}>
                <h1 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '-490px' }}>
                    Matching 
                </h1>
                <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '-490px' }}>hotels with concerts.</p>

                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative" style={{ marginTop:"-55px" }}>
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        value={search}
                        onChange={handleSearchChange}
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search ..."
                        required
                    />
                </div>
            </form>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center" style={{ margin: '0 auto', maxWidth: '1100px', marginTop:"10px" }}>
                    {currentHotels.map(deal => (
                        <div key={deal.CID} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                                style={{ height:"800px" }}>
                            <a href={`/matallc/${deal.CID}`} className="flex-grow text-decoration-none">
                                <div className="h-3/5">
                                    <img className="rounded-t-lg mx-auto mt-6" style={{ height: '80%' }} src={deal.Poster} alt={deal.Name} />
                                </div>
                                <div className="p-5">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white -mt-16">
                                        {deal.Name}
                                    </h5>
                                    <p><strong>โซนที่นั้่ง:</strong> {deal.Ticket_zone}</p>
                                    <p><strong>จำนวนบัตร:</strong> {deal.Number_of_ticket}</p>
                                    <p><strong>ราคา:</strong> {deal.PriceCD}</p>
                                    <p><strong>วันเริ่มต้น:</strong> {deal.S_datetime_TH}</p>
                                    <p><strong>วันสิ้นสุด:</strong> {deal.E_datetime_TH}</p>
                                    
                                </div>
                            </a>
                            <div className="p-5">
                                <button
                                    onClick={() => {
                                        setSelectedDeal(deal.CDID);
                                        setSelectedDealData(deal);
                                        setShowModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 
                                            focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full justify-center"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            
                {showModal && selectedDealData && hotelDeals.map(deal => (
                    <div  id="default-modal" className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select End Date</h3>
                                    <button onClick={() => setShowModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
                                            rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Select end date"
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 
                                            focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                            dark:focus:border-blue-500"
                                    minDate={new Date(Math.max(new Date(S_datetimeHD), new Date(selectedDealData.S_datetime)))}  // คำนวณวันที่เริ่มต้น

                                    maxDate={new Date(E_datetimeHD) > new Date(selectedDealData.E_datetime) ? new Date(selectedDealData.E_datetime) : new Date(E_datetimeHD)} // Max date logic
                            
                                    
                                />

                                </div>

                                <div>
                                <p style={{ marginLeft:"30px" }}><strong>ประเภทห้อง:</strong> {deal.NameTR} - {deal.NameTV}</p>
                                <p style={{ marginLeft:"30px" }}><strong>จำนวนห้อง:</strong> {deal.Number_of_room}</p>
                                <p style={{ marginLeft:"30px" }}><strong>วันเริ่มต้น:</strong> {deal.S_datetimeHD} - {deal.E_datetimeHD}</p>
                                    <input type="text" id="NumOfRoom" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                            rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                                            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                            dark:focus:border-blue-500" 
                                            placeholder="จำนวนห้องที่ต้องการ"
                                            value={numofroom.NumOfRoom}
                                            onChange={(e) => setNumOfRoom({ ...numofroom, NumOfRoom: e.target.value })}
                                            style={{ marginLeft:"30px", width:"200px", marginTop:"20px" }}
                                    required />
                                </div>
                                <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                                    <button onClick={handleAddDeal} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 
                                            dark:focus:ring-blue-800">Add Deal</button>
                                    <button     onClick={handleCloseModal} 
                                            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 
                                            focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 
                                            dark:focus:ring-gray-600">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            <div className="flex justify-center mt-4">
                    <nav style={{ height: '35px' }}>
                        <ul className="flex list-none -mt-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <li key={number} className="mx-1">
                                    <button 
                                        onClick={() => paginate(number)}
                                        className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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

export default HotelMatConcert;
