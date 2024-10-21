import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterAdmin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simple client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/register-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Email: email,
                    Password: password,
                    ConfirmPassword: confirmPassword,
                }),
            });

            if (response.ok) {
                navigate(-1); // Redirect to a success page
            } else {
                const errorMessage = await response.text();
                setError(errorMessage); // Set error message from the server
            }
        } catch (err) {
            console.error('An error occurred:', err);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
            <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700" style={{ marginTop: '150px', marginLeft:"600px" }}>
                <form class="space-y-6" onSubmit={handleSubmit}>
                    <h5 class="text-xl font-medium text-gray-900 dark:text-white">Create an admin account</h5>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" 
                                name="email" 
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" 
                                name="password" 
                                id="password" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                        <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Repeat password
                        </label>
                        <input
                            type="password"
                            id="repeat-password"
                            placeholder="••••••••"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <div className="mb-5 text-red-500">
                            {error}
                        </div>
                    )}
                    <button type="submit" disabled={loading} class="w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800">
                        {loading ? 'Registering...' : 'Register new account'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default RegisterAdmin;