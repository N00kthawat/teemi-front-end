import React, { useState,useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import date-fns for date formatting

function ConcertDeals() {
    const { CID } = useParams();
    const navigate = useNavigate();
    const [numberOfTickets, setNumberOfTickets] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [FDate, setFDate] = useState(null);
    const [concertDetails, setConcertDetails] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        if (startDate && endDate && startDate > endDate) {
            setEndDate(null); // ล้าง endDate ถ้าเลือกผิดช่วง
        }
    }, [startDate]);
    
    useEffect(() => {
        const fetchConcertDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/concertdeals-c?CID=${CID}`);
                if (response.ok) {
                    const data = await response.json();
                    setConcertDetails(data);
                } else {
                    console.error('Failed to fetch concert details');
                }
            } catch (error) {
                console.error('Error fetching concert details:', error);
            }
        };

        fetchConcertDetails();
    }, [CID, API_URL]);

    const handleStartDateChange = (date) => {
        console.log("Selected Start Date:", date); // ตรวจสอบค่า
        setStartDate(date);
        if (endDate && date > endDate) {
            setEndDate(null);
        }
    };
    
    const handleEndDateChange = (date) => {
        console.log("Selected End Date:", date); // ตรวจสอบค่า
        setEndDate(date);
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format the dates to YYYY-MM-DD (ใช้วันที่จาก state ที่ผู้ใช้เลือก)
        const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : null;
        const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : null;
    
        const data = {
            CID,
            Number_of_ticket: numberOfTickets,
            S_datetime: formattedStartDate,
            E_datetime: formattedEndDate,
            StatusCD: 1,
            PriceCD: price
        };
    
        try {
            const response = await fetch(`${API_URL}/concertdeals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                alert('Insert successful');
                navigate('/management');
            } else {
                alert('Failed to insert');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        }
    };
    

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }}>Create</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400"
                style={{ marginLeft: '50px' }}>Concert Deals</p>
            
            {concertDetails ? (
                <div className="flex justify-center items-center" style={{ marginTop: "20px" }}>
                    <div className="flex justify-between w-full max-w-6xl mx-auto">
                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <a href="" className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={concertDetails.Poster} alt="Poster"
                                    style={{ marginLeft: "20px" }} />
                                <div className="flex flex-col justify-between p-4 leading-normal">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{concertDetails.Name}</h5>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">ชื่อศิลปิน: {concertDetails.LineUP}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{concertDetails.Address}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{concertDetails.NameTS}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{concertDetails.NameTC}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">ประเภทบัตร: {concertDetails.NameT}</p>
                                </div>
                            </a>

                            <a href="" className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={concertDetails.Show_secheduld} alt="Show Schedule"
                                    style={{ marginLeft: "20px" }} />
                                <div className="flex flex-col justify-between p-4 leading-normal">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{concertDetails.Ticket_zone}</h5>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">เวลา: {concertDetails.Time}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">ราคา: {concertDetails.Price}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        {concertDetails.StartDate_TH === concertDetails.EndDate_TH 
                                                ? concertDetails.StartDate_TH 
                                                : `${concertDetails.StartDate_TH} - ${concertDetails.EndDate_TH}`}
                                    </p>
                                </div>
                            </a>
                        </div>

                        <div className="w-full md:w-1/2">
                            <form className="max-w-sm mx-auto" style={{ marginTop: '60px' }} onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="Number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of Tickets</label>
                                    <input type="text" id="Number" value={numberOfTickets} onChange={(e) => setNumberOfTickets(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>
                                <div>
                                    <label htmlFor="Price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                    <input type="text" id="Price" value={price} onChange={(e) => setPrice(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                </div>

                                <div className="flex space-x-4 mb-4" style={{ marginTop:"10px" }}>
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="startDate"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Start Date
                                        </label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={handleStartDateChange}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                                                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                                dark:focus:border-blue-500"
                                            placeholderText="Select start date"
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()} // ห้ามเลือกวันที่ย้อนหลัง
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="endDate"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            End Date
                                        </label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={handleEndDateChange}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate || new Date()} // ถ้ากำหนด startDate ต้องเริ่มจากวันนั้น
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 
                                                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                                dark:focus:border-blue-500"
                                            placeholderText="Select end date"
                                            dateFormat="dd/MM/yyyy"
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
                </div>
            ) : (
                <p>Loading concert details...</p>
            )}


        </>
    )
}

export default ConcertDeals;
