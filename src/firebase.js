// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/analytics';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCVbd83SEzNhwv3Lw-deWHi04aPG_zzrY",
  authDomain: "personal-finance-tracker-42b19.firebaseapp.com",
  projectId: "personal-finance-tracker-42b19",
  storageBucket: "personal-finance-tracker-42b19.appspot.com",
  messagingSenderId: "633047924309",
  appId: "1:633047924309:web:24ee64111b93799ff4dedc",
  measurementId: "G-Q0BV9BJ8D3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signOut };
