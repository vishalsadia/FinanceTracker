import React, { useState } from 'react';
import "./style.css";
import Input from '../../../input';
import Button from '../../../Button';
import { auth, db } from '../../../../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function signUpWithEmail() {
        setLoading(true);

        if (name && email && password && confirmPassword) {
            if (password === confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        toast.success("User Created");
                        resetForm();
                        createDoc(user);
                        navigate("/dashboard");
                    })
                    .catch((error) => {
                        toast.error(error.message);
                        setLoading(false);
                    });
            } else {
                toast.error("Password and Confirm Password don't match");
                setLoading(false);
            }
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    function loginUsingEmail() {
        setLoading(true);

        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // const user = userCredential.user;
                    toast.success("User Logged in");
                    navigate("/dashboard");
                })
                .catch((error) => {
                    toast.error(error.message);
                    setLoading(false);
                });
        } else {
            toast.error("All fields are mandatory");
            setLoading(false);
        }
    }

    async function createDoc(user) {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists()) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName || name,
                    email: user.email,
                    photoUrl: user.photoURL || "",
                    createdAt: new Date(),
                });
                toast.success("Document created");
            } catch (e) {
                toast.error(e.message);
            }
        } else {
            toast.error("Document already exists");
        }
        setLoading(false);
    }

    function googleAuth() {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;   
                createDoc(user);
                setLoading(false);
                toast.success("User Authenticated");
                navigate("/dashboard");
            
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
        });
    }

    function resetForm() {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setLoading(false);
    }

    return (
        <>
            {loginForm ? (
                <div className='signup-wrapper'>
                    <h2 className='title'>
                        Login to <span style={{ color: "var(--theme)" }}>Financely</span>
                    </h2>
                    <form>
                        <Input
                            type="email"
                            label={"Email"}
                            state={email}
                            setState={setEmail}
                            placeholder={"JohnDoe@gmail.com"}
                        />
                        <Input
                            type="password"
                            label={"Password"}
                            state={password}
                            setState={setPassword}
                            placeholder={"Example@123"}
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Login using Email and Password"}
                            onClick={loginUsingEmail}
                        />
                        <p style={{ textAlign: "center", margin: 0 }}>or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Login using Google"}
                            blue={true}
                        />
                        <p
                            className='p-login'
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(!loginForm)}
                        >
                            Don't Have An Account? Click Here
                        </p>
                    </form>
                </div>
            ) : (
                <div className='signup-wrapper'>
                    <h2 className='title'>
                        Sign Up on <span style={{ color: "var(--theme)" }}>Financely</span>
                    </h2>
                    <form>
                        <Input
                            label={"Full Name"}
                            state={name}
                            setState={setName}
                            placeholder={"John Doe"}
                        />
                        <Input
                            type="email"
                            label={"Email"}
                            state={email}
                            setState={setEmail}
                            placeholder={"JohnDoe@gmail.com"}
                        />
                        <Input
                            type="password"
                            label={"Password"}
                            state={password}
                            setState={setPassword}
                            placeholder={"Example@123"}
                        />
                        <Input
                            type="password"
                            label={"Confirm Password"}
                            state={confirmPassword}
                            setState={setConfirmPassword}
                            placeholder={"Example@123"}
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Sign Up using Email and Password"}
                            onClick={signUpWithEmail}
                        />
                        <p style={{ textAlign: "center", margin: 0 }}>or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Sign Up using Google"}
                            blue={true}
                        />
                        <p
                            className='p-login'
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(!loginForm)}
                        >
                            Have An Account Already? Click Here
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}

export default SignupSigninComponent;
