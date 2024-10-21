import React, { useState,useEffect } from 'react';
import Header from "../../components/Head";
import { useNavigate,useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correctly import the default export 'jwtDecode'
import axios from 'axios';

function LoginEntreprenur() {
  const { ID_user } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Email:', email, 'Password:', password);  // เพิ่มการพิมพ์ข้อมูล Email และ Password

      const response = await fetch(`${API_URL}/login-en`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login successful:', data);
      navigate(`/homeen`);
    } catch (error) {
      console.error('Error during login:', error);
      alert(error.message);
    }
  };

  const [userData, setUserData] = useState(null);

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

  return (
    <>
      <Header />
      <section class="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
          <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
              <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl"
                  style={{ marginTop:'-130px' }}>Entrepreneur login</h1>
              <div style={{ marginLeft:"440px", marginTop:"70px" }} class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                  <form class="space-y-6" onSubmit={handleSubmit}>
                      <div>
                          <input type="email"
                                  name="email"
                                  id="email"
                                  value={email} 
                                  onChange={(e) => setEmail(e.target.value)}  
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                                  placeholder="name@company.com" 
                          required />
                      </div>
                      <div>
                          <input type="password" 
                                  name="password" 
                                  id="password" 
                                  placeholder="••••••••"
                                  value={password} 
                                  onChange={(e) => setPassword(e.target.value)}  
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                          required />
                      </div>
                      <button type="submit" 
                              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800">
                        Login
                      </button>
                      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                          <a href={`/registerentreprenur/${userData?.ID_user}`} class="text-blue-700 hover:underline dark:text-blue-500">
                            Create account
                          </a>
                      </div>
                  </form>
              </div>
          </div>
      </section>

    </>
  );
}

export default LoginEntreprenur;
