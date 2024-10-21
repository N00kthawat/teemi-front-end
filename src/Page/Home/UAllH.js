import React, { useState, useEffect } from 'react';
import Header from "../../components/Head";
import axios from 'axios';
import { useParams } from 'react-router-dom';


function UAllH(){
    const { ID_hotel } = useParams();
    const [images, setImages] = useState([]);
    const [hotelDetails, setHotelDetails] = useState([]);
    const [chanelHotel, setChanelHotel] = useState([]);
    const [typeHotel, setTypeHotel] = useState(null);
    const [roomDetails, setRoomDetails] = useState([]);
    const initialVisibleImages = 6;
    const [visibleImages, setVisibleImages] = useState(initialVisibleImages);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [roomImages, setRoomImages] = useState([]); // State for room images
    const [concertlData, setConcertData] = useState([]); 
    const [error, setError] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${API_URL}/pictures/${ID_hotel}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const combinedImages = [
                    ...data.hotelPictures.map(pic => pic.Img_Url_Hotel),
                    ...data.roomPictures.map(pic => pic.Img_Url_Room)
                ];
                setImages(combinedImages);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        const fetchHotelDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/detailhotels/${ID_hotel}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHotelDetails(data);

                if (data && data.length > 0) {
                    fetchTypeHotel(data[0].Type_hotel);
                }
            } catch (error) {
                console.error('Error fetching hotel details:', error);
            }
        };

        const fetchTypeHotel = async (typeHotelId) => {
            try {
                const response = await fetch(`${API_URL}/typehotel-h?Type_hotel=${typeHotelId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTypeHotel(data[0]);
            } catch (error) {
                console.error('Error fetching type hotel:', error);
            }
        };

        const fetchChanelHotel = async () => {
            try {
                const response = await fetch(`${API_URL}/chanelhotel/${ID_hotel}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setChanelHotel(data);
            } catch (error) {
                console.error('Error fetching ChanelHotel data:', error);
            }
        };

        const fetchRoomDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/detail-room?ID_hotel=${ID_hotel}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRoomDetails(data);
            } catch (error) {
                console.error('Error fetching room details:', error);
            }
        };

        fetchImages();
        fetchHotelDetails();
        fetchChanelHotel();
        fetchRoomDetails();
    }, [ID_hotel]);

    const toggleImages = () => {
        setVisibleImages(isExpanded ? initialVisibleImages : images.length);
        setIsExpanded(!isExpanded);
    };

    const openModal = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const fetchRoomImages = async (ID_room) => {
        try {
            const response = await fetch(`${API_URL}/view-images?ID_room=${ID_room}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRoomImages(data.map(pic => pic.Img_Url_room));
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching room images:', error);
        }
    };
    useEffect(() => {
        if (ID_hotel) {
            console.log(`Fetching hotel data for CID: ${ID_hotel}`);
            const fetchConcertData = async () => {
                try {
                    const hotelResponse = await axios.get(`${API_URL}/detail-hotel-in-con?ID_hotel=${ID_hotel}`);
                    setConcertData(hotelResponse.data);
                } catch (err) {
                    console.error('Error fetching hotel data:', err);
                    setError('Failed to load hotel data.');
                }
            };
            fetchConcertData();
        }
    }, [ID_hotel]);

    return (
        <>
            <Header />
            <div className="gallery-container" style={{ marginTop: '120px', textAlign: 'center' }}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {hotelDetails.length > 0 && hotelDetails[0].NameH}
                </h5>
                <p>{hotelDetails.length > 0 && hotelDetails[0].AddressH}</p>
                </div>

                <div className="booking-gallery" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                {images.slice(0, visibleImages).map((src, index) => (
                    <div className="booking-img-container" key={index} style={{ maxWidth: '200px', flex: '1 1 auto' }}>
                    <img
                        className="booking-img"
                        src={src}
                        alt={`Image ${index + 1}`}
                        onClick={() => openModal(src)}
                        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                    />
                    </div>
                ))}
                </div>

                {images.length > initialVisibleImages && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button
                    className="text-blue-600 hover:underline"
                    onClick={toggleImages}
                    >
                    {isExpanded ? 'See Less' : 'See More'}
                    </button>
                </div>
                )}

                {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                    {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '100%', height: 'auto' }} />}
                    {!selectedImage && roomImages.length > 0 && roomImages.map((src, index) => (
                        <img key={index} src={src} alt={`Room Image ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                    ))}
                    <button className="close-button" onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '20px' }}>
                        Close
                    </button>
                    </div>
                </div>
                )}

                {hotelDetails.length > 0 && (
                <div className="hotel-details" style={{ maxWidth: '90%', margin: '20px auto', textAlign: 'center' }}>
                    <h3 className="text-lg font-bold mb-2">{typeHotel && <p><strong></strong>{typeHotel.NameTH}</p>}</h3>
                    <p>{hotelDetails[0].DetailH}</p>
                </div>
                )}

                {roomDetails.length > 0 && (
                <div className="room-details" style={{ maxWidth: '90%', margin: '20px auto', textAlign: 'center' }}>
                    <h3 className="text-lg font-bold mb-2">Room Details</h3>
                    <table className="table-auto w-full text-left">
                    <thead>
                        <tr>
                        <th className="px-4 py-2">Type of Room</th>
                        <th className="px-4 py-2">Type of View</th>
                        <th className="px-4 py-2">Number of Room</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomDetails.map((room, index) => (
                        <tr key={index} className="hover:bg-gray-200 cursor-pointer">
                            <td className="border px-4 py-2">{room.NameTR}</td>
                            <td className="border px-4 py-2">{room.NameTV}</td>
                            <td className="border px-4 py-2">{room.NRoom}</td>
                            <td className="border px-4 py-2">{room.NameRS}</td>
                            <td className="border px-4 py-2">{room.PriceH} $</td>
                            <td className="border px-4 py-2">
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                fetchRoomImages(room.ID_room);
                                }}
                                className="text-blue-600 hover:underline"
                            >
                                View Images
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}

                <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        style={{ marginLeft:"80px" }}>
                    <svg class="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z"/>
                    </svg>
                    <a href="#">
                        <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Matching concert</h5>
                    </a>

                    {concertlData.length > 0 ? concertlData.map((concert, index) => (
                        <li key={concert.CDID || index}>
                            <a href={`/uallc/${concert.CID}`} className="inline-flex font-medium items-center text-blue-600 hover:underline">
                                {concert.Name}
                                <svg className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"/>
                                </svg>
                            </a>
                        </li>
                    )) : <p>There are no matching concerts yet.</p>}

                </div>
                <div className="details-container" style={{ maxWidth: '90%', marginTop:"-125px", marginLeft:"-90px" }}>
                <div className="details">
                    <div className="details-content">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        ช่องทางการจอง
                    </h5>
                    {chanelHotel && chanelHotel.map((item, index) => (
                        <p key={index}><strong>Link:</strong> <a href={item.UrlH} target="_blank" rel="noopener noreferrer">กดตรงนี้</a></p>
                    ))}
                    </div>
                </div>
            </div>

        </>
    )
}

export default UAllH;