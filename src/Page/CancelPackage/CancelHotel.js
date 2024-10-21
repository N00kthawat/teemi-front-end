import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

function CancelHotel (){
    const { ID_user } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [hotelOffers, setHotelOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    const [search, setSearch] = useState(''); // Store the search input
    const [numofroom, setNumOfRoom] = useState({
        Number_of_room: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 6;

    // Fetch data whenever ID_user or search changes
    useEffect(() => {
        const fetchHotelOffers = async () => {
            try {
                const response = await axios.get(`${API_URL}/check-cancel-hotel-offers`, {
                    params: {
                        ID_user,
                        search, // Send the search query as a parameter
                    },
                });
                setHotelOffers(response.data);
            } catch (error) {
                console.error('Error fetching hotel offers:', error);
            }
        };

        fetchHotelOffers();
    }, [ID_user, search]); // Add 'search' as a dependency

    const handleSearchChange = (event) => {
        setSearch(event.target.value); // Update the search state on input change
    };

    const handleAcceptClick = (offer) => {
        setSelectedOffer(offer);
        setShowModal(true);
    };

    const handleCancelClick = async (offer) => {
        const idDeals = String(offer.ID_deals); // แปลง ID_deals เป็น string
        console.log('Sending ID_deals:', idDeals);
    
        try {
            const response = await axios.post(`${API_URL}/cancel-hotel-main`, { 
                HDID: offer.HDID,
                CDID: offer.CDID,
                ID_deals: idDeals, // ส่งค่า ID_deals ที่แปลงแล้ว
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error cancelling hotel offer:', error.response ? error.response.data : error.message);
        }
    };
    

    const handleCancel = async () => {
        if (selectedOffer) {
            const hdid = String(selectedOffer.HDID).split(',')[0];
            const cdid = String(selectedOffer.CDID).split(',')[0];
            const dataToSend = {
                HDID: hdid,
                CDID: cdid,
                ID_deals: selectedOffer.ID_deals,
                Number_of_room: selectedOffer.Number_of_room
            };
    
            console.log('Data to send:', dataToSend);
    
            try {
                const response = await axios.post(`${API_URL}/confirm-cancel-hotel-main`, dataToSend);
                console.log('Response:', response.data);
                setShowModal(false);
            } catch (error) {
                handleErrorResponse(error);
            }
        } else {
            console.error('Missing required fields for creating package');
        }
    };

    const handleErrorResponse = (error) => {
        console.error('Error:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.log('Response data:', error.response.data);
            console.log('Response status:', error.response.status);
            console.log('Response headers:', error.response.headers);
        }
    };
    
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = hotelOffers.slice(indexOfFirstHotel, indexOfLastHotel);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(hotelOffers.length / hotelsPerPage);
    

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Manage</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}> Cancellation hotel package</p>
            <form className="max-w-md mx-auto" style={{ margin: '0 auto', maxWidth: '500px', padding: '10px' }}>
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
                        placeholder="Search .." 
                        value={search} // Bind the search state to the input value
                        onChange={handleSearchChange}
                        required 
                    />
                </div>
            </form>
            <div className="container mx-auto px-4 py-5" style={{ marginTop:"-80px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {currentHotels.map(offer => (
                        <div key={offer.HDID}>
                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-5">
                                    <a href={`/matallh/${offer.ID_hotel}`}>
                                        <img className="w-full h-48 object-cover rounded-t-lg" src={offer.MinImg_Url_Hotel} alt={offer.NameH} />
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            {offer.NameH}
                                        </h5>
                                        <p><strong>ประเภทโรงแรม:</strong> {offer.NameTH}</p>
                                        <p><strong>ประเภทห้อง:</strong> {offer.NameTR}</p>
                                        <p><strong>ประเภทวิว:</strong> {offer.NameTV}</p>
                                        <p><strong>จำนวนห้อง:</strong> {offer.Con_NumOfRooms} {offer.NumOfRooms}</p>
                                        <p><strong>ราคา:</strong> {offer.Total}</p>
                                        <p><strong>วันเริ่มต้น:</strong> {offer.S_datetimeHD_TH}</p>
                                        <p><strong>วันสิ้นสุด:</strong> {offer.E_datetimeHD_TH}</p>
                                        <p style={{ marginTop:"10px" }}><strong>ขอยกเลิกจับคุ่กับ</strong> {offer.Name} <strong>ของคุณ</strong></p>
                                    </a>

                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleCancelClick(offer)}
                                            className="px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleAcceptClick(offer)}
                                            className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div id="default-modal" className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" style={{ height:"220px" }}>
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Dismiss package
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Do you want to cancel a package?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button onClick={handleCancel}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Dismiss
                                    </button>
                                    <button onClick={() => setShowModal(false)}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-4">
                <nav style={{ height: '35px' }}>
                    <ul className="flex list-none" style={{ marginTop: '-7px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <li key={number} className="mx-1">
                        <button onClick={() => paginate(number)} className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
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

export default CancelHotel