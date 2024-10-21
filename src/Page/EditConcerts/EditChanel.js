import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderUser from "../../components/HeadUser";

function EditChanel (){
    const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
    const { CID } = useParams(); // Get CID from URL parameters
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchChanelData = async () => {
            try {
                const response = await axios.get(`${API_URL}/chanelconcerts/${CID}`);
                const fetchedInputs = response.data.map((url, index) => ({
                    id: index + 1,
                    value: url.Url
                }));
                setInputs(fetchedInputs.length > 0 ? fetchedInputs : [{ id: 1, value: '' }]);
            } catch (error) {
                console.error('Error fetching Chanel data:', error);
            }
        };
        fetchChanelData();
    }, [CID]);

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
        try {
            const channels = inputs.map(input => input.value);
            await axios.post(`${API_URL}/chanelconcerts/${CID}`, { channels });
            alert('Channels updated successfully');
            navigate(`/allc/${CID}`);
        } catch (error) {
            console.error('Error updating Chanel data:', error);
        }
    };

    return(
        <>
            <HeaderUser />
            <h5 className="text-5xl font-extrabold dark:text-white"
                style={{ marginTop: '100px', marginLeft: '50px' }} >Edit </h5>
            <p  className="ms-2 font-semibold text-gray-500 dark:text-gray-400"
                style={{ marginLeft: '50px' }} >Chanels for booking concert tickets. </p>

            <form className="max-w-md mx-auto" style={{ marginTop: '20px' }} onSubmit={handleSubmit}>
                {inputs.map(input => (
                    <div className="relative mb-4" key={input.id}>
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
            </form>
        </>
    );
}

export default EditChanel;
