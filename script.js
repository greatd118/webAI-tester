// Firebase Config (dari lo)
const firebaseConfig = {
    apiKey: "AIzaSyAKk8yOBe0AJbu9krI0DigvIJpATFWXezE",
    authDomain: "stealth-c7df6.firebaseapp.com",
    databaseURL: "https://stealth-c7df6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stealth-c7df6",
    storageBucket: "stealth-c7df6.firebasestorage.app",
    messagingSenderId: "167464139264",
    appId: "1:167464139264:web:62b093af1066bf8084b6e5",
    measurementId: "G-0VE28H406J"
};

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Fungsi get Device ID (fingerprint)
function getDeviceID() {
    let components = [];
    components.push(screen.width + 'x' + screen.height);
    components.push(screen.colorDepth);
    components.push(navigator.userAgent);
    components.push(navigator.language);
    components.push(navigator.platform);
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
            components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        }
    }
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    const canvas2 = document.createElement('canvas');
    const ctx = canvas2.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('DeviceID', 2, 2);
    components.push(canvas2.toDataURL());

    const raw = components.join('|||');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'DEV-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

// Eksekusi
const deviceID = getDeviceID();

// Kirim ke Firebase
push(ref(db, 'devices'), {
    id: deviceID,
    time: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen: screen.width + 'x' + screen.height
}).then(() => {
    console.log('✅ Device ID terkirim:', deviceID);
    // Redirect setelah sukses (GANTI URL TUJUAN LO)
    window.location.href = 'https://www.example.com';
}).catch((err) => {
    console.error('❌ Gagal kirim ke Firebase:', err);
    // Tetep redirect walau error
    window.location.href = 'https://www.example.com';
});
