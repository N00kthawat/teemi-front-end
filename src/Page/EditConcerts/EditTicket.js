import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderUser from "../../components/HeadUser";

function EditTicket() {
    const { CID } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({
        Ticket_zone: '',
        Price: '',
        Type: '',
        Date: ''
    });
    const [ticketTypes, setTicketTypes] = useState([]); // State for storing ticket types
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await axios.get(`${API_URL}/tickets/${CID}`);
                if (response.status === 200 && response.data.length > 0) {
                    const ticketData = response.data[0];
                    setTicket({
                        Ticket_zone: ticketData.Ticket_zone || '',
                        Price: ticketData.Price || '',
                        Type: ticketData.Type || '',
                        Date: ticketData.Date ? ticketData.Date.split('T')[0] : ''
                    });
                } else {
                    setError('Ticket not found');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ticket data:', error);
                setError('Failed to fetch ticket data');
                setLoading(false);
            }
        };

        const fetchTicketTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/typeTickets`);
                setTicketTypes(response.data);
            } catch (error) {
                console.error('Error fetching ticket types:', error);
            }
        };

        fetchTicketData();
        fetchTicketTypes();
    }, [CID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTicket((prevTicket) => ({
            ...prevTicket,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/updateticket/${CID}`, ticket);
            alert('Ticket updated successfully');
            navigate('/management'); // Redirect to the tickets page or any other page
        } catch (error) {
            console.error('Error updating ticket:', error.response ? error.response.data : error.message);
            alert('Failed to update ticket');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>
                Edit
            </h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>  ticket inform </p>
            <form className="max-w-sm mx-auto" style={{ marginTop: '60px' }} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="Ticket_zone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ticket Zone</label>
                    <input 
                        type="text" 
                        name="Ticket_zone"
                        value={ticket.Ticket_zone}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="VIP-3" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input 
                        type="text" 
                        name="Price"
                        value={ticket.Price}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="2,500" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="Type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ticket Type</label>
                    <select 
                        id="Type" 
                        name="Type"
                        value={ticket.Type}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    >
                        <option value="" disabled>Select Ticket Type</option>
                        {ticketTypes.map(type => (
                            <option key={type.id} value={type.TID}>{type.NameT}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="Date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                    <input 
                        type="date" 
                        name="Date"
                        value={ticket.Date}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        required 
                    />
                </div>
                <button 
                    type="submit" 
                    style={{ marginTop: '20px' }}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </form>
        </>
    );
}

export default EditTicket;
