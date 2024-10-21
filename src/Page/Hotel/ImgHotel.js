import React, { useState } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ImgHotel() {
    const { ID_hotel } = useParams();
    const [imageLinks, setImageLinks] = useState(['']);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleAddInput = () => {
        setImageLinks([...imageLinks, '']);
    };

    const handleInputChange = (index, event) => {
        const newImageLinks = [...imageLinks];
        newImageLinks[index] = event.target.value;
        setImageLinks(newImageLinks);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/hotelpicture`, {
                ID_hotel: parseInt(ID_hotel, 10),
                Img_Url_Hotel: imageLinks
            });
            console.log(response.data);
            navigate(`/management_hotel`);
        } catch (error) {
            console.error('There was an error submitting the form!', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    };

    return (
        <>
            <HeaderUser />
            <h5
                className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }}
            >
                Hotel
            </h5>
            <p
                className="ms-2 font-semibold text-gray-500 dark:text-gray-400"
                style={{ marginLeft: '50px' }}
            >
                image
            </p>
            <form className="max-w-md mx-auto" style={{ marginTop: '20px' }} onSubmit={handleSubmit}>
                {imageLinks.map((link, index) => (
                    <div className="relative mb-4" key={index}>
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                        <input
                            type="url"
                            value={link}
                            onChange={(event) => handleInputChange(index, event)}
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
                                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Link img"
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddInput}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
                            rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Add
                </button>
                <button
                    type="submit"
                    className="ml-4 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-green-300 
                            font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    Next
                </button>
            </form>
        </>
    );
}

export default ImgHotel;
