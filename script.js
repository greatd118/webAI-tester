// Fungsi generate Device ID dari berbagai fingerprint
function getDeviceID() {
    let components = [];
    // Layar
    components.push(screen.width + 'x' + screen.height);
    components.push(screen.colorDepth);
    // Navigator
    components.push(navigator.userAgent);
    components.push(navigator.language);
    components.push(navigator.platform);
    // WebGL (kalau ada)
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
            components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        }
    }
    // Timezone
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
    // Fonts (pakai canvas fingerprint)
    const canvas2 = document.createElement('canvas');
    const ctx = canvas2.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('DeviceID', 2, 2);
    components.push(canvas2.toDataURL());

    // Hash jadi ID unik
    const raw = components.join('|||');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Konversi ke 32-bit integer
    }
    return 'DEV-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

// Eksekusi
const deviceID = getDeviceID();

// Simpan ke localStorage (buat diambil admin.html nanti)
let data = JSON.parse(localStorage.getItem('deviceData') || '[]');
data.push({
    id: deviceID,
    time: new Date().toISOString(),
    userAgent: navigator.userAgent
});
localStorage.setItem('deviceData', JSON.stringify(data));

// Redirect paksa ke URL tujuan (ganti sendiri)
window.location.href = 'https://www.example.com'; // atau 'admin.html' kalo mau liat hasil langsung
