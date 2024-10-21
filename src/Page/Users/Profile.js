import React, { useState, useEffect } from 'react';
import HeaderUser from "../../components/HeadUser";
import { useParams, useNavigate } from 'react-router-dom';

function Profile(){
    const { userId } = useParams();
    const API_URL = process.env.REACT_APP_API_URL;
    return(
        <>
            <HeaderUser/>
        </>
    )
}

export default Profile;