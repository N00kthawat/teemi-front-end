import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                Email: Email,
                Password: Password
            };
            console.log('Sending data:', data); // ตรวจสอบข้อมูลที่ส่งไป
            const response = await axios.post(`${API_URL}/login`, data);
            const token = response.data.token;
            localStorage.setItem('token', token); // เก็บ token ใน localStorage
            console.log('Login successful. Token:', token);

            if (token) {
                navigate('/home', { state: { token } }); // ส่ง token ไปที่หน้า /home
            } else {
                alert('Invalid email or password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                if (error.response.status === 401) {
                    alert('Invalid email or password.');
                } else {
                    alert('An error occurred. Please try again.');
                }
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <section class="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
        <div style={{ marginRight:"200px" }}>
            <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
                    <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl"
                        style={{ marginTop:'-110px', marginLeft:"-350px" }}>Welcome to TEEMI</h1>
                    
                    <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0" 
                            style={{ marginTop:"80px" }}>
                    <p class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
                        This system is designed to help users find interesting concerts and match them 
                        with suitable hotels nearby. It features a search function that allows users to 
                        specify concert details such as artist name, date, and venue. Additionally, it 
                        recommends nearby hotels, providing further information about room rates and 
                        booking options.
                    </p>
                    <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
                            style={{ marginTop:"-130px" }}>
                        <form class="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    style={{ marginRight:"290px" }}
                                >Email</label>
                                <input type="email" 
                                                        id="email" 
                                                        value={Email}
                                                        onChange={(e) => setEmail(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                style={{ marginRight:"350px" }}
                                >Password</label>
                                <input type="password" 
                                                        id="password"
                                                        value={Password}
                                                        onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                            </div>
                            <div class="flex items-start">
                                <div class="flex items-start">
                                    <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                                        <a href="/loginadmin" class="text-blue-700 hover:underline dark:text-blue-500"
                                        >Admin</a>
                                    </div>
                                </div>
                                <a href="/lostpassword" class="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                                >Lost Password?</a>
                            </div>
                            <button type="submit" class="w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800"
                                >Login to your account
                            </button>
                            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                                Not registered? <a href="/register" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>        
    </section>
    );
}

export default Login;

