import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correctly import the default export 'jwtDecode'

function SeeConDeals_() {
    const { CID } = useParams();
    const [concertDeals, setConcertDeals] = useState([]);
    const [statusCD, setStatusCD] = useState(''); // State for StatusCD
    const [statusDescriptions, setStatusDescriptions] = useState({});
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchConcertDeals = async () => {
            try {
                const response = await fetch(`${API_URL}/concertsdeals-approve/${CID}`);
                const deals = await response.json();
                setConcertDeals(deals);

                if (deals.length > 0) {
                    setStatusCD(deals[0].StatusCD); // Assuming all deals have the same StatusCD
                }
            } catch (error) {
                console.error("Error fetching the concert deals:", error);
            }
        };

        fetchConcertDeals();
    }, [CID]);

    useEffect(() => {
        if (concertDeals.length > 0) {
            const fetchStatusDescriptions = async () => {
                try {
                    const statusPromises = concertDeals.map(deal =>
                        fetch(`${API_URL}/offerStatus-c/${deal.StatusCD}`).then(res => res.json())
                    );

                    const statuses = await Promise.all(statusPromises);
                    const statusMap = concertDeals.reduce((acc, deal, index) => {
                        const nameOS = statuses[index][0].NameOS; // Assuming the status has a 'NameOS' field
                        console.log(`Deal StatusCD: ${deal.StatusCD}, NameOS: ${nameOS}`);
                        acc[deal.StatusCD] = nameOS;
                        return acc;
                    }, {});

                    setStatusDescriptions(statusMap);
                } catch (error) {
                    console.error("Error fetching the status descriptions:", error);
                }
            };

            fetchStatusDescriptions();
        }
    }, [concertDeals]);

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect to login if no token is found
            return;
        }

        try {
            const decoded = jwtDecode(token); // Decode the token
            const userId = decoded.id; // Extract user ID from decoded token
            console.log('Decoded user ID:', userId); // Add console log

            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/users/${userId}`);
                    console.log('User data:', response.data); // Add console log
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

    const navigateTo_Not_Approved = () => {
        navigate(`/seecondeals/${CID}`);
    };
    return (
        <>
            <HeaderUser />
            <div className="flex items-center justify-center py-4 md:py-8 flex-wrap" style={{ marginTop: '120px' }}>
                <button type="button" onClick={navigateTo_Not_Approved}
                        className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800">
                    ยังไม่อนุมัติ
                </button>
                <button type="button" className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">
                    อนุมัติแล้ว
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ width: '1100px', marginLeft: '200px' }}>
                {concertDeals.map(deal => (
                    <div key={deal.DealID}>
                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href={`/concertmathotel/${userData?.ID_user}/${CID}/${deal.CDID}`}>
                                <img className="rounded-t-lg" src={deal.Poster} alt="" />
                            </a>
                            <div className="p-5">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{deal.Name}</h5>
                                    <p><strong>ID:</strong> {deal.CDID}</p>
                                    <p><strong>จำนวนบัตร:</strong> {deal.Number_of_ticket}</p>
                                    <p><strong>ราคา:</strong> {deal.PriceCD}</p>
                                    <p><strong>วันเริ่มต้น:</strong> {deal.S_datetime}</p>
                                    <p><strong>วันสิ้นสุด:</strong> {deal.E_datetime}</p>
                                    <p><strong>สถานะ:</strong> {statusDescriptions[deal.StatusCD]}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
        </>
    );
}

export default SeeConDeals_;
