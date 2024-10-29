// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Optional: If you plan to use Firestore
// Import other Firebase services as needed

// Your web app's Firebase configuration (replace with your own credentials)
const firebaseConfig = {
    apiKey: "AIzaSyAxaGQU1IFpTU3SkxzV_dtQSNYqN5FOFLY",
    authDomain: "clockwise-3196b.firebaseapp.com",
    projectId: "clockwise-3196b",
    storageBucket: "clockwise-3196b.appspot.com",
    messagingSenderId: "337715407613",
    appId: "1:337715407613:web:fb1dff59fdb0f49896ec94",
    measurementId: "G-VQG5ZV7V15"
  };

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore (if you are using Firestore)
const db = getFirestore(app);

// Export the services to use them in other parts of your app
export { auth, db }; // Add other services as needed
export default app; // Optional: Export the initialized app if needed
