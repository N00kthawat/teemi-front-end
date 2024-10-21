import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SeeHoDeals_() {
    const { ID_hotel } = useParams();
    const hotelID = ID_hotel ? ID_hotel.split(',')[0] : null;
    const [hotelDeals, setHotelDeals] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/hoteldeals-approve/${hotelID}`);
                const data = response.data;
                console.log('Hotel deals data:', data);
                setHotelDeals(data);

            } catch (error) {
                console.error("Error fetching the hotel deals:", error);
            }
        };

        if (hotelID) {
            fetchData();
        }
    }, [hotelID]);

    const navigateTo_Not_Approved = () => {
        navigate(`/seehoteldetails/${ID_hotel}`);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center" style={{ margin: '0 auto', maxWidth: '1100px' }}>
            {hotelDeals.map(deal => (
                <div key={deal.HDID} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <img className="rounded-t-lg w-full h-48 object-cover" src={deal.MinImg_Url_Hotel} alt={deal.NameH} />
                    <div className="p-5">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{deal.NameH}</h5>
                        <p><strong>ประเภทห้อง:</strong> {deal.NameTR}</p>
                        <p><strong>ประเภทวิว:</strong> {deal.NameTV}</p>
                        <p><strong>จำนวนห้อง:</strong> {deal.Number_of_room}</p>
                        <p><strong>วันเริ่มต้น:</strong> {deal.S_datetimeHD}</p>
                        <p><strong>วันสิ้นสุด:</strong> {deal.E_datetimeHD}</p>
                        <p><strong>สถานะ:</strong> {deal.NameOS}</p>
                    </div>
                </div>
            ))}
        </div>

        </>
    );
}

export default SeeHoDeals_;
