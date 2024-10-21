import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import HeaderUser from "../../components/HeadUser";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Management_Hotel = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 9;
    const [searchTerm, setSearchTerm] = useState('');  // เพิ่ม state สำหรับการค้นหา
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedHotelId, setSelectedHotelId] = useState(null);  // เก็บ ID โรงแรมที่เลือก
    
    const API_URL = process.env.REACT_APP_API_URL;

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const navigateToConcertPage = () => {
        navigate("/management");
    };

    const navigateToPPage = () => {
        navigate("/management_p");
    };
    const navigateToAdd = () => {
        navigate("/hoteladd");
    };

    const handleRowClick = (ID_hotel) => {
        navigate(`/allh/${ID_hotel}`);
    };

    const navigateToHistoryPage = () => {
        navigate("/management_history");
    };

    const navigateToMatch = () => {
        navigate("/management_hotel_match");
    };

    const navigateToUnMatch = () => {
        navigate("/management_hotel_un_match");
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setUserId(userId);
    
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/${userId}`);
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
    
            const fetchHotels = async (searchTerm = '') => {
                try {
                    const response = await axios.get(`${API_URL}/hotelU/${userId}`, {
                        params: { search: searchTerm }  // ส่ง searchTerm ไปเป็นพารามิเตอร์ค้นหา
                    });
                    setHotels(response.data);
                } catch (error) {
                    console.error('Error fetching hotels:', error);
                }
            };
    
            fetchUserData();
            fetchHotels(searchTerm);  // เรียก fetchHotels พร้อม searchTerm
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [navigate, searchTerm]);  // เพิ่ม searchTerm ใน dependencies
    
    
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);  // เรียกใช้ handleSearchChange เมื่อมีการพิมพ์
    };
    

    const handleDeleteHotel = async () => {
        try {
            const ID_user = userId;
            const ID_hotel = selectedHotelId;  // ใช้ ID_hotel ที่เก็บไว้
            console.log(`Deleting hotel: ${ID_hotel}, by user: ${ID_user}`);
            const response = await axios.delete(`${API_URL}/deletehotel`, {
                data: { ID_hotel, ID_user }
            });
            console.log('Response:', response.data);
            
            setHotels(hotels.filter(hotel => hotel.ID_hotel !== ID_hotel));
            setShowDeleteDialog(false);  // ปิด Dialog หลังจากลบเสร็จ
        } catch (error) {
            console.error('Error deleting hotel:', error);
        }
    };

    // แสดง Dialog เพื่อลบโรงแรม
    const handleOpenDeleteDialog = (ID_hotel) => {
        setSelectedHotelId(ID_hotel);  // เก็บ ID โรงแรมที่ต้องการลบ
        setShowDeleteDialog(true);     // แสดง Dialog
    };

    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false);    // ซ่อน Dialog
    };


    // Calculate the index range for the current page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(hotels.length / hotelsPerPage);

    return (
        <>
            <HeaderUser />
            <div className="home-MN">
                <form className="max-w-md mx-auto" style={{ margin: '0 auto', maxWidth: '500px', padding: '10px' }}>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                    Search
                    </label>
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
                        value={searchTerm}  // ผูกค่ากับ searchTerm
                        onChange={handleSearchChange}  // เรียก handleSearchChange เมื่อมีการเปลี่ยนแปลง
                        required
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
                        onClick={toggleDropdown}
                        style={{ height:'45px' }}
                        >
                        <span className="sr-only">Action button</span>
                        โรงแรม
                        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                        </svg>
                        </button>
                        <button onClick={navigateToAdd}
                                style={{ marginLeft:'10px' }}
                                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Add
                        </span>
                        </button>

                        <button type="button" style={{ marginLeft:"810px" }}
                                class="px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-s-lg hover:bg-gray-800 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-700">
                            ค่าเริ่มต้น
                        </button>
                        <button type="button"
                                onClick={navigateToMatch}
                                class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            จับคู่แล้ว
                        </button>
                        <button type="button"
                                onClick={navigateToUnMatch}
                                class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            ยังไม่จับคู่
                        </button>
                        
                        <div id="dropdownAction" className={`z-10 ${dropdownVisible ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-900 dark:divide-gray-600`}>
                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-100" aria-labelledby="dropdownActionButton">
                            <li>
                            <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">โรงแรม</a>
                            </li>
                            <li>
                            <a onClick={navigateToConcertPage} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                คอนเสิร์ต
                            </a>
                            </li>
                            <li>
                            <a onClick={navigateToPPage} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
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
                        <th scope="col" className="px-6 py-3">Name & Picture</th>
                        <th scope="col" className="px-6 py-3">Location</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                        <th scope="col" className="px-6 py-3">Create</th>
                        <th scope="col" className="px-6 py-3">Offer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentHotels.map((hotel) => (
                        <tr key={hotel.ID_hotel} className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300">
                            <td className="w-4 p-4">
                            <div className="flex items-center">
                                <label htmlFor={`checkbox-table-search-${hotel.ID_hotel}`} className="sr-only">checkbox</label>
                            </div>
                            </td>
                            <th scope="row" className="relative flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white" onClick={() => handleRowClick(hotel.ID_hotel)}>
                                <img className="image-container_H" src={hotel.Img_Url_Hotel} alt="Hotel" />
                                <div className="ps-3">
                                    <div className="text-base font-semibold">
                                        <span className='text-gray-700'>{hotel.NameH}</span>
                                    </div>
                                </div>
                                <h1 className="absolute bottom-0 right-0 mb-4 text-sx font-extrabold text-gray-900 dark:text-white md:text-sx lg:text-sx">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                        {hotel.Deal_Status !== null ? hotel.Deal_Status : 'ยังไม่ได้จับคู่'}
                                    </span>
                                </h1>
                            </th>

                            <td className="px-6 py-4">{hotel.AddressH}</td>
                            <td className="px-6 py-4">
                            <a href="" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" 
                                onClick={(e) => { e.preventDefault(); handleOpenDeleteDialog(hotel.ID_hotel); }}>
                                Delete
                            </a>
                            </td>

                            <td className="px-6 py-4">
                                <a href={`/room/${hotel.ID_hotel}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Room</a>
                            </td>
                            <td className="px-6 py-4">
                                <a href={`/hoteldetails/${hotel.ID_hotel}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Create</a>
                            </td>
                            <td className="px-6 py-4">
                                <a href={`/seehoteldetails/${hotel.ID_hotel}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">See</a>
                            </td>

                        </tr>
                        
                        ))}
                    </tbody>
                </table>
                    
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
                    {/* Delete Confirmation Dialog */}
                    {showDeleteDialog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                                <p>Are you sure you want to delete this hotel?</p>
                                <div className="flex justify-end mt-6">
                                    <button className="px-4 py-2 mr-2 bg-gray-700 text-white rounded hover:bg-gray-900" onClick={handleCloseDeleteDialog}>Cancel</button>
                                    <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900" onClick={handleDeleteHotel}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Management_Hotel;
