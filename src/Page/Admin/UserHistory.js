import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeadAdmin from '../../components/HeadAdmin';

function UserHistory() {
    const [userHistory, setuserHistory] = useState([]);
    const [search, setSearch] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selecteduserHistory, setSelecteduserHistory] = useState({ Type_History: '', Annotation: '' });
    const API_URL = process.env.REACT_APP_API_URL;
    // Fetch room statuses from the API
    const fetchuserHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/admin-type-history?search=${search}`);
            const data = await response.json();
            setuserHistory(data);
        } catch (error) {
            console.error('Error fetching room statuses:', error);
        }
    };

    // Delete room status by ID
    const deleteuserHistory = async (id) => {
        try {
            await fetch(`${API_URL}/admin-type-history/${id}`, {
                method: 'DELETE',
            });
            fetchuserHistory(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting room status:', error);
        }
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editMode) {
                // Update existing room status
                await fetch(`${API_URL}/admin-type-history/${selecteduserHistory.Type_History}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Annotation: selecteduserHistory.Annotation }),
                });
            } else {
                // Add new room status
                await fetch(`${API_URL}/admin-type-history`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Annotation: selecteduserHistory.Annotation }),
                });
            }

            setSelecteduserHistory({ Type_History: '', Annotation: '' });
            setEditMode(false);
            fetchuserHistory(); // Refresh the list after adding/editing
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Fetch data on component mount and when search changes
    useEffect(() => {
        fetchuserHistory();
    }, [search]);

    const handleRowClick = (type) => {
        setSelecteduserHistory(type);
        setEditMode(true);
    };

    return (
        <>
            <HeadAdmin />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    minHeight: 'calc(10vh - 100px)', // Adjust the height to exclude the HeadAdmin height
                    marginTop: '100px',
                }}
                className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
            >
                <ul className="flex flex-wrap justify-center -mb-px">
                    <li className="me-2">
                        <Link
                            to="/room-status"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                        >
                            สถานะห้อง
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/concert-types"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"

                            aria-current="page"
                        >
                            ประเภทคอนเสิร์ต
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/ticket-types"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                        >
                            ประเภทการแสดง
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/ticket-types"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                        >
                            ประเภทตั๋ว
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/hotel-types"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                        >
                            ประเภทโรงแรม
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/room-types"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                        >
                            ประเภทห้อง
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/view-types"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                        >
                            ประเภทวิวห้อง
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/offer-status"
                            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                        >
                            สถานะข้อเสนอ
                        </Link>
                    </li>
                    <li className="me-2">
                        <Link
                            to="/userhistory"
                            className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                        >
                            ประเภทประวัติ
                        </Link>
                    </li>
                </ul>
            </div>

            <form 
                className="max-w-md mx-auto"
                style={{ marginTop: '20px' }} 
                onSubmit={(e) => { e.preventDefault(); fetchuserHistory(); }}
            >   
                <label 
                    htmlFor="default-search" 
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg 
                            className="w-4 h-4 text-gray-500 dark:text-gray-400" 
                            aria-hidden="true" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                stroke="currentColor" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input 
                        type="search" 
                        id="default-search" 
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Search ..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        required 
                    />
                </div>
            </form>


            <div style={{   width: '500px',  margin: '20px auto'  }} 
                className="flex justify-center items-center relative overflow-x-auto shadow-md sm:rounded-lg">
                <div  className="w-full h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        style={{ height:"400px" }}>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userHistory.map((type, index) => (
                            <tr 
                            key={type.Type_History} 
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRowClick(type)}
                            >
                            <th 
                                scope="row" 
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {index + 1}
                            </th>
                            <td className="px-6 py-4">{type.Annotation}</td>
                            <td className="px-6 py-4">
                            {index > 17 && (
                                    <button 
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the row click event
                                            deleteuserHistory(type.Type_History);
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <form 
                style={{ 
                    marginTop:'20px', 
                    width:'440px', 
                    margin: '0 auto'  // Center the form horizontally
                }} 
                className="flex items-center max-w-lg mx-auto"
                onSubmit={handleFormSubmit}
            >   
                <label htmlFor="voice-input" className="sr-only"></label>
                <div className="relative w-full">
                    <input 
                        type="text" 
                        id="voice-input" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Edit room status name..." 
                        value={selecteduserHistory.Annotation}
                        onChange={(e) => setSelecteduserHistory({ ...selecteduserHistory, Annotation: e.target.value })}
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    {editMode ? 'Edit' : 'Add'}
                </button>
            </form>
        </>
    );
}

export default UserHistory;
