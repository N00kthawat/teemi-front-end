import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HeaderUser from "../../components/HeadUser";

function EditSeeConDeals() {
    const { CDID } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [originalStartDate, setOriginalStartDate] = useState(null);
    const [originalEndDate, setOriginalEndDate] = useState(null);
    const [numberOfTickets, setNumberOfTickets] = useState('');
    const [price, setPrice] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchConcertDeal = async () => {
            try {
                const response = await fetch(`${API_URL}/concertdeals-cdid/${CDID}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data);

                    // Ensure only the date part is considered
                    const start = data.S_datetime ? new Date(data.S_datetime.split('T')[0]) : null;
                    const end = data.E_datetime ? new Date(data.E_datetime.split('T')[0]) : null;

                    if (start) {
                        setStartDate(start);
                        setOriginalStartDate(start); // เก็บวันที่เริ่มต้นเดิม
                    }
                    if (end) {
                        setEndDate(end);
                        setOriginalEndDate(end); // เก็บวันที่สิ้นสุดเดิม
                    }

                    setStatus(data.StatusCD);
                    setNumberOfTickets(data.Number_of_ticket);
                    setPrice(data.PriceCD);
                } else {
                    console.error('Failed to fetch concert deal data');
                }
            } catch (error) {
                console.error('Error fetching concert deal data:', error);
            }
        };

        fetchConcertDeal();
    }, [CDID]);

    const handleStartDateChange = (date) => {
        console.log('Start date selected:', date);
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        console.log('End date selected:', date);
        setEndDate(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!numberOfTickets || !startDate || !endDate || !price) {
            alert('Please fill in all fields');
            return;
        }

        // Format dates without time component
        const updatedData = {
            Number_of_ticket: numberOfTickets,
            S_datetime: startDate ? startDate.toISOString().split('T')[0] : originalStartDate.toISOString().split('T')[0],
            E_datetime: endDate ? endDate.toISOString().split('T')[0] : originalEndDate.toISOString().split('T')[0],
            PriceCD: price
        };
    
        try {
            const response = await fetch(`${API_URL}/concertdeals-cdid/${CDID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
    
            if (response.ok) {
                alert('Update successful');
                navigate(-1); // Redirect to another page if needed
            } else {
                console.error('Failed to update concert deal');
                alert('Update failed');
            }
        } catch (error) {
            console.error('Error updating concert deal:', error);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Edit</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>Concert Deals</p>
            <form className="max-w-sm mx-auto" style={{ marginTop: '60px' }} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="Number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of Tickets</label>
                    <input
                        type="text"
                        id="Number"
                        value={numberOfTickets}
                        onChange={(e) => setNumberOfTickets(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input
                        type="text"
                        id="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <label htmlFor="Type_hotel" style={{ marginTop: '20px' }} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Original dates: {originalStartDate && originalEndDate ? `${formatDate(originalStartDate)} to ${formatDate(originalEndDate)}` : 'No original dates'}
                </label>
                <div id="date-range-picker" className="flex items-center">
                    <div className="relative">
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Select start date"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <span className="mx-4 text-gray-500">to</span>
                    <div className="relative">
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholderText="Select end date"
                            dateFormat="dd/MM/yyyy"
                            minDate={startDate}
                        />
                    </div>
                </div>
                <button type="submit" style={{ marginTop: '20px' }}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
                    w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit
                </button>
            </form>
        </>
    );
}

export default EditSeeConDeals;
