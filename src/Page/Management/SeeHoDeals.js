import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correctly import the default export 'jwtDecode'
import axios from 'axios';

function SeeHoDeals() {
    const { ID_hotel } = useParams();
    const hotelID = ID_hotel ? ID_hotel.split(',')[0] : null;
    const [hotelDeals, setHotelDeals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [offerStatus, setOfferStatus] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/hoteldeals-not-approved/${hotelID}`);
                const data = await response.json();
                console.log('Hotel deals data:', data); // Add console log
                setHotelDeals(data);

            } catch (error) {
                console.error("Error fetching the hotel deals:", error);
            }
        };

        fetchData();
    }, [hotelID]);

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

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
            return;
        }

        try {
            const decoded = jwtDecode(token); // Decode the token
            const userId = decoded.id; // Extract user ID from decoded token
            console.log('Decoded user ID:', userId); // Add console log

            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/${userId}`);
                    console.log('User data:', response.data); // Add console log
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

    const navigateTo_Approve = () => {
        navigate(`/seehodeals_/${ID_hotel}`);
    };
    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Your</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '60px' }}>hotel room</p>
            <div className="flex items-center justify-center py-4 md:py-8 flex-wrap" style={{ marginTop: '-50px' }}>
            {/* <button 
                type="button" 
                className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800">
                ยังไม่อนุมัติ 
            </button>
            <button 
                type="button" 
                className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
                onClick={navigateTo_Approve}>
                อนุมัติแล้ว
            </button> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center" style={{ margin: '0 auto', maxWidth: '1100px' }}>
            {hotelDeals.map(deal => (
                <div key={deal.HDID} className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href={`/hotelmatconcert/${userData?.ID_user}/${hotelID}/${deal.HDID}`} >
                        <img className="w-full h-48 object-cover rounded-t-lg" src={deal.MinImg_Url_Hotel} alt={deal.NameH} />
                    </a>
                    <div className="p-5">
                        <a href={`/hotelmatconcert/${userData?.ID_user}/${hotelID}/${deal.HDID}/${deal.S_datetimeHD}/${deal.E_datetimeHD}`}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{deal.NameH}</h5>
                            <p><strong>ประเภทห้อง:</strong> {deal.NameTR}</p>
                            <p><strong>ประเภทวิว:</strong> {deal.NameTV}</p>
                            <p><strong>จำนวนห้อง:</strong> {deal.Number_of_room}</p>
                            <p><strong>ราคา:</strong> {deal.Total}</p>
                            <p><strong>วันเริ่มต้น:</strong> {deal.S_datetimeHD_TH}</p>
                            <p><strong>วันสิ้นสุด:</strong> {deal.E_datetimeHD_TH}</p>
                            
                        </a>

                        <a href={`/editseehoteldetails/${deal.HDID}`}
                            className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Edit
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </a>

                        <a onClick={() => {
                                setSelectedDeal(deal.HDID);
                                setShowModal(true);
                            }}
                            style={{ marginLeft:"155px" }}
                            className="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Delete
                        </a>
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
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Delete Deal
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
                            <button
                                onClick={handleDelete}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Delete
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default SeeHoDeals;
