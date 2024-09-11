import React, { useEffect } from 'react';
import "./style.css";
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import userImg from '../../assets/user.svg'

function Header() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(""); 
        }
    }, [user, loading , navigate]);

    function logoutFunc() {
        try {
            signOut(auth)
                .then(() => {
                    toast.success("Logged out successfully.");
                    navigate("./"); 
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <div className='navbar'>
            <p className='logo'>Financely</p>
            {user && (
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <img src={user.photoURL?user.photoURL:userImg}  
                    style={{height:"1.5rem", width :"1.5rem " ,borderRadius:"50%" }}></img>

                
                <p className='logo link' onClick={logoutFunc}>Logout

                </p>
                </div>
            )}
        </div>
    );
}

export default Header;
