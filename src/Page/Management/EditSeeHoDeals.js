import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HeaderUser from "../../components/HeadUser";

function EditSeeHoDeals(){
    const { HDID } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('');
    const [Total, setTotal] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [originalStartDate, setOriginalStartDate] = useState(null);
    const [originalEndDate, setOriginalEndDate] = useState(null);
    const [numberOfRooms, setNumberOfRooms] = useState('');
    const [quantity, setQuantity] = useState(1);  
    const API_URL = process.env.REACT_APP_API_URL;

     // ฟังก์ชันเพิ่มจำนวน
    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // ฟังก์ชันลดจำนวน
    const decrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity - 1); // สามารถลดได้โดยไม่มีการจำกัด
    };    

    useEffect(() => {
        const fetchConcertDeal = async () => {
            try {
                const response = await fetch(`${API_URL}/editseehodeals?HDID=${HDID}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data);
    
                    if (data.length === 0) {
                        console.error('No data found for the given HDID');
                        return;
                    }
    
                    const deal = data[0];
                    console.log('S_datetimeHD:', deal.S_datetimeHD);
                    console.log('E_datetimeHD:', deal.E_datetimeHD);
    
                    const start = deal.S_datetimeHD ? new Date(deal.S_datetimeHD) : null;
                    const end = deal.E_datetimeHD ? new Date(deal.E_datetimeHD) : null;
    
                    console.log('Start Date:', start);
                    console.log('End Date:', end);
    
                    setStartDate(start);
                    setTotal(deal.Total);
                    setEndDate(end);
                    setStatus(deal.NameOS); // ใช้ฟิลด์ที่ถูกต้อง
                    setNumberOfRooms(deal.Number_of_room);
                    setOriginalStartDate(start);
                    setOriginalEndDate(end);
                } else {
                    console.error('Failed to fetch hotel deal data');
                }
            } catch (error) {
                console.error('Error fetching hotel deal data:', error);
            }
        };
    
        fetchConcertDeal();
    }, [HDID, API_URL]);
    
    
    

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
    
        if (!numberOfRooms || !startDate || !endDate || !quantity || !Total) {
            alert('Please fill in all fields');
            return;
        }

        // Format dates without time component
        const updatedData = {
            Number_of_room: numberOfRooms,
            S_datetimeHD: startDate ? startDate.toISOString().split('T')[0] : originalStartDate.toISOString().split('T')[0],
            E_datetimeHD: endDate ? endDate.toISOString().split('T')[0] : originalEndDate.toISOString().split('T')[0],
            quantity: quantity,
            Total: Total
        };
    
        try {
            const response = await fetch(`${API_URL}/hoteldeals-hdid/${HDID}`, {
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
    return(
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Edit</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>Concert Deals</p>
            <div className='flex items-center justify-center min-h-screen' style={{ marginTop:"-200px" }}>
                <div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
                    <form className="max-w-sm mx-auto" style={{ marginTop: '10px' }} onSubmit={handleSubmit}>
                        <div>
                            <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                            You now have {numberOfRooms} rooms.
                            </h5>   
                            <div class="flex items-center">
                            <button 
                                    type="button"
                                    onClick={decrementQuantity}
                                    className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100"
                                >
                                    <span className="sr-only">Decrease quantity</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                    </svg>
                                </button>
                                <div>
                                    <input 
                                        type="number" 
                                        id="first_product" 
                                        value={quantity}  // ใช้ค่าจาก state quantity
                                        readOnly
                                        className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1"
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={incrementQuantity}
                                    className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100"
                                >
                                    <span className="sr-only">Increase quantity</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Total" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Price
                            </label>
                            <input
                                type="Total"
                                id="Total"
                                value={Total}
                                onChange={(e) => setTotal(e.target.value)}
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
                                selected={startDate}  // ใช้ Date object ที่ถูกตั้งค่า
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
                                selected={endDate}  // ใช้ Date object ที่ถูกตั้งค่า
                                onChange={handleEndDateChange}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholderText="Select end date"
                                dateFormat="dd/MM/yyyy"
                                minDate={startDate} // กำหนดไม่ให้ endDate น้อยกว่า startDate
                            />
                        </div>

                        </div>
                        <button type="submit" style={{ marginTop: '20px' }}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
                            w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditSeeHoDeals;