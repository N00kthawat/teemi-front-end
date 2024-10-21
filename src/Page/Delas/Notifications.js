import React, { useEffect, useState } from 'react';
import HeaderUser from '../../components/HeadUser';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Notifications() {
    const { ID_user } = useParams();
    const [hotelOffers, setHotelOffers] = useState(null);
    const [concertOffers, setConcertOffers] = useState(null); // เพิ่ม state สำหรับ concert offers
    const [cancelhotelOffers, setcancelHotelOffers] = useState(null);
    const [cancelconcertOffers, setCancelConcertOffers] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchHotelOffers = async () => {
            try {
                const response = await axios.get(`${API_URL}/count-hotel-offers`, {
                    params: { ID_user }
                });
                setHotelOffers(response.data);
            } catch (error) {
                console.error('Error fetching hotel offers:', error);
            }
        };
        const fetchCancelHotelOffers = async () => {
            try {
                const response = await axios.get(`${API_URL}/count-cancel-hotel-offers`, {
                    params: { ID_user }
                });
                setcancelHotelOffers(response.data);
            } catch (error) {
                console.error('Error fetching hotel offers:', error);
            }
        };

        const fetchConcertOffers = async () => { // เพิ่มการดึงข้อมูล concert offers
            try {
                const response = await axios.get(`${API_URL}/count-concert-offers`, {
                    params: { ID_user }
                });
                setConcertOffers(response.data);
            } catch (error) {
                console.error('Error fetching concert offers:', error);
            }
        };

        const fetchCancelConcertOffers = async () => { // เพิ่มการดึงข้อมูล concert offers
            try {
                const response = await axios.get(`${API_URL}/count-cancel-concert-offers`, {
                    params: { ID_user }
                });
                setCancelConcertOffers(response.data);
            } catch (error) {
                console.error('Error fetching concert offers:', error);
            }
        };

        
        fetchHotelOffers();
        fetchConcertOffers(); // เรียกฟังก์ชันนี้ใน useEffect เพื่อดึงข้อมูล
        fetchCancelHotelOffers();
        fetchCancelConcertOffers();

    }, [ID_user]);

    return (
        <>
            <HeaderUser />
            <div
                className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
                style={{ marginTop: '150px' }}
            >
                <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Notifications</h5>
                <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
                    Notifications of your hotel and concert deals.
                </p>
                <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                    <div className="relative">
                        <a
                            href={`/managehotelpackaes/${ID_user}`}
                            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                            <svg
                                className="w-[35px] h-[35px] text-white-800 dark:text-white"
                                aria-hidden="true"
                                style={{ marginRight: '10px' }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                                />
                            </svg>
                            <div className="text-left rtl:text-right">
                                <div className="mb-1 text-xs">Go to hotel offer alerts</div>
                                <div className="-mt-1 font-sans text-sm font-semibold">H O T E L S</div>
                            </div>
                            {hotelOffers && hotelOffers[0] && (
                                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                                    {hotelOffers[0].offerCountHotel}
                                </div>
                            )}
                        </a>
                    </div>
                    <div className="relative">
                        <a
                            href={`/manageconcertpackaes/${ID_user}`}
                            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                            <svg
                                className="w-[35px] h-[35px] text-white-800 dark:text-white"
                                aria-hidden="true"
                                style={{ marginRight: '10px' }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M18.5 12A2.5 2.5 0 0 1 21 9.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 1 0 5V17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2.5a2.5 2.5 0 0 1-2.5-2.5Z"
                                />
                            </svg>
                            <div className="text-left rtl:text-right">
                                <div className="mb-1 text-xs">Go to concert offer alerts</div>
                                <div className="-mt-1 font-sans text-sm font-semibold">C O N C E R T S</div>
                            </div>
                            {concertOffers && concertOffers[0] && (
                                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                                    {concertOffers[0].offerCount}
                                </div>
                            )}
                        </a>
                    </div>
                </div>


                <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse"
                    style={{ marginTop:"20px" }}>
                    <div className="relative">
                        <a
                            href={`/cancelhotel/${ID_user}`}
                            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                            
                            <div className="text-left rtl:text-right">
                                <div className="mb-1 text-xs">
                                Cancel hotel offer</div>
                                <div className="-mt-1 font-sans text-sm font-semibold">H O T E L S</div>
                            </div>
                            {cancelhotelOffers && cancelhotelOffers[0] && (
                                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                                    {cancelhotelOffers[0].offerCountHotel}
                                </div>
                            )}
                        </a>
                    </div>
                    <div className="relative">
                        <a
                            href={`/cancelconcert/${ID_user}`}
                            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                        >
                        
                            <div className="text-left rtl:text-right">
                                <div className="mb-1 text-xs">
                                Cancel concert offer</div>
                                <div className="-mt-1 font-sans text-sm font-semibold">C O N C E R T S</div>
                            </div>
                            {cancelconcertOffers && cancelconcertOffers[0] && (
                                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                                    {cancelconcertOffers[0].offerCount_cancel_concert}
                                </div>
                            )}
                        </a>
                    </div>
                </div>

                
                <Typography
                    gutterBottom
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        color: 'black',
                        fontFamily: 'Myriad Pro, sans-serif',
                    }}
                    variant="h2"
                    marginTop={'190px'}
                >
                    TEE<span style={{ color: 'skyblue' }}>MI</span>
                </Typography>
            </div>
        </>
    );
}

export default Notifications;
