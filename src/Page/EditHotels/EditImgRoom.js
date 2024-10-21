import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';

function EditImgRoom() {
    const { ID_room } = useParams();
    const [inputs, setInputs] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    // Fetch existing image URLs when component mounts
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${API_URL}/roompicture/${ID_room}`);
                const imageUrls = response.data.map((item, index) => ({
                    id: index + 1, // Adjust id according to your requirement
                    value: item.Img_Url_Room
                }));
                setInputs(imageUrls);
            } catch (error) {
                console.error('Error fetching image URLs:', error);
            }
        };

        fetchImages();
    }, [ID_room]);

    const handleAddInput = () => {
        setInputs([...inputs, { id: inputs.length + 1, value: '' }]);
    };

    const handleInputChange = (id, event) => {
        const newInputs = inputs.map(input => {
            if (input.id === id) {
                return { ...input, value: event.target.value };
            }
            return input;
        });
        setInputs(newInputs);
    };

    const handleRemoveInput = (id) => {
        setInputs(inputs.filter(input => input.id !== id));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare the data to send
        const channels = inputs.map(input => input.value);

        try {
            await axios.post(`${API_URL}/roompicture/${ID_room}`, { channels });
            alert('Images updated successfully');
            navigate('/management_hotel'); // Redirect to another page if necessary
        } catch (error) {
            console.error('Error updating images:', error);
            alert('Error updating images');
        }
    };

    const handleEditRoom = () => {
        navigate(`/editroom/${ID_room}`);
    };

    return (
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white" style={{ marginTop: '100px', marginLeft: '50px' }}>Edit</h5>
            <p className="ms-2 font-semibold text-gray-500 dark:text-gray-400" style={{ marginLeft: '50px' }}>room photos.</p>
            <form className="max-w-md mx-auto" style={{ marginTop: '20px' }} onSubmit={handleSubmit}>
                {inputs.map(input => (
                    <div className="relative mb-4 flex items-center" key={input.id}>
                        <img
                            src={input.value}
                            alt={`Image ${input.id}`}
                            className="w-16 h-16 object-cover mr-4 border rounded"
                            style={{ display: input.value ? 'block' : 'none' }} // Hide image if URL is empty
                        />
                        <input
                            type="url"
                            id={`url-${input.id}`}
                            value={input.value}
                            onChange={e => handleInputChange(input.id, e)}
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
                                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Link Chanel"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveInput(input.id)}
                            className="absolute right-0 top-0 mt-4 mr-4 text-white bg-red-500 hover:bg-red-700 
                            focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1"
                        >
                            X
                        </button>
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
                    Save
                </button>
                <button type="button" style={{ marginLeft:'210px' }}
                        onClick={handleEditRoom}
                        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                                focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 
                                dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                >Next</button>
            </form>
        </>
    );
}

export default EditImgRoom;
