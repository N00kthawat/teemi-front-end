import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';

function ChanelH() {
    const { ID_hotel } = useParams();
    const [inputFields, setInputFields] = useState([{ value: '' }]);
    const API_URL = process.env.REACT_APP_API_URL;
    //const [ID_hotel, setID_hotel] = useState(null); // State to hold the hotel ID
    const navigate = useNavigate();  // Initialize the navigate function


    const handleAddInput = () => {
        setInputFields([...inputFields, { value: '' }]);
    };

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        values[index].value = event.target.value;
        setInputFields(values);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!ID_hotel) {
            alert('Hotel ID is not available.');
            return;
        }

        try {
            for (const field of inputFields) {
                const response = await fetch(`${API_URL}/addchanelhotel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ID_hotel: ID_hotel,
                        UrlH: field.value
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            }

            alert('All ChanelHotel records added successfully');
            navigate(`/imghotel/${ID_hotel}`);  // Navigate to the management_hotel page
        } catch (error) {
            console.error('Error:', error.message);
            alert(`There was an error adding ChanelHotel records: ${error.message}`);
        }
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>
                Chanels
            </h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>
                for booking hotel.
            </p>
            <form className="max-w-md mx-auto" style={{ marginTop: '20px' }} onSubmit={handleSubmit}>
                {inputFields.map((inputField, index) => (
                    <div className="relative mb-4" key={index}>
                        <input
                            type="url"
                            value={inputField.value}
                            onChange={(event) => handleInputChange(index, event)}
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
                                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Link Chanel"
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

export default ChanelH;
