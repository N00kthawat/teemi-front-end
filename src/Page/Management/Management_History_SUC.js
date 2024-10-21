import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import {jwtDecode } from 'jwt-decode';
import HeaderUser from "../../components/HeadUser";
import { useNavigate } from 'react-router-dom';

const Management_History_SUC = () => {
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

    const navigateToPKPage = () => {
        navigate("/management_p");
    };

    const HistoryPage = () => {
        navigate("/management_history");
    };

    const HistoryFailed = () => {
        navigate("/management_historyfailed");
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded && decoded.id) {
                setUserId(decoded.id);
                fetchHistory(decoded.id);
            } else {
                navigate('/login');
            }
        } catch (error) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchHistory = debounce(async (id) => {
        try {
            const response = await axios.get(`${API_URL}/all-history-you-suc`, {
                params: {
                    ID_user: id,
                    search: searchTerm
                }
            });
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 500); // 500ms debounce

    useEffect(() => {
        if (userId) {
            fetchHistory(userId);
        }
    }, [searchTerm, userId]);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const indexOfLastPackage = currentPage * packagesPerPage;
    const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
    const currentPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(packages.length / packagesPerPage);

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown2 = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = (e) => {
        if (e.target.closest("#dropdownDefault")) return;
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
        document.addEventListener('click', closeDropdown);
        } else {
        document.removeEventListener('click', closeDropdown);
        }

        return () => {
        document.removeEventListener('click', closeDropdown);
        };
    }, [isOpen]);
    
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
                        onChange={handleSearchChange}
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
                                ประวัติ
                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                </svg>
                            </button>
                            <div class="inline-flex rounded-md shadow-sm" role="group"
                                    style={{ marginLeft:"20px" }}>
                                <button type="button" onClick={HistoryPage} 
                                        class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                    ค่าเริ่มต้น
                                </button>
                                <button type="button" class="px-4 py-2 text-sm font-medium text-white bg-black border-t border-b border-black hover:bg-gray-800 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-700">
                                    สำเร็จ
                                </button>
                                <button type="button" onClick={HistoryFailed} 
                                        class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                                    ไม่สำเร็จ
                                </button>
                                <button style={{ marginLeft:"20px" }}
                                    id="dropdownDefault"
                                    data-dropdown-toggle="dropdown"
                                    className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-gray-100 bg-gray-900 rounded-lg hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:focus:ring-gray-700"
                                    onClick={toggleDropdown2}
                                >
                                    
                                    ค่าเริ่มต้น
                                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="relative inline-block" style={{ marginLeft:"10px" }}>
                                

                                {isOpen && (
                                    <div id="dropdown" className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" style={{ width:"100px" }}>
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                                        <li>
                                        <a href="/management_historysuc_max" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >ล่าสุด</a>
                                        </li>
                                        <li>
                                        <a href="/management_historysuc_min" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                            >เก่าสุด</a>
                                        </li>
                                    </ul>
                                    </div>
                                )}
                                </div>
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
                                        <a onClick={navigateToPKPage} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            แพ็คเกจ
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
                                    Concerts
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Hotels
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                        {currentPackages.map((pkg, index) => (
                                <tr  className="bg-white border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-300">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        {/* <img className="image-container" src={pkg.Show_secheduld} 
                                            alt="Show_secheduld" /> */}
                                        <img className="image-container-pp" src={pkg.Poster} 
                                            alt="Poster" style={{ marginLeft:"20px", width:"250px" }}/>
                                        <div className="ps-3">
                                            {[1,2, 3, 5, 7, 9, 11, 15].includes(pkg.Type_History_Con) ? (
                                                <a style={{marginLeft:"2px"}} className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 mb-2">
                                                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                    <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z"/>
                                                    </svg>
                                                    {pkg.ConcertAnnotation}
                                                </a>
                                                ) : [ 4, 6, 8, 10, 12, 14, 16, 17].includes(pkg.Type_History_Con) ? (
                                                <a style={{marginLeft:"2px"}} className="bg-purple-100 text-purple-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-purple-400 mb-2">
                                                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                    <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z"/>
                                                    </svg>
                                                    {pkg.ConcertAnnotation}
                                                </a>
                                                ) : null}
                                                {pkg.ID_user === pkg.ID_user_Concert && (
                                                    <span style={{ marginLeft:"5px" }} className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-gray-700 dark:text-blue-400">
                                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"/>
                                                        <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"/>
                                                        </svg>
                                                        <span className="sr-only">Icon description</span>
                                                    </span>
                                                )}
                                            <div className="text-base font-semibold">
                                                <span className='text-gray-700'>{pkg.Name}</span>
                                            </div>
                                            <div className="font-normal text-gray-500" style={{ marginTop:"10px" }}>
                                            {pkg.Ticket_zone} ราคา {pkg.PriceCD} บาท
                                            </div>
                                            {pkg.Con_NumOfRooms !== null && (
                                                <div className="font-normal text-gray-500" style={{ marginTop:"10px" }}>
                                                    จำนวนห้องที่ขอไป {pkg.Con_NumOfRooms}
                                                </div>
                                            )}
                                    
                                            <div className="font-normal text-gray-500" style={{ marginTop:"10px" }}>
                                                แสดงเวลา {pkg.Time}
                                            </div>
                                            <div className="font-normal text-gray-500">
                                            {pkg.StartDate_TH === pkg.EndDate_TH 
                                                ? pkg.StartDate_TH 
                                            : `${pkg.StartDate_TH} - ${pkg.EndDate_TH}`}
                                                <span className='font-normal text-gray-500'></span>
                                                <div style={{ marginTop:"20px" }}></div>
                                                
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                                {pkg.S_datelineCD_TH === pkg.E_datelineCD_TH 
                                                    ? pkg.S_datelineCD_TH 
                                                : `${pkg.S_datelineCD_TH} - ${pkg.E_datelineCD_TH}`}
                                                
                                                </span>
                                            </div>
                                        </div>
                                    </th>
                                    
                                    <td className="px-6 py-4">
                                    </td>
                                    
                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        
                                        <img className="image-container-pp" src={pkg.Img_Url_Hotel} 
                                            alt="Img_Url_Hotel" />
                                        <div className="ps-3">
                                            {[1,2, 3, 5, 7, 9, 11, 15,].includes(pkg.Type_History_Hotel) ? (
                                                <a style={{marginLeft:"2px"}} className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 mb-2">
                                                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                    <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z"/>
                                                    </svg>
                                                    {pkg.HotelAnnotation}
                                                </a>
                                                
                                                ) : [ 4, 6, 8, 10, 12, 14, 16,17, 18].includes(pkg.Type_History_Hotel) ? (
                                                <a style={{marginLeft:"2px"}} className="bg-purple-100 text-purple-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-purple-400 mb-2">
                                                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                    <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z"/>
                                                    </svg>
                                                    {pkg.HotelAnnotation}
                                                </a>
                                                ) : null}
                                            {pkg.ID_user === pkg.ID_user_Hotel && (
                                                    <span style={{ marginLeft:"5px" }} className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full dark:bg-gray-700 dark:text-blue-400">
                                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill="currentColor" d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"/>
                                                        <path fill="#fff" d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"/>
                                                        </svg>
                                                        <span className="sr-only">Icon description</span>
                                                    </span>
                                                )}
                                            <div className="text-base font-semibold">
                                                <span className='text-gray-700'>{pkg.NameH}</span>
                                            </div>
                                            {pkg.NumOfRooms !== null && (
                                                <div className="font-normal text-gray-500" style={{ marginTop:"10px" }}>
                                                    จำนวนห้องที่ยื่นไป {pkg.NumOfRooms}
                                                </div>
                                            )}
                                            <div className="font-normal text-gray-500">
                                            {pkg.NameTR} - {pkg.NameTV} 
                                            <span className='font-normal text-gray-500'></span>
                                            <div >ราคา {pkg.PriecH}</div>
                                            <div style={{ marginTop:"20px" }}>
                                                <span  className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                                {pkg.S_datelineCHD_TH === pkg.E_datelineHD_TH 
                                                    ? pkg.S_datelineHD_TH 
                                                : `${pkg.S_datelineHD_TH} - ${pkg.E_datelineHD_TH}`}
                                                                                                </span>
                                            </div>
                                            </div>
                                        </div>
                                        
                                    </th>
                                    { 
                                        [1, 4, 5].includes(pkg.Type_History_Con) && 
                                        [1, 3, 6].includes(pkg.Type_History_Hotel) ? (
                                            <span style={{ marginLeft: "-590px" }} className="inline-flex items-center bg-green-400 text-white text-l font-medium px-2.5 py-0.5 rounded-full bg-green-700 dark:text-white">
                                                <span className="w-2 h-2 me-1 bg-green-100 rounded-full"></span>
                                                จับคู่สำเร็จแล้ว 
                                                <span style={{ marginLeft: "30px" }} className="inline-flex items-center bg-gray-900 text-white text-l font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-white">
                                                    <span className="w-2 h-2 me-1 bg-white rounded-full"></span>
                                                    {pkg.DateAction_TH}
                                                </span>
                                            </span>
                                        ) : 
                                        [5, 14].includes(pkg.Type_History_Con) && 
                                        [3, 16].includes(pkg.Type_History_Hotel) ? (
                                            <span style={{ marginLeft: "200px" }} className="inline-flex items-center bg-red-500 text-white text-l font-medium px-2.5 py-0.5 rounded-full bg-red-700 dark:text-white">
                                                <span className="w-2 h-2 me-1 bg-red-100 rounded-full"></span>
                                                จับคู่ไม่สำเร็จแล้ว 
                                                <span style={{ marginLeft: "30px" }} className="inline-flex items-center bg-gray-800 text-white text-l font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-800 dark:text-white">
                                                    <span className="w-2 h-2 me-1 bg-white rounded-full"></span>
                                                    {pkg.DateAction_TH}
                                                </span>
                                            </span>
                                        ) :
                                        [2, 9, 12].includes(pkg.Type_History_Con) && 
                                        [2, 11, 10].includes(pkg.Type_History_Hotel) ? (
                                            <span style={{ marginLeft: "-590px" }} className="inline-flex items-center bg-blue-500 text-white text-l font-medium px-2.5 py-0.5 rounded-full bg-blue-500 dark:text-white">
                                                <span className="w-2 h-2 me-1 bg-red-100 rounded-full"></span>
                                                ยกเลิกการจับคู่สำเร็จแล้ว 
                                                <span style={{ marginLeft: "30px" }} className="inline-flex items-center bg-gray-800 text-white text-l font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-800 dark:text-white">
                                                    <span className="w-2 h-2 me-1 bg-white rounded-full"></span>
                                                    {pkg.DateAction_TH}
                                                </span>
                                            </span>
                                        ): 
                                        [9, 17].includes(pkg.Type_History_Con) && 
                                        [7, 18].includes(pkg.Type_History_Hotel) ? (
                                        <span style={{ marginLeft: "200px" }} className="inline-flex items-center bg-amber-500 text-white text-l font-medium px-2.5 py-0.5 rounded-full bg-amber-500 dark:text-white">
                                                <span className="w-2 h-2 me-1 bg-red-100 rounded-full"></span>
                                                ยกเลิกการจับคู่ไม่สำเร็จแล้ว 
                                                <span style={{ marginLeft: "10px" }} className="inline-flex items-center bg-gray-800 text-white text-l font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-800 dark:text-white">
                                                    <span className="w-2 h-2 me-1 bg-white rounded-full"></span>
                                                    {pkg.DateAction_TH}
                                                </span>
                                            </span>
                                        ): null
                                    }
                                </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
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
};

export default Management_History_SUC;
