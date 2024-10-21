import React, { useState, useEffect } from 'react';
import Header from "../../components/Head";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function UAllC() {
    const { CID } = useParams();
    const concertID = CID ? CID.split(',')[0] : null;
    const [concerts, setConcerts] = useState([]);
    const [typeTickets, setTypeTickets] = useState({});
    const [error, setError] = useState('');
    const [chanelData, setChanelData] = useState([]);
    const [hotelData, setHotelData] = useState([]); 
    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch concert data based on concertID
    useEffect(() => {
        if (CID) {
            console.log(`Fetching concerts CID: ${CID}`);
            const fetchConcerts = async () => {
                try {
                    const response = await axios.get(`${API_URL}/detailconcertsmt/${CID}`);
                    setConcerts(response.data);
                } catch (err) {
                    setError(err.response ? err.response.data : 'Server error. Please try again later.');
                }
            };
            fetchConcerts();
        }
    }, [CID]);

    // Fetch type ticket data for each concert
    useEffect(() => {
        if (concerts.length > 0) {
            const fetchTypeTickets = async () => {
                try {
                    const typeTicketPromises = concerts.map(concert =>
                        axios.get(`${API_URL}/typeTickets/${concert.Type}`)
                    );
                    const typeTicketResponses = await Promise.all(typeTicketPromises);
                    const typeTicketData = typeTicketResponses.reduce((acc, res, index) => {
                        const typeKey = concerts[index].Type;
                        acc[typeKey] = res.data;
                        return acc;
                    }, {});

                    setTypeTickets(typeTicketData);
                } catch (err) {
                    console.error('Error fetching type ticket data:', err);
                    setError('Failed to load type ticket data.');
                }
            };
            fetchTypeTickets();
        }
    }, [concerts]);

    // Fetch Chanel data based on concertID
    useEffect(() => {
        if (CID) {
            console.log(`Fetching Chanel data for CID: ${CID}`);
            const fetchChanelData = async () => {
                try {
                    const chanelResponse = await axios.get(`${API_URL}/chanelconcerts/${CID}`);
                    setChanelData(chanelResponse.data);
                } catch (err) {
                    console.error('Error fetching Chanel data:', err);
                    setError('Failed to load Chanel data.');
                }
            };
            fetchChanelData();
        }
    }, [CID]);
    useEffect(() => {
        if (CID) {
            console.log(`Fetching hotel data for CID: ${CID}`);
            const fetchHotelData = async () => {
                try {
                    const hotelResponse = await axios.get(`${API_URL}/detail-con-in-hotel?CID=${CID}`);
                    setHotelData(hotelResponse.data);
                } catch (err) {
                    console.error('Error fetching hotel data:', err);
                    setError('Failed to load hotel data.');
                }
            };
            fetchHotelData();
        }
    }, [CID]);
    return (
        <>
            <Header />
            <div style={{ marginTop: '150px', display: 'flex', justifyContent: 'center' }}>
                {concerts.length > 0 ? (
                    <ul style={{ marginTop: '-40px', maxWidth: '90%', width: '1200px' }}>
                        {concerts.map((concert, index) => (
                            <li key={concert.CID || index} className="mb-4 flex flex-col md:flex-row items-start">
                                <img className="w-full md:w-80 h-80 object-cover mr-4 mb-4 md:mb-0" 
                                    src={concert.Show_secheduld} 
                                    alt={concert.Name}
                                    style={{ height: '100%' }}
                                />
                                <div className="flex flex-col justify-between p-4 leading-normal">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{concert.Name}</h5>
                                    <p><strong>วันที่ทำการแสดง:</strong> {concert.StartDate_TH === concert.EndDate_TH 
                                                ? concert.StartDate_TH 
                                                : `${concert.StartDate_TH} - ${concert.EndDate_TH}`} 
                                    </p>
                                    <p><strong>สถานที่:</strong> {concert.Address}</p>
                                    <p><strong>ประเภทคอนเสิร์ต:</strong> {concert.NameTC}</p>
                                    <p><strong>ประเภทการแสดง:</strong> {concert.NameTS}</p>
                                    <p><strong>เวลาทำการแสดง:</strong> {concert.Time}</p>
                                    <p><strong>ประเภทบัตร:</strong> {concert.NameT}</p>
                                    <p><strong>บัตร:</strong> {concert.Ticket_zone}</p>
                                    <p><strong>ราคา:</strong> {concert.Price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                null
                )}
            </div>
            <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                style={{ marginLeft:"170px" }}>
                <svg class="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z"/>
                </svg>
                <a href="#">
                    <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Matching hotel</h5>
                </a>

                {hotelData.length > 0 ? hotelData.map((hotel, index) => (
                    <li key={hotel.HDID || index}>
                        <a href={`/uallh/${hotel.ID_hotel}`} className="inline-flex font-medium items-center text-blue-600 hover:underline">
                            {hotel.NameH}
                            <svg className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                            </svg>
                        </a>
                    </li>
                )) : <p>There are no matching hotels yet.</p>}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>

                {concerts.length > 0 ? (
                    <ul style={{ maxWidth: '90%', width: '1200px' }}>
                        {concerts.map((concert, index) => (
                            <li key={concert.CID || index} className="mb-4 flex flex-col md:flex-row items-start">
                                <div className="flex flex-col justify-between p-4 leading-normal">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Detail & Line UP</h5>
                                    <p>{concert.Detail}</p>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white" style={{ marginTop: '50px' }}>Member</h5>
                                    <p>{concert.LineUP}</p>
                                </div>
                                <img className="w-full md:w-80 h-80 object-cover ml-4 mb-4 md:mb-0" 
                                    src={concert.Poster} 
                                    alt={concert.Name}
                                    style={{ height: '100%' }}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                null
                )}
            </div>

            <div className="details-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <div className="details" style={{ maxWidth: '90%', width: '1200px' }}>
                    <div className="details-content">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">ช่องทางการจอง</h5>
                        {chanelData.length > 0 ? (
                            <ul>
                                {chanelData.map((chanel, index) => (
                                    <li key={chanel.id || index}>
                                        <p><strong>Link:</strong> <a href={chanel.Url} target="_blank" rel="noopener noreferrer">กดตรงนี้</a></p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            null
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UAllC;
