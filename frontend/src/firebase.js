import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0S_Ox_iEremnqGmxD30puNlReTxfJF1k",
  authDomain: "smartcarpoolmanager.firebaseapp.com",
  projectId: "smartcarpoolmanager",
  storageBucket: "smartcarpoolmanager.firebasestorage.app",
  messagingSenderId: "947531182407",
  appId: "1:947531182407:web:d327eac8979bd13e0e9c62",
  measurementId: "G-7KY3YHFFD9"
};

 

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to request notification permissions and get device token
export const getDeviceToken = async () => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission not granted for notifications.");
    }

    // Get the device token from Firebase Messaging
    const token = await getToken(messaging, {
      vapidKey: "your-vapid-key", // Get this from Firebase Console
    });

    if (!token) {
      throw new Error("No device token received.");
    }

    return token;
  } catch (error) {
    console.error("Error getting device token:", error);
    return null;
  }
};
