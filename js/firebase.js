// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD5BEQMluv8fdW4qCBS8biycQ1PSUTu-Is",
    authDomain: "yermap-696969.firebaseapp.com",
    databaseURL: "https://yermap-696969-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "yermap-696969",
    storageBucket: "yermap-696969.firebasestorage.app",
    messagingSenderId: "787158803464",
    appId: "1:787158803464:web:0ceb3c8750d2f2f2ae5dbd",
    measurementId: "G-XGQZ57FLJY"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exportar auth para login
export const db = getDatabase(app); // Exportar Firestore