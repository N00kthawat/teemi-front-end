import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { useNavigate } from 'react-router-dom';

const Management_Concert_Un_Match_MIN = () => {

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };
    
    const navigateToHotelPage = () => {
        navigate("/management_hotel");
    };
    
    const navigateToPPage = () => {
        navigate("/management_p");
    };
    
    const navigateToAddPage = () => {
        navigate("/concertadd");
    };

    const navigateToPPageMAX = () => {
        navigate("/management_concert_max");
    };

    const navigateToHistoryPage = () => {
        navigate("/management_history");
    };

    const navigateToConcert= () => {
        navigate("/management");
    };

    const navigateToConcertMatch= () => {
        navigate("/management_match");
    };

    const navigateToConcertUnMatch= () => {
        navigate("/management_un_match");
    };
    
    const [userData, setUserData] = useState(null);
    const [concerts, setConcerts] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');  // Search term state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [concertToDelete, setConcertToDelete] = useState(null); // Store the concert ID to delete

    
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 9;
    const API_URL = process.env.REACT_APP_API_URL;
    
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
            fetchUserData();
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [navigate]);
    
    useEffect(() => {
        if (userId) {
            const fetchConcerts = async () => {
                try {
                    const response = await axios.get(`${API_URL}/concertsU-un-match-min`, {
                        params: {
                            id_user: userId,
                            search: searchTerm  // Send search term as query parameter
                        }
                    });
                    setConcerts(response.data);
                } catch (err) {
                    setError(err.response ? err.response.data : 'Server error. Please try again later.');
                }
            };
            fetchConcerts();
        }
    }, [userId, searchTerm]);  // Trigger useEffect when searchTerm changes
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);  // Update searchTerm on input change
    };
    
    const openDeleteDialog = (CID) => {
        setConcertToDelete(CID);
        setShowDeleteDialog(true);
    };
    
    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setConcertToDelete(null);
    };
    
    const confirmDeleteConcert = async () => {
        try {
            await axios.delete(`${API_URL}/concerts`, {
                data: { CID: concertToDelete, ID_user: userId }
            });
            setConcerts(concerts.filter(concert => concert.CID !== concertToDelete));
            closeDeleteDialog();
        } catch (err) {
            setError(err.response ? err.response.data : 'Error deleting the concert.');
            closeDeleteDialog();
        }
    };
    
    
    const navigateToAllc = (CID) => {
        navigate(`/allc/${CID}`);
    };
    
    // Calculate the index range for the current page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentConcerts = concerts.slice(indexOfFirstHotel, indexOfLastHotel);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Calculate total pages
    const totalPages = Math.ceil(concerts.length / hotelsPerPage);

    return (
        <>
            <HeaderUser />
            <div className="home-MN">
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
                            value={searchTerm}  // ผูกค่า searchTerm กับ input
                            onChange={handleSearchChange}  // เรียก handleSearchChange เมื่อ input เปลี่ยน
                            required 
                        />
                    </div>
                </form>
                {showDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this concert?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900"
                                onClick={closeDeleteDialog}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900"
                                onClick={confirmDeleteConcert}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

                <div className="relative overflow-x-auto shadow-md" style={{ maxWidth: '1280px', margin: '20px auto', padding: '10px' }}>
                    <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white">
                        <div>
                            <button 
                                id="dropdownActionButton" 
                                data-dropdown-toggle="dropdownAction" 
                                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                                type="button"
                                style={{ height:'45px' }}
                                onClick={toggleDropdown}>
                                <span className="sr-only">Action button</span>
                                คอนเสิร์ต
                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                </svg>
                            </button>
                            <div
                                id="dropdownAction"
                                className={`z-10 ${dropdownVisible ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-900 dark:divide-gray-600`}
                            >
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-100" aria-labelledby="dropdownActionButton">
                                    <li>
                                        <a  onClick={navigateToHotelPage}
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">โรงแรม</a>
                                    </li>
                                    <li>
                                        <a  
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            คอนเสิร์ต
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={navigateToPPage}
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
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
                            <button style={{ marginLeft:'10px' }} onClick={navigateToAddPage}
                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Add
                                </span>
                            </button>

                            <button type="button" style={{ marginLeft:"810px" }}
                                    onClick={navigateToConcert}
                                class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            ค่าเริ่มต้น
                        </button>
                        <button type="button"
                                onClick={navigateToConcertMatch}
                                class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            จับคู่แล้ว
                        </button>
                        <button type="button" 
                                class="px-4 py-2 text-sm font-medium text-white bg-black border border-black rounded-e-lg hover:bg-gray-800 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-700">
                            ยังไม่จับคู่
                        </button>
                        </div>
                        <p className="font-normal text-gray-500" style={{ marginLeft:"1170px" }}>กว่าจะถึง </p>
                        <svg className="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" onClick={navigateToConcertUnMatch}
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 20V10m0 10-3-3m3 3 3-3m5-13v10m0-10 3 3m-3-3-3 3"/>
                        </svg>
                    </div>
                    
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">Offer</th>
                                <th scope="col" className="px-6 py-3">See</th>
                            </tr>
                        </thead>
                        <tbody >
                            {currentConcerts.map(concert => (
                                <tr key={concert.CID} className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-300"
                                    onClick={() => navigateToAllc(concert.CID)}>
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="relative flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="image-container" src={concert.Poster} alt={concert.Name} />
                                        <div className="ps-3">
                                            <div className="text-base font-semibold"><span className='text-gray-700'>{concert.Name}</span></div>
                                            <div className="font-normal text-gray-500">{concert.Address}</div>
                                            <div className="font-normal text-gray-500" style={{ marginTop:"10px" }}>
                                            {concert.StartDate_TH === concert.EndDate_TH 
                                                ? concert.StartDate_TH 
                                                : `${concert.StartDate_TH} - ${concert.EndDate_TH}`}
                                            </div>
                                        </div>
                                        <h1 className="absolute bottom-0 right-0 mb-4 text-sx font-extrabold text-gray-900 dark:text-white md:text-sx lg:text-sx">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                            {concert.Deal_Status !== null ? concert.Deal_Status : 'ยังไม่ได้จับคู่'}
                                        </span>
                                    </h1>
                                    </th>
                                    <td className="px-6 py-4">{concert.NameTC}</td>
                                    <td className="px-6 py-4">
                                        <a  className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteDialog(concert.CID);
                                            }}>
                                            Delete
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`/concertdeals/${concert.CID}`} className="text-indigo-600 hover:text-indigo-900">Offer</a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`/seecondeals/${concert.CID}`} className="text-indigo-600 hover:text-indigo-900">See</a>
                                    </td>
                                </tr>
                            ))}
                            {concerts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center">{error ? error : 'No concerts found.'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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

                </div>
            </div>
        </>
    );
};

export default Management_Concert_Un_Match_MIN;
