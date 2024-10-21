import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function LostPassword (){
    const [email, setEmail] = useState('');  
    const navigate = useNavigate();
    
    const navigateToCheckUser = () => {
        navigate(`/checkUser/${email}`);
    }    

    return(
        <section class="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
            <div className='px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56'
                    style={{ marginLeft:"550px" }}>
                <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <form class="space-y-6" >
                        <h5 style={{ marginTop:"30px" }} class="text-xl font-medium text-gray-900 dark:text-white">Enter your email address to confirm your password change.</h5>
                        <div >
                            <input type="email" 
                                    name="email" 
                                    id="email"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                                placeholder="name@company.com" 
                                value={email}  // ผูกค่ากับ state email
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                        </div>
                        <button type="submit" onClick={navigateToCheckUser}
                                class="w-full text-white bg-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-800"
                            >Attest
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default LostPassword;