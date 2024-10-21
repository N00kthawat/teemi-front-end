import React, { useState, useEffect } from 'react';
import Header from "../../components/Head";
import axios from 'axios';

function Home_Con() {
    const [search, setSearch] = useState('');
    const [concerts, setConcert] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelsPerPage = 6;
    const API_URL = process.env.REACT_APP_API_URL;
    // Fetch hotels on component mount
    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const response = await axios.get(`${API_URL}/concert-and-search`);
                setConcert(response.data);
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
                const response = await axios.get(`${API_URL}/concert-and-search`, { 
                    params: { search } 
                });
                setConcert(response.data);
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

    // Calculate the index range for the current page
    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    // Add current hotels
    const currentConcert = concerts.slice(indexOfFirstHotel, indexOfLastHotel);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(concerts.length / hotelsPerPage);

    return(
        <>
            <Header/>
            
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

            <div className="container" style={{ marginTop:'10px' }}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ marginLeft:"55px" }}>
                    {currentConcert.map((concert) => (
                        <div key={concert.CID} 
                                style={{ height:'550px' }}
                                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href={`/uallc/${concert.CID}`}>
                            <img className="p-8 rounded-t-lg" src={concert.Poster} alt={concert.Name} 
                                    style={{ 
                                        height: '60%', 
                                        display: 'block', 
                                        margin: '0 auto' 
                                    }}/>
                                <div className="px-5 pb-5">
                                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{concert.Name}</h5>
                                    <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft:'0px',marginTop:'10px' }}
                                    >{concert.Address}</p>
                                    <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft:'0px' }}
                                    >{concert.Pre_date}</p>
                                    <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft:'0px' }}
                                    >{concert.Time}</p>
                                    <div className="flex items-center justify-between"
                                            style={{ marginTop:'20px' }}>
                                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">฿{concert.Price}</h5>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
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
}

export default Home_Con;
