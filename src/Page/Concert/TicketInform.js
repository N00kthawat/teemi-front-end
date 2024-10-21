import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import { useNavigate,useParams } from 'react-router-dom';
import HeaderUser from "../../components/HeadUser";

function TicketInform() {
    const [userData, setUserData] = useState(null);
    const [concerts, setConcerts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null); // Added userId state
    const { CID } = useParams(); // Get CID from URL parameters

    // Added state for form fields
    const [ticketZone, setTicketZone] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [ticketTypes, setTicketTypes] = useState([]); // State for ticket types
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
            return;
        }
        try {
            const decoded = jwtDecode(token); // Decode the token
            const userId = decoded.id; // Extract user ID from decoded token
            setUserId(userId); // Set userId state
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
            navigate('/login'); // Redirect to login page if decoding fails
        }
    }, [navigate]);

    useEffect(() => {
        if (userId) {
            const fetchConcerts = async () => {
                try {
                    const response = await axios.get(`${API_URL}/concerts/${userId}`);
                    setConcerts(response.data);
                } catch (err) {
                    setError(err.response ? err.response.data : 'Server error. Please try again later.');
                }
            };
            fetchConcerts();
        }
    }, [userId]);

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/typeTickets`);
                setTicketTypes(response.data);
            } catch (error) {
                console.error('Error fetching ticket types:', error);
            }
        };
        fetchTicketTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/addticket`, {
                CID: CID,
                Ticket_zone: ticketZone,
                Price: price,
                Type: type,
                Date: date
            });
            console.log(response.data);
            alert('Ticket added successfully!');
            navigate('/management'); // Navigate to the management page
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.response ? err.response.data : 'Server error. Please try again later.');
        }
    };

    return (
        <div>
            <HeaderUser />
            <h5
                className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }} >
                Concerts
            </h5>
            
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" 
                style={{ marginLeft: '70px' }}> Ticket information </p>

            <form className="max-w-sm mx-auto" style={{ marginTop: '60px' }} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="ticketZone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ticket Zone</label>
                    <input type="text" 
                            id="ticketZone" value={ticketZone} 
                            onChange={(e) => setTicketZone(e.target.value)} 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                                        block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                        dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="VIP-3" 
                    required />
                </div>
                
                <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input type="text" 
                            id="price" 
                            value={price} onChange={(e) => setPrice(e.target.value)} 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="2,500" 
                    required />
                </div>
                
                <div>
                    <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ticket Type</label>
                    <select 
                        id="type" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Ticket Type</option>
                        {ticketTypes.map(ticket => (
                            <option key={ticket.id} value={ticket.TID}>{ticket.NameT}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                    <input type="date" 
                            id="date" value={date} onChange={(e) => setDate(e.target.value)} 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required />
                </div>

                <button type="submit" 
                        style={{ marginTop: '20px' }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium 
                        rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none 
                        dark:focus:ring-blue-800">
                        Submit
                </button>
            </form>
        </div>
    );
}

export default TicketInform;
