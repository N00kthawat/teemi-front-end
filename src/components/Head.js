import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const UserDropdown = ({ onLogout, userId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login'); // Redirect to login if no token is found
        return;
    }
    try {
        const decoded = jwtDecode(token); // Decode the token
        const userId = decoded.id; // Extract user ID from decoded token
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/${userId}`);
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
    <div>
      {userData ? (
        <div className="relative" style={{ position: 'relative', marginLeft: '25px' }} ref={dropdownRef}>
          <img
            id="avatarButton"
            data-dropdown-toggle="userDropdown"
            data-dropdown-placement="bottom-start"
            className="w-19 h-19 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer"
            src={userData.img}
            width={50}
            height={50}
            alt="avatar"
            onClick={handleToggleDropdown}
          />
          {isDropdownOpen && (
            <div
              id="userDropdown"
              className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 
                absolute mt-2"
              style={{ right: 0, top: '100%', backgroundColor: 'black' }}
            >
              <div className="px-4 py-3 text-sm text-gray-200 dark:text-white">
                <div>{userData.FL_name}</div>
                <div className="font-medium truncate text-xs">{userData.Email}</div>
              </div>
              <ul className="py-2 text-sm text-gray-400 dark:text-gray-200" aria-labelledby="avatarButton">
                <li>
                  <a href={`/loginentreprenur/${userId}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    
                    บัญชีผู้ประกอบการ
                  </a>
                </li>
              </ul>
              <div className="py-1">
                <a 
                  className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600
                  dark:text-gray-200 dark:hover:text-white"
                  onClick={onLogout}
                >
                  ออกจากระบบ
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>  </p>
      )}
    </div>
  );
}

const HeaderUser = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const navigateToLoginPage = () => {
    navigate("/");
  };

  const navigateToManagementPage = () => {
    navigate("/management_hotel");
  };

  const navigateToHomePage = () => {
    navigate(`/home`); // Change this to your home route
  };

  const navigateToHomeConPage = () => {
    navigate("/home_con");
  };

  const navigateToHomePackPage = () => {
    navigate("/home_p");
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{
          justifyContent: "space-between",
          flexWrap: "wrap",   // เพิ่ม flex-wrap เพื่อจัดการเนื้อหาที่ล้น
          minHeight: { xs: 100, sm: 80 },  // เพิ่มความสูงเมื่อหน้าจอเล็ก
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button onClick={navigateToHomePackPage} sx={{ color: "white" }}>แพ็คเกจ</Button>
            <Button onClick={navigateToHomePage} sx={{ color: "white" }}>โรงแรม</Button>
            <Button onClick={navigateToHomeConPage} sx={{ color: "white" }}>คอนเสิร์ต</Button>
          </Box>
          <Typography
            onClick={navigateToHomePage}
            sx={{ 
              fontWeight: 'bold', 
              color: 'white', 
              fontFamily: 'Myriad Pro, sans-serif', 
              cursor: 'pointer',
              textAlign: 'center', // จัดกึ่งกลางเมื่อจอเล็ก
              fontSize: { xs: '1.5rem', sm: '2rem' } // ปรับขนาดฟอนต์เมื่อจอเล็ก
            }}
            variant="h4"
          >
            TEE<span style={{ color: 'skyblue' }}>MI</span>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <UserDropdown onLogout={navigateToLoginPage} userId={userId} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default HeaderUser;
