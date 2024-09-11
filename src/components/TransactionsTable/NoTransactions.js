import React, { useEffect } from 'react';
import './style.css';
import { auth, signOut } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userImg from '../../assets/user.svg';






function Header() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/"); // Navigate to home or intended route
        }
    }, [user, loading, navigate]);

    function logoutFunc() {
        signOut(auth)
            .then(() => {
                toast.success("Logged out successfully.");
                navigate("./"); 
            })
            .catch((error) => {
                toast.error(error.message);
            });
    }

    return (
        <div className='navbar'>
            <p className='logo'>Financely</p>
            {user && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <img 
                        src={user.photoURL ? user.photoURL : userImg}  
                        alt="User" 
                        style={{ height: "1.5rem", width: "1.5rem", borderRadius: "50%" }} 
                    />
                    <p className='logo link' onClick={logoutFunc}>Logout</p>
                </div>
            )}
        </div>
    );
}

export default Header;
