import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import axios from 'axios';

function HomeEN_P(){
    const [search, setSearch] = useState('');
    const [packages, setPackages] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage the dropdown visibility
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 6;
    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch hotels on component mount
    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const response = await axios.get(`${API_URL}/packeage-and-search`);
                setPackages(response.data);
            } catch (error) {
                console.error('Error fetching hotel data:', error);
            }
        };

        fetchConcerts();
    }, []);

    // Fetch hotels when the search input changes (real-time search)
    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const response = await axios.get(`${API_URL}/packeage-and-search`, { 
                    params: { search } 
                });
                setPackages(response.data);
            } catch (error) {
                console.error('Error fetching hotel data:', error);
            }
        };

        if (search !== '') {
            fetchConcerts();
        }
    }, [search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const toggleDropdown = (id) => {
        setDropdownOpen(dropdownOpen === id ? null : id); // Toggle dropdown visibility
    };

    // Calculate the index range for the current page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    // Add current hotels
    const currentPackages = packages.slice(indexOfFirstHotel, indexOfLastHotel);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(packages.length / hotelsPerPage);

    return(
        <>
            <HeaderUser/>
            
            <form className="max-w-md mx-auto" style={{ marginTop:'120px' }}>   
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
                        placeholder="Search ..." 
                        value={search}
                        onChange={handleSearchChange}
                        required 
                    />
                </div>
            </form>

            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ marginLeft:"50px" }}>
                    {currentPackages.map((packeage) => {
                        // Declare variables outside JSX
                        const price = parseFloat(packeage.PriceCD) || 0;
                        const priceH = parseFloat(packeage.PriceH) || 0;
                        const sum = price / packeage.Number_of_ticket;
                        const totalPrice = sum + priceH;

                        return(
                            <div key={packeage.CID} 
                                style={{ height:'700px' }}
                                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex justify-end px-4 pt-4">
                                <button 
                                    id="dropdownButton" 
                                    className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" 
                                    type="button"
                                    onClick={() => toggleDropdown(packeage.CID)} // Toggle dropdown on click
                                >
                                    <span className="sr-only">Open dropdown</span>
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                    </svg>
                                </button>
                                {/* Dropdown menu */}
                                {dropdownOpen === packeage.CID && ( // Conditionally render dropdown
                                    <div className="z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul className="py-2" aria-labelledby="dropdownButton">
                                            <li>
                                                <a href={`/matallc/${packeage.CID}`} 
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Concert</a>
                                            </li>
                                            <li>
                                                <a href={`/matallh/${packeage.ID_hotel}`} 
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Hotel</a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <img className="p-8 rounded-t-lg" src={packeage.Poster} alt={packeage.Name} 
                                    style={{ 
                                        height: '50%', 
                                        display: 'block', 
                                        margin: '0 auto' 
                                    }}/>
                                <div className="px-5 pb-5">
                                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{packeage.Name} </h5>
                                    <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft:'0px',marginTop:'10px' }}
                                    >{packeage.Ticket_zone}: {packeage.Number_of_ticket}  ใบ</p>
                                    <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft:'0px' }}
                                    >{packeage.Address}</p>
                                    <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft:'0px' }}
                                    >{packeage.StartDate_TH} - {packeage.EndDate_TH}</p>
                                    <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft:'0px' }}
                                    >{packeage.Time}</p>
                                </div>
                                <div className="flex items-center justify-between"
                                            style={{ marginTop:'20px' }}>
                                        <h5 style={{ marginLeft:'20px' }}
                                            className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">฿{totalPrice.toFixed(2)}</h5>
                                </div>
                        </div>
                        );
                    })}
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
    )
}

export default HomeEN_P;
