import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function ManageHotelPackages() {
    const { ID_user } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [hotelOffers, setHotelOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    };

    useEffect(() => {
        setStartDate(new Date()); // กำหนดค่าเริ่มต้นให้ startDate เป็นวันที่ปัจจุบัน
    }, []);

    useEffect(() => {
    const fetchHotelOffers = async () => {
        try {
        const response = await axios.get(`${API_URL}/check-hotel-offers`, {
            params: { ID_user, search: searchTerm }
        });
        setHotelOffers(response.data);
        } catch (error) {
        console.error('Error fetching hotel offers:', error);
        }
    };
    
    fetchHotelOffers();
    }, [ID_user, searchTerm]);

    const handleAcceptClick = (offer) => {
        setSelectedOffer(offer);
        setShowModal(true);
    };

    const handleCancelClick = async (offer) => {
        try {
            console.log('Sending data:', {
                HDID: String(offer.HDID).split(',')[0],
                CDID: String(offer.CDID).split(',')[0]
                
            });
    
            const response = await axios.post(`${API_URL}/cancel-hotel-offers`, { 
                HDID: String(offer.HDID).split(',')[0],
                CDID: String(offer.CDID).split(',')[0]
            });
    
            console.log('Response:', response.data);
            setHotelOffers(hotelOffers.filter(o => o.HDID !== offer.HDID));
        } catch (error) {
            console.error('Error cancelling hotel offer:', error.response ? error.response.data : error.message);
        }
    };
    
    // ตั้งค่า startDate เป็นวันที่ปัจจุบันเมื่อคอมโพเนนต์ถูกโหลด
    useEffect(() => {
        setStartDate(new Date()); // กำหนดค่าเริ่มต้นให้ startDate เป็นวันที่ปัจจุบัน
    }, []);
    const handleCreate = async () => {
        if (selectedOffer && startDate && endDate) {
            const hdid = String(selectedOffer.HDID).split(',')[0];
            const dataToSend = {
                HDID: hdid,
                CDID: selectedOffer.CDID,
                ID_deals: selectedOffer.ID_deals,
                Deadline_package: moment(endDate).format('YYYY-MM-DD'),
                S_Deadline_package: moment(startDate).format('YYYY-MM-DD'),
            };
    
            console.log('Data to send:', dataToSend);
    
            try {
                const response = await axios.post(`${API_URL}/confirm-hotel-offer-main`, dataToSend);
                console.log('Response:', response.data);
                setShowModal(false);
                // Update state or refresh data if needed
            } catch (error) {
                console.error('Error confirming hotel offer:', error.response ? error.response.data : error.message);
            }
        } else {
            console.error('Missing required fields for creating package');
        }
    };
    

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Manage</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>Hotel package</p>
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
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                        required 
                    />
                </div>
            </form>
            <div className="container mx-auto px-4 py-5" style={{ marginTop:"-120px", marginLeft:"30px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {hotelOffers.map(offer => (
                        <div key={offer.HDID}>
                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-5">
                                    <a href={`/matallh/${offer.ID_hotel}`}>
                                        <img className="w-full h-48 object-cover rounded-t-lg" src={offer.MinImg_Url_Hotel} alt={offer.NameH} />
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            {offer.NameH}
                                        </h5>
                                        {/* <p><strong>HDID:</strong> {offer.HDID}</p>
                                        <p><strong>CDID:</strong> {offer.CDID}</p> */}
                                        <p><strong>ประเภทโรงแรม:</strong> {offer.NameTH}</p>
                                        <p><strong>ประเภทห้อง:</strong> {offer.NameTR}</p>
                                        <p><strong>ประเภทวิว:</strong> {offer.NameTV}</p>
                                        <p><strong>จำนวนห้อง:</strong> {offer.NumOfRooms}</p>
                                        <p><strong>ราคา:</strong> {offer.Total}</p>

                                        <p style={{ marginTop:"10px" }}>ต้องการจับคู่กับ <strong>{offer.Name}</strong>  ของคูณ</p>

                                        <p><strong>วันสิ้นสุด:</strong> {offer.Datetime_match_TH}</p>
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
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && hotelOffers.map(offer =>(
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
                                                Create package
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Do you want to create a package?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 ml-10">Choose your time</h3>
                                    <div className="flex justify-center mt-4" style={{ marginRight:"250px" }}>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            dateFormat="dd/MM/yyyy"
                                            className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 ml-4"
                                            minDate={ Date(offer.Datetime_match)} 
                                            maxDate={new Date(offer.Datetime_match)} 
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button onClick={handleCreate}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Create
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
                ))}
            </div>

        </>
    );
}

export default ManageHotelPackages;
