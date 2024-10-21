import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correctly import the default export 'jwtDecode'
import 'react-datepicker/dist/react-datepicker.css';

function HMC() {
    const [hotelDeals, setHotelDeals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [offerStatus, setOfferStatus] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Add search query state
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 6;
    const [isLoading, setIsLoading] = useState(false); // สถานะการโหลด
    const API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                return;
            }
    
            try {
                // ตั้งค่ากำลังโหลดข้อมูล
                setIsLoading(true);
    
                // Include search query in the API request, ใช้ search แทน NameH
                const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
                const response = await fetch(`${API_URL}/hoteldeals-not-approved-u/${userId}${query}`);
                
                // ตรวจสอบสถานะของ response ก่อนที่จะทำงานต่อ
                if (!response.ok) {
                    throw new Error(`Error fetching hotel deals: ${response.statusText}`);
                }
    
                const data = await response.json();
                console.log('Hotel deals data:', data);
                setHotelDeals(data);
    
                // หากมีข้อมูลและ statusHD ในดีล
                if (data.length > 0 && data[0].StatusHD) {
                    const statusResponse = await fetch(`${API_URL}/offerStatus/${data[0].StatusHD}`);
                    
                    // ตรวจสอบสถานะของ response
                    if (!statusResponse.ok) {
                        throw new Error(`Error fetching offer status: ${statusResponse.statusText}`);
                    }
    
                    const statusData = await statusResponse.json();
                    console.log('Offer status data:', statusData);
                    setOfferStatus(statusData);
                }
            } catch (error) {
                console.error("Error fetching the hotel deals or offer status:", error);
            } finally {
                // ปิดสถานะการโหลดข้อมูล
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [userId, searchQuery]); // การทำงานจะขึ้นอยู่กับ userId และ searchQuery
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
            return;
        }

        try {
            const decoded = jwtDecode(token); // Decode the token
            const userId = decoded.id; // Extract user ID from decoded token
            setUserId(userId);
            console.log('Decoded user ID:', userId);

            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/${userId}`);
                    console.log('User data:', response.data);
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login'); // Redirect to login page if decoding fails
        }
    }, [navigate]);

    const handleDelete = async () => {
        try {
            await fetch(`${API_URL}/hoteldeals/${selectedDeal}`, {
                method: 'DELETE',
            });
            setHotelDeals(hotelDeals.filter(deal => deal.HDID !== selectedDeal));
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting the deal:", error);
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
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Your</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '60px' }}>hotel room</p>
            <form className="max-w-md mx-auto my-8" style={{ marginTop:"-70px" }}>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center" style={{ margin: '0 auto', maxWidth: '1100px' }}>
                {currentHotels.map(deal => (
                    <div key={deal.HDID}>
                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                            style={{ height: "550px", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div className="p-5 flex-grow">
                                <img className="w-full h-48 object-cover rounded-t-lg" src={deal.MinImg_Url_Hotel} alt={deal.NameH} />
                                <a href={`/cmh/${userId}/${deal.ID_hotel}/${deal.HDID}/${deal.S_datetimeHD}/${deal.E_datetimeHD}`}>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{deal.NameH}</h5>
                                    {/* <p><strong>ID:</strong> {deal.HDID}</p> */}
                                    <p><strong>ห้อง:</strong> {deal.NameTR} - {deal.NameTV}</p>
                                    <p><strong>จำนวนห้อง:</strong> {deal.Number_of_room}</p>
                                    <p><strong>ราคา:</strong> {deal.Total}</p>
                                    <p><strong>วันเริ่มต้น:</strong> {deal.S_datetimeHD_TH}</p>
                                    <p><strong>วันสิ้นสุด:</strong> {deal.E_datetimeHD_TH}</p>
                                    {/* <p><strong>สถานะ:</strong> {offerStatus ? offerStatus[0]?.NameOS : 'Loading...'}</p> */}
                                </a>
                            </div>

                            {/* ปุ่ม Edit และ Delete */}
                            <div className="mt-auto p-5 flex justify-between">
                                <a href={`/editseehoteldetails/${deal.HDID}`}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Edit
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </a>

                                <a onClick={() => {
                                    setSelectedDeal(deal.HDID);
                                    setShowModal(true);
                                }}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Delete
                                </a>
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
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Delete Confirmation
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this deal? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={handleDelete} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Delete
                                </button>
                                <button onClick={() => setShowModal(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                                    Cancel
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

export default HMC;
