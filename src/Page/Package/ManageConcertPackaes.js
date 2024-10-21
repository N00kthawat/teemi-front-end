import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function ManageConcertPackages() {
    const { ID_user } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [concertOffers, setConcertOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 6;
    // ตั้งค่า startDate เป็นวันที่ปัจจุบันเมื่อคอมโพเนนต์ถูกโหลด
    useEffect(() => {
        setStartDate(new Date()); // กำหนดค่าเริ่มต้นให้ startDate เป็นวันที่ปัจจุบัน
    }, []);

    const fetchConcertOffers = async () => {
        try {
            const response = await axios.get(`${API_URL}/check-concert-offers?ID_user=${ID_user}&search=${search}`);
            setConcertOffers(response.data);
        } catch (error) {
            console.error('Error fetching concert offers:', error);
        }
    };

    useEffect(() => {
        fetchConcertOffers();
    }, [ID_user, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value); // Update search term
    };

    const handleAcceptClick = (offer) => {
        setSelectedOffer(offer);
        setShowModal(true);
    };

    const handleCreate = async () => {
        // ตรวจสอบข้อมูลที่จำเป็นต้องใช้
        if (!selectedOffer || !startDate || !endDate) {
            let missingInfo = [];
            
            if (!selectedOffer) missingInfo.push('Selected Offer');
            if (!startDate) missingInfo.push('Start Date');
            if (!endDate) missingInfo.push('End Date');
            
            // แสดงข้อความแจ้งเตือนว่าข้อมูลใดขาดหายไป
            alert(`Missing required information: ${missingInfo.join(', ')}`);
            console.error(`Missing required information: ${missingInfo.join(', ')}`);
            
            return;
        }
    
        try {
            const cdid = String(selectedOffer.CDID).split(',')[0]; // แปลงค่า CDID เป็น string แล้วแยกด้วย comma
            await axios.post(`${API_URL}/confirm-concert-offer`, {
                CDID: cdid,
                ID_deals: selectedOffer.ID_deals,
                Deadline_package: moment(endDate).format('YYYY-MM-DD'),
                S_Deadline_package: moment(startDate).format('YYYY-MM-DD'),
                HDID: selectedOffer.HDID,
                Number_of_room: selectedOffer.Number_of_room,
                Con_NumOfRooms: selectedOffer.Con_NumOfRooms
            });
    
            // เมื่อเสร็จสิ้นให้ทำการล็อกข้อความและอัปเดตข้อมูล
            console.log('Concert offer confirmed:', selectedOffer.CDID);
            setShowModal(false);
            fetchConcertOffers(); // โหลดข้อเสนอใหม่
        } catch (error) {
            console.error('Error confirming concert offer:', error);
            alert('Error confirming concert offer. Please try again.'); // เพิ่มการแจ้งเตือนผู้ใช้เมื่อเกิดข้อผิดพลาด
        }
    };
    
    
    const handleCancelClick = async (offer) => {
        if (!offer || !offer.CDID || !offer.HDID) {
            console.error('Invalid offer data');
            return;
        }
    
        try {
            const cdid = String(offer.CDID).split(',')[0];
            const hdid = String(offer.HDID).split(',')[0];
            await axios.post(`${API_URL}/cancel-concert-offers`, {
                CDID: cdid,
                HDID: hdid
            });
    
            console.log('Concert offer cancelled:', cdid);
            fetchConcertOffers();
        } catch (error) {
            console.error('Error cancelling concert offer:', error.response ? error.response.data : error.message);
        }
    };
    

    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentConcerts = concertOffers.slice(indexOfFirstHotel, indexOfLastHotel);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Calculate total pages
    const totalPages = Math.ceil(concertOffers.length / hotelsPerPage);

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Manage</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>Concert package</p>
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
                        value={search} 
                        onChange={handleSearchChange} 
                        required 
                    />
                </div>
            </form>
            <div className="container mx-auto my-10" style={{ marginTop:"-80px" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentConcerts.map(offer => (
                        <div key={offer.CDID} className="flex justify-center">
                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <a href={`/matallc/${offer.CID}`} className="flex justify-center">
                                    <img className="rounded-t-lg" src={offer.Poster || ""} alt="" style={{ maxWidth: '40%', height: 'auto', marginTop: '20px' }} />
                                </a>

                                <div className="p-5">
                                    <a href={`/matallc/${offer.CID}`}>
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{offer.Name}</h5>
                                        {/* <p><strong>ID:</strong> {offer.CDID}</p> */}
                                        <p><strong>จำนวนบัตร:</strong> {offer.Number_of_ticket}</p>
                                        <p><strong>ราคา:</strong> {offer.PriceCD}</p>
                                        <p style={{ marginTop:"10px" }}>ต้องการจับคู่กับ <strong>{offer.NameH}</strong> {offer.NameTR} - {offer.NameTV} ของคุณ จำนวน <strong>{offer.Con_NumOfRooms}</strong> ห้อง</p>
                                        <p><strong>วันสิ้นสุด:</strong> {offer.Datetime_match_TH}</p>
                                    </a>

                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleCancelClick(offer)}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => handleAcceptClick(offer)}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && concertOffers.map(offer =>(
                    <div id="default-modal" className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
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
                                <h3 className="text-lg leading-6 font-medium text-gray-900 ms-4">
                                    {selectedOffer?.Name}
                                </h3>
                                
                                <div className="flex justify-between px-4" style={{ marginTop:"20px" }}>
                                    <label className="block text-gray-700 font-bold mb-2">End Date:</label>
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
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                                    style={{ marginTop:"250px" }}>
                                <button
                                    onClick={handleCreate}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>

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
    );
}

export default ManageConcertPackages;
