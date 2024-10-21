import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import {jwtDecode } from 'jwt-decode';
import HeaderUser from "../../components/HeadUser";
import { useNavigate } from 'react-router-dom';

const Management_P = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');  // State for the search term
    const [currentPage, setCurrentPage] = useState(1);
    const packagesPerPage = 9;
    const [userId, setUserId] = useState(null);  // Store userId here
    const API_URL = process.env.REACT_APP_API_URL;

    const toggleDropdown = () => {
        setDropdownVisible(prev => !prev);
    };

    const navigateToAdd = () => {
        navigate("/hmc");
    };

    const navigateToHotelPage = () => {
        navigate("/management_hotel"); 
    };

    const navigateToConcertPage = () => {
        navigate("/management");
    };

    const navigateToHistoryPage = () => {
        navigate("/management_history");
    };

    const fetchPackages = async (userId, searchTerm) => {
        try {
            const response = await axios.get(`${API_URL}/package/${userId}`, {
                params: { search: searchTerm }
            });
            console.log('Fetched packages:', response.data); // Log the response
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    // Debounced search handler
    const debouncedFetchPackages = useCallback(debounce(fetchPackages, 500), []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }
    
        try {
            // Decode token and check its content
            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded);
    
            if (decoded && decoded.id) {
                const userId = decoded.id;
                setUserId(userId); // Save the userId in state
                console.log('userId set to:', userId);
                
                // Fetch packages after setting userId
                debouncedFetchPackages(userId, searchTerm);
            } else {
                console.error('Decoded token does not contain user ID');
                navigate('/login');
            }
    
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [searchTerm, navigate, debouncedFetchPackages]);
    


    const indexOfLastHotel = currentPage * packagesPerPage;
    const indexOfFirstHotel = indexOfLastHotel - packagesPerPage;
    const currentPackages = Array.isArray(packages) ? packages.slice(indexOfFirstHotel, indexOfLastHotel) : [];
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Calculate total pages
    const totalPages = Math.ceil(packages.length / packagesPerPage);
    
    const [showDialog, setShowDialog] = useState(false);  // สำหรับควบคุมการแสดง Dialog
    const [selectedPackage, setSelectedPackage] = useState(null);  // เก็บ package ที่จะยกเลิก


    // ฟังก์ชันปิด Dialog
    const closeDialog = () => {
        setShowDialog(false);
        setSelectedPackage(null);
    };

    // ฟังก์ชันเพื่อเปิด Dialog และบันทึก package ที่เลือก
    const handleRecantClick = (pkg) => {
        // ตั้งค่า selectedPackage ด้วยค่าที่ได้รับจาก pkg
        setSelectedPackage({
            hotelIDUser: pkg.hotelIDUser,        // ตรวจสอบชื่อฟิลด์ใน pkg
            concertIDUser: pkg.concertIDUser,    // ว่ามีข้อมูลเหล่านี้หรือไม่
            ID_deals: pkg.ID_deals,
            HDID: pkg.HDID,
            CDID: pkg.CDID
        });
    
        // แสดงข้อมูลเพื่อความมั่นใจ
        console.log('Selected Package:', {
            hotelIDUser: pkg.hotelIDUser,
            concertIDUser: pkg.concertIDUser,
            ID_deals: pkg.ID_deals,
            HDID: pkg.HDID,
            CDID: pkg.CDID
        });
    
        setShowDialog(true);
    };
    

    // ฟังก์ชันสำหรับการยืนยันยกเลิก
    const confirmRecant = async () => {
        if (selectedPackage && userId) {
            try {
                console.log('Sending cancellation request for:', selectedPackage);
    
                const response = await axios.post(`${API_URL}/cancellation-request/${userId}/${selectedPackage.hotelIDUser}/${selectedPackage.concertIDUser}/${selectedPackage.ID_deals}/${selectedPackage.HDID}/${selectedPackage.CDID}`);
    
                if (response.status === 200) {
                    alert('Cancellation request processed successfully.');
                    debouncedFetchPackages(userId, searchTerm);  // ดึงข้อมูลใหม่หลังจากยกเลิกสำเร็จ
                    closeDialog();  // ปิด dialog หลังยืนยัน
                }
            } catch (error) {
                console.error('Error processing cancellation:', error);
                alert('Failed to process cancellation.');
            }
        }
    };
    
    return (
        <>
            <HeaderUser />
            <div className="home-MN">
            <form className="max-w-md mx-auto" style={{ margin: '0 auto', maxWidth: '500px', padding: '10px' }}>
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 text-sm border border-gray-300 rounded-lg"
                        placeholder="Search .."
                        value={searchTerm}  // ผูกค่า search input กับ state
                        onChange={(e) => setSearchTerm(e.target.value)}  // อัพเดต searchTerm เมื่อมีการเปลี่ยนแปลง
                    />
                </div>
            </form>
            
                <div className="relative overflow-x-auto shadow-md" style={{ maxWidth: '1280px', margin: '20px auto', padding: '10px' }}>
                    <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white">
                        <div>
                            <button
                                id="dropdownActionButton"
                                data-dropdown-toggle="dropdownAction"
                                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                type="button"
                                style={{ height:'45px' }}
                                onClick={toggleDropdown}
                            >
                                <span className="sr-only">Action button</span>
                                แพ็คเกจ
                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                </svg>
                            </button>
                            <button style={{ marginLeft:'20px' }}
                                    onClick={navigateToAdd}
                                    class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Add
                                </span>
                            </button>       
                            <div
                                id="dropdownAction"
                                className={`z-10 ${dropdownVisible ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-900 dark:divide-gray-600`}
                            >
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-100" aria-labelledby="dropdownActionButton">
                                    <li>
                                        <a onClick={navigateToHotelPage} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            โรงแรม
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={navigateToConcertPage} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            คอนเสิร์ต
                                        </a>
                                    </li>
                                    <li>
                                        <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            แพ็คเกจ
                                        </a>
                                    </li>
                                    <li>
                                    <a onClick={navigateToHistoryPage} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                        ประวัติ
                                    </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-black-50 dark:bg-gray-900 dark:text-gray-100">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Poster
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    See
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    See
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPackages.map((pkg, index) => (
                                <tr key={index} className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="image-container" src={pkg.Poster} alt="Package Poster" />
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">
                                                <span className='text-gray-700'>{pkg.Name} X {pkg.NameH}</span>
                                            </div>
                                            <div className="font-normal text-gray-500" style={{ marginTop:"10px" }}>
                                                {pkg.StartDate_TH === pkg.EndDate_TH 
                                                    ? pkg.StartDate_TH 
                                                    : `${pkg.StartDate_TH} - ${pkg.EndDate_TH}`}
                                            </div>
                                            <div className="font-normal text-gray-500">
                                                {pkg.Ticket_zone}
                                                <span className='font-normal text-gray-500'>: จำนวน {pkg.Number_of_ticket} ใบ</span>
                                                <div style={{ marginTop:"20px" }}></div>
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                                    {pkg.Matching_Status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                    </th>
                                    <td className="px-6 py-4">
                                        {pkg.Address}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                                type="button"
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                onClick={() => handleRecantClick(pkg)}
                                            >
                                                Recant
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {pkg.ID_hotel && (
                                            <a href={`/matallh/${pkg.ID_hotel}`}
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Hotel</a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`/matallc/${pkg.CID}`}
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Concert</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDialog && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                    <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
                    <p>Are you sure you want to cancel the selected package?</p>
                    <div className="mt-4 flex justify-end space-x-3">
                        <button
                            onClick={closeDialog}
                            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmRecant}
                            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )}


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
};

export default Management_P;
