// Firebaseè¨­å®š
const firebaseConfig = {
    apiKey: "AIzaSyBBNxYD46f-HPoeHo0JlBqIDiZs8_E7l_k",
    authDomain: "shift-app-956a0.firebaseapp.com",
    databaseURL: "https://shift-app-956a0-default-rtdb.firebaseio.com",
    projectId: "shift-app-956a0",
    storageBucket: "shift-app-956a0.firebasestorage.app",
    messagingSenderId: "81668991091",
    appId: "1:81668991091:web:ccac553daf21cd3e15e206",
    measurementId: "G-002NDWGWGL"
};

// FirebaseåˆæœŸåŒ–
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
// ==========================================
// èªè¨¼æ©Ÿèƒ½ã‚³ãƒ¼ãƒ‰ï¼ˆå¾“æ¥­å“¡ç•ªå·å¯¾å¿œç‰ˆï¼‰
// ==========================================

// Firebase Auth ã®åˆæœŸåŒ–ï¼ˆfirebase.initializeApp ã®å¾Œã«è¿½åŠ ï¼‰
const auth = firebase.auth();

// ç¾åœ¨ã®ãƒ¦ãƒ¼ã‚¶ãƒ¼æƒ…å ±ã‚’ä¿æŒ
let currentUser = null;

// å¾“æ¥­å“¡ç•ªå·ã‚’ãƒ¡ãƒ¼ãƒ«ã‚¢ãƒ‰ãƒ¬ã‚¹ã«å¤‰æ›
function staffIdToEmail(staffId) {
    return staffId + '@staff.local';
}

// ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰ã‚’6æ–‡å­—ä»¥ä¸Šã«å¤‰æ›
function convertPassword(password) {
    return password + 'pw';
}

// èªè¨¼çŠ¶æ…‹ã®ç›£è¦–
auth.onAuthStateChanged((user) => {
    if (user) {
        // ãƒ­ã‚°ã‚¤ãƒ³æ¸ˆã¿
        currentUser = user;
        console.log('ãƒ­ã‚°ã‚¤ãƒ³æ¸ˆã¿:', user.email);
        
        // UIã‚’è¡¨ç¤º
        document.getElementById('authContainer').classList.remove('show');
        document.getElementById('appContainer').classList.remove('hidden');
        document.getElementById('logoutBtnContainer').style.display = 'block';
        
        // ãƒ‡ãƒ¼ã‚¿ãƒ™ãƒ¼ã‚¹ã«ãƒ¦ãƒ¼ã‚¶ãƒ¼æƒ…å ±ã‚’ä¿å­˜ï¼ˆåˆå›žã®ã¿ï¼‰
        const userRef = database.ref('users/' + user.uid);
        userRef.once('value', (snapshot) => {
            if (!snapshot.exists()) {
                // æ–°è¦ãƒ¦ãƒ¼ã‚¶ãƒ¼ã®å ´åˆã€ãƒ‡ãƒ¼ã‚¿ãƒ™ãƒ¼ã‚¹ã«ç™»éŒ²
                const staffId = user.email.split('@')[0];
                userRef.set({
                    staffId: staffId,
                    displayName: user.displayName || 'å¾“æ¥­å“¡' + staffId,
                    createdAt: new Date().toISOString()
                });
            }
        });
        
        // æ—¢å­˜ã®åˆæœŸåŒ–å‡¦ç†ã‚’å®Ÿè¡Œ
        if (typeof initApp === 'function') {
            initApp();
        }
        
    } else {
        // æœªãƒ­ã‚°ã‚¤ãƒ³
        currentUser = null;
        console.log('æœªãƒ­ã‚°ã‚¤ãƒ³');
        
        // ãƒ­ã‚°ã‚¤ãƒ³ç”»é¢ã‚’è¡¨ç¤º
        document.getElementById('authContainer').classList.add('show');
        document.getElementById('appContainer').classList.add('hidden');
        document.getElementById('logoutBtnContainer').style.display = 'none';
    }
});

// ã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’è¡¨ç¤º
function showAuthError(message) {
    const errorEl = document.getElementById('authError');
    errorEl.textContent = message;
    errorEl.classList.add('show');
    setTimeout(() => {
        errorEl.classList.remove('show');
    }, 5000);
}

// ãƒ­ã‚°ã‚¤ãƒ³/ç™»éŒ²ãƒ¢ãƒ¼ãƒ‰ã®åˆ‡ã‚Šæ›¿ãˆ
let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const toggleText = document.getElementById('toggleText');
    const authSubtitle = document.getElementById('authSubtitle');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // å¾“æ¥­å“¡ç•ªå·ã®å…¥åŠ›åˆ¶é™ï¼ˆ3æ¡ã®æ•°å­—ã®ã¿ï¼‰
    const staffIdInputs = document.querySelectorAll('.staff-id-input');
    staffIdInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // æ•°å­—ã®ã¿è¨±å¯
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            // 3æ¡ã¾ã§
            if (e.target.value.length > 3) {
                e.target.value = e.target.value.slice(0, 3);
            }
        });
    });
    
    // ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰ã®å…¥åŠ›åˆ¶é™ï¼ˆ4æ¡ã®æ•°å­—ã®ã¿ï¼‰
    const passwordInputs = document.querySelectorAll('.password-input');
    passwordInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            // æ•°å­—ã®ã¿è¨±å¯
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            // 4æ¡ã¾ã§
            if (e.target.value.length > 4) {
                e.target.value = e.target.value.slice(0, 4);
            }
        });
    });
    
    // ãƒ­ã‚°ã‚¤ãƒ³/ç™»éŒ²ã®åˆ‡ã‚Šæ›¿ãˆ
    toggleAuthMode.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
            authSubtitle.textContent = 'ãƒ­ã‚°ã‚¤ãƒ³ã—ã¦ãã ã•ã„';
            toggleText.textContent = 'ã¾ã ç™»éŒ²ã—ã¦ã„ãªã„æ–¹ã¯';
            toggleAuthMode.textContent = 'æ–°è¦ç™»éŒ²';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
            authSubtitle.textContent = 'æ–°è¦ã‚¢ã‚«ã‚¦ãƒ³ãƒˆä½œæˆ';
            toggleText.textContent = 'ã™ã§ã«ç™»éŒ²æ¸ˆã¿ã®æ–¹ã¯';
            toggleAuthMode.textContent = 'ãƒ­ã‚°ã‚¤ãƒ³';
        }
        
        // ã‚¨ãƒ©ãƒ¼ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’ã‚¯ãƒªã‚¢
        document.getElementById('authError').classList.remove('show');
    });
    
    // ãƒ­ã‚°ã‚¤ãƒ³å‡¦ç†
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const staffId = document.getElementById('loginStaffId').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // å…¥åŠ›ãƒã‚§ãƒƒã‚¯
        if (staffId.length !== 3) {
            showAuthError('å¾“æ¥­å“¡ç•ªå·ã¯3æ¡ã§å…¥åŠ›ã—ã¦ãã ã•ã„');
            return;
        }
        if (password.length !== 4) {
            showAuthError('ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰ã¯4æ¡ã§å…¥åŠ›ã—ã¦ãã ã•ã„');
            return;
        }
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'ãƒ­ã‚°ã‚¤ãƒ³ä¸­...';
            
            const email = staffIdToEmail(staffId);
            const fullPassword = convertPassword(password);
            
            await auth.signInWithEmailAndPassword(email, fullPassword);
            // ãƒ­ã‚°ã‚¤ãƒ³æˆåŠŸï¼ˆonAuthStateChangedã§å‡¦ç†ã•ã‚Œã‚‹ï¼‰
            
        } catch (error) {
            console.error('ãƒ­ã‚°ã‚¤ãƒ³ã‚¨ãƒ©ãƒ¼:', error);
            let errorMessage = 'ãƒ­ã‚°ã‚¤ãƒ³ã«å¤±æ•—ã—ã¾ã—ãŸ';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'å¾“æ¥­å“¡ç•ªå·ã¾ãŸã¯ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰ãŒé–“é•ã£ã¦ã„ã¾ã™';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'å¾“æ¥­å“¡ç•ªå·ã¾ãŸã¯ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰ãŒé–“é•ã£ã¦ã„ã¾ã™';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'å¾“æ¥­å“¡ç•ªå·ã¾ãŸã¯ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰ãŒé–“é•ã£ã¦ã„ã¾ã™';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'ãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã‚¨ãƒ©ãƒ¼ãŒç™ºç”Ÿã—ã¾ã—ãŸ';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'ãƒ­ã‚°ã‚¤ãƒ³è©¦è¡Œå›žæ•°ãŒå¤šã™ãŽã¾ã™ã€‚ã—ã°ã‚‰ãå¾…ã£ã¦ã‹ã‚‰å†åº¦ãŠè©¦ã—ãã ã•ã„';
                    break;
            }
            
            showAuthError(errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ãƒ­ã‚°ã‚¤ãƒ³';
        }
    });
    
    // æ–°è¦ç™»éŒ²å‡¦ç†
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const staffId = document.getElementById('registerStaffId').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        // å…¥åŠ›ãƒã‚§ãƒƒã‚¯
        if (!name) {
            showAuthError('åå‰ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„');
            return;
        }
        if (staffId.length !== 3) {
            showAuthError('å¾“æ¥­å“¡ç•ªå·ã¯3æ¡ã§å…¥åŠ›ã—ã¦ãã ã•ã„');
            return;
        }
        if (password.length !== 4) {
            showAuthError('ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰ã¯4æ¡ã§å…¥åŠ›ã—ã¦ãã ã•ã„');
            return;
        }
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'ç™»éŒ²ä¸­...';
            
            const email = staffIdToEmail(staffId);
            const fullPassword = convertPassword(password);
            
            const userCredential = await auth.createUserWithEmailAndPassword(email, fullPassword);
            
            // è¡¨ç¤ºåã‚’è¨­å®š
            await userCredential.user.updateProfile({
                displayName: name
            });
            
            // ãƒ‡ãƒ¼ã‚¿ãƒ™ãƒ¼ã‚¹ã«ãƒ¦ãƒ¼ã‚¶ãƒ¼æƒ…å ±ã‚’ä¿å­˜
            await database.ref('users/' + userCredential.user.uid).set({
                staffId: staffId,
                displayName: name,
                createdAt: new Date().toISOString()
            });
            
            // ç™»éŒ²æˆåŠŸï¼ˆonAuthStateChangedã§å‡¦ç†ã•ã‚Œã‚‹ï¼‰
            
        } catch (error) {
            console.error('ç™»éŒ²ã‚¨ãƒ©ãƒ¼:', error);
            let errorMessage = 'ã‚¢ã‚«ã‚¦ãƒ³ãƒˆç™»éŒ²ã«å¤±æ•—ã—ã¾ã—ãŸ';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'ã“ã®å¾“æ¥­å“¡ç•ªå·ã¯æ—¢ã«ä½¿ç”¨ã•ã‚Œã¦ã„ã¾ã™';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'ãƒ¡ãƒ¼ãƒ«/ãƒ‘ã‚¹ãƒ¯ãƒ¼ãƒ‰èªè¨¼ãŒæœ‰åŠ¹ã«ãªã£ã¦ã„ã¾ã›ã‚“';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'ãƒãƒƒãƒˆãƒ¯ãƒ¼ã‚¯ã‚¨ãƒ©ãƒ¼ãŒç™ºç”Ÿã—ã¾ã—ãŸ';
                    break;
            }
            
            showAuthError(errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'æ–°è¦ç™»éŒ²';
        }
    });
    
    // ãƒ­ã‚°ã‚¢ã‚¦ãƒˆå‡¦ç†
    logoutBtn.addEventListener('click', async () => {
        if (confirm('ãƒ­ã‚°ã‚¢ã‚¦ãƒˆã—ã¾ã™ã‹ï¼Ÿ')) {
            try {
                await auth.signOut();
                // ãƒ­ã‚°ã‚¢ã‚¦ãƒˆæˆåŠŸï¼ˆonAuthStateChangedã§å‡¦ç†ã•ã‚Œã‚‹ï¼‰
            } catch (error) {
                console.error('ãƒ­ã‚°ã‚¢ã‚¦ãƒˆã‚¨ãƒ©ãƒ¼:', error);
                alert('ãƒ­ã‚°ã‚¢ã‚¦ãƒˆã«å¤±æ•—ã—ã¾ã—ãŸ');
            }
        }
    });
});

// æ—¢å­˜ã®ã‚³ãƒ¼ãƒ‰ã¨ã®çµ±åˆç”¨ï¼šinitAppé–¢æ•°ã‚’ä½œæˆï¼ˆå¿…è¦ã«å¿œã˜ã¦æ—¢å­˜ã®åˆæœŸåŒ–ã‚³ãƒ¼ãƒ‰ã‚’ç§»å‹•ï¼‰
// function initApp() {
//     // æ—¢å­˜ã®åˆæœŸåŒ–å‡¦ç†ã‚’ã“ã“ã«ç§»å‹•
// }



// è¨­å®š
let CONFIG = { ADMIN_PIN: '1234' };

// Firebaseã‹ã‚‰æš—è¨¼ç•ªå·ã‚’èª­ã¿è¾¼ã¿
database.ref('settings/adminPin').once('value', snap => {
    if (snap.val()) CONFIG.ADMIN_PIN = snap.val();
});

// çŠ¶æ…‹ç®¡ç†
const state = {
    currentWeekStart: getWeekStart(new Date()),
    shifts: [],
    fixedShifts: [],
    shiftOverrides: [], // å›ºå®šã‚·ãƒ•ãƒˆã®å˜æ—¥ä¸Šæ›¸ã
    changeRequests: [],
    leaveRequests: [],
    holidayRequests: [],
    employees: [],
    messages: [],
    swapRequests: [],
    dailyEvents: [],
    nonDailyAdvice: [], // éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹
    trendReports: [], // ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆ
    newProductReports: [], // é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰
    weatherData: {}, // æ—¥ä»˜åˆ¥ã®å¤©æ°—ãƒ‡ãƒ¼ã‚¿
    selectedColor: '#6366f1',
    isAdmin: false,
    activeAdminTab: 'shiftChanges',
    editingShiftId: null,
    isConnected: false,
    zoomLevel: 100,
    currentPopoverShift: null,
    eventTypeFilter: 'all', // åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ã®ã‚¿ã‚¤ãƒ—ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼
    nonDailyFilter: 'all', // éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã®ã‚«ãƒ†ã‚´ãƒªãƒ•ã‚£ãƒ«ã‚¿ãƒ¼
    dailyChecklist: {}, // ã‚«ãƒ†ã‚´ãƒªåˆ¥æ—¥æ¬¡ãƒã‚§ãƒƒã‚¯ãƒªã‚¹ãƒˆ
    categoryMemos: [], // ã‚«ãƒ†ã‚´ãƒªåˆ¥ãƒ¡ãƒ¢
    selectedAdvisorCategory: null, // é¸æŠžä¸­ã®ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼ã‚«ãƒ†ã‚´ãƒª
    productCategories: [], // å•†å“åˆ†é¡žãƒ‡ãƒ¼ã‚¿ï¼ˆPMA/æƒ…å ±åˆ†é¡ž/å°åˆ†é¡žï¼‰
    selectedPmaId: null, // é¸æŠžä¸­ã®PMA ID
    usageStats: [], // 利用統計データ
    specialEvents: [] // 臨時シフト用イベント日
};

// åˆ©ç”¨çµ±è¨ˆã®æ©Ÿèƒ½ã‚«ãƒ†ã‚´ãƒªå®šç¾©
const USAGE_FEATURES = {
    // ã‚¢ãƒ—ãƒªé–²è¦§
    'app_view': { name: 'ã‚¢ãƒ—ãƒªé–²è¦§', category: 'ã‚¢ã‚¯ã‚»ã‚¹', icon: 'ðŸ‘ï¸' },
    // ã‚·ãƒ•ãƒˆé–¢é€£
    'view_shift': { name: 'ã‚·ãƒ•ãƒˆè¡¨é–²è¦§', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'ðŸ“…' },
    'add_shift': { name: 'ã‚·ãƒ•ãƒˆè¿½åŠ ', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'âž•' },
    'edit_shift': { name: 'ã‚·ãƒ•ãƒˆç·¨é›†', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'âœï¸' },
    'delete_shift': { name: 'ã‚·ãƒ•ãƒˆå‰Šé™¤', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'ðŸ—‘ï¸' },
    'request_change': { name: 'ã‚·ãƒ•ãƒˆå¤‰æ›´ç”³è«‹', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'ðŸ”„' },
    'request_swap': { name: 'ã‚·ãƒ•ãƒˆäº¤ä»£ä¾é ¼', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'ðŸ¤' },
    'request_leave': { name: 'æœ‰çµ¦ç”³è«‹', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'ðŸ–ï¸' },
    'request_holiday': { name: 'ä¼‘æ—¥ç”³è«‹', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'ðŸ ' },
    'create_halfday': { name: 'åŠä¼‘ä½œæˆ', category: 'ã‚·ãƒ•ãƒˆç®¡ç†', icon: 'ðŸŒ…' },
    'add_special_event': { name: '臨時シフトイベント追加', category: 'シフト管理', icon: '⚡' },
    // ç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç®¡ç†
    'view_order_advice': { name: 'ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹é–²è¦§', category: 'ç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç®¡ç†', icon: 'ðŸ“¦' },
    'submit_order_feedback': { name: 'ç™ºæ³¨ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯é€ä¿¡', category: 'ç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç®¡ç†', icon: 'ðŸ“' },
    'view_daily_checklist': { name: 'æ—¥æ¬¡ãƒã‚§ãƒƒã‚¯ãƒªã‚¹ãƒˆç¢ºèª', category: 'ç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç®¡ç†', icon: 'âœ…' },
    'update_daily_checklist': { name: 'æ—¥æ¬¡ãƒã‚§ãƒƒã‚¯ãƒªã‚¹ãƒˆæ›´æ–°', category: 'ç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç®¡ç†', icon: 'â˜‘ï¸' },
    // éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨å‚è€ƒæƒ…å ±
    'view_non_daily': { name: 'éžãƒ‡ã‚¤ãƒªãƒ¼å‚è€ƒæƒ…å ±é–²è¦§', category: 'éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨å‚è€ƒæƒ…å ±', icon: 'ðŸ“ˆ' },
    'add_non_daily': { name: 'éžãƒ‡ã‚¤ãƒªãƒ¼å‚è€ƒæƒ…å ±è¿½åŠ ', category: 'éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨å‚è€ƒæƒ…å ±', icon: 'âž•' },
    'edit_non_daily': { name: 'éžãƒ‡ã‚¤ãƒªãƒ¼å‚è€ƒæƒ…å ±ç·¨é›†', category: 'éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨å‚è€ƒæƒ…å ±', icon: 'âœï¸' },
    'delete_non_daily': { name: 'éžãƒ‡ã‚¤ãƒªãƒ¼å‚è€ƒæƒ…å ±å‰Šé™¤', category: 'éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨å‚è€ƒæƒ…å ±', icon: 'ðŸ—‘ï¸' },
    // åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«
    'view_daily_events': { name: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«é–²è¦§', category: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«', icon: 'ðŸ“…' },
    'add_daily_event': { name: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«è¿½åŠ ', category: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«', icon: 'âž•' },
    'edit_daily_event': { name: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç·¨é›†', category: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«', icon: 'âœï¸' },
    'delete_daily_event': { name: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«å‰Šé™¤', category: 'åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«', icon: 'ðŸ—‘ï¸' },
    // ãƒ¬ãƒãƒ¼ãƒˆ
    'view_trend_report': { name: 'ãƒˆãƒ¬ãƒ³ãƒ‰ãƒ¬ãƒãƒ¼ãƒˆé–²è¦§', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'ðŸ“Š' },
    'add_trend_report': { name: 'ãƒˆãƒ¬ãƒ³ãƒ‰ãƒ¬ãƒãƒ¼ãƒˆè¿½åŠ ', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'âž•' },
    'edit_trend_report': { name: 'ãƒˆãƒ¬ãƒ³ãƒ‰ãƒ¬ãƒãƒ¼ãƒˆç·¨é›†', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'âœï¸' },
    'delete_trend_report': { name: 'ãƒˆãƒ¬ãƒ³ãƒ‰ãƒ¬ãƒãƒ¼ãƒˆå‰Šé™¤', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'ðŸ—‘ï¸' },
    'view_new_product': { name: 'é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰é–²è¦§', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'ðŸ†•' },
    'add_new_product': { name: 'é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰è¿½åŠ ', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'âž•' },
    'edit_new_product': { name: 'é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ç·¨é›†', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'âœï¸' },
    'delete_new_product': { name: 'é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰å‰Šé™¤', category: 'ãƒ¬ãƒãƒ¼ãƒˆ', icon: 'ðŸ—‘ï¸' },
    // ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸
    'view_messages': { name: 'ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ç¢ºèª', category: 'ã‚³ãƒŸãƒ¥ãƒ‹ã‚±ãƒ¼ã‚·ãƒ§ãƒ³', icon: 'ðŸ“©' },
    'send_broadcast': { name: 'å…¨å“¡ã¸é€šçŸ¥é€ä¿¡', category: 'ã‚³ãƒŸãƒ¥ãƒ‹ã‚±ãƒ¼ã‚·ãƒ§ãƒ³', icon: 'ðŸ“¢' },
    // ç®¡ç†è€…æ©Ÿèƒ½
    'admin_approve': { name: 'ç”³è«‹æ‰¿èª', category: 'ç®¡ç†è€…', icon: 'âœ…' },
    'admin_reject': { name: 'ç”³è«‹å´ä¸‹', category: 'ç®¡ç†è€…', icon: 'âŒ' },
    'manage_employees': { name: 'å¾“æ¥­å“¡ç®¡ç†', category: 'ç®¡ç†è€…', icon: 'ðŸ‘¥' },
    'view_feedback_stats': { name: 'ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯é›†è¨ˆé–²è¦§', category: 'ç®¡ç†è€…', icon: 'ðŸ“Š' },
    'manage_product_categories': { name: 'å•†å“åˆ†é¡žç®¡ç†', category: 'ç®¡ç†è€…', icon: 'ðŸ“‚' },
    // ãã®ä»–
    'export_pdf': { name: 'PDFå‡ºåŠ›', category: 'ãã®ä»–', icon: 'ðŸ“„' },
    'print_shift': { name: 'ã‚·ãƒ•ãƒˆè¡¨å°åˆ·', category: 'ãã®ä»–', icon: 'ðŸ–¨ï¸' }
};

// åˆ©ç”¨çµ±è¨ˆã‚’è¨˜éŒ²ã™ã‚‹é–¢æ•°
function trackUsage(featureId, userName = null) {
    const feature = USAGE_FEATURES[featureId];
    if (!feature) return;
    
    const stat = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
        featureId: featureId,
        featureName: feature.name,
        category: feature.category,
        userName: userName || 'åŒ¿å',
        timestamp: new Date().toISOString(),
        date: formatDate(new Date())
    };
    
    // Firebaseã«ä¿å­˜
    database.ref('usageStats/' + stat.id).set(stat);
}

// åº—èˆ—ã®ä½ç½®æƒ…å ±ï¼ˆåƒè‘‰çœŒåƒè‘‰å¸‚ï¼‰
const STORE_LOCATION = {
    latitude: 35.6074,
    longitude: 140.1065,
    name: 'åƒè‘‰å¸‚'
};

// æŽ¥ç¶šçŠ¶æ…‹ã®ç›£è¦–
database.ref('.info/connected').on('value', (snap) => {
    const statusEl = document.getElementById('connectionStatus');
    const textEl = statusEl?.querySelector('.status-text');
    if (snap.val() === true) {
        state.isConnected = true;
        statusEl?.classList.remove('disconnected');
        statusEl?.classList.add('connected');
        if (textEl) textEl.textContent = 'æŽ¥ç¶šä¸­';
    } else {
        state.isConnected = false;
        statusEl?.classList.remove('connected');
        statusEl?.classList.add('disconnected');
        if (textEl) textEl.textContent = 'ã‚ªãƒ•ãƒ©ã‚¤ãƒ³';
    }
});

// ãƒ¦ãƒ¼ãƒ†ã‚£ãƒªãƒ†ã‚£é–¢æ•°
// é€±ã®é–‹å§‹æ—¥ã‚’å–å¾—ï¼ˆæœˆæ›œæ—¥å§‹ã¾ã‚Šï¼‰
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    // æœˆæ›œæ—¥ã‚’0ã¨ã—ã¦è¨ˆç®—ï¼ˆæ—¥æ›œæ—¥ã¯6ã«ãªã‚‹ï¼‰
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    return d;
}
// æ—¥ä»˜ã‚’ãƒ­ãƒ¼ã‚«ãƒ«ã‚¿ã‚¤ãƒ ã‚¾ãƒ¼ãƒ³ã§ãƒ•ã‚©ãƒ¼ãƒžãƒƒãƒˆï¼ˆYYYY-MM-DDå½¢å¼ï¼‰
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function formatDateTime(str) {
    const d = new Date(str);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function getDayName(i) { return ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'][i]; }
function getMonthDay(date) {
    const d = new Date(date);
    return { month: d.getMonth() + 1, day: d.getDate(), dayOfWeek: d.getDay() };
}
function getDayOfWeek(str) { return new Date(str).getDay(); }

// æ™‚åˆ»ã‚’ãƒ•ã‚©ãƒ¼ãƒžãƒƒãƒˆã™ã‚‹ãƒ˜ãƒ«ãƒ‘ãƒ¼é–¢æ•°ï¼ˆ30åˆ†å˜ä½å¯¾å¿œï¼‰
function formatTime(val) {
    const hours = Math.floor(val);
    const mins = Math.round((val - hours) * 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

// æ—¥ä»˜é¸æŠžæ™‚ã«æ›œæ—¥ã‚’è¡¨ç¤º
function updateShiftDateDay() {
    const dateInput = document.getElementById('shiftDate');
    const dayDisplay = document.getElementById('shiftDateDay');
    if (dateInput.value) {
        const dow = getDayOfWeek(dateInput.value);
        const dayNames = ['æ—¥æ›œæ—¥', 'æœˆæ›œæ—¥', 'ç«æ›œæ—¥', 'æ°´æ›œæ—¥', 'æœ¨æ›œæ—¥', 'é‡‘æ›œæ—¥', 'åœŸæ›œæ—¥'];
        dayDisplay.textContent = dayNames[dow];
        dayDisplay.style.color = dow === 0 ? '#ef4444' : dow === 6 ? '#3b82f6' : 'inherit';
    } else {
        dayDisplay.textContent = '';
    }
}

// Firebase ã‹ã‚‰ãƒ‡ãƒ¼ã‚¿ã‚’èª­ã¿è¾¼ã¿
function loadData() {
    const refs = ['shifts', 'fixedShifts', 'shiftOverrides', 'changeRequests', 'leaveRequests', 'holidayRequests', 'employees', 'messages', 'swapRequests', 'dailyEvents', 'nonDailyAdvice', 'trendReports', 'categoryMemos', 'productCategories', 'newProductReports', 'specialEvents'];
    refs.forEach(key => {
        database.ref(key).on('value', snap => {
            const data = snap.val();
            state[key] = data ? Object.values(data) : [];
            if (key === 'employees') updateEmployeeSelects();
            if (key === 'nonDailyAdvice') renderNonDailyAdvisor();
            if (key === 'newProductReports') renderNewProductReport();
            if (key === 'trendReports') renderTrendReports();
            render();
            if (state.isAdmin) renderAdminPanel();
            updateMessageBar();
        });
    });
    // dailyChecklistã¯ã‚ªãƒ–ã‚¸ã‚§ã‚¯ãƒˆå½¢å¼ã§ç®¡ç†
    database.ref('dailyChecklist').on('value', snap => {
        state.dailyChecklist = snap.val() || {};
    });
    // åˆ©ç”¨çµ±è¨ˆï¼ˆç®¡ç†è€…ç”¨ï¼‰
    database.ref('usageStats').on('value', snap => {
        const data = snap.val();
        state.usageStats = data ? Object.values(data) : [];
        if (state.isAdmin && state.activeAdminTab === 'usageStats') {
            renderAdminPanel();
        }
    });
}

// Firebase ã«ãƒ‡ãƒ¼ã‚¿ã‚’ä¿å­˜
function saveToFirebase(key, data) {
    const ref = database.ref(key);
    ref.set(data.reduce((acc, item) => { acc[item.id] = item; return acc; }, {}));
}

// å¾“æ¥­å“¡ã‚»ãƒ¬ã‚¯ãƒˆæ›´æ–°
function updateEmployeeSelects() {
    ['shiftName', 'leaveName', 'holidayName', 'holidaySwapPartner', 'swapTargetEmployee', 'changeApplicant', 'swapApplicant'].forEach(id => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = '<option value="">é¸æŠžã—ã¦ãã ã•ã„</option>';
        state.employees.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.name;
            opt.textContent = e.name;
            sel.appendChild(opt);
        });
    });
}

// æ‹…å½“è€…è‰²ãƒžãƒƒãƒ—
function getNameColors() {
    const map = {};
    [...state.shifts, ...state.fixedShifts].forEach(s => { if (!map[s.name]) map[s.name] = s.color; });
    return map;
}

// æ™‚é–“ãƒ˜ãƒƒãƒ€ãƒ¼
function renderTimeHeader() {
    const h = document.getElementById('timeHeader');
    h.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const c = document.createElement('div');
        c.className = 'time-cell';
        c.textContent = `${i}æ™‚`;
        h.appendChild(c);
    }
}

// ã‚·ãƒ•ãƒˆãƒ¬ãƒ™ãƒ«è¨ˆç®—ï¼ˆé‡ãªã‚‹ã‚·ãƒ•ãƒˆã‚’ç¸¦ã«ä¸¦ã¹ã‚‹ï¼‰
function calculateShiftLevels(shifts) {
    const levels = {};

    // å„ã‚·ãƒ•ãƒˆã®è¡¨ç¤ºç”¨çµ‚äº†æ™‚é–“ã‚’è¨ˆç®—ï¼ˆå¤œå‹¤ã¯é–‹å§‹æ—¥ã¯24æ™‚ã¾ã§è¡¨ç¤ºï¼‰
    const getDisplayEndHour = (s) => {
        if (s.overnight && !s.isOvernightContinuation) {
            return 24; // å¤œå‹¤ã‚·ãƒ•ãƒˆã®é–‹å§‹æ—¥ã¯24æ™‚ï¼ˆ0æ™‚ï¼‰ã¾ã§
        }
        return s.endHour;
    };

    // é–‹å§‹æ™‚é–“ã§ã‚½ãƒ¼ãƒˆã€åŒã˜å ´åˆã¯IDã§ã‚½ãƒ¼ãƒˆï¼ˆå®‰å®šã—ãŸã‚½ãƒ¼ãƒˆã®ãŸã‚ï¼‰
    const sorted = [...shifts].sort((a, b) => {
        if (a.startHour !== b.startHour) return a.startHour - b.startHour;
        return String(a.id).localeCompare(String(b.id));
    });

    // ãƒ‡ãƒãƒƒã‚°ç”¨ãƒ­ã‚°
    console.log('Calculating levels for shifts:', sorted.map(s => ({
        id: s.id,
        name: s.name,
        start: s.startHour,
        end: s.endHour,
        displayEnd: getDisplayEndHour(s),
        overnight: s.overnight
    })));

    sorted.forEach(s => {
        let lvl = 0;
        const sStart = s.startHour;
        const sEnd = getDisplayEndHour(s);

        for (const o of sorted) {
            if (o.id === s.id || levels[o.id] === undefined) continue;
            const oStart = o.startHour;
            const oEnd = getDisplayEndHour(o);

            // æ™‚é–“å¸¯ãŒé‡ãªã‚‹ã‹ãƒã‚§ãƒƒã‚¯ï¼ˆé–‹å§‹=çµ‚äº†ã®å ´åˆã‚‚é‡ãªã‚Šã¨ã¿ãªã™ï¼‰
            const overlaps = !(sEnd < oStart || sStart > oEnd);
            if (overlaps && levels[o.id] >= lvl) {
                lvl = levels[o.id] + 1;
            }
        }
        levels[s.id] = lvl;
    });

    console.log('Calculated levels:', levels);
    return levels;
}

// ã‚¬ãƒ³ãƒˆãƒãƒ£ãƒ¼ãƒˆ
function renderGanttBody() {
    const body = document.getElementById('ganttBody');
    body.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        const date = new Date(state.currentWeekStart);
        date.setDate(date.getDate() + i);
        const dateStr = formatDate(date);
        const { day, dayOfWeek } = getMonthDay(date);

        const row = document.createElement('div');
        row.className = 'gantt-row';

        // ç¥æ—¥åˆ¤å®šã‚’å…ˆã«è¡Œã†
        const holidayName = getJapaneseHoliday(date);

        let dayClass = 'date-day';
        if (dayOfWeek === 0 || holidayName) dayClass += ' sunday'; // ç¥æ—¥ã‚‚èµ¤è‰²ã«
        else if (dayOfWeek === 6) dayClass += ' saturday';

        const label = document.createElement('div');
        label.className = 'gantt-date-label';
        if (holidayName) label.classList.add('is-holiday');

        // åŸºæœ¬ã®æ—¥ä»˜è¡¨ç¤º
        let labelHTML = `<span class="date-number${holidayName ? ' holiday' : ''}">${day}</span><span class="${dayClass}">${getDayName(dayOfWeek)}</span>`;

        // å¤©æ°—äºˆå ±ã‚’è¿½åŠ 
        const weather = state.weatherData[dateStr];
        if (weather) {
            const weatherInfo = getWeatherInfo(weather.weatherCode);

            // æ˜¨å¹´æ¯”è¼ƒç”¨ã®å·®åˆ†è¨ˆç®—
            let lastYearHtml = '';
            if (weather.lastYearTempMax !== null && weather.lastYearTempMin !== null) {
                const diffMax = weather.tempMax - weather.lastYearTempMax;
                const diffSign = diffMax >= 0 ? '+' : '';
                const diffClass = diffMax >= 0 ? 'temp-diff-plus' : 'temp-diff-minus';
                lastYearHtml = `<div class="weather-last-year">æ˜¨å¹´ <span class="temp-max">${weather.lastYearTempMax}Â°</span>/<span class="temp-min">${weather.lastYearTempMin}Â°</span> <span class="${diffClass}">(${diffSign}${diffMax}Â°)</span></div>`;
            }

            labelHTML += `<div class="weather-info" title="${weatherInfo.desc}">
                <span class="weather-icon">${weatherInfo.icon}</span>
                <span class="weather-temp"><span class="temp-max">${weather.tempMax}Â°</span>/<span class="temp-min">${weather.tempMin}Â°</span></span>
            </div>${lastYearHtml}`;
        }

        // ç¥æ—¥è¡¨ç¤ºã‚’è¿½åŠ ï¼ˆholidayNameã¯ä¸Šã§æ—¢ã«å–å¾—æ¸ˆã¿ï¼‰
        if (holidayName) {
            labelHTML += `<div class="holiday-mark" title="${holidayName}">ðŸŽŒ ${holidayName}</div>`;
        }

        // çµ¦æ–™æ—¥ãƒ»å¹´é‡‘æ”¯çµ¦æ—¥ãƒžãƒ¼ã‚¯ã‚’è¿½åŠ 
        const payDayInfo = getPayDayInfo(date);
        if (payDayInfo.length > 0) {
            labelHTML += `<div class="payday-marks">${payDayInfo.map(p => 
                `<span class="payday-mark ${p.type}" title="${p.label}">${p.icon} ${p.shortLabel}</span>`
            ).join('')}</div>`;
        }

        // 臨時シフト（特別イベント日）表示
        const specialEventForDay = getSpecialEvent(dateStr);
        if (specialEventForDay) {
            labelHTML += `<div class="special-event-mark" title="${specialEventForDay.eventName || 'イベント'}">⚡ ${specialEventForDay.eventName || '臨時シフト'}</div>`;
            label.classList.add('is-special-event');
        }

        // ã“ã®æ—¥ã®ã‚¤ãƒ™ãƒ³ãƒˆã‚’å–å¾—ï¼ˆæœŸé–“å†…ã«ã‚ã‚‹æ—¥ä»˜ã‚’å«ã‚€ã‚¤ãƒ™ãƒ³ãƒˆï¼‰
        const dayEvents = state.dailyEvents.filter(e => {
            const startDate = e.startDate || e.date; // å¾Œæ–¹äº’æ›æ€§
            const endDate = e.endDate || e.date;
            return dateStr >= startDate && dateStr <= endDate;
        });
        if (dayEvents.length > 0) {
            const eventIcons = getEventTypeIcons();
            let iconsHTML = '<div class="event-icons">';
            dayEvents.forEach(e => {
                const icon = eventIcons[e.type] || eventIcons.other;
                iconsHTML += `<span class="event-icon ${e.type}" data-date="${dateStr}" title="${e.title}">${icon}</span>`;
            });
            iconsHTML += '</div>';
            labelHTML += iconsHTML;
        }

        label.innerHTML = labelHTML;

        // ã‚¤ãƒ™ãƒ³ãƒˆã‚¢ã‚¤ã‚³ãƒ³ã«ã‚¯ãƒªãƒƒã‚¯ã‚¤ãƒ™ãƒ³ãƒˆã‚’è¿½åŠ 
        label.querySelectorAll('.event-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                showEventPopover(dateStr, e);
            });
            icon.addEventListener('touchend', (e) => {
                e.stopPropagation();
                e.preventDefault();
                showEventPopover(dateStr, e);
            }, { passive: false });
        });

        row.appendChild(label);

        const timeline = document.createElement('div');
        timeline.className = 'gantt-timeline';
        for (let h = 0; h < 24; h++) {
            const cell = document.createElement('div');
            cell.className = 'hour-cell';
            timeline.appendChild(cell);
        }

        // ã‚·ãƒ•ãƒˆåŽé›†
        const dayShifts = state.shifts.filter(s => s.date === dateStr);
        const prevDate = new Date(date); prevDate.setDate(prevDate.getDate() - 1);
        const prevStr = formatDate(prevDate);
        const overnight = state.shifts.filter(s => s.date === prevStr && s.overnight).map(s => ({
            ...s, id: `on-${s.id}`, date: dateStr, startHour: 0, endHour: s.endHour, isOvernightContinuation: true
        }));

        // æœ‰çµ¦ã«ã‚ˆã‚‹ä¸Šæ›¸ãã‚·ãƒ•ãƒˆã®IDã‚’å–å¾—
        const leaveOverrideFixedIds = state.shifts
            .filter(s => s.date === dateStr && s.isLeaveOverride && s.fixedShiftOverride)
            .map(s => s.fixedShiftOverride);

        // ã“ã®æ—¥ã®å˜æ—¥ä¸Šæ›¸ããƒ‡ãƒ¼ã‚¿ã‚’å–å¾—
        const dayOverrides = state.shiftOverrides.filter(o => o.date === dateStr);

        // 臨時シフト：イベント日は固定シフトを停止
        const specialEvent = getSpecialEvent(dateStr);
        const isSpecialDay = specialEvent && specialEvent.suppressFixed !== false;
        // å›ºå®šã‚·ãƒ•ãƒˆï¼ˆãŸã ã—ã€åŒã˜æ—¥ãƒ»åŒã˜æ™‚é–“å¸¯ã«é€šå¸¸ã‚·ãƒ•ãƒˆãŒã‚ã‚‹å ´åˆã¯é™¤å¤–ã€æœ‰çµ¦ä¸Šæ›¸ãã‚‚é™¤å¤–ï¼‰
        const fixed = state.fixedShifts.filter(f => {
            // æ›œæ—¥ãƒã‚§ãƒƒã‚¯
            // イベント日は固定シフトを停止
            if (isSpecialDay) return false;
            if (f.dayOfWeek !== dayOfWeek) return false;
            // æœ‰åŠ¹æœŸé–“ãƒã‚§ãƒƒã‚¯
            if (f.startDate && dateStr < f.startDate) return false;
            if (f.endDate && dateStr > f.endDate) return false;
            return true;
        }).map(f => {
            // å˜æ—¥ä¸Šæ›¸ããŒã‚ã‚‹ã‹ç¢ºèª
            const override = dayOverrides.find(o => o.fixedShiftId === f.id);
            if (override) {
                // ä¸Šæ›¸ããƒ‡ãƒ¼ã‚¿ã‚’é©ç”¨
                return {
                    ...f,
                    ...override,
                    id: `fx-${f.id}-${dateStr}`,
                    date: dateStr,
                    isFixed: true,
                    hasOverride: true,
                    overrideId: override.id
                };
            }
            return {
                ...f, id: `fx-${f.id}-${dateStr}`, date: dateStr, isFixed: true
            };
        }).filter(f => {
            // æœ‰çµ¦ã«ã‚ˆã‚‹ä¸Šæ›¸ããŒã‚ã‚‹å ´åˆã¯é™¤å¤–
            if (leaveOverrideFixedIds.includes(f.id.replace(`fx-`, '').replace(`-${dateStr}`, ''))) {
                return false;
            }
            // å…ƒã®IDã‚’å–å¾—ï¼ˆfx-xxx-dateStrå½¢å¼ã‹ã‚‰ï¼‰
            const originalId = f.id.split('-')[1];
            if (leaveOverrideFixedIds.includes(originalId)) {
                return false;
            }
            // åŒã˜æ—¥ãƒ»åŒã˜å›ºå®šã‚·ãƒ•ãƒˆã‹ã‚‰äº¤ä»£ã•ã‚ŒãŸé€šå¸¸ã‚·ãƒ•ãƒˆãŒã‚ã‚‹ã‹ç¢ºèª
            return !dayShifts.some(s =>
                s.swapHistory &&
                s.startHour === f.startHour &&
                s.endHour === f.endHour &&
                s.swapHistory.previousName === f.name
            );
        });

        const prevDow = (dayOfWeek + 6) % 7;
        // æœ‰çµ¦ã«ã‚ˆã‚‹ä¸Šæ›¸ãã‚’å¤œå‹¤ç¶™ç¶šåˆ†ã«ã‚‚é©ç”¨
        const leaveOverrideFixedIdsForOvernight = state.shifts
            .filter(s => s.date === prevStr && s.isLeaveOverride && s.fixedShiftOverride)
            .map(s => s.fixedShiftOverride);

        // å‰æ—¥ã®å˜æ—¥ä¸Šæ›¸ããƒ‡ãƒ¼ã‚¿ã‚’å–å¾—
        const prevDayOverrides = state.shiftOverrides.filter(o => o.date === prevStr);
            
        const fixedOvernight = state.fixedShifts.filter(f => {
            // æ›œæ—¥ãƒ»å¤œå‹¤ãƒã‚§ãƒƒã‚¯
            // 前日がイベント日の場合は固定夜勤継続も停止
            const prevSpecialEvent = getSpecialEvent(prevStr);
            if (prevSpecialEvent && prevSpecialEvent.suppressFixed !== false) return false;
            if (f.dayOfWeek !== prevDow || !f.overnight) return false;
            // æœ‰åŠ¹æœŸé–“ãƒã‚§ãƒƒã‚¯ï¼ˆå‰æ—¥ã®æ—¥ä»˜ã§ãƒã‚§ãƒƒã‚¯ï¼‰
            if (f.startDate && prevStr < f.startDate) return false;
            if (f.endDate && prevStr > f.endDate) return false;
            return true;
        }).map(f => {
            // å˜æ—¥ä¸Šæ›¸ããŒã‚ã‚‹ã‹ç¢ºèª
            const override = prevDayOverrides.find(o => o.fixedShiftId === f.id);
            if (override && override.overnight) {
                return {
                    ...f,
                    ...override,
                    id: `fxo-${f.id}-${dateStr}`,
                    date: dateStr,
                    startHour: 0,
                    endHour: override.endHour,
                    isFixed: true,
                    isOvernightContinuation: true,
                    hasOverride: true,
                    overrideId: override.id
                };
            }
            return {
                ...f, id: `fxo-${f.id}-${dateStr}`, date: dateStr, startHour: 0, endHour: f.endHour, isFixed: true, isOvernightContinuation: true
            };
        }).filter(f => {
            const originalId = f.id.split('-')[1];
            return !leaveOverrideFixedIdsForOvernight.includes(originalId);
        });

        // é€šå¸¸ã‚·ãƒ•ãƒˆã‹ã‚‰hiddenãƒ•ãƒ©ã‚°ã®ã‚‚ã®ã‚’é™¤å¤–
        const visibleDayShifts = dayShifts.filter(s => !s.hidden && !s.isLeaveOverride);
        const visibleOvernight = overnight.filter(s => !s.hidden && !s.isLeaveOverride);

        const all = [...visibleDayShifts, ...visibleOvernight, ...fixed, ...fixedOvernight];

        // æ‰¿èªæ¸ˆã¿ã®ä¼‘æ—¥ï¼ˆå…¨æ—¥ä¼‘ã¿ï¼‰ãŒã‚ã‚‹æ‹…å½“è€…ã®ã‚·ãƒ•ãƒˆã‚’é™¤å¤–
        const approvedHolidays = state.holidayRequests.filter(h => {
            if (h.status !== 'approved') return false;
            if (!(dateStr >= h.startDate && dateStr <= h.endDate)) return false;
            if (h.halfDayType) return false; // åŠä¼‘ã¯é™¤å¤–å¯¾è±¡å¤–
            
            // shiftTimesãŒã‚ã‚‹å ´åˆã¯ã€è©²å½“æ—¥ã®ãƒ‡ãƒ¼ã‚¿ãŒå­˜åœ¨ã™ã‚‹ã‹ãƒã‚§ãƒƒã‚¯ï¼ˆæœ€å„ªå…ˆï¼‰
            if (h.shiftTimes && Object.keys(h.shiftTimes).length > 0) {
                return !!h.shiftTimes[dateStr];
            }
            // selectedShiftsãŒã‚ã‚‹å ´åˆã¯ã€è©²å½“æ—¥ã®ã‚·ãƒ•ãƒˆãŒå­˜åœ¨ã™ã‚‹ã‹ãƒã‚§ãƒƒã‚¯
            if (h.selectedShifts && h.selectedShifts.length > 0) {
                return h.selectedShifts.some(s => s.date === dateStr);
            }
            // ã©ã¡ã‚‰ã‚‚ãªã„å ´åˆã¯å¾“æ¥ã®æœŸé–“ãƒ™ãƒ¼ã‚¹ã®é™¤å¤–
            return true;
        });
        const holidayNames = approvedHolidays.map(h => h.name);

        // æ‰¿èªæ¸ˆã¿ã®æœ‰çµ¦ãŒã‚ã‚‹æ‹…å½“è€…ã®ã‚·ãƒ•ãƒˆã‚‚é™¤å¤–
        const approvedLeaves = state.leaveRequests.filter(l =>
            l.status === 'approved' &&
            dateStr >= l.startDate &&
            dateStr <= l.endDate
        );
        const leaveNames = approvedLeaves.map(l => l.name);

        // å…¨æ—¥ä¼‘ã¿ãƒ»æœ‰çµ¦ã®æ‹…å½“è€…ã®ã‚·ãƒ•ãƒˆã‚’é™¤å¤–ã—ãŸãƒªã‚¹ãƒˆ
        const filteredAll = all.filter(s => !holidayNames.includes(s.name) && !leaveNames.includes(s.name));

        const levels = calculateShiftLevels(filteredAll);
        const maxLvl = Math.max(0, ...Object.values(levels));
        const baseH = 80, perLvl = 28;
        timeline.style.minHeight = `${baseH + maxLvl * perLvl}px`;

        filteredAll.forEach(s => timeline.appendChild(createShiftBar(s, levels[s.id])));

        // æœ‰çµ¦
        const leaves = state.leaveRequests.filter(l => l.status === 'approved' && dateStr >= l.startDate && dateStr <= l.endDate);
        let barCount = leaves.length;
        leaves.forEach((l, idx) => {
            const bar = document.createElement('div');
            bar.className = 'leave-bar';
            bar.style.top = `${baseH + (maxLvl + 1 + idx) * perLvl}px`;
            bar.style.height = `${perLvl - 4}px`;
            
            // ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ãŒã‚ã‚‹å ´åˆã¯ã€ãã®æ™‚é–“ã«åˆã‚ã›ã¦è¡¨ç¤º
            let timeText = '';
            if (l.shiftTimes && l.shiftTimes[dateStr]) {
                const shiftTime = l.shiftTimes[dateStr];
                let start = shiftTime.startHour;
                let end = shiftTime.endHour;
                const overnight = shiftTime.overnight;
                
                // å¤œå‹¤ã®å ´åˆã¯24æ™‚ã¾ã§è¡¨ç¤ºï¼ˆç¿Œæ—¥åˆ†ã¯ç¿Œæ—¥ã«è¡¨ç¤ºï¼‰
                if (overnight) end = 24;
                
                const leftPercent = (start / 24) * 100;
                const widthPercent = ((end - start) / 24) * 100;
                bar.style.left = `${leftPercent}%`;
                bar.style.width = `${widthPercent}%`;
                
                if (overnight) {
                    timeText = ` ${formatTime(start)}-ç¿Œ${formatTime(shiftTime.endHour)}`;
                } else {
                    timeText = ` ${formatTime(start)}-${formatTime(end)}`;
                }
            }
            // ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ãŒãªã„å ´åˆã¯å…¨å¹…ã§è¡¨ç¤ºï¼ˆå¾“æ¥ã®å‹•ä½œï¼‰
            
            bar.textContent = `ðŸ–ï¸ ${l.name} æœ‰çµ¦${timeText}`;
            timeline.appendChild(bar);
        });
        
        // å¤œå‹¤ã®æœ‰çµ¦ã®ç¿Œæ—¥åˆ†ã‚’è¡¨ç¤º
        const overnightLeaves = state.leaveRequests.filter(l => {
            if (l.status !== 'approved' || !l.shiftTimes) return false;
            // å‰æ—¥ã®æ—¥ä»˜ã‚’å–å¾—
            const prevDate = new Date(dateStr);
            prevDate.setDate(prevDate.getDate() - 1);
            const prevDateStr = formatDate(prevDate);
            // å‰æ—¥ã®ã‚·ãƒ•ãƒˆãŒå¤œå‹¤ã§ã€å‰æ—¥ãŒæœ‰çµ¦æœŸé–“å†…ã‹ãƒã‚§ãƒƒã‚¯
            return l.shiftTimes[prevDateStr] && 
                   l.shiftTimes[prevDateStr].overnight &&
                   prevDateStr >= l.startDate && 
                   prevDateStr <= l.endDate;
        });
        
        overnightLeaves.forEach((l, idx) => {
            const prevDate = new Date(dateStr);
            prevDate.setDate(prevDate.getDate() - 1);
            const prevDateStr = formatDate(prevDate);
            const shiftTime = l.shiftTimes[prevDateStr];
            
            const bar = document.createElement('div');
            bar.className = 'leave-bar overnight-continuation';
            bar.style.top = `${baseH + (maxLvl + 1 + barCount + idx) * perLvl}px`;
            bar.style.height = `${perLvl - 4}px`;
            
            // 0æ™‚ã‹ã‚‰çµ‚äº†æ™‚åˆ»ã¾ã§è¡¨ç¤º
            const end = shiftTime.endHour;
            const leftPercent = 0;
            const widthPercent = (end / 24) * 100;
            bar.style.left = `${leftPercent}%`;
            bar.style.width = `${widthPercent}%`;
            
            bar.textContent = `ðŸ–ï¸ ${l.name} æœ‰çµ¦ 0:00-${formatTime(end)}`;
            timeline.appendChild(bar);
        });
        barCount += overnightLeaves.length;

        // ä¼‘æ—¥
        const holidays = state.holidayRequests.filter(h => {
            if (h.status !== 'approved') return false;
            if (!(dateStr >= h.startDate && dateStr <= h.endDate)) return false;
            
            // shiftTimesãŒã‚ã‚‹å ´åˆã¯ã€è©²å½“æ—¥ã®ãƒ‡ãƒ¼ã‚¿ãŒå­˜åœ¨ã™ã‚‹ã‹ãƒã‚§ãƒƒã‚¯ï¼ˆæœ€å„ªå…ˆï¼‰
            if (h.shiftTimes && Object.keys(h.shiftTimes).length > 0) {
                const hasTime = !!h.shiftTimes[dateStr];
                console.log(`[ä¼‘æ—¥ãƒ‡ãƒãƒƒã‚°] ${h.name} ${dateStr}: shiftTimeså­˜åœ¨, è©²å½“æ—¥=${hasTime}`, h.shiftTimes);
                return hasTime;
            }
            // selectedShiftsãŒã‚ã‚‹å ´åˆã¯ã€è©²å½“æ—¥ã®ã‚·ãƒ•ãƒˆãŒå­˜åœ¨ã™ã‚‹ã‹ãƒã‚§ãƒƒã‚¯
            if (h.selectedShifts && h.selectedShifts.length > 0) {
                const hasShift = h.selectedShifts.some(s => s.date === dateStr);
                console.log(`[ä¼‘æ—¥ãƒ‡ãƒãƒƒã‚°] ${h.name} ${dateStr}: selectedShiftså­˜åœ¨, è©²å½“æ—¥=${hasShift}`, h.selectedShifts);
                return hasShift;
            }
            // ã©ã¡ã‚‰ã‚‚ãªã„å ´åˆã¯å¾“æ¥ã®æœŸé–“ãƒ™ãƒ¼ã‚¹ã®è¡¨ç¤º
            console.log(`[ä¼‘æ—¥ãƒ‡ãƒãƒƒã‚°] ${h.name} ${dateStr}: shiftTimes/selectedShiftsç„¡ã—ã€æœŸé–“ãƒ™ãƒ¼ã‚¹è¡¨ç¤º`);
            return true;
        });
        
        holidays.forEach((h, idx) => {
            const bar = document.createElement('div');

            // åŠä¼‘ã‚¿ã‚¤ãƒ—ã«å¿œã˜ã¦ã‚¯ãƒ©ã‚¹ã‚’è¨­å®š
            if (h.halfDayType === 'morning') {
                bar.className = 'holiday-bar half-day-bar morning';
            } else if (h.halfDayType === 'afternoon') {
                bar.className = 'holiday-bar half-day-bar afternoon';
            } else {
                bar.className = 'holiday-bar';
            }
            bar.dataset.holidayId = h.id;

            // ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ã‚’å–å¾—ï¼ˆå„ªå…ˆé †ä½: shiftTimes[æ—¥ä»˜] > selectedShifts > ç›´æŽ¥ãƒ—ãƒ­ãƒ‘ãƒ†ã‚£ï¼‰
            let shiftTimeInfo = null;
            
            // 1. shiftTimes ã‹ã‚‰æ—¥ä»˜ã”ã¨ã®æ™‚é–“æƒ…å ±ã‚’å–å¾—
            if (h.shiftTimes && h.shiftTimes[dateStr]) {
                shiftTimeInfo = h.shiftTimes[dateStr];
                console.log(`[ä¼‘æ—¥æ™‚é–“ãƒ‡ãƒãƒƒã‚°] ${h.name} ${dateStr}: shiftTimesã‹ã‚‰å–å¾—`, shiftTimeInfo);
            }
            // 2. selectedShifts ã‹ã‚‰è©²å½“æ—¥ã®æ™‚é–“æƒ…å ±ã‚’å–å¾—
            else if (h.selectedShifts && h.selectedShifts.length > 0) {
                const selectedShift = h.selectedShifts.find(s => s.date === dateStr);
                if (selectedShift) {
                    shiftTimeInfo = {
                        startHour: selectedShift.startHour,
                        endHour: selectedShift.endHour,
                        overnight: selectedShift.overnight || false
                    };
                    console.log(`[ä¼‘æ—¥æ™‚é–“ãƒ‡ãƒãƒƒã‚°] ${h.name} ${dateStr}: selectedShiftsã‹ã‚‰å–å¾—`, shiftTimeInfo);
                }
            }
            // 3. ç›´æŽ¥ãƒ—ãƒ­ãƒ‘ãƒ†ã‚£ã‹ã‚‰å–å¾—ï¼ˆå¾“æ¥ã®å½¢å¼ï¼‰
            else if (h.startHour !== undefined && h.endHour !== undefined) {
                shiftTimeInfo = {
                    startHour: h.startHour,
                    endHour: h.endHour,
                    overnight: h.overnight || false
                };
                console.log(`[ä¼‘æ—¥æ™‚é–“ãƒ‡ãƒãƒƒã‚°] ${h.name} ${dateStr}: ç›´æŽ¥ãƒ—ãƒ­ãƒ‘ãƒ†ã‚£ã‹ã‚‰å–å¾—`, shiftTimeInfo);
            } else {
                console.log(`[ä¼‘æ—¥æ™‚é–“ãƒ‡ãƒãƒƒã‚°] ${h.name} ${dateStr}: æ™‚é–“æƒ…å ±ãªã—`, h);
            }

            // ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ãŒã‚ã‚‹å ´åˆã¯ã€ãã®æ™‚é–“ã«åˆã‚ã›ã¦è¡¨ç¤º
            if (shiftTimeInfo) {
                let start = shiftTimeInfo.startHour;
                let end = shiftTimeInfo.endHour;
                // å¤œå‹¤ã®å ´åˆã¯24æ™‚ã¾ã§è¡¨ç¤º
                if (shiftTimeInfo.overnight) end = 24;

                const leftPercent = (start / 24) * 100;
                const widthPercent = ((end - start) / 24) * 100;
                bar.style.left = `${leftPercent}%`;
                bar.style.width = `${widthPercent}%`;
            }
            // ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ãŒãªã„å ´åˆã¯å…¨å¹…ã§è¡¨ç¤ºï¼ˆå¾“æ¥ã®å‹•ä½œï¼‰

            bar.style.top = `${baseH + (maxLvl + 1 + barCount + idx) * perLvl}px`;
            bar.style.height = `${perLvl - 4}px`;

            // æ™‚é–“è¡¨ç¤ºã‚’è¿½åŠ 
            let timeText = '';
            if (shiftTimeInfo) {
                if (shiftTimeInfo.overnight) {
                    timeText = ` ${formatTime(shiftTimeInfo.startHour)}-ç¿Œ${formatTime(shiftTimeInfo.endHour)}`;
                } else {
                    timeText = ` ${formatTime(shiftTimeInfo.startHour)}-${formatTime(shiftTimeInfo.endHour)}`;
                }
            }

            // åŠä¼‘ã‚¿ã‚¤ãƒ—ã«å¿œã˜ãŸãƒ©ãƒ™ãƒ«
            let label;
            if (h.halfDayType === 'morning') {
                label = `ðŸŒ… ${h.name} åˆå‰åŠä¼‘${timeText}`;
            } else if (h.halfDayType === 'afternoon') {
                label = `ðŸŒ‡ ${h.name} åˆå¾ŒåŠä¼‘${timeText}`;
            } else {
                label = `ðŸ  ${h.name} ä¼‘æ—¥${timeText}`;
            }
            bar.textContent = label;

            // ã‚¯ãƒªãƒƒã‚¯/ã‚¿ãƒƒãƒ—ã§å‰Šé™¤
            bar.style.cursor = 'pointer';
            const deleteLabel = h.halfDayType ? 'åŠä¼‘' : 'ä¼‘æ—¥';
            bar.title = `ã‚¯ãƒªãƒƒã‚¯ã§${deleteLabel}ã‚’å–ã‚Šæ¶ˆã—`;

            const handleDeleteHoliday = () => {
                const typeLabel = h.halfDayType === 'morning' ? 'åˆå‰åŠä¼‘' : (h.halfDayType === 'afternoon' ? 'åˆå¾ŒåŠä¼‘' : 'ä¼‘æ—¥');
                if (confirm(`${h.name}ã•ã‚“ã®${typeLabel}ï¼ˆ${h.startDate}ï¼‰ã‚’å–ã‚Šæ¶ˆã—ã¾ã™ã‹ï¼Ÿ`)) {
                    state.holidayRequests = state.holidayRequests.filter(x => x.id !== h.id);
                    saveToFirebase('holidayRequests', state.holidayRequests);
                    render();
                }
            };

            bar.addEventListener('click', handleDeleteHoliday);
            bar.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteHoliday();
            }, { passive: false });

            timeline.appendChild(bar);
        });
        barCount += holidays.length;
        
        // å¤œå‹¤ã®ä¼‘æ—¥ã®ç¿Œæ—¥åˆ†ã‚’è¡¨ç¤º
        const overnightHolidays = state.holidayRequests.filter(h => {
            if (h.status !== 'approved') return false;
            // å‰æ—¥ã®æ—¥ä»˜ã‚’å–å¾—
            const prevDate = new Date(dateStr);
            prevDate.setDate(prevDate.getDate() - 1);
            const prevDateStr = formatDate(prevDate);
            
            // å‰æ—¥ãŒä¼‘æ—¥æœŸé–“å†…ã‹ãƒã‚§ãƒƒã‚¯
            if (!(prevDateStr >= h.startDate && prevDateStr <= h.endDate)) return false;
            
            // å‰æ—¥ã®ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ã‚’å–å¾—ã—ã¦å¤œå‹¤ã‹ãƒã‚§ãƒƒã‚¯
            let prevShiftTime = null;
            if (h.shiftTimes && h.shiftTimes[prevDateStr]) {
                prevShiftTime = h.shiftTimes[prevDateStr];
            } else if (h.selectedShifts && h.selectedShifts.length > 0) {
                const selectedShift = h.selectedShifts.find(s => s.date === prevDateStr);
                if (selectedShift) {
                    prevShiftTime = {
                        startHour: selectedShift.startHour,
                        endHour: selectedShift.endHour,
                        overnight: selectedShift.overnight || false
                    };
                }
            } else if (h.startHour !== undefined && h.overnight) {
                prevShiftTime = { startHour: h.startHour, endHour: h.endHour, overnight: h.overnight };
            }
            
            return prevShiftTime && prevShiftTime.overnight;
        });
        
        overnightHolidays.forEach((h, idx) => {
            const prevDate = new Date(dateStr);
            prevDate.setDate(prevDate.getDate() - 1);
            const prevDateStr = formatDate(prevDate);
            
            // å‰æ—¥ã®ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ã‚’å–å¾—
            let prevShiftTime = null;
            if (h.shiftTimes && h.shiftTimes[prevDateStr]) {
                prevShiftTime = h.shiftTimes[prevDateStr];
            } else if (h.selectedShifts && h.selectedShifts.length > 0) {
                const selectedShift = h.selectedShifts.find(s => s.date === prevDateStr);
                if (selectedShift) {
                    prevShiftTime = {
                        startHour: selectedShift.startHour,
                        endHour: selectedShift.endHour,
                        overnight: selectedShift.overnight || false
                    };
                }
            } else if (h.startHour !== undefined) {
                prevShiftTime = { startHour: h.startHour, endHour: h.endHour, overnight: h.overnight };
            }
            
            if (!prevShiftTime) return;
            
            const bar = document.createElement('div');
            bar.className = 'holiday-bar overnight-continuation';
            bar.style.top = `${baseH + (maxLvl + 1 + barCount + idx) * perLvl}px`;
            bar.style.height = `${perLvl - 4}px`;
            
            // 0æ™‚ã‹ã‚‰çµ‚äº†æ™‚åˆ»ã¾ã§è¡¨ç¤º
            const end = prevShiftTime.endHour;
            const leftPercent = 0;
            const widthPercent = (end / 24) * 100;
            bar.style.left = `${leftPercent}%`;
            bar.style.width = `${widthPercent}%`;
            
            bar.textContent = `ðŸ  ${h.name} ä¼‘æ—¥ 0:00-${formatTime(end)}`;
            timeline.appendChild(bar);
        });
        barCount += overnightHolidays.length;

        timeline.style.minHeight = `${baseH + (maxLvl + 1 + barCount) * perLvl}px`;

        row.appendChild(timeline);
        body.appendChild(row);
    }
}

// ã‚»ãƒ«ã®å®Ÿéš›ã®å¹…ã‚’å–å¾—ã™ã‚‹é–¢æ•°
function getCellWidth() {
    const hourCell = document.querySelector('.hour-cell');
    if (hourCell) {
        return hourCell.getBoundingClientRect().width;
    }
    // ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆå€¤ï¼ˆãƒ•ã‚©ãƒ¼ãƒ«ãƒãƒƒã‚¯ï¼‰
    return window.innerWidth <= 768 ? 38 : 50;
}

// ã‚¿ãƒƒãƒã‚¤ãƒ™ãƒ³ãƒˆã‹ã©ã†ã‹ã‚’åˆ¤å®š
let touchMoved = false;

// ã‚·ãƒ•ãƒˆãƒãƒ¼ä½œæˆï¼ˆãƒ‘ãƒ¼ã‚»ãƒ³ãƒˆãƒ™ãƒ¼ã‚¹ã§ä½ç½®è¨ˆç®—ï¼‰
function createShiftBar(s, lvl) {
    const bar = document.createElement('div');
    let cls = 'shift-bar';
    if (s.isFixed) cls += ' fixed';
    if (s.overnight && !s.isOvernightContinuation) cls += ' overnight';
    bar.className = cls;
    bar.dataset.id = s.id;

    // ãƒ‘ãƒ¼ã‚»ãƒ³ãƒˆãƒ™ãƒ¼ã‚¹ã§ä½ç½®ã‚’è¨ˆç®—ï¼ˆ24æ™‚é–“ = 100%ï¼‰
    let start = s.startHour, end = s.endHour;
    if (s.overnight && !s.isOvernightContinuation) end = 24;

    const leftPercent = (start / 24) * 100;
    const widthPercent = ((end - start) / 24) * 100;

    bar.style.left = `${leftPercent}%`;
    bar.style.width = `${widthPercent}%`;
    bar.style.top = `${8 + lvl * 28}px`;
    bar.style.height = '24px';
    // è‰²ãŒæ­£ã—ãè¨­å®šã•ã‚Œã¦ã„ã‚‹ã‹ç¢ºèªã—ã€ä¸æ­£ãªå ´åˆã¯ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆè‰²ã‚’ä½¿ç”¨
    const shiftColor = (s.color && s.color.startsWith('#') && s.color.length >= 4) ? s.color : '#6366f1';
    bar.style.background = `linear-gradient(135deg, ${shiftColor}, ${adjustColor(shiftColor, -20)})`;

    let icons = '';
    if (s.changeHistory) icons += '<span class="change-icon" title="ã‚·ãƒ•ãƒˆå¤‰æ›´ã‚ã‚Š">ðŸ“</span>';
    if (s.swapHistory) icons += '<span class="swap-icon" title="ã‚·ãƒ•ãƒˆäº¤ä»£ã‚ã‚Š">ðŸ¤</span>';
    if (s.hasOverride) icons += '<span class="override-icon" title="ã“ã®æ—¥ã®ã¿å¤‰æ›´">âœï¸</span>';
    if (s.isFixed && !s.hasOverride) icons += '<span class="fixed-icon">ðŸ”</span>';
    if (s.overnight && !s.isOvernightContinuation) icons += '<span class="overnight-icon">ðŸŒ™</span>';
    if (s.isOvernightContinuation) icons += '<span class="overnight-icon">â†’</span>';
    // 臨時シフト判定（イベント日のシフトにバッジを付ける）
    if (!s.isFixed && s.date && isSpecialEventDate(s.date)) {
        icons += '<span class="temporary-icon" title="臨時シフト">⚡</span>';
        bar.classList.add('temporary-shift');
    }

    let time = s.overnight && !s.isOvernightContinuation ? `${formatTime(s.startHour)}-ç¿Œ${formatTime(s.endHour)}` :
        s.isOvernightContinuation ? `ã€œ${formatTime(s.endHour)}` : `${formatTime(s.startHour)}-${formatTime(s.endHour)}`;

    // å¤‰æ›´å±¥æ­´ãŒã‚ã‚‹å ´åˆã¯ãƒ„ãƒ¼ãƒ«ãƒãƒƒãƒ—ã«è¡¨ç¤º
    if (s.changeHistory) {
        const h = s.changeHistory;
        bar.title = `å¤‰æ›´å‰: ${h.previousDate} ${formatTime(h.previousStartHour)}-${formatTime(h.previousEndHour)}\nç†ç”±: ${h.reason}`;
        bar.classList.add('changed');
    }

    // äº¤ä»£å±¥æ­´ãŒã‚ã‚‹å ´åˆã¯ãƒ„ãƒ¼ãƒ«ãƒãƒƒãƒ—ã«è¡¨ç¤º
    if (s.swapHistory) {
        const h = s.swapHistory;
        bar.title = `äº¤ä»£å‰: ${h.previousName} â†’ äº¤ä»£å¾Œ: ${h.newName}`;
        bar.classList.add('swapped');
    }

    bar.innerHTML = `${icons}<span class="shift-name">${s.name}</span><span class="shift-time">${time}</span>`;

    // ã‚¿ãƒƒãƒä½ç½®ã‚’ä¿å­˜ã™ã‚‹ãŸã‚ã®å¤‰æ•°
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    // ã‚¯ãƒªãƒƒã‚¯ã‚¤ãƒ™ãƒ³ãƒˆï¼ˆãƒ‡ã‚¹ã‚¯ãƒˆãƒƒãƒ—ç”¨ï¼‰
    bar.addEventListener('click', e => {
        // ç¢ºèªãƒ€ã‚¤ã‚¢ãƒ­ã‚°ã‚’è¡¨ç¤ºã—ã¦ã‹ã‚‰ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã‚’è¡¨ç¤º
        if (confirm('ã‚·ãƒ•ãƒˆå†…å®¹ã‚’å¤‰æ›´ã—ã¾ã™ã‹ï¼Ÿ')) {
            showShiftPopover(s, e, bar);
        }
    });

    // ã‚¿ãƒƒãƒã‚¤ãƒ™ãƒ³ãƒˆï¼ˆãƒ¢ãƒã‚¤ãƒ«ç”¨ï¼‰
    bar.addEventListener('touchstart', (e) => {
        touchMoved = false;
        touchStartTime = Date.now();
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
        // ã‚¤ãƒ™ãƒ³ãƒˆã®ä¼æ’­ã‚’åœæ­¢ã—ã¦ãƒ”ãƒ³ãƒã‚ºãƒ¼ãƒ ã¨ã®ç«¶åˆã‚’é˜²ã
        e.stopPropagation();
    }, { passive: true });

    bar.addEventListener('touchmove', (e) => {
        // å°‘ã—ã§ã‚‚å‹•ã„ãŸã‚‰ã‚¹ã‚¯ãƒ­ãƒ¼ãƒ«ã¨ã¿ãªã™
        if (e.touches.length === 1) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
            if (deltaX > 10 || deltaY > 10) {
                touchMoved = true;
            }
        }
    }, { passive: true });

    bar.addEventListener('touchend', (e) => {
        // ã‚¿ãƒƒãƒ—åˆ¤å®šï¼šå‹•ããŒå°‘ãªãã€çŸ­ã„æ™‚é–“
        const touchDuration = Date.now() - touchStartTime;
        if (touchMoved || touchDuration > 500) return;

        e.preventDefault();
        e.stopPropagation();

        // ç¢ºèªãƒ€ã‚¤ã‚¢ãƒ­ã‚°ã‚’è¡¨ç¤ºã—ã¦ã‹ã‚‰ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã‚’è¡¨ç¤º
        if (confirm('ã‚·ãƒ•ãƒˆå†…å®¹ã‚’å¤‰æ›´ã—ã¾ã™ã‹ï¼Ÿ')) {
            showShiftPopover(s, {
                clientX: touchStartX,
                clientY: touchStartY,
                target: bar
            }, bar);
        }
    }, { passive: false });

    return bar;
}

// ã‚·ãƒ•ãƒˆè©³ç´°ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã‚’è¡¨ç¤º
function showShiftPopover(s, event, barElement = null) {
    const popover = document.getElementById('shiftPopover');

    // ã‚·ãƒ•ãƒˆæƒ…å ±ã‚’å–å¾—ï¼ˆå›ºå®šã‚·ãƒ•ãƒˆã‚„å¤œå‹¤ç¶™ç¶šã®å ´åˆã¯å…ƒã®ã‚·ãƒ•ãƒˆã‚’å–å¾—ï¼‰
    let displayShift = s;
    if (s.isFixed) {
        const parts = s.id.split('-');
        const originalId = parts[1];
        const original = state.fixedShifts.find(f => f.id === originalId);
        if (original) {
            displayShift = { ...original, date: s.date, isFixed: true, hasOverride: s.hasOverride, overrideId: s.overrideId };
        }
    } else if (s.isOvernightContinuation && s.id.startsWith('on-')) {
        const originalId = s.id.replace('on-', '');
        const original = state.shifts.find(x => x.id === originalId);
        if (original) {
            displayShift = original;
        }
    }

    state.currentPopoverShift = s;

    // ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã®å†…å®¹ã‚’æ›´æ–°
    document.getElementById('popoverName').textContent = displayShift.name;

    // æ—¥ä»˜è¡¨ç¤º
    const dateObj = new Date(displayShift.date || s.date);
    const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
    const dateStr = `${dateObj.getMonth() + 1}æœˆ${dateObj.getDate()}æ—¥ï¼ˆ${dayNames[dateObj.getDay()]}ï¼‰`;
    document.getElementById('popoverDate').textContent = dateStr;

    // æ™‚é–“è¡¨ç¤º
    let timeStr;
    if (displayShift.overnight && !s.isOvernightContinuation) {
        timeStr = `${formatTime(displayShift.startHour)} ã€œ ç¿Œ${formatTime(displayShift.endHour)}`;
    } else if (s.isOvernightContinuation) {
        timeStr = `0:00 ã€œ ${formatTime(displayShift.endHour)}ï¼ˆå‰æ—¥ã‹ã‚‰ã®ç¶™ç¶šï¼‰`;
    } else {
        timeStr = `${formatTime(displayShift.startHour)} ã€œ ${formatTime(displayShift.endHour)}`;
    }
    document.getElementById('popoverTime').textContent = timeStr;

    // ã‚¿ã‚¤ãƒ—è¡¨ç¤º
    document.getElementById('popoverOvernightRow').style.display =
        (displayShift.overnight && !s.isOvernightContinuation) ? 'flex' : 'none';
    document.getElementById('popoverFixedRow').style.display = s.isFixed ? 'flex' : 'none';

    // å˜æ—¥å¤‰æ›´è¡¨ç¤º
    const overrideRow = document.getElementById('popoverOverrideRow');
    if (overrideRow) {
        overrideRow.style.display = s.hasOverride ? 'flex' : 'none';
    }

    // ã€Œã“ã®æ—¥ã®ã¿å¤‰æ›´ã€ãƒœã‚¿ãƒ³ã®è¡¨ç¤ºåˆ¶å¾¡ï¼ˆå›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã®ã¿è¡¨ç¤ºï¼‰
    const overrideBtn = document.getElementById('popoverOverrideBtn');
    if (overrideBtn) {
        overrideBtn.style.display = s.isFixed ? 'inline-block' : 'none';
        // ã™ã§ã«ä¸Šæ›¸ããŒã‚ã‚‹å ´åˆã¯ãƒœã‚¿ãƒ³ãƒ†ã‚­ã‚¹ãƒˆã‚’å¤‰æ›´
        if (s.hasOverride) {
            overrideBtn.textContent = 'ðŸ“ å˜æ—¥å¤‰æ›´ã‚’ç·¨é›†';
        } else {
            overrideBtn.textContent = 'ðŸ“ ã“ã®æ—¥ã®ã¿å¤‰æ›´';
        }
    }

    // å¤‰æ›´å±¥æ­´è¡¨ç¤º
    if (displayShift.changeHistory) {
        document.getElementById('popoverChangeRow').style.display = 'flex';
        const h = displayShift.changeHistory;
        document.getElementById('popoverChangeInfo').textContent =
            `${h.previousDate} ${formatTime(h.previousStartHour)}-${formatTime(h.previousEndHour)}ã‹ã‚‰å¤‰æ›´`;
    } else {
        document.getElementById('popoverChangeRow').style.display = 'none';
    }

    // äº¤ä»£å±¥æ­´è¡¨ç¤º
    if (displayShift.swapHistory) {
        document.getElementById('popoverSwapRow').style.display = 'flex';
        const h = displayShift.swapHistory;
        document.getElementById('popoverSwapInfo').textContent = `${h.previousName} â†’ ${h.newName}`;
    } else {
        document.getElementById('popoverSwapRow').style.display = 'none';
    }

    // ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã®ä½ç½®ã‚’è¨ˆç®—
    // ãƒãƒ¼è¦ç´ ã‚’å–å¾—ï¼ˆç›´æŽ¥æ¸¡ã•ã‚ŒãŸã‹ã€ã‚¤ãƒ™ãƒ³ãƒˆã‹ã‚‰å–å¾—ï¼‰
    let bar = barElement;
    if (!bar && event && event.target) {
        bar = event.target.closest ? event.target.closest('.shift-bar') : event.target;
    }

    const popoverWidth = 300;
    const popoverHeight = 280;
    let left, top;

    if (bar && bar.getBoundingClientRect) {
        const rect = bar.getBoundingClientRect();
        left = rect.left + (rect.width / 2) - (popoverWidth / 2);
        top = rect.bottom + 10;

        // ç”»é¢ã‹ã‚‰ã¯ã¿å‡ºã•ãªã„ã‚ˆã†ã«èª¿æ•´
        if (top + popoverHeight > window.innerHeight - 10) {
            top = rect.top - popoverHeight - 10;
        }
    } else if (event && (event.clientX !== undefined)) {
        // ã‚¿ãƒƒãƒã‚¤ãƒ™ãƒ³ãƒˆã®å ´åˆã€ã‚¿ãƒƒãƒä½ç½®ã‚’åŸºæº–ã«é…ç½®
        left = event.clientX - (popoverWidth / 2);
        top = event.clientY + 20;
    } else {
        // ãƒ•ã‚©ãƒ¼ãƒ«ãƒãƒƒã‚¯ï¼šç”»é¢ä¸­å¤®
        left = (window.innerWidth - popoverWidth) / 2;
        top = (window.innerHeight - popoverHeight) / 2;
    }

    // å·¦å³ã®ã¯ã¿å‡ºã—èª¿æ•´
    if (left < 10) left = 10;
    if (left + popoverWidth > window.innerWidth - 10) {
        left = window.innerWidth - popoverWidth - 10;
    }

    // ä¸Šä¸‹ã®ã¯ã¿å‡ºã—èª¿æ•´
    if (top < 10) top = 10;
    if (top + popoverHeight > window.innerHeight - 10) {
        top = window.innerHeight - popoverHeight - 10;
    }

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.classList.add('active');
}

// ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã‚’é–‰ã˜ã‚‹
function closeShiftPopover() {
    const popover = document.getElementById('shiftPopover');
    popover.classList.remove('active');
    state.currentPopoverShift = null;
}

// å¤‰æ›´å±¥æ­´ãƒ¢ãƒ¼ãƒ€ãƒ«è¡¨ç¤º
function showChangeHistoryModal(s) {
    const h = s.changeHistory;
    const result = confirm(
        `ðŸ“ ã‚·ãƒ•ãƒˆå¤‰æ›´å±¥æ­´\n\n` +
        `ã€å¤‰æ›´å‰ã€‘\næ—¥ä»˜: ${h.previousDate}\næ™‚é–“: ${h.previousStartHour}:00ã€œ${h.previousEndHour}:00\n\n` +
        `ã€å¤‰æ›´å¾Œï¼ˆç¾åœ¨ï¼‰ã€‘\næ—¥ä»˜: ${s.date}\næ™‚é–“: ${s.startHour}:00ã€œ${s.endHour}:00\n\n` +
        `ç†ç”±: ${h.reason}\n\n` +
        `ã€ŒOKã€ã§ç·¨é›†ç”»é¢ã‚’é–‹ãã¾ã™`
    );
    if (result) openEditShiftModal(s);
}

// äº¤ä»£å±¥æ­´ãƒ¢ãƒ¼ãƒ€ãƒ«è¡¨ç¤º
function showSwapHistoryModal(s) {
    const h = s.swapHistory;
    const result = confirm(
        `ðŸ¤ ã‚·ãƒ•ãƒˆäº¤ä»£å±¥æ­´\n\n` +
        `ã€äº¤ä»£å‰ã€‘\næ‹…å½“è€…: ${h.previousName}\n\n` +
        `ã€äº¤ä»£å¾Œï¼ˆç¾åœ¨ï¼‰ã€‘\næ‹…å½“è€…: ${h.newName}\n\n` +
        `ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸: ${h.message || 'ãªã—'}\n\n` +
        `ã€ŒOKã€ã§ç·¨é›†ç”»é¢ã‚’é–‹ãã¾ã™`
    );
    if (result) openEditShiftModal(s);
}

function adjustColor(hex, amt) {
    // è‰²ãŒæ­£ã—ããªã„å ´åˆã¯ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆè‰²ã‚’ä½¿ç”¨
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length < 4) {
        hex = '#6366f1';
    }
    try {
        const n = parseInt(hex.slice(1), 16);
        if (isNaN(n)) return '#6366f1';
        const r = Math.min(255, Math.max(0, (n >> 16) + amt));
        const g = Math.min(255, Math.max(0, ((n >> 8) & 0xFF) + amt));
        const b = Math.min(255, Math.max(0, (n & 0xFF) + amt));
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    } catch (e) {
        return '#6366f1';
    }
}

// å‡¡ä¾‹
function renderLegend() {
    const el = document.getElementById('legendItems');
    const colors = getNameColors();
    if (!Object.keys(colors).length) { el.innerHTML = '<span style="color:var(--text-muted)">ã‚·ãƒ•ãƒˆã‚’è¿½åŠ ã™ã‚‹ã¨æ‹…å½“è€…ãŒè¡¨ç¤ºã•ã‚Œã¾ã™</span>'; return; }
    el.innerHTML = '';
    Object.entries(colors).forEach(([n, c]) => {
        const d = document.createElement('div');
        d.className = 'legend-item';
        d.innerHTML = `<span class="legend-color" style="background:${c}"></span><span>${n}</span>`;
        el.appendChild(d);
    });
}

// æœŸé–“è¡¨ç¤º
function updatePeriodDisplay() {
    const el = document.getElementById('currentPeriod');
    const s = new Date(state.currentWeekStart), e = new Date(s);
    e.setDate(e.getDate() + 6);
    const sm = s.getMonth() + 1, sd = s.getDate(), em = e.getMonth() + 1, ed = e.getDate();
    el.textContent = sm === em ? `${s.getFullYear()}å¹´${sm}æœˆ${sd}æ—¥ ã€œ ${ed}æ—¥` : `${s.getFullYear()}å¹´${sm}æœˆ${sd}æ—¥ ã€œ ${em}æœˆ${ed}æ—¥`;
}

// ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ãƒãƒ¼
function updateMessageBar() {
    const cnt = state.messages.filter(m => !m.read).length + state.swapRequests.filter(r => r.status === 'pending').length;
    const bar = document.getElementById('messageBar'), num = document.getElementById('messageCount');
    if (cnt > 0) { bar.style.display = 'flex'; num.textContent = cnt; }
    else bar.style.display = 'none';
}

// CRUDæ“ä½œ
function addShift(d) { const s = { id: Date.now().toString(), ...d }; state.shifts.push(s); saveToFirebase('shifts', state.shifts); trackUsage('add_shift', d.name); }
function updateShift(id, d) { const i = state.shifts.findIndex(s => s.id === id); if (i >= 0) { state.shifts[i] = { ...state.shifts[i], ...d }; saveToFirebase('shifts', state.shifts); trackUsage('edit_shift', d.name || state.shifts[i]?.name); } }
function addFixedShift(d) { 
    const s = { 
        id: Date.now().toString(), 
        dayOfWeek: getDayOfWeek(d.date), 
        name: d.name,
        startHour: d.startHour,
        endHour: d.endHour,
        color: d.color,
        overnight: d.overnight,
        startDate: d.fixedStartDate || null,
        endDate: d.fixedEndDate || null,
        createdAt: new Date().toISOString()
    }; 
    state.fixedShifts.push(s); 
    saveToFirebase('fixedShifts', state.fixedShifts); 
    trackUsage('add_shift', d.name); 
}
function deleteShift(id) { const shift = state.shifts.find(s => s.id === id); state.shifts = state.shifts.filter(s => s.id !== id); saveToFirebase('shifts', state.shifts); trackUsage('delete_shift', shift?.name); }
function deleteFixedShift(id) { const shift = state.fixedShifts.find(s => s.id === id); state.fixedShifts = state.fixedShifts.filter(s => s.id !== id); saveToFirebase('fixedShifts', state.fixedShifts); trackUsage('delete_shift', shift?.name); }
function updateFixedShift(id, d) {
    const i = state.fixedShifts.findIndex(s => s.id === id);
    if (i >= 0) {
        const updated = { 
            ...state.fixedShifts[i], 
            name: d.name,
            startHour: d.startHour,
            endHour: d.endHour,
            color: d.color,
            overnight: d.overnight,
            dayOfWeek: getDayOfWeek(d.date),
            updatedAt: new Date().toISOString()
        };
        // æœ‰åŠ¹æœŸé–“ãŒæŒ‡å®šã•ã‚Œã¦ã„ã‚‹å ´åˆã®ã¿æ›´æ–°
        if (d.fixedStartDate !== undefined) updated.startDate = d.fixedStartDate;
        if (d.fixedEndDate !== undefined) updated.endDate = d.fixedEndDate;
        state.fixedShifts[i] = updated;
        saveToFirebase('fixedShifts', state.fixedShifts);
        trackUsage('edit_shift', d.name);
    }
}

// å˜æ—¥ä¸Šæ›¸ã CRUDæ“ä½œ
function addShiftOverride(d) {
    const override = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...d };
    state.shiftOverrides.push(override);
    saveToFirebase('shiftOverrides', state.shiftOverrides);
}

function updateShiftOverride(id, d) {
    const i = state.shiftOverrides.findIndex(o => o.id === id);
    if (i >= 0) {
        state.shiftOverrides[i] = { ...state.shiftOverrides[i], ...d, updatedAt: new Date().toISOString() };
        saveToFirebase('shiftOverrides', state.shiftOverrides);
    }
}

function deleteShiftOverride(id) {
    state.shiftOverrides = state.shiftOverrides.filter(o => o.id !== id);
    saveToFirebase('shiftOverrides', state.shiftOverrides);
}
function addChangeRequest(d) {
    const r = { id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString(), ...d };
    state.changeRequests.push(r);
    saveToFirebase('changeRequests', state.changeRequests);
    trackUsage('request_change', d.applicant);

    // ã‚·ãƒ•ãƒˆã®æŒã¡ä¸»ã¨ç®¡ç†è€…ã«ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’é€ä¿¡
    const shift = state.shifts.find(s => s.id === d.originalShiftId);
    if (shift) {
        const title = 'ðŸ”„ ã‚·ãƒ•ãƒˆå¤‰æ›´ç”³è«‹';
        const content = `${d.applicant}ã•ã‚“ã‹ã‚‰ã‚·ãƒ•ãƒˆå¤‰æ›´ç”³è«‹ãŒã‚ã‚Šã¾ã—ãŸã€‚\nã‚·ãƒ•ãƒˆ: ${shift.date} ${shift.startHour}:00-${shift.endHour}:00\nå¤‰æ›´å¾Œ: ${d.newDate} ${d.newStartHour}:00-${d.newEndHour}:00\nç†ç”±: ${d.reason}`;

        // ã‚·ãƒ•ãƒˆã®æŒã¡ä¸»ã«é€šçŸ¥ï¼ˆç”³è«‹è€…ã¨ç•°ãªã‚‹å ´åˆï¼‰
        if (shift.name !== d.applicant) {
            state.messages.push({ id: Date.now().toString() + '_owner', to: shift.name, from: d.applicant, title, content, createdAt: new Date().toISOString(), read: false });
        }

        // ç®¡ç†è€…ã«é€šçŸ¥
        state.messages.push({ id: Date.now().toString() + '_admin', to: 'ç®¡ç†è€…', from: d.applicant, title, content, createdAt: new Date().toISOString(), read: false });

        saveToFirebase('messages', state.messages);
    }
}

// æœ‰çµ¦ç”³è«‹ï¼ˆäº’æ›æ€§ç¶­æŒç”¨ã®å˜ä¸€é–¢æ•°ï¼‰
function addLeaveRequest(d) { 
    const r = { id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString(), ...d }; 
    state.leaveRequests.push(r); 
    saveToFirebase('leaveRequests', state.leaveRequests); 
    trackUsage('request_leave', d.name); 
}

// è¤‡æ•°ã‚·ãƒ•ãƒˆã®æœ‰çµ¦ç”³è«‹
function addLeaveRequestMultiple(name, selectedShifts) {
    const shiftsInfo = selectedShifts.map(s => ({
        date: s.date,
        startHour: s.startHour,
        endHour: s.endHour,
        overnight: s.overnight || false,
        isFixed: s.isFixed || false,
        fixedShiftId: s.fixedShiftId || null
    }));
    
    // æ—¥ä»˜ã§ã‚½ãƒ¼ãƒˆ
    shiftsInfo.sort((a, b) => a.date.localeCompare(b.date));
    
    // é–‹å§‹æ—¥ã¨çµ‚äº†æ—¥ã‚’å–å¾—
    const startDate = shiftsInfo[0].date;
    const endDate = shiftsInfo[shiftsInfo.length - 1].date;
    
    const r = {
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        name: name,
        startDate: startDate,
        endDate: endDate,
        selectedShifts: shiftsInfo,
        reason: 'æœ‰çµ¦ä¼‘æš‡'
    };
    
    state.leaveRequests.push(r);
    saveToFirebase('leaveRequests', state.leaveRequests);
    trackUsage('request_leave', name);
    
    // ç®¡ç†è€…ã«é€šçŸ¥
    const title = 'ðŸ–ï¸ æœ‰çµ¦ç”³è«‹';
    const shiftDates = shiftsInfo.map(s => {
        const d = new Date(s.date);
        const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
        return `${d.getMonth() + 1}/${d.getDate()}ï¼ˆ${dayNames[d.getDay()]}ï¼‰${formatTime(s.startHour)}-${formatTime(s.endHour)}`;
    }).join('\n');
    const content = `${name}ã•ã‚“ã‹ã‚‰æœ‰çµ¦ç”³è«‹ãŒã‚ã‚Šã¾ã—ãŸã€‚\n\nã€ç”³è«‹ã‚·ãƒ•ãƒˆã€‘\n${shiftDates}`;
    state.messages.push({ id: Date.now().toString() + '_admin', to: 'ç®¡ç†è€…', from: name, title, content, createdAt: new Date().toISOString(), read: false });
    saveToFirebase('messages', state.messages);
}

// è¤‡æ•°ã‚·ãƒ•ãƒˆã®ä¼‘æ—¥ç”³è«‹
function addHolidayRequestMultiple(name, selectedShifts, options) {
    const shiftsInfo = selectedShifts.map(s => ({
        date: s.date,
        startHour: options.customStartTime ? parseFloat(options.customStartTime) : s.startHour,
        endHour: options.customEndTime ? parseFloat(options.customEndTime) : s.endHour,
        originalStartHour: s.startHour,
        originalEndHour: s.endHour,
        overnight: s.overnight || false,
        isFixed: s.isFixed || false,
        fixedShiftId: s.fixedShiftId || null
    }));
    
    // æ—¥ä»˜ã§ã‚½ãƒ¼ãƒˆ
    shiftsInfo.sort((a, b) => a.date.localeCompare(b.date));
    
    // é–‹å§‹æ—¥ã¨çµ‚äº†æ—¥ã‚’å–å¾—
    const startDate = shiftsInfo[0].date;
    const endDate = shiftsInfo[shiftsInfo.length - 1].date;
    
    const r = {
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        name: name,
        startDate: startDate,
        endDate: endDate,
        selectedShifts: shiftsInfo,
        swapRequested: options.swapRequested,
        swapPartner: options.swapPartner,
        reason: options.reason,
        hasCustomTime: !!(options.customStartTime || options.customEndTime)
    };
    
    state.holidayRequests.push(r);
    saveToFirebase('holidayRequests', state.holidayRequests);
    trackUsage('request_holiday', name);
    
    // ç®¡ç†è€…ã«é€šçŸ¥
    const title = 'ðŸ  ä¼‘æ—¥ç”³è«‹';
    const shiftDates = shiftsInfo.map(s => {
        const d = new Date(s.date);
        const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
        return `${d.getMonth() + 1}/${d.getDate()}ï¼ˆ${dayNames[d.getDay()]}ï¼‰${formatTime(s.startHour)}-${formatTime(s.endHour)}`;
    }).join('\n');
    let content = `${name}ã•ã‚“ã‹ã‚‰ä¼‘æ—¥ç”³è«‹ãŒã‚ã‚Šã¾ã—ãŸã€‚\n\nã€ç”³è«‹ã‚·ãƒ•ãƒˆã€‘\n${shiftDates}\n\nç†ç”±: ${options.reason}`;
    if (options.swapRequested && options.swapPartner) {
        content += `\nã‚·ãƒ•ãƒˆäº¤ä»£: ${options.swapPartner}ã•ã‚“ã¨äº¤ä»£`;
    }
    state.messages.push({ id: Date.now().toString() + '_admin', to: 'ç®¡ç†è€…', from: name, title, content, createdAt: new Date().toISOString(), read: false });
    saveToFirebase('messages', state.messages);
}

// æœ‰çµ¦ç”³è«‹ç”¨ã®ã‚·ãƒ•ãƒˆãƒªã‚¹ãƒˆã‚’æ›´æ–°
function updateLeaveShiftList() {
    const name = document.getElementById('leaveName').value;
    const container = document.getElementById('leaveShiftList');
    
    if (!name) {
        container.innerHTML = '<p class="no-shift-message">ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</p>';
        return;
    }
    
    const shifts = getEmployeeShiftsForPeriod(name, 4); // 4é€±é–“åˆ†
    
    if (shifts.length === 0) {
        container.innerHTML = '<p class="no-shift-message">è©²å½“ã™ã‚‹ã‚·ãƒ•ãƒˆãŒã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }
    
    container.innerHTML = shifts.map(s => {
        const d = new Date(s.date);
        const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
        const dayColor = d.getDay() === 0 ? '#ef4444' : (d.getDay() === 6 ? '#3b82f6' : '#f8fafc');
        const badges = [];
        if (s.isFixed) badges.push('<span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: #f59e0b; color: white; flex-shrink: 0; margin-left: auto;">å›ºå®š</span>');
        if (s.overnight) badges.push('<span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: #6366f1; color: white; flex-shrink: 0; margin-left: auto;">å¤œå‹¤</span>');
        
        const shiftInfo = JSON.stringify(s).replace(/"/g, '&quot;');
        const dateText = `${d.getMonth() + 1}/${d.getDate()}ï¼ˆ${dayNames[d.getDay()]}ï¼‰`;
        const timeText = `${formatTime(s.startHour)} ã€œ ${formatTime(s.endHour)}${s.overnight ? ' ï¼ˆç¿Œæ—¥ï¼‰' : ''}`;
        
        return `
            <div class="shift-selection-item" data-shift-info="${shiftInfo}" onclick="toggleShiftSelection(this)" style="display: flex; align-items: center; gap: 12px; padding: 12px; margin-bottom: 8px; background: #1e293b; border-radius: 6px; border: 1px solid rgba(148, 163, 184, 0.2); cursor: pointer; width: 100%; box-sizing: border-box;">
                <input type="checkbox" class="shift-selection-checkbox" style="width: 20px; height: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0; padding: 0; margin: 0; cursor: pointer;">
                <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-weight: 600; font-size: 0.95rem; color: ${dayColor}; display: block;">${dateText}</span>
                    <span style="font-size: 0.9rem; color: #94a3b8; display: block;">${timeText}</span>
                </div>
                ${badges.join('')}
            </div>
        `;
    }).join('');
}

// ä¼‘æ—¥ç”³è«‹ç”¨ã®ã‚·ãƒ•ãƒˆãƒªã‚¹ãƒˆã‚’æ›´æ–°
function updateHolidayShiftList() {
    const name = document.getElementById('holidayName').value;
    const container = document.getElementById('holidayShiftList');
    const timeRangeGroup = document.getElementById('holidayTimeRangeGroup');
    
    if (!name) {
        container.innerHTML = '<p class="no-shift-message">ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</p>';
        timeRangeGroup.style.display = 'none';
        return;
    }
    
    const shifts = getEmployeeShiftsForPeriod(name, 4); // 4é€±é–“åˆ†
    
    if (shifts.length === 0) {
        container.innerHTML = '<p class="no-shift-message">è©²å½“ã™ã‚‹ã‚·ãƒ•ãƒˆãŒã‚ã‚Šã¾ã›ã‚“</p>';
        timeRangeGroup.style.display = 'none';
        return;
    }
    
    container.innerHTML = shifts.map(s => {
        const d = new Date(s.date);
        const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
        const dayColor = d.getDay() === 0 ? '#ef4444' : (d.getDay() === 6 ? '#3b82f6' : '#f8fafc');
        const badges = [];
        if (s.isFixed) badges.push('<span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: #f59e0b; color: white; flex-shrink: 0; margin-left: auto;">å›ºå®š</span>');
        if (s.overnight) badges.push('<span style="font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; background: #6366f1; color: white; flex-shrink: 0; margin-left: auto;">å¤œå‹¤</span>');
        
        const shiftInfo = JSON.stringify(s).replace(/"/g, '&quot;');
        const dateText = `${d.getMonth() + 1}/${d.getDate()}ï¼ˆ${dayNames[d.getDay()]}ï¼‰`;
        const timeText = `${formatTime(s.startHour)} ã€œ ${formatTime(s.endHour)}${s.overnight ? ' ï¼ˆç¿Œæ—¥ï¼‰' : ''}`;
        
        return `
            <div class="shift-selection-item" data-shift-info="${shiftInfo}" onclick="toggleShiftSelection(this, 'holiday')" style="display: flex; align-items: center; gap: 12px; padding: 12px; margin-bottom: 8px; background: #1e293b; border-radius: 6px; border: 1px solid rgba(148, 163, 184, 0.2); cursor: pointer; width: 100%; box-sizing: border-box;">
                <input type="checkbox" class="shift-selection-checkbox" style="width: 20px; height: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0; padding: 0; margin: 0; cursor: pointer;">
                <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-weight: 600; font-size: 0.95rem; color: ${dayColor}; display: block;">${dateText}</span>
                    <span style="font-size: 0.9rem; color: #94a3b8; display: block;">${timeText}</span>
                </div>
                ${badges.join('')}
            </div>
        `;
    }).join('');
    
    // æ™‚é–“å¸¯é¸æŠžã‚’è¡¨ç¤º
    timeRangeGroup.style.display = 'block';
    updateHolidayTimeOptions();
}

// ã‚·ãƒ•ãƒˆé¸æŠžã®åˆ‡ã‚Šæ›¿ãˆ
function toggleShiftSelection(element, type) {
    const checkbox = element.querySelector('.shift-selection-checkbox');
    checkbox.checked = !checkbox.checked;
    element.classList.toggle('selected', checkbox.checked);
    
    // ä¼‘æ—¥ç”³è«‹ã®å ´åˆã€æ™‚é–“é¸æŠžã‚’æ›´æ–°
    if (type === 'holiday') {
        updateHolidayTimeOptions();
    }
}

// ä¼‘æ—¥ç”³è«‹ã®æ™‚é–“é¸æŠžã‚ªãƒ—ã‚·ãƒ§ãƒ³ã‚’æ›´æ–°
function updateHolidayTimeOptions() {
    const startSelect = document.getElementById('holidayStartTime');
    const endSelect = document.getElementById('holidayEndTime');
    
    // é¸æŠžã•ã‚ŒãŸã‚·ãƒ•ãƒˆã‚’å–å¾—
    const selectedItems = document.querySelectorAll('#holidayShiftList .shift-selection-checkbox:checked');
    
    if (selectedItems.length === 0) {
        startSelect.innerHTML = '<option value="">ã‚·ãƒ•ãƒˆé–‹å§‹æ™‚åˆ»</option>';
        endSelect.innerHTML = '<option value="">ã‚·ãƒ•ãƒˆçµ‚äº†æ™‚åˆ»</option>';
        return;
    }
    
    // æœ€åˆã«é¸æŠžã•ã‚ŒãŸã‚·ãƒ•ãƒˆã‚’åŸºæº–ã«ã™ã‚‹
    const firstItem = selectedItems[0].closest('.shift-selection-item');
    const shiftData = JSON.parse(firstItem.dataset.shiftInfo);
    
    // é–‹å§‹æ™‚åˆ»ã®é¸æŠžè‚¢ã‚’ç”Ÿæˆ
    startSelect.innerHTML = '<option value="">ã‚·ãƒ•ãƒˆé–‹å§‹æ™‚åˆ»</option>';
    for (let h = shiftData.startHour; h < shiftData.endHour; h += 0.5) {
        startSelect.innerHTML += `<option value="${h}">${formatTime(h)}</option>`;
    }
    
    // çµ‚äº†æ™‚åˆ»ã®é¸æŠžè‚¢ã‚’ç”Ÿæˆ
    endSelect.innerHTML = '<option value="">ã‚·ãƒ•ãƒˆçµ‚äº†æ™‚åˆ»</option>';
    for (let h = shiftData.startHour + 0.5; h <= shiftData.endHour; h += 0.5) {
        endSelect.innerHTML += `<option value="${h}">${formatTime(h)}</option>`;
    }
}

// å¾“æ¥­å“¡ã®ã‚·ãƒ•ãƒˆã‚’æœŸé–“åˆ†å–å¾—
function getEmployeeShiftsForPeriod(employeeName, weeks) {
    const shifts = [];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (weeks * 7));
    
    // é€šå¸¸ã‚·ãƒ•ãƒˆã‚’åŽé›†
    state.shifts.forEach(s => {
        if (s.name === employeeName && !s.hidden && !s.isLeaveOverride) {
            const shiftDate = new Date(s.date);
            if (shiftDate >= today && shiftDate <= endDate) {
                shifts.push({
                    date: s.date,
                    startHour: s.startHour,
                    endHour: s.endHour,
                    overnight: s.overnight || false,
                    isFixed: false,
                    shiftId: s.id
                });
            }
        }
    });
    
    // å›ºå®šã‚·ãƒ•ãƒˆã‚’åŽé›†ï¼ˆä»Šæ—¥ã‹ã‚‰æŒ‡å®šé€±é–“åˆ†ï¼‰
    const currentDate = new Date(today);
    while (currentDate <= endDate) {
        const dateStr = formatDate(currentDate);
        const dayOfWeek = currentDate.getDay();
        
        // ã“ã®æ—¥ã«æ—¢ã«é€šå¸¸ã‚·ãƒ•ãƒˆãŒã‚ã‚‹ã‹ç¢ºèª
        const hasNormalShift = shifts.some(s => s.date === dateStr);
        
        if (!hasNormalShift) {
            // 臨時シフト日は固定シフトをスキップ
            const isSpecialDay = isSpecialEventDate(dateStr);
            if (isSpecialDay) { currentDate.setDate(currentDate.getDate() + 1); continue; }
            // å›ºå®šã‚·ãƒ•ãƒˆã‚’æŽ¢ã™
            state.fixedShifts.forEach(f => {
                if (f.name === employeeName && f.dayOfWeek === dayOfWeek) {
                    // æœ‰çµ¦ã‚„ä¼‘æ—¥ã§ä¸Šæ›¸ãã•ã‚Œã¦ã„ãªã„ã‹ç¢ºèª
                    const isOverridden = state.shifts.some(s => 
                        s.date === dateStr && 
                        s.fixedShiftOverride === f.id && 
                        (s.isLeaveOverride || s.hidden)
                    );
                    
                    if (!isOverridden) {
                        // å˜æ—¥ä¸Šæ›¸ããŒã‚ã‚‹ã‹ç¢ºèª
                        const override = state.shiftOverrides.find(o => o.fixedShiftId === f.id && o.date === dateStr);
                        
                        shifts.push({
                            date: dateStr,
                            startHour: override ? override.startHour : f.startHour,
                            endHour: override ? override.endHour : f.endHour,
                            overnight: override ? (override.overnight || false) : (f.overnight || false),
                            isFixed: true,
                            fixedShiftId: f.id
                        });
                    }
                }
            });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // æ—¥ä»˜ã§ã‚½ãƒ¼ãƒˆ
    shifts.sort((a, b) => a.date.localeCompare(b.date));
    
    return shifts;
}

function addSwapRequest(d) {
    const r = { id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString(), ...d };
    state.swapRequests.push(r);
    saveToFirebase('swapRequests', state.swapRequests);
    trackUsage('request_swap', d.applicant);

    // ã‚·ãƒ•ãƒˆæƒ…å ±ã‚’å–å¾—ï¼ˆå›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã‚‚å¯¾å¿œï¼‰
    let shiftInfo = null;
    if (d.shiftId && d.shiftId.startsWith('fx-')) {
        // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆ: fx-{originalId}-{dateStr} å½¢å¼
        const parts = d.shiftId.split('-');
        const originalId = parts[1];
        const dateStr = parts.slice(2).join('-');
        const fixed = state.fixedShifts.find(f => f.id === originalId);
        if (fixed) {
            shiftInfo = { date: dateStr, startHour: fixed.startHour, endHour: fixed.endHour, name: fixed.name };
        }
    } else {
        const shift = state.shifts.find(s => s.id === d.shiftId);
        if (shift) {
            shiftInfo = { date: shift.date, startHour: shift.startHour, endHour: shift.endHour, name: shift.name };
        }
    }

    // äº¤ä»£ç›¸æ‰‹ã«ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’é€ä¿¡ï¼ˆç®¡ç†è€…ã¯ç®¡ç†è€…ãƒ‘ãƒãƒ«ã§ç¢ºèªã§ãã‚‹ãŸã‚é€šçŸ¥ã—ãªã„ï¼‰
    if (shiftInfo) {
        const title = 'ðŸ¤ ã‚·ãƒ•ãƒˆäº¤ä»£ä¾é ¼';
        const timeDisplay = `${formatTime(shiftInfo.startHour)}-${formatTime(shiftInfo.endHour)}`;
        const content = `${d.applicant}ã•ã‚“ã‹ã‚‰${d.targetEmployee}ã•ã‚“ã¸ã‚·ãƒ•ãƒˆäº¤ä»£ä¾é ¼ãŒã‚ã‚Šã¾ã—ãŸã€‚\nã‚·ãƒ•ãƒˆ: ${shiftInfo.date} ${timeDisplay}\nç¾åœ¨ã®æ‹…å½“: ${shiftInfo.name}\näº¤ä»£å…ˆ: ${d.targetEmployee}\nãƒ¡ãƒƒã‚»ãƒ¼ã‚¸: ${d.message}`;

        // äº¤ä»£ç›¸æ‰‹ã«é€šçŸ¥
        state.messages.push({ id: Date.now().toString() + '_target', to: d.targetEmployee, from: d.applicant, title, content, createdAt: new Date().toISOString(), read: false });

        saveToFirebase('messages', state.messages);
    }
}
function addEmployee(d) { const e = { id: Date.now().toString(), ...d }; state.employees.push(e); saveToFirebase('employees', state.employees); }
function deleteEmployee(id) { state.employees = state.employees.filter(e => e.id !== id); saveToFirebase('employees', state.employees); }
function updateEmployee(id, d) {
    const i = state.employees.findIndex(e => e.id === id);
    if (i >= 0) {
        state.employees[i] = { ...state.employees[i], ...d };
        saveToFirebase('employees', state.employees);
    }
}

// ====== 臨時シフト（特別イベント）管理 ======
function addSpecialEvent(d) {
    const e = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...d };
    state.specialEvents.push(e);
    saveToFirebase('specialEvents', state.specialEvents);
    trackUsage('add_special_event', d.name || '管理者');
}

function updateSpecialEvent(id, d) {
    const i = state.specialEvents.findIndex(e => e.id === id);
    if (i >= 0) {
        state.specialEvents[i] = { ...state.specialEvents[i], ...d };
        saveToFirebase('specialEvents', state.specialEvents);
    }
}

function deleteSpecialEvent(id) {
    state.specialEvents = state.specialEvents.filter(e => e.id !== id);
    saveToFirebase('specialEvents', state.specialEvents);
}

// 指定日がイベント日かチェック
function isSpecialEventDate(dateStr) {
    return state.specialEvents.some(e => e.date === dateStr);
}

// 指定日のイベント情報を取得
function getSpecialEvent(dateStr) {
    return state.specialEvents.find(e => e.date === dateStr);
}

// 臨時シフト管理画面をレンダリング
function renderSpecialEventManagement(container) {
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    
    // イベントを日付でソート
    const sortedEvents = [...state.specialEvents].sort((a, b) => a.date.localeCompare(b.date));
    const today = formatDate(new Date());
    const upcomingEvents = sortedEvents.filter(e => e.date >= today);
    const pastEvents = sortedEvents.filter(e => e.date < today);
    
    let html = `
        <div style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; color: #f8fafc;">⚡ 臨時シフト管理</h3>
                <button class="btn btn-primary btn-sm" onclick="openSpecialEventModal()">＋ イベント日を追加</button>
            </div>
            <p style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 16px;">
                イベント日を登録すると、その日の固定シフトが自動停止され、臨時シフトのみが表示されます。<br>
                臨時シフトは通常の「シフト追加」から登録してください（自動的に臨時マークが付きます）。
            </p>
    `;
    
    // 今後のイベント
    html += `<h4 style="color: #f59e0b; margin-bottom: 8px;">📅 今後のイベント (${upcomingEvents.length}件)</h4>`;
    if (upcomingEvents.length === 0) {
        html += `<p style="color: #64748b; padding: 12px; text-align: center;">予定されているイベントはありません</p>`;
    } else {
        upcomingEvents.forEach(e => {
            const d = new Date(e.date);
            const dayColor = d.getDay() === 0 ? '#ef4444' : (d.getDay() === 6 ? '#3b82f6' : '#f8fafc');
            const dateDisplay = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}（${dayNames[d.getDay()]}）`;
            
            // この日のシフト数をカウント
            const dayShiftCount = state.shifts.filter(s => s.date === e.date && !s.hidden && !s.isLeaveOverride).length;
            
            html += `
                <div style="background: #1e293b; border: 1px solid #f59e0b40; border-radius: 8px; padding: 14px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                <span style="font-size: 1.2rem;">⚡</span>
                                <span style="font-weight: 700; font-size: 1rem; color: ${dayColor};">${dateDisplay}</span>
                            </div>
                            <div style="font-weight: 600; color: #f8fafc; font-size: 0.95rem; margin-bottom: 4px;">${e.eventName || 'イベント'}</div>
                            ${e.description ? `<div style="color: #94a3b8; font-size: 0.85rem;">${e.description}</div>` : ''}
                            <div style="margin-top: 6px; display: flex; gap: 8px; align-items: center;">
                                <span style="font-size: 0.8rem; padding: 2px 8px; border-radius: 10px; background: ${e.suppressFixed !== false ? '#dc262640' : '#22c55e40'}; color: ${e.suppressFixed !== false ? '#f87171' : '#4ade80'};">
                                    固定シフト: ${e.suppressFixed !== false ? '停止' : '有効'}
                                </span>
                                <span style="font-size: 0.8rem; color: #64748b;">臨時シフト: ${dayShiftCount}件</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <button class="btn btn-sm" style="background: #334155; color: #94a3b8; border: 1px solid #475569; padding: 4px 10px; font-size: 0.8rem;" onclick="openEditSpecialEventModal('${e.id}')">編集</button>
                            <button class="btn btn-sm" style="background: #7f1d1d40; color: #f87171; border: 1px solid #7f1d1d; padding: 4px 10px; font-size: 0.8rem;" onclick="if(confirm('このイベントを削除しますか？\\n※臨時シフトは削除されません')){deleteSpecialEvent('${e.id}')}">削除</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // 過去のイベント
    if (pastEvents.length > 0) {
        html += `<h4 style="color: #64748b; margin-top: 16px; margin-bottom: 8px;">📋 過去のイベント (${pastEvents.length}件)</h4>`;
        pastEvents.slice(-5).reverse().forEach(e => {
            const d = new Date(e.date);
            const dateDisplay = `${d.getMonth() + 1}/${d.getDate()}（${dayNames[d.getDay()]}）`;
            html += `
                <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 10px 14px; margin-bottom: 6px; opacity: 0.7;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="color: #64748b;">${dateDisplay}</span>
                            <span style="color: #94a3b8; margin-left: 8px;">${e.eventName || 'イベント'}</span>
                        </div>
                        <button class="btn btn-sm" style="background: transparent; color: #64748b; border: 1px solid #334155; padding: 2px 8px; font-size: 0.75rem;" onclick="if(confirm('削除しますか？')){deleteSpecialEvent('${e.id}')}">削除</button>
                    </div>
                </div>
            `;
        });
    }
    
    html += `</div>`;
    container.innerHTML = html;
}

// 臨時イベント追加モーダルを開く
function openSpecialEventModal() {
    document.getElementById('specialEventModalTitle').textContent = '⚡ イベント日を追加';
    document.getElementById('specialEventSubmitBtn').textContent = '追加';
    document.getElementById('editSpecialEventId').value = '';
    document.getElementById('specialEventDate').value = formatDate(new Date());
    document.getElementById('specialEventName').value = '';
    document.getElementById('specialEventDescription').value = '';
    document.getElementById('suppressFixedShifts').checked = true;
    openModal(document.getElementById('specialEventModalOverlay'));
}

// 臨時イベント編集モーダルを開く
function openEditSpecialEventModal(id) {
    const e = state.specialEvents.find(x => x.id === id);
    if (!e) return;
    document.getElementById('specialEventModalTitle').textContent = '⚡ イベント日を編集';
    document.getElementById('specialEventSubmitBtn').textContent = '更新';
    document.getElementById('editSpecialEventId').value = id;
    document.getElementById('specialEventDate').value = e.date;
    document.getElementById('specialEventName').value = e.eventName || '';
    document.getElementById('specialEventDescription').value = e.description || '';
    document.getElementById('suppressFixedShifts').checked = e.suppressFixed !== false;
    openModal(document.getElementById('specialEventModalOverlay'));
}

// å¾“æ¥­å“¡ç·¨é›†ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openEditEmployeeModal(id) {
    const emp = state.employees.find(e => e.id === id);
    if (!emp) return;

    // ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚¿ã‚¤ãƒˆãƒ«ã¨ãƒœã‚¿ãƒ³ãƒ†ã‚­ã‚¹ãƒˆã‚’å¤‰æ›´
    document.getElementById('employeeModalTitle').textContent = 'ðŸ‘¤ å¾“æ¥­å“¡ç·¨é›†';
    document.getElementById('employeeSubmitBtn').textContent = 'æ›´æ–°';
    document.getElementById('editEmployeeId').value = id;

    // ãƒ•ã‚©ãƒ¼ãƒ ã«ç¾åœ¨ã®å€¤ã‚’ã‚»ãƒƒãƒˆ
    document.getElementById('employeeName').value = emp.name || '';
    document.getElementById('employeeRole').value = emp.role || 'staff';
    document.getElementById('employeeShiftTime').value = emp.shiftTime || 'day';

    // ç™ºæ³¨æ‹…å½“åˆ†é¡žã®ãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹ã‚’ãƒªã‚»ãƒƒãƒˆã—ã¦ç¾åœ¨ã®å€¤ã‚’ã‚»ãƒƒãƒˆ
    document.querySelectorAll('input[name="orderCategory"]').forEach(cb => {
        cb.checked = emp.orderCategories && emp.orderCategories.includes(cb.value);
    });

    // ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
    openModal(document.getElementById('employeeModalOverlay'));
}

// å¾“æ¥­å“¡è¿½åŠ ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ãï¼ˆãƒªã‚»ãƒƒãƒˆç”¨ï¼‰
function openAddEmployeeModal() {
    // ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚¿ã‚¤ãƒˆãƒ«ã¨ãƒœã‚¿ãƒ³ãƒ†ã‚­ã‚¹ãƒˆã‚’ãƒªã‚»ãƒƒãƒˆ
    document.getElementById('employeeModalTitle').textContent = 'ðŸ‘¤ å¾“æ¥­å“¡è¿½åŠ ';
    document.getElementById('employeeSubmitBtn').textContent = 'è¿½åŠ ';
    document.getElementById('editEmployeeId').value = '';

    // ãƒ•ã‚©ãƒ¼ãƒ ã‚’ãƒªã‚»ãƒƒãƒˆ
    document.getElementById('employeeName').value = '';
    document.getElementById('employeeRole').value = 'staff';
    document.getElementById('employeeShiftTime').value = 'day';

    // ç™ºæ³¨æ‹…å½“åˆ†é¡žã®ãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹ã‚’ãƒªã‚»ãƒƒãƒˆ
    document.querySelectorAll('input[name="orderCategory"]').forEach(cb => {
        cb.checked = false;
    });

    // ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
    openModal(document.getElementById('employeeModalOverlay'));
}

function addHolidayRequest(d) {
    const r = { id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString(), ...d };
    state.holidayRequests.push(r);
    saveToFirebase('holidayRequests', state.holidayRequests);
    trackUsage('request_holiday', d.name);

    // ç®¡ç†è€…ã«é€šçŸ¥
    const title = 'ðŸ  ä¼‘æ—¥ç”³è«‹';
    let content = `${d.name}ã•ã‚“ã‹ã‚‰ä¼‘æ—¥ç”³è«‹ãŒã‚ã‚Šã¾ã—ãŸã€‚\næœŸé–“: ${d.startDate} ã€œ ${d.endDate}\nç†ç”±: ${d.reason}`;
    if (d.swapRequested && d.swapPartner) {
        content += `\nã‚·ãƒ•ãƒˆäº¤ä»£: ${d.swapPartner}ã•ã‚“ã¨äº¤ä»£`;
    }
    state.messages.push({ id: Date.now().toString() + '_admin', to: 'ç®¡ç†è€…', from: d.name, title, content, createdAt: new Date().toISOString(), read: false });
    saveToFirebase('messages', state.messages);
}

// åŠä¼‘ã‚’ä½œæˆã™ã‚‹é–¢æ•°
function createHalfDayOff(s, halfDayType) {
    // ã‚·ãƒ•ãƒˆã®æ‹…å½“è€…åã¨æ—¥ä»˜ã‚’å–å¾—
    let name, date, startHour, endHour, overnight;

    if (s.isFixed) {
        const parts = s.id.split('-');
        const originalId = parts[1];
        const fixed = state.fixedShifts.find(f => f.id === originalId);
        if (fixed) {
            name = fixed.name;
            date = s.date;
            startHour = fixed.startHour;
            endHour = fixed.endHour;
            overnight = fixed.overnight || false;
        }
    } else if (s.isOvernightContinuation && s.id.startsWith('on-')) {
        const originalId = s.id.replace('on-', '');
        const original = state.shifts.find(x => x.id === originalId);
        if (original) {
            name = original.name;
            date = original.date;
            startHour = original.startHour;
            endHour = original.endHour;
            overnight = original.overnight || false;
        }
    } else {
        name = s.name;
        date = s.date;
        startHour = s.startHour;
        endHour = s.endHour;
        overnight = s.overnight || false;
    }

    if (!name || !date) {
        alert('ã‚·ãƒ•ãƒˆæƒ…å ±ã®å–å¾—ã«å¤±æ•—ã—ã¾ã—ãŸã€‚');
        return;
    }

    // åŠä¼‘ã®æ™‚é–“ã‚’è¨ˆç®—ï¼ˆ12æ™‚ã‚’å¢ƒç•Œã¨ã™ã‚‹ï¼‰
    let halfStartHour, halfEndHour;
    if (halfDayType === 'morning') {
        // åˆå‰åŠä¼‘: ã‚·ãƒ•ãƒˆé–‹å§‹ã€œ12:00 ã‚’ä¼‘ã¿ã«ã™ã‚‹
        halfStartHour = Math.min(startHour, 12);
        halfEndHour = 12;
    } else {
        // åˆå¾ŒåŠä¼‘: 12:00ã€œã‚·ãƒ•ãƒˆçµ‚äº† ã‚’ä¼‘ã¿ã«ã™ã‚‹
        halfStartHour = 12;
        halfEndHour = Math.max(endHour, 12);
        // å¤œå‹¤ã§ç¿Œæ—¥ã«ã¾ãŸãŒã‚‹å ´åˆ
        if (overnight) {
            halfEndHour = 24;
        }
    }

    // æ‰¿èªæ¸ˆã¿ã®åŠä¼‘ãƒªã‚¯ã‚¨ã‚¹ãƒˆã‚’ä½œæˆ
    const holidayRequest = {
        id: Date.now().toString(),
        name: name,
        startDate: date,
        endDate: date,
        startHour: halfStartHour,
        endHour: halfEndHour,
        overnight: false,
        halfDayType: halfDayType,  // 'morning' or 'afternoon'
        reason: halfDayType === 'morning' ? 'åˆå‰åŠä¼‘' : 'åˆå¾ŒåŠä¼‘',
        swapRequested: false,
        swapPartner: null,
        status: 'approved',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        processedBy: 'ç®¡ç†è€…ï¼ˆå³æ™‚æ‰¿èªï¼‰'
    };
    state.holidayRequests.push(holidayRequest);
    saveToFirebase('holidayRequests', state.holidayRequests);
    trackUsage('create_halfday', name);

    // ã‚·ãƒ•ãƒˆã¯å‰Šé™¤ã›ãšã€åŠä¼‘ãƒãƒ¼ã‚’è¡¨ç¤ºã™ã‚‹ï¼ˆã‚·ãƒ•ãƒˆã¯æ®‹ã—ãŸã¾ã¾ï¼‰
    // å¿…è¦ã«å¿œã˜ã¦ã‚·ãƒ•ãƒˆã‚’å‰Šé™¤ã™ã‚‹å ´åˆã¯ã“ã“ã«è¿½åŠ 

    const typeText = halfDayType === 'morning' ? 'åˆå‰åŠä¼‘' : 'åˆå¾ŒåŠä¼‘';
    alert(`${typeText}ã«å¤‰æ›´ã—ã¾ã—ãŸã€‚`);
    render();
}
function sendBroadcast(title, content) {
    trackUsage('send_broadcast', 'ç®¡ç†è€…');
    state.employees.forEach(e => {
        state.messages.push({ id: Date.now().toString() + e.id, to: e.name, from: 'ç®¡ç†è€…', title, content, createdAt: new Date().toISOString(), read: false });
    });
    saveToFirebase('messages', state.messages);
}

// æ‰¿èªãƒ»å´ä¸‹
function approveRequest(type, id) {
    const processedAt = new Date().toISOString();
    const processedBy = 'ç®¡ç†è€…'; // ç¾åœ¨ã¯ç®¡ç†è€…ã®ã¿ãŒæ‰¿èªå¯èƒ½
    trackUsage('admin_approve', 'ç®¡ç†è€…');

    if (type === 'change') {
        const r = state.changeRequests.find(x => x.id === id);
        if (r) {
            r.status = 'approved';
            r.approvedAt = processedAt;
            r.processedBy = processedBy;
            const s = state.shifts.find(x => x.id === r.originalShiftId);
            if (s) {
                // å¤‰æ›´å‰ã®æƒ…å ±ã‚’ä¿å­˜
                s.changeHistory = {
                    previousDate: s.date,
                    previousStartHour: s.startHour,
                    previousEndHour: s.endHour,
                    changedAt: processedAt,
                    reason: r.reason
                };
                // æ–°ã—ã„æƒ…å ±ã«æ›´æ–°
                s.date = r.newDate;
                s.startHour = r.newStartHour;
                s.endHour = r.newEndHour;
            }
            saveToFirebase('shifts', state.shifts);
            saveToFirebase('changeRequests', state.changeRequests);
        }
    } else if (type === 'leave') {
        const r = state.leaveRequests.find(x => x.id === id);
        if (r) {
            r.status = 'approved';
            r.approvedAt = processedAt;
            r.processedBy = processedBy;
            
            console.log('æœ‰çµ¦æ‰¿èªå‡¦ç†:', { name: r.name, startDate: r.startDate, endDate: r.endDate, selectedShifts: r.selectedShifts });
            
            // é¸æŠžã‚·ãƒ•ãƒˆå½¢å¼ã‹ã©ã†ã‹ã§å‡¦ç†ã‚’åˆ†å²
            if (r.selectedShifts && r.selectedShifts.length > 0) {
                // æ–°å½¢å¼ï¼šé¸æŠžã•ã‚ŒãŸã‚·ãƒ•ãƒˆã®ã¿ã‚’å‡¦ç†
                r.shiftTimes = {};
                
                r.selectedShifts.forEach(shiftInfo => {
                    const dateStr = shiftInfo.date;
                    
                    // ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ã‚’ä¿å­˜ï¼ˆã‚¬ãƒ³ãƒˆãƒãƒ£ãƒ¼ãƒˆè¡¨ç¤ºç”¨ï¼‰
                    r.shiftTimes[dateStr] = {
                        startHour: shiftInfo.startHour,
                        endHour: shiftInfo.endHour,
                        overnight: shiftInfo.overnight || false
                    };
                    
                    if (shiftInfo.isFixed && shiftInfo.fixedShiftId) {
                        // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆï¼šä¸Šæ›¸ãã‚·ãƒ•ãƒˆã‚’è¿½åŠ 
                        const existingOverride = state.shifts.find(s => 
                            s.date === dateStr && 
                            s.fixedShiftOverride === shiftInfo.fixedShiftId
                        );
                        
                        if (!existingOverride) {
                            const fixed = state.fixedShifts.find(f => f.id === shiftInfo.fixedShiftId);
                            if (fixed) {
                                state.shifts.push({
                                    id: 'leave-override-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                                    date: dateStr,
                                    name: r.name,
                                    startHour: fixed.startHour,
                                    endHour: fixed.endHour,
                                    color: fixed.color,
                                    fixedShiftOverride: shiftInfo.fixedShiftId,
                                    isLeaveOverride: true,
                                    hidden: true
                                });
                                console.log('å›ºå®šã‚·ãƒ•ãƒˆä¸Šæ›¸ãè¿½åŠ :', dateStr);
                            }
                        }
                    } else {
                        // é€šå¸¸ã‚·ãƒ•ãƒˆã®å ´åˆï¼šè©²å½“ã‚·ãƒ•ãƒˆã‚’å‰Šé™¤
                        state.shifts = state.shifts.filter(s => {
                            const isTarget = s.date === dateStr && s.name === r.name;
                            if (isTarget) console.log('å‰Šé™¤å¯¾è±¡ã‚·ãƒ•ãƒˆ:', s);
                            return !isTarget;
                        });
                    }
                });
            } else {
                // å¾“æ¥å½¢å¼ï¼šæœŸé–“å†…ã®å…¨ã‚·ãƒ•ãƒˆã‚’å‡¦ç†
                const startDate = new Date(r.startDate);
                const endDate = new Date(r.endDate);
                
                // å„æ—¥ã®ã‚·ãƒ•ãƒˆæ™‚é–“æƒ…å ±ã‚’ä¿å­˜ï¼ˆã‚¬ãƒ³ãƒˆãƒãƒ£ãƒ¼ãƒˆè¡¨ç¤ºç”¨ï¼‰
                r.shiftTimes = {};
                const currentDateForShift = new Date(startDate);
                while (currentDateForShift <= endDate) {
                    const dateStr = formatDate(currentDateForShift);
                    const dayOfWeek = currentDateForShift.getDay();
                    
                    // ãã®æ—¥ã®é€šå¸¸ã‚·ãƒ•ãƒˆã‚’æŽ¢ã™
                    const normalShift = state.shifts.find(s => s.date === dateStr && s.name === r.name);
                    if (normalShift) {
                        r.shiftTimes[dateStr] = {
                            startHour: normalShift.startHour,
                            endHour: normalShift.endHour,
                            overnight: normalShift.overnight || false
                        };
                    } else {
                        // å›ºå®šã‚·ãƒ•ãƒˆã‚’æŽ¢ã™
                        const fixedShift = state.fixedShifts.find(f => f.name === r.name && f.dayOfWeek === dayOfWeek);
                        if (fixedShift) {
                            r.shiftTimes[dateStr] = {
                                startHour: fixedShift.startHour,
                                endHour: fixedShift.endHour,
                                overnight: fixedShift.overnight || false
                            };
                        }
                    }
                    currentDateForShift.setDate(currentDateForShift.getDate() + 1);
                }
                
                // é€šå¸¸ã‚·ãƒ•ãƒˆã‹ã‚‰è©²å½“è€…ãƒ»è©²å½“æœŸé–“ã®ã‚·ãƒ•ãƒˆã‚’å‰Šé™¤
                const beforeCount = state.shifts.length;
                state.shifts = state.shifts.filter(s => {
                    const shiftDate = new Date(s.date);
                    const isInRange = shiftDate >= startDate && shiftDate <= endDate;
                    const isSamePerson = s.name === r.name;
                    if (isInRange && isSamePerson) {
                        console.log('å‰Šé™¤å¯¾è±¡ã‚·ãƒ•ãƒˆ:', s);
                    }
                    return !(isInRange && isSamePerson);
                });
                console.log('é€šå¸¸ã‚·ãƒ•ãƒˆå‰Šé™¤:', beforeCount, '->', state.shifts.length);
                
                // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆï¼šè©²å½“æ—¥ã«ã€Œå‰Šé™¤ã€ãƒžãƒ¼ã‚¯ã®ã‚·ãƒ•ãƒˆã‚’è¿½åŠ ã—ã¦ä¸Šæ›¸ã
                const fixedShiftsToOverride = state.fixedShifts.filter(f => f.name === r.name);
                console.log('å›ºå®šã‚·ãƒ•ãƒˆå¯¾è±¡:', fixedShiftsToOverride);
                
                if (fixedShiftsToOverride.length > 0) {
                    const currentDate = new Date(startDate);
                    while (currentDate <= endDate) {
                        const dateStr = formatDate(currentDate);
                        const dayOfWeek = currentDate.getDay();
                        
                        fixedShiftsToOverride.forEach(fixed => {
                            if (fixed.dayOfWeek === dayOfWeek) {
                                const existingOverride = state.shifts.find(s => 
                                    s.date === dateStr && 
                                    s.fixedShiftOverride === fixed.id
                                );
                                
                                if (!existingOverride) {
                                    state.shifts.push({
                                        id: 'leave-override-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                                        date: dateStr,
                                        name: r.name,
                                        startHour: fixed.startHour,
                                        endHour: fixed.endHour,
                                        color: fixed.color,
                                        fixedShiftOverride: fixed.id,
                                        isLeaveOverride: true,
                                        hidden: true
                                    });
                                    console.log('å›ºå®šã‚·ãƒ•ãƒˆä¸Šæ›¸ãè¿½åŠ :', dateStr, fixed.name);
                                }
                            }
                        });
                        
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
            }
            
            saveToFirebase('shifts', state.shifts);
            saveToFirebase('leaveRequests', state.leaveRequests);
        }
    } else if (type === 'swap') {
        const r = state.swapRequests.find(x => x.id === id);
        if (r) {
            r.status = 'approved';
            r.approvedAt = processedAt;
            r.processedBy = processedBy;

            // ã‚·ãƒ•ãƒˆæƒ…å ±ã‚’å–å¾—ã—ã¦æ›´æ–°ï¼ˆå›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã‚‚å¯¾å¿œï¼‰
            let updated = false;

            if (r.shiftId && r.shiftId.startsWith('fx-')) {
                // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆ: fx-{originalId}-{dateStr} å½¢å¼
                // æ–°ã—ã„é€šå¸¸ã‚·ãƒ•ãƒˆã‚’ä½œæˆã—ã¦æ‹…å½“è€…ã‚’å¤‰æ›´
                const parts = r.shiftId.split('-');
                const originalId = parts[1];
                const dateStr = parts.slice(2).join('-');
                const fixed = state.fixedShifts.find(f => f.id === originalId);
                if (fixed) {
                    // å›ºå®šã‚·ãƒ•ãƒˆã‚’å…ƒã«æ–°ã—ã„é€šå¸¸ã‚·ãƒ•ãƒˆã‚’ä½œæˆ
                    const newShift = {
                        id: Date.now().toString(),
                        date: dateStr,
                        name: r.targetEmployee,
                        startHour: fixed.startHour,
                        endHour: fixed.endHour,
                        color: fixed.color,
                        overnight: fixed.overnight || false,
                        swapHistory: {
                            previousName: fixed.name,
                            newName: r.targetEmployee,
                            swappedAt: processedAt,
                            message: r.message
                        }
                    };
                    state.shifts.push(newShift);
                    updated = true;
                }
            } else if (r.shiftId) {
                // é€šå¸¸ã‚·ãƒ•ãƒˆã®å ´åˆ
                const s = state.shifts.find(x => x.id === r.shiftId);
                if (s) {
                    // äº¤ä»£å‰ã®æƒ…å ±ã‚’ä¿å­˜
                    s.swapHistory = {
                        previousName: s.name,
                        newName: r.targetEmployee,
                        swappedAt: processedAt,
                        message: r.message
                    };
                    // æ–°ã—ã„æ‹…å½“è€…ã«æ›´æ–°
                    s.name = r.targetEmployee;
                    updated = true;
                }
            }
            saveToFirebase('shifts', state.shifts);
            saveToFirebase('swapRequests', state.swapRequests);

            if (updated) {
                alert('ã‚·ãƒ•ãƒˆäº¤ä»£ã‚’æ‰¿èªã—ã¾ã—ãŸã€‚\\n' + r.fromEmployee + ' â†’ ' + r.targetEmployee + '\\nã‚·ãƒ•ãƒˆè¡¨ãŒæ›´æ–°ã•ã‚Œã¾ã—ãŸã€‚');
            } else {
                alert('æ‰¿èªã—ã¾ã—ãŸãŒã€ã‚·ãƒ•ãƒˆè¡¨ã®æ›´æ–°ã«å¤±æ•—ã—ã¾ã—ãŸã€‚\\nshiftId: ' + (r.shiftId || 'æœªè¨­å®š'));
            }
        }
    } else if (type === 'holiday') {
        const r = state.holidayRequests.find(x => x.id === id);
        if (r) {
            r.status = 'approved';
            r.approvedAt = processedAt;
            r.processedBy = processedBy;
            
            // é¸æŠžã‚·ãƒ•ãƒˆå½¢å¼ã®å ´åˆã€shiftTimesæƒ…å ±ã‚’ä½œæˆ
            if (r.selectedShifts && r.selectedShifts.length > 0) {
                r.shiftTimes = {};
                r.selectedShifts.forEach(shiftInfo => {
                    r.shiftTimes[shiftInfo.date] = {
                        startHour: shiftInfo.startHour,
                        endHour: shiftInfo.endHour,
                        overnight: shiftInfo.overnight || false
                    };
                });
            }
            
            saveToFirebase('holidayRequests', state.holidayRequests);
            alert('ä¼‘æ—¥ç”³è«‹ã‚’æ‰¿èªã—ã¾ã—ãŸã€‚');
        }
    }
    render(); renderAdminPanel(); updateMessageBar();
}
function rejectRequest(type, id) {
    const processedAt = new Date().toISOString();
    const processedBy = 'ç®¡ç†è€…';
    trackUsage('admin_reject', 'ç®¡ç†è€…');

    let arr, refName;
    if (type === 'change') {
        arr = state.changeRequests;
        refName = 'changeRequests';
    } else if (type === 'leave') {
        arr = state.leaveRequests;
        refName = 'leaveRequests';
    } else if (type === 'holiday') {
        arr = state.holidayRequests;
        refName = 'holidayRequests';
    } else {
        arr = state.swapRequests;
        refName = 'swapRequests';
    }
    const r = arr.find(x => x.id === id);
    if (r) {
        r.status = 'rejected';
        r.rejectedAt = processedAt;
        r.processedBy = processedBy;
        saveToFirebase(refName, arr);
    }
    renderAdminPanel(); updateMessageBar();
}

// ãƒŠãƒ“
function goToPrevWeek() { state.currentWeekStart.setDate(state.currentWeekStart.getDate() - 7); render(); fetchWeatherData(); }
function goToNextWeek() { state.currentWeekStart.setDate(state.currentWeekStart.getDate() + 7); render(); fetchWeatherData(); }

// èªè¨¼
function showPinModal() { document.getElementById('adminPin').value = ''; document.getElementById('pinError').style.display = 'none'; openModal(document.getElementById('pinModalOverlay')); }
function verifyPin(p) { return p === CONFIG.ADMIN_PIN; }
function switchToAdmin() { state.isAdmin = true; document.getElementById('roleToggle').classList.add('admin'); document.getElementById('roleText').textContent = 'ç®¡ç†è€…'; document.querySelector('.role-icon').textContent = 'ðŸ‘‘'; document.getElementById('adminPanel').style.display = 'block'; renderAdminPanel(); }
function switchToStaff() { state.isAdmin = false; document.getElementById('roleToggle').classList.remove('admin'); document.getElementById('roleText').textContent = 'ã‚¹ã‚¿ãƒƒãƒ•'; document.querySelector('.role-icon').textContent = 'ðŸ‘¤'; document.getElementById('adminPanel').style.display = 'none'; }
function toggleRole() { state.isAdmin ? switchToStaff() : showPinModal(); }

// ç®¡ç†è€…ã‚¿ãƒ–ã®é€šçŸ¥ãƒãƒƒã‚¸æ›´æ–°
function updateAdminBadges() {
    const changeCount = state.changeRequests.filter(r => r.status === 'pending').length;
    const swapCount = state.swapRequests.filter(r => r.status === 'pending').length;
    const leaveCount = state.leaveRequests.filter(r => r.status === 'pending').length;
    const holidayCount = state.holidayRequests.filter(r => r.status === 'pending').length;

    document.querySelectorAll('.admin-tab').forEach(tab => {
        // æ—¢å­˜ã®ãƒãƒƒã‚¸ã‚’å‰Šé™¤
        const existingBadge = tab.querySelector('.tab-badge');
        if (existingBadge) existingBadge.remove();

        let count = 0;
        if (tab.dataset.tab === 'shiftChanges') count = changeCount;
        else if (tab.dataset.tab === 'shiftSwaps') count = swapCount;
        else if (tab.dataset.tab === 'leaveRequests') count = leaveCount;
        else if (tab.dataset.tab === 'holidayRequests') count = holidayCount;

        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'tab-badge';
            badge.textContent = count;
            tab.appendChild(badge);
        }
    });
}

// å›ºå®šã‚·ãƒ•ãƒˆç®¡ç†ç”»é¢ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderFixedShiftManagement(container) {
    const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
    
    // å›ºå®šã‚·ãƒ•ãƒˆã‚’æ›œæ—¥ã§ã‚°ãƒ«ãƒ¼ãƒ—åŒ–
    const groupedByDay = {};
    for (let i = 0; i < 7; i++) {
        groupedByDay[i] = state.fixedShifts.filter(f => f.dayOfWeek === i);
    }
    
    // æœ‰åŠ¹/ç„¡åŠ¹ã‚’åˆ¤å®šã™ã‚‹é–¢æ•°
    const isActive = (f) => {
        const today = formatDate(new Date());
        if (f.startDate && today < f.startDate) return false;
        if (f.endDate && today > f.endDate) return false;
        return true;
    };
    
    // çµ±è¨ˆæƒ…å ±
    const totalFixed = state.fixedShifts.length;
    const activeFixed = state.fixedShifts.filter(isActive).length;
    const expiredFixed = state.fixedShifts.filter(f => f.endDate && formatDate(new Date()) > f.endDate).length;
    
    let html = `
        <div class="fixed-shift-management">
            <div class="fixed-shift-summary">
                <div class="summary-item">
                    <span class="summary-label">ç·å›ºå®šã‚·ãƒ•ãƒˆæ•°</span>
                    <span class="summary-value">${totalFixed}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">æœ‰åŠ¹</span>
                    <span class="summary-value active">${activeFixed}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">æœŸé™åˆ‡ã‚Œ</span>
                    <span class="summary-value expired">${expiredFixed}</span>
                </div>
            </div>
            
            <div class="fixed-shift-list">
    `;
    
    // æœˆæ›œæ—¥ã‹ã‚‰å§‹ã‚ã¦æ›œæ—¥ã”ã¨ã«è¡¨ç¤º
    const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // æœˆç«æ°´æœ¨é‡‘åœŸæ—¥
    
    dayOrder.forEach(dayIndex => {
        const shifts = groupedByDay[dayIndex];
        const dayName = dayNames[dayIndex];
        const dayClass = dayIndex === 0 ? 'sunday' : dayIndex === 6 ? 'saturday' : '';
        
        html += `
            <div class="fixed-shift-day-group">
                <h4 class="day-header ${dayClass}">${dayName}æ›œæ—¥ (${shifts.length}ä»¶)</h4>
        `;
        
        if (shifts.length === 0) {
            html += `<p class="no-shifts">å›ºå®šã‚·ãƒ•ãƒˆãªã—</p>`;
        } else {
            shifts.forEach(f => {
                const active = isActive(f);
                const statusClass = active ? 'active' : 'inactive';
                const statusText = active ? 'æœ‰åŠ¹' : (f.endDate && formatDate(new Date()) > f.endDate ? 'æœŸé™åˆ‡ã‚Œ' : 'é–‹å§‹å‰');
                
                const startDateStr = f.startDate ? f.startDate : 'æŒ‡å®šãªã—';
                const endDateStr = f.endDate ? f.endDate : 'ç„¡æœŸé™';
                
                html += `
                    <div class="fixed-shift-card ${statusClass}">
                        <div class="fixed-shift-color" style="background-color: ${f.color || '#6366f1'}"></div>
                        <div class="fixed-shift-info">
                            <div class="fixed-shift-name">${f.name}</div>
                            <div class="fixed-shift-time">
                                ${formatTime(f.startHour)} - ${formatTime(f.endHour)}
                                ${f.overnight ? '<span class="overnight-badge">ðŸŒ™å¤œå‹¤</span>' : ''}
                            </div>
                            <div class="fixed-shift-period">
                                <span class="period-label">æœ‰åŠ¹æœŸé–“:</span>
                                <span class="period-value">${startDateStr} ï½ž ${endDateStr}</span>
                            </div>
                        </div>
                        <div class="fixed-shift-status ${statusClass}">${statusText}</div>
                        <div class="fixed-shift-actions">
                            <button class="btn btn-secondary btn-sm" onclick="openEditFixedShiftModal('${f.id}')">âœï¸ ç·¨é›†</button>
                            <button class="btn btn-danger btn-sm" onclick="confirmDeleteFixedShift('${f.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `</div>`;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// å›ºå®šã‚·ãƒ•ãƒˆç·¨é›†ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openEditFixedShiftModal(id) {
    const f = state.fixedShifts.find(s => s.id === id);
    if (!f) return;
    
    // æ›œæ—¥ã‹ã‚‰æ—¥ä»˜ã‚’é€†ç®—ï¼ˆä»Šé€±ã®è©²å½“æ›œæ—¥ï¼‰
    const today = new Date();
    const currentDow = today.getDay();
    const diff = f.dayOfWeek - currentDow;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    document.getElementById('shiftModalTitle').textContent = 'å›ºå®šã‚·ãƒ•ãƒˆç·¨é›†';
    document.getElementById('shiftSubmitBtn').textContent = 'æ›´æ–°';
    document.getElementById('editShiftId').value = id;
    document.getElementById('shiftDate').value = formatDate(targetDate);
    updateShiftDateDay();
    document.getElementById('shiftName').value = f.name;
    document.getElementById('shiftStart').value = f.startHour;
    document.getElementById('shiftEnd').value = f.endHour;
    document.getElementById('overnightShift').checked = f.overnight || false;
    document.getElementById('fixedShift').checked = true;
    document.getElementById('fixedShift').disabled = true; // å›ºå®šã‚·ãƒ•ãƒˆç·¨é›†æ™‚ã¯ãƒã‚§ãƒƒã‚¯ã‚’å¤–ã›ãªã„ã‚ˆã†ã«
    
    // æœ‰åŠ¹æœŸé–“ã‚’è¨­å®š
    document.getElementById('fixedShiftPeriod').style.display = 'block';
    document.getElementById('fixedStartDate').value = f.startDate || '';
    document.getElementById('fixedEndDate').value = f.endDate || '';
    document.getElementById('fixedNoEndDate').checked = !f.endDate;
    document.getElementById('fixedEndDate').disabled = !f.endDate;
    
    // è‰²ã‚’è¨­å®š
    state.selectedColor = f.color || '#6366f1';
    document.querySelectorAll('.color-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.color === state.selectedColor);
    });
    
    openModal(document.getElementById('modalOverlay'));
}

// å›ºå®šã‚·ãƒ•ãƒˆå‰Šé™¤ç¢ºèª
function confirmDeleteFixedShift(id) {
    const f = state.fixedShifts.find(s => s.id === id);
    if (!f) return;
    
    const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
    if (confirm(`${f.name}ã•ã‚“ã®${dayNames[f.dayOfWeek]}æ›œæ—¥ã®å›ºå®šã‚·ãƒ•ãƒˆã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ\n\nâ€»ã“ã®æ“ä½œã¯å–ã‚Šæ¶ˆã›ã¾ã›ã‚“ã€‚`)) {
        deleteFixedShift(id);
        renderAdminPanel();
    }
}

// ç®¡ç†è€…ãƒ‘ãƒãƒ«
function renderAdminPanel() {
    updateAdminBadges();
    const c = document.getElementById('adminContent');
    c.innerHTML = '';
    
    // ãƒˆãƒ¬ãƒ³ãƒ‰ãƒ¬ãƒãƒ¼ãƒˆã‚¿ãƒ–ã®å ´åˆã¯max-heightã‚’è§£é™¤
    if (state.activeAdminTab === 'trendReports' || state.activeAdminTab === 'newProductReport') {
        c.classList.add('trend-reports-content');
    } else {
        c.classList.remove('trend-reports-content');
    }
    
    if (state.activeAdminTab === 'shiftChanges') {
        const reqs = state.changeRequests.filter(r => r.status === 'pending');
        if (!reqs.length) { c.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">æ‰¿èªå¾…ã¡ãªã—</p>'; return; }
        reqs.forEach(r => {
            const s = state.shifts.find(x => x.id === r.originalShiftId);
            const card = document.createElement('div'); card.className = 'request-card';
            card.innerHTML = `<div class="request-info"><h4>ðŸ”„ ã‚·ãƒ•ãƒˆå¤‰æ›´ç”³è«‹</h4><p>ç”³è«‹è€…: ${r.applicant || 'ä¸æ˜Ž'}</p><p>å¯¾è±¡ã‚·ãƒ•ãƒˆ: ${s?.name || 'ä¸æ˜Ž'} - ${s?.date || '?'} ${s?.startHour || '?'}:00-${s?.endHour || '?'}:00</p><p>å¤‰æ›´å¾Œ: ${r.newDate} ${r.newStartHour}:00-${r.newEndHour}:00</p><p>ç†ç”±: ${r.reason}</p></div><div class="request-actions"><button class="btn btn-success btn-sm" onclick="approveRequest('change','${r.id}')">æ‰¿èª</button><button class="btn btn-danger btn-sm" onclick="rejectRequest('change','${r.id}')">å´ä¸‹</button></div>`;
            c.appendChild(card);
        });
    } else if (state.activeAdminTab === 'shiftSwaps') {
        const reqs = state.swapRequests.filter(r => r.status === 'pending');
        if (!reqs.length) { c.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">æ‰¿èªå¾…ã¡ãªã—</p>'; return; }
        reqs.forEach(r => {
            // ã‚·ãƒ•ãƒˆæƒ…å ±ã‚’å–å¾—ï¼ˆå›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã‚‚å¯¾å¿œï¼‰
            let shiftInfo = null;
            if (r.shiftId && r.shiftId.startsWith('fx-')) {
                const parts = r.shiftId.split('-');
                const originalId = parts[1];
                const dateStr = parts.slice(2).join('-');
                const fixed = state.fixedShifts.find(f => f.id === originalId);
                if (fixed) {
                    shiftInfo = { date: dateStr, startHour: fixed.startHour, endHour: fixed.endHour };
                }
            } else {
                const s = state.shifts.find(x => x.id === r.shiftId);
                if (s) {
                    shiftInfo = { date: s.date, startHour: s.startHour, endHour: s.endHour };
                }
            }
            const dateDisplay = shiftInfo?.date || '?';
            const timeDisplay = shiftInfo ? `${formatTime(shiftInfo.startHour)}-${formatTime(shiftInfo.endHour)}` : '?:00-?:00';
            const card = document.createElement('div'); card.className = 'request-card';
            card.innerHTML = `<div class="request-info"><h4>ðŸ¤ ã‚·ãƒ•ãƒˆäº¤æ›ä¾é ¼</h4><p>ç”³è«‹è€…: ${r.applicant || 'ä¸æ˜Ž'}</p><p>ã‚·ãƒ•ãƒˆ: ${dateDisplay} ${timeDisplay}</p><p>ç¾åœ¨ã®æ‹…å½“: ${r.fromEmployee} â†’ äº¤ä»£å…ˆ: ${r.targetEmployee}</p><p>ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸: ${r.message}</p></div><div class="request-actions"><button class="btn btn-success btn-sm" onclick="approveRequest('swap','${r.id}')">æ‰¿èª</button><button class="btn btn-danger btn-sm" onclick="rejectRequest('swap','${r.id}')">å´ä¸‹</button></div>`;
            c.appendChild(card);
        });
    } else if (state.activeAdminTab === 'leaveRequests') {
        const reqs = state.leaveRequests.filter(r => r.status === 'pending');
        if (!reqs.length) { c.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">æ‰¿èªå¾…ã¡ãªã—</p>'; return; }
        reqs.forEach(r => {
            const card = document.createElement('div'); card.className = 'request-card';
            
            // é¸æŠžã•ã‚ŒãŸã‚·ãƒ•ãƒˆæƒ…å ±ã‚’è¡¨ç¤º
            let shiftsHtml = '';
            if (r.selectedShifts && r.selectedShifts.length > 0) {
                const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
                shiftsHtml = '<div class="selected-shifts-list">' + 
                    r.selectedShifts.map(s => {
                        const d = new Date(s.date);
                        const badges = [];
                        if (s.isFixed) badges.push('<span class="shift-badge fixed">å›ºå®š</span>');
                        if (s.overnight) badges.push('<span class="shift-badge overnight">å¤œå‹¤</span>');
                        return `<div class="shift-item">${d.getMonth() + 1}/${d.getDate()}ï¼ˆ${dayNames[d.getDay()]}ï¼‰${formatTime(s.startHour)}-${formatTime(s.endHour)} ${badges.join('')}</div>`;
                    }).join('') + 
                '</div>';
            } else {
                // å¾“æ¥ã®é–‹å§‹æ—¥ã€œçµ‚äº†æ—¥å½¢å¼
                shiftsHtml = `<p>æœŸé–“: ${r.startDate} ã€œ ${r.endDate}</p>`;
            }
            
            card.innerHTML = `<div class="request-info"><h4>ðŸ–ï¸ ${r.name} - æœ‰çµ¦ç”³è«‹</h4>${shiftsHtml}<p>ç†ç”±: ${r.reason || 'æœ‰çµ¦ä¼‘æš‡'}</p></div><div class="request-actions"><button class="btn btn-success btn-sm" onclick="approveRequest('leave','${r.id}')">æ‰¿èª</button><button class="btn btn-danger btn-sm" onclick="rejectRequest('leave','${r.id}')">å´ä¸‹</button></div>`;
            c.appendChild(card);
        });
    } else if (state.activeAdminTab === 'holidayRequests') {
        const reqs = state.holidayRequests.filter(r => r.status === 'pending');
        if (!reqs.length) { c.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">æ‰¿èªå¾…ã¡ãªã—</p>'; return; }
        reqs.forEach(r => {
            const card = document.createElement('div'); card.className = 'request-card';
            
            // é¸æŠžã•ã‚ŒãŸã‚·ãƒ•ãƒˆæƒ…å ±ã‚’è¡¨ç¤º
            let shiftsHtml = '';
            if (r.selectedShifts && r.selectedShifts.length > 0) {
                const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
                shiftsHtml = '<div class="selected-shifts-list">' + 
                    r.selectedShifts.map(s => {
                        const d = new Date(s.date);
                        const badges = [];
                        if (s.isFixed) badges.push('<span class="shift-badge fixed">å›ºå®š</span>');
                        if (s.overnight) badges.push('<span class="shift-badge overnight">å¤œå‹¤</span>');
                        const timeDisplay = s.originalStartHour !== undefined && (s.startHour !== s.originalStartHour || s.endHour !== s.originalEndHour) 
                            ? `${formatTime(s.startHour)}-${formatTime(s.endHour)} <span class="custom-time">(å…ƒ: ${formatTime(s.originalStartHour)}-${formatTime(s.originalEndHour)})</span>`
                            : `${formatTime(s.startHour)}-${formatTime(s.endHour)}`;
                        return `<div class="shift-item">${d.getMonth() + 1}/${d.getDate()}ï¼ˆ${dayNames[d.getDay()]}ï¼‰${timeDisplay} ${badges.join('')}</div>`;
                    }).join('') + 
                '</div>';
            } else {
                // å¾“æ¥ã®é–‹å§‹æ—¥ã€œçµ‚äº†æ—¥å½¢å¼
                shiftsHtml = `<p>æœŸé–“: ${r.startDate} ã€œ ${r.endDate}</p>`;
            }
            
            let swapInfo = r.swapRequested && r.swapPartner ? `<p>ã‚·ãƒ•ãƒˆäº¤ä»£: ${r.swapPartner}ã•ã‚“ã¨äº¤ä»£</p>` : '<p>ã‚·ãƒ•ãƒˆäº¤ä»£: ãªã—</p>';
            card.innerHTML = `<div class="request-info"><h4>ðŸ  ${r.name} - ä¼‘æ—¥ç”³è«‹</h4>${shiftsHtml}${swapInfo}<p>ç†ç”±: ${r.reason}</p></div><div class="request-actions"><button class="btn btn-success btn-sm" onclick="approveRequest('holiday','${r.id}')">æ‰¿èª</button><button class="btn btn-danger btn-sm" onclick="rejectRequest('holiday','${r.id}')">å´ä¸‹</button></div>`;
            c.appendChild(card);
        });
    } else if (state.activeAdminTab === 'specialEvents') {
        // 臨時シフト管理
        renderSpecialEventManagement(c);
    } else if (state.activeAdminTab === 'fixedShiftManage') {
        // å›ºå®šã‚·ãƒ•ãƒˆç®¡ç†
        renderFixedShiftManagement(c);
    } else if (state.activeAdminTab === 'employees') {
        c.innerHTML = `<div style="margin-bottom:16px"><button class="btn btn-primary btn-sm" onclick="openAddEmployeeModal()">+ å¾“æ¥­å“¡è¿½åŠ </button></div><div class="employee-list" id="employeeList"></div>`;
        const list = document.getElementById('employeeList');
        const roleNames = { staff: 'ã‚¹ã‚¿ãƒƒãƒ•', shiftLeader: 'ã‚·ãƒ•ãƒˆãƒªãƒ¼ãƒ€ãƒ¼', employee: 'ç¤¾å“¡', manager: 'ãƒžãƒãƒ¼ã‚¸ãƒ£ãƒ¼', leader: 'ãƒªãƒ¼ãƒ€ãƒ¼' };
        const shiftNames = { day: 'æ—¥å‹¤', evening: 'å¤•å‹¤', night: 'å¤œå‹¤' };
        state.employees.forEach(e => {
            const card = document.createElement('div'); card.className = 'employee-card';
            const roleName = roleNames[e.role] || e.role;
            const shiftName = shiftNames[e.shiftTime] || '';

            // ç™ºæ³¨æ‹…å½“åˆ†é¡žã‚¿ã‚°ã‚’ç”Ÿæˆ
            let orderCategoriesHtml = '';
            if (e.orderCategories && e.orderCategories.length > 0) {
                orderCategoriesHtml = `<div class="order-categories-display">${e.orderCategories.map(cat => `<span class="order-category-tag">${cat}</span>`).join('')}</div>`;
            }

            card.innerHTML = `<div class="employee-info"><div class="employee-avatar">${e.name.charAt(0)}</div><div><div class="employee-name">${e.name}</div><div class="employee-role">${roleName}${shiftName ? ' / ' + shiftName : ''}</div>${orderCategoriesHtml}</div></div><div class="employee-actions"><button class="btn btn-secondary btn-sm" onclick="openEditEmployeeModal('${e.id}')">âœï¸ ç·¨é›†</button><button class="btn btn-danger btn-sm" onclick="deleteEmployee('${e.id}')">å‰Šé™¤</button></div>`;
            list.appendChild(card);
        });
    } else if (state.activeAdminTab === 'broadcast') {
        c.innerHTML = `<div style="text-align:center;padding:20px"><p style="margin-bottom:16px;color:var(--text-secondary)">å…¨å¾“æ¥­å“¡ã«ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’é€ä¿¡</p><button class="btn btn-primary" onclick="openModal(document.getElementById('broadcastModalOverlay'))">ðŸ“¢ ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ä½œæˆ</button></div>`;
    } else if (state.activeAdminTab === 'settings') {
        c.innerHTML = `<div style="text-align:center;padding:20px"><p style="margin-bottom:16px;color:var(--text-secondary)">ç®¡ç†è€…è¨­å®š</p><button class="btn btn-primary" onclick="openModal(document.getElementById('changePinModalOverlay'))">ðŸ”‘ æš—è¨¼ç•ªå·ã‚’å¤‰æ›´</button></div>`;
    } else if (state.activeAdminTab === 'dailyEvents') {
        // åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç®¡ç†
        const icons = getEventTypeIcons();
        const typeNames = { sale: 'ã‚»ãƒ¼ãƒ«', notice: 'é€£çµ¡äº‹é …', training: 'ç ”ä¿®', inventory: 'æ£šå¸', delivery: 'ç‰¹ç™ºç´å“', other: 'ãã®ä»–' };

        // ç¾åœ¨ã®ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼çŠ¶æ…‹ã‚’å–å¾—ï¼ˆåˆæœŸå€¤ã¯'all'ï¼‰
        const currentFilter = state.eventTypeFilter || 'all';

        c.innerHTML = `
            <div class="daily-events-header">
                <h3>ðŸ“… åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ç®¡ç†</h3>
                <button class="btn btn-primary btn-sm" onclick="openEventModal()">+ ã‚¤ãƒ™ãƒ³ãƒˆè¿½åŠ </button>
            </div>
            <div class="filter-tabs" id="eventFilterTabs">
                <button class="filter-tab ${currentFilter === 'all' ? 'active' : ''}" data-filter="all" onclick="filterEventsByType('all')">ã™ã¹ã¦</button>
                ${Object.entries(typeNames).map(([key, name]) =>
            `<button class="filter-tab ${currentFilter === key ? 'active' : ''}" data-filter="${key}" onclick="filterEventsByType('${key}')">${icons[key]} ${name}</button>`
        ).join('')}
            </div>
            <div class="daily-events-list" id="dailyEventsList"></div>
        `;

        const list = document.getElementById('dailyEventsList');

        // ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°ã—ã¦é–‹å§‹æ—¥é †ã«ã‚½ãƒ¼ãƒˆ
        let filteredEvents = [...state.dailyEvents];
        if (currentFilter !== 'all') {
            filteredEvents = filteredEvents.filter(e => e.type === currentFilter);
        }
        const sortedEvents = filteredEvents.sort((a, b) => {
            const aDate = a.startDate || a.date;
            const bDate = b.startDate || b.date;
            return new Date(aDate) - new Date(bDate);
        });

        if (sortedEvents.length === 0) {
            list.innerHTML = '<p class="no-events-message">ç™»éŒ²ã•ã‚Œã¦ã„ã‚‹ã‚¤ãƒ™ãƒ³ãƒˆã¯ã‚ã‚Šã¾ã›ã‚“</p>';
        } else {
            sortedEvents.forEach(e => {
                const icon = icons[e.type] || icons.other;
                const typeName = typeNames[e.type] || 'ãã®ä»–';
                const startDate = e.startDate || e.date;
                const endDate = e.endDate || e.date;
                const startObj = new Date(startDate);
                const endObj = new Date(endDate);
                const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];

                // æœŸé–“è¡¨ç¤ºï¼ˆåŒã˜æ—¥ãªã‚‰1æ—¥ã®ã¿ã€é•ã†æ—¥ãªã‚‰æœŸé–“è¡¨ç¤ºï¼‰
                let dateDisplay;
                if (startDate === endDate) {
                    dateDisplay = `${startObj.getMonth() + 1}/${startObj.getDate()}ï¼ˆ${dayNames[startObj.getDay()]}ï¼‰`;
                } else {
                    dateDisplay = `${startObj.getMonth() + 1}/${startObj.getDate()} ã€œ ${endObj.getMonth() + 1}/${endObj.getDate()}`;
                }

                const card = document.createElement('div');
                card.className = 'daily-event-card';
                card.innerHTML = `
                    <div class="event-info">
                        <div class="event-header">
                            <span class="event-date">${dateDisplay}</span>
                            <span class="event-type-icon">${icon}</span>
                            <span class="event-title">${e.title}</span>
                        </div>
                        ${e.description ? `<div class="event-description">${e.description}</div>` : ''}
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-secondary btn-sm" onclick="openEditEventModal('${e.id}')">âœï¸ ç·¨é›†</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDeleteEvent('${e.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                    </div>
                `;
                list.appendChild(card);
            });
        }
    } else if (state.activeAdminTab === 'nonDailyAdvice') {
        // éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç®¡ç†
        renderNonDailyAdminPanel(c);
    } else if (state.activeAdminTab === 'feedbackStats') {
        // ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯é›†è¨ˆ
        renderFeedbackStats(c);
    } else if (state.activeAdminTab === 'productCategories') {
        // å•†å“åˆ†é¡žç®¡ç†
        renderProductCategoriesPanel(c);
    } else if (state.activeAdminTab === 'trendReports') {
        // ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆç®¡ç†
        renderTrendReportsAdmin(c);
    } else if (state.activeAdminTab === 'newProductReport') {
        // é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ç®¡ç†
        renderNewProductReportAdmin(c);
    } else if (state.activeAdminTab === 'usageStats') {
        // åˆ©ç”¨çµ±è¨ˆ
        renderUsageStats(c);
    } else if (state.activeAdminTab === 'history') {
        renderRequestHistory(c);
    }
}

// å±¥æ­´è¡¨ç¤ºé–¢æ•°
function renderRequestHistory(container) {
    // å‡¦ç†æ¸ˆã¿ã®ç”³è«‹ã‚’å…¨ã¦å–å¾—
    const changeHistory = state.changeRequests.filter(r => r.status === 'approved' || r.status === 'rejected');
    const swapHistory = state.swapRequests.filter(r => r.status === 'approved' || r.status === 'rejected');
    const leaveHistory = state.leaveRequests.filter(r => r.status === 'approved' || r.status === 'rejected');
    const holidayHistory = state.holidayRequests.filter(r => r.status === 'approved' || r.status === 'rejected');

    // å…¨ã¦ã®å±¥æ­´ã‚’ä¸€ã¤ã®é…åˆ—ã«ã¾ã¨ã‚ã€å‡¦ç†æ—¥æ™‚ã§é™é †ã‚½ãƒ¼ãƒˆ
    const allHistory = [
        ...changeHistory.map(r => ({ ...r, type: 'change', processedAt: r.approvedAt || r.rejectedAt || r.createdAt })),
        ...swapHistory.map(r => ({ ...r, type: 'swap', processedAt: r.approvedAt || r.rejectedAt || r.createdAt })),
        ...leaveHistory.map(r => ({ ...r, type: 'leave', processedAt: r.approvedAt || r.rejectedAt || r.createdAt })),
        ...holidayHistory.map(r => ({ ...r, type: 'holiday', processedAt: r.approvedAt || r.rejectedAt || r.createdAt }))
    ].sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt));

    if (!allHistory.length) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">å‡¦ç†æ¸ˆã¿ã®ç”³è«‹å±¥æ­´ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }

    // ãƒ•ã‚£ãƒ«ã‚¿ãƒœã‚¿ãƒ³ã‚’è¿½åŠ 
    container.innerHTML = `
        <div class="history-filters" style="margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sm history-filter-btn active" data-filter="all">ã™ã¹ã¦ (${allHistory.length})</button>
            <button class="btn btn-sm history-filter-btn" data-filter="change">ã‚·ãƒ•ãƒˆå¤‰æ›´ (${changeHistory.length})</button>
            <button class="btn btn-sm history-filter-btn" data-filter="swap">ã‚·ãƒ•ãƒˆäº¤ä»£ (${swapHistory.length})</button>
            <button class="btn btn-sm history-filter-btn" data-filter="leave">æœ‰çµ¦ç”³è«‹ (${leaveHistory.length})</button>
            <button class="btn btn-sm history-filter-btn" data-filter="holiday">ä¼‘æ—¥ç”³è«‹ (${holidayHistory.length})</button>
        </div>
        <div id="historyList"></div>
    `;

    const listEl = document.getElementById('historyList');

    // ãƒ•ã‚£ãƒ«ã‚¿ãƒœã‚¿ãƒ³ã®ã‚¤ãƒ™ãƒ³ãƒˆ
    container.querySelectorAll('.history-filter-btn').forEach(btn => {
        btn.onclick = () => {
            container.querySelectorAll('.history-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderHistoryItems(listEl, allHistory, btn.dataset.filter);
        };
    });

    // åˆæœŸè¡¨ç¤º
    renderHistoryItems(listEl, allHistory, 'all');
}

// å±¥æ­´ã‚¢ã‚¤ãƒ†ãƒ ã®ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderHistoryItems(container, allHistory, filter) {
    const filtered = filter === 'all' ? allHistory : allHistory.filter(h => h.type === filter);

    if (!filtered.length) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">è©²å½“ã™ã‚‹å±¥æ­´ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }

    container.innerHTML = '';

    filtered.forEach(h => {
        const card = document.createElement('div');
        card.className = `request-card history-card ${h.status}`;

        // ã‚¹ãƒ†ãƒ¼ã‚¿ã‚¹ãƒãƒƒã‚¸
        const statusBadge = h.status === 'approved'
            ? '<span class="status-badge approved">âœ… æ‰¿èªæ¸ˆã¿</span>'
            : '<span class="status-badge rejected">âŒ å´ä¸‹</span>';

        // å‡¦ç†æ—¥æ™‚
        const processedAtStr = h.approvedAt || h.rejectedAt
            ? formatDateTime(h.approvedAt || h.rejectedAt)
            : 'ä¸æ˜Ž';

        // ç”³è«‹æ—¥æ™‚
        const createdAtStr = h.createdAt ? formatDateTime(h.createdAt) : 'ä¸æ˜Ž';

        // å‡¦ç†è€…
        const processedByStr = h.processedBy || 'ç®¡ç†è€…';

        let content = '';

        if (h.type === 'change') {
            content = `
                <div class="request-info">
                    <h4>ðŸ”„ ã‚·ãƒ•ãƒˆå¤‰æ›´ç”³è«‹ ${statusBadge}</h4>
                    <p><strong>ç”³è«‹è€…:</strong> ${h.applicant || 'ä¸æ˜Ž'}</p>
                    <p><strong>å¤‰æ›´å¾Œ:</strong> ${h.newDate} ${h.newStartHour}:00-${h.newEndHour}:00</p>
                    <p><strong>ç†ç”±:</strong> ${h.reason}</p>
                    <div class="history-meta">
                        <p>ðŸ“… ç”³è«‹æ—¥æ™‚: ${createdAtStr}</p>
                        <p>âœï¸ å‡¦ç†æ—¥æ™‚: ${processedAtStr}</p>
                        <p>ðŸ‘¤ å‡¦ç†è€…: ${processedByStr}</p>
                    </div>
                </div>
            `;
        } else if (h.type === 'swap') {
            content = `
                <div class="request-info">
                    <h4>ðŸ¤ ã‚·ãƒ•ãƒˆäº¤ä»£ä¾é ¼ ${statusBadge}</h4>
                    <p><strong>ç”³è«‹è€…:</strong> ${h.applicant || 'ä¸æ˜Ž'}</p>
                    <p><strong>äº¤ä»£:</strong> ${h.fromEmployee} â†’ ${h.targetEmployee}</p>
                    <p><strong>ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸:</strong> ${h.message}</p>
                    <div class="history-meta">
                        <p>ðŸ“… ç”³è«‹æ—¥æ™‚: ${createdAtStr}</p>
                        <p>âœï¸ å‡¦ç†æ—¥æ™‚: ${processedAtStr}</p>
                        <p>ðŸ‘¤ å‡¦ç†è€…: ${processedByStr}</p>
                    </div>
                </div>
            `;
        } else if (h.type === 'leave') {
            content = `
                <div class="request-info">
                    <h4>ðŸ–ï¸ æœ‰çµ¦ç”³è«‹ ${statusBadge}</h4>
                    <p><strong>ç”³è«‹è€…:</strong> ${h.name || 'ä¸æ˜Ž'}</p>
                    <p><strong>æœŸé–“:</strong> ${h.startDate} ã€œ ${h.endDate}</p>
                    <p><strong>ç†ç”±:</strong> ${h.reason}</p>
                    <div class="history-meta">
                        <p>ðŸ“… ç”³è«‹æ—¥æ™‚: ${createdAtStr}</p>
                        <p>âœï¸ å‡¦ç†æ—¥æ™‚: ${processedAtStr}</p>
                        <p>ðŸ‘¤ å‡¦ç†è€…: ${processedByStr}</p>
                    </div>
                </div>
            `;
        } else if (h.type === 'holiday') {
            let swapInfo = h.swapRequested && h.swapPartner ? `<p><strong>ã‚·ãƒ•ãƒˆäº¤ä»£:</strong> ${h.swapPartner}ã•ã‚“ã¨äº¤ä»£</p>` : '';
            content = `
                <div class="request-info">
                    <h4>ðŸ  ä¼‘æ—¥ç”³è«‹ ${statusBadge}</h4>
                    <p><strong>ç”³è«‹è€…:</strong> ${h.name || 'ä¸æ˜Ž'}</p>
                    <p><strong>æœŸé–“:</strong> ${h.startDate} ã€œ ${h.endDate}</p>
                    ${swapInfo}
                    <p><strong>ç†ç”±:</strong> ${h.reason}</p>
                    <div class="history-meta">
                        <p>ðŸ“… ç”³è«‹æ—¥æ™‚: ${createdAtStr}</p>
                        <p>âœï¸ å‡¦ç†æ—¥æ™‚: ${processedAtStr}</p>
                        <p>ðŸ‘¤ å‡¦ç†è€…: ${processedByStr}</p>
                    </div>
                </div>
            `;
        }

        card.innerHTML = content;
        container.appendChild(card);
    });
}

// ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸è¡¨ç¤º
function renderMessages() {
    const c = document.getElementById('messagesContent');
    const all = [...state.messages.map(m => ({ ...m, type: 'message' })), ...state.swapRequests.filter(r => r.status === 'pending').map(r => ({ ...r, type: 'swap' }))].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!all.length) { c.innerHTML = '<p style="color:var(--text-muted);text-align:center">ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ãªã—</p>'; return; }

    // ãƒ˜ãƒƒãƒ€ãƒ¼ã«å…¨å‰Šé™¤ãƒœã‚¿ãƒ³ã‚’è¿½åŠ 
    c.innerHTML = '<div style="text-align:right;margin-bottom:12px;"><button class="btn btn-danger btn-sm" onclick="clearAllMessages()">ðŸ—‘ï¸ å…¨ã¦ã®ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’å‰Šé™¤</button></div>';

    all.forEach(m => {
        const card = document.createElement('div'); card.className = 'message-card' + (!m.read ? ' unread' : '');
        if (m.type === 'message') {
            card.innerHTML = `<div class="message-header"><span class="message-from">${m.from}</span><span class="message-date">${formatDateTime(m.createdAt)}</span></div><div class="message-content"><strong>${m.title}</strong><br>${m.content}</div><div class="message-actions"><button class="btn btn-danger btn-sm" onclick="deleteMessage('${m.id}')">å‰Šé™¤</button></div>`;
            card.onclick = (e) => { if (e.target.tagName !== 'BUTTON') { m.read = true; saveToFirebase('messages', state.messages); updateMessageBar(); renderMessages(); } };
        } else {
            // ã‚·ãƒ•ãƒˆæƒ…å ±ã‚’å–å¾—ï¼ˆå›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã‚‚å¯¾å¿œï¼‰
            let shiftInfo = null;
            if (m.shiftId && m.shiftId.startsWith('fx-')) {
                // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆ: fx-{originalId}-{dateStr} å½¢å¼
                const parts = m.shiftId.split('-');
                const originalId = parts[1];
                const dateStr = parts.slice(2).join('-');
                const fixed = state.fixedShifts.find(f => f.id === originalId);
                if (fixed) {
                    shiftInfo = { date: dateStr, startHour: fixed.startHour, endHour: fixed.endHour };
                }
            } else {
                const s = state.shifts.find(x => x.id === m.shiftId);
                if (s) {
                    shiftInfo = { date: s.date, startHour: s.startHour, endHour: s.endHour };
                }
            }
            const dateDisplay = shiftInfo?.date || '?';
            const timeDisplay = shiftInfo ? `${formatTime(shiftInfo.startHour)}-${formatTime(shiftInfo.endHour)}` : '?:00-?:00';
            card.innerHTML = `<div class="message-header"><span class="message-from">ðŸ¤ ã‚·ãƒ•ãƒˆäº¤ä»£ä¾é ¼</span><span class="message-date">${formatDateTime(m.createdAt)}</span></div><div class="message-content"><strong>${m.fromEmployee}</strong>ã•ã‚“ã‹ã‚‰ã€<strong>${m.targetEmployee}</strong>ã•ã‚“ã¸ã®ä¾é ¼<br>ã‚·ãƒ•ãƒˆ: ${dateDisplay} ${timeDisplay}<br>${m.message}</div><div class="message-actions"><button class="btn btn-success btn-sm" onclick="approveRequest('swap','${m.id}')">äº¤ä»£ã™ã‚‹</button><button class="btn btn-danger btn-sm" onclick="rejectRequest('swap','${m.id}')">ãŠæ–­ã‚Š</button></div>`;
        }
        c.appendChild(card);
    });
}

// ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸å‰Šé™¤
function deleteMessage(id) {
    state.messages = state.messages.filter(m => m.id !== id);
    saveToFirebase('messages', state.messages);
    updateMessageBar();
    renderMessages();
}

// å…¨ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸å‰Šé™¤
function clearAllMessages() {
    if (confirm('å…¨ã¦ã®ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ')) {
        state.messages = [];
        saveToFirebase('messages', state.messages);
        updateMessageBar();
        renderMessages();
        alert('å…¨ã¦ã®ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’å‰Šé™¤ã—ã¾ã—ãŸã€‚');
    }
}

function render() { renderTimeHeader(); renderGanttBody(); renderLegend(); updatePeriodDisplay(); updateMessageBar(); renderScheduleList(); }

// ãƒ¢ãƒ¼ãƒ€ãƒ«æ“ä½œ
function openModal(o) { o.classList.add('active'); }
function closeModal(o) { 
    o.classList.remove('active'); 
    // ã‚·ãƒ•ãƒˆãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‰ã˜ã‚‹æ™‚ã«å›ºå®šã‚·ãƒ•ãƒˆé–¢é€£ã‚’ãƒªã‚»ãƒƒãƒˆ
    if (o.id === 'modalOverlay') {
        document.getElementById('fixedShift').disabled = false;
        document.getElementById('fixedShiftPeriod').style.display = 'none';
    }
}

function openEditShiftModal(s) {
    // å›ºå®šã‚·ãƒ•ãƒˆã‚„å¤œå‹¤ç¶™ç¶šã®å ´åˆã€å…ƒã®ã‚·ãƒ•ãƒˆã‚’å–å¾—
    let actualShift = s;
    let actualId = s.id;

    if (s.isFixed) {
        // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆï¼ˆIDãŒ fx-123-date ã¾ãŸã¯ fxo-123-date å½¢å¼ï¼‰
        const parts = s.id.split('-');
        const originalId = parts[1];
        const original = state.fixedShifts.find(f => f.id === originalId);
        if (original) {
            actualShift = { ...original, date: s.date };
            actualId = originalId;
        }
    } else if (s.isOvernightContinuation && s.id.startsWith('on-')) {
        // å¤œå‹¤ç¶™ç¶šã®å ´åˆï¼ˆIDãŒ on-123 å½¢å¼ï¼‰
        const originalId = s.id.replace('on-', '');
        const original = state.shifts.find(x => x.id === originalId);
        if (original) {
            actualShift = original;
            actualId = originalId;
        }
    }

    state.editingShiftId = actualId;
    document.getElementById('shiftModalTitle').textContent = s.isFixed ? 'å›ºå®šã‚·ãƒ•ãƒˆç·¨é›†' : 'ã‚·ãƒ•ãƒˆç·¨é›†';
    document.getElementById('shiftSubmitBtn').textContent = 'æ›´æ–°';
    document.getElementById('editShiftId').value = actualId;
    document.getElementById('shiftDate').value = actualShift.date || s.date;
    updateShiftDateDay();
    document.getElementById('shiftName').value = actualShift.name;
    document.getElementById('shiftStart').value = actualShift.startHour;
    document.getElementById('shiftEnd').value = actualShift.endHour;
    document.getElementById('overnightShift').checked = actualShift.overnight || false;
    document.getElementById('fixedShift').checked = s.isFixed || false;
    
    // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã¯æœ‰åŠ¹æœŸé–“ã‚»ã‚¯ã‚·ãƒ§ãƒ³ã‚’è¡¨ç¤ºã—ã€å€¤ã‚’è¨­å®š
    const fixedShiftPeriod = document.getElementById('fixedShiftPeriod');
    if (s.isFixed) {
        fixedShiftPeriod.style.display = 'block';
        document.getElementById('fixedShift').disabled = true; // å›ºå®šã‚·ãƒ•ãƒˆç·¨é›†æ™‚ã¯ãƒã‚§ãƒƒã‚¯ã‚’å¤–ã›ãªã„
        document.getElementById('fixedStartDate').value = actualShift.startDate || '';
        if (actualShift.endDate) {
            document.getElementById('fixedNoEndDate').checked = false;
            document.getElementById('fixedEndDate').value = actualShift.endDate;
            document.getElementById('fixedEndDate').disabled = false;
        } else {
            document.getElementById('fixedNoEndDate').checked = true;
            document.getElementById('fixedEndDate').value = '';
            document.getElementById('fixedEndDate').disabled = true;
        }
    } else {
        fixedShiftPeriod.style.display = 'none';
        document.getElementById('fixedShift').disabled = false; // é€šå¸¸ã‚·ãƒ•ãƒˆç·¨é›†æ™‚ã¯å›ºå®šã‚·ãƒ•ãƒˆã«å¤‰æ›å¯èƒ½
        document.getElementById('fixedStartDate').value = actualShift.date || s.date;
        document.getElementById('fixedNoEndDate').checked = true;
        document.getElementById('fixedEndDate').value = '';
        document.getElementById('fixedEndDate').disabled = true;
    }
    
    document.querySelectorAll('.color-option').forEach(o => { o.classList.toggle('selected', o.dataset.color === actualShift.color); });
    state.selectedColor = actualShift.color;
    openModal(document.getElementById('modalOverlay'));
}

function openChangeModal() {
    const sel = document.getElementById('changeShiftSelect');
    sel.innerHTML = '<option value="">å…ˆã«ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</option>';

    // ç”³è«‹è€…ã‚’é¸æŠžæ™‚ã«ã‚·ãƒ•ãƒˆã‚’ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°
    document.getElementById('changeApplicant').value = '';

    document.getElementById('changeDate').value = formatDate(new Date());
    document.getElementById('changeStart').value = 9;
    document.getElementById('changeEnd').value = 17;
    openModal(document.getElementById('changeModalOverlay'));
}

// ç”³è«‹è€…ã«è©²å½“ã™ã‚‹ã‚·ãƒ•ãƒˆã®ã¿ã‚’ãƒ‰ãƒ­ãƒƒãƒ—ãƒ€ã‚¦ãƒ³ã«è¡¨ç¤º
function updateChangeShiftOptions(applicantName) {
    const sel = document.getElementById('changeShiftSelect');
    sel.innerHTML = '<option value="">é¸æŠžã—ã¦ãã ã•ã„</option>';

    if (!applicantName) {
        sel.innerHTML = '<option value="">å…ˆã«ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</option>';
        return;
    }

    // é€šå¸¸ã‚·ãƒ•ãƒˆã‚’è¿½åŠ ï¼ˆç”³è«‹è€…ã®ã¿ï¼‰
    state.shifts.filter(s => s.name === applicantName).forEach(s => {
        const o = document.createElement('option');
        o.value = s.id;
        o.textContent = `${s.date} ${formatTime(s.startHour)}-${formatTime(s.endHour)}`;
        sel.appendChild(o);
    });

    // ç¾åœ¨ã®é€±ã®å›ºå®šã‚·ãƒ•ãƒˆã‚‚è¿½åŠ ï¼ˆç”³è«‹è€…ã®ã¿ï¼‰
    for (let i = 0; i < 7; i++) {
        const d = new Date(state.currentWeekStart);
        d.setDate(d.getDate() + i);
        const dateStr = formatDate(d);
        const dayOfWeek = d.getDay();
        state.fixedShifts.filter(f => f.dayOfWeek === dayOfWeek && f.name === applicantName).forEach(f => {
            const virtualId = `fx-${f.id}-${dateStr}`;
            const o = document.createElement('option');
            o.value = virtualId;
            o.textContent = `${dateStr} ${formatTime(f.startHour)}-${formatTime(f.endHour)} [å›ºå®š]`;
            sel.appendChild(o);
        });
    }
}

function openSwapModal() {
    const sel = document.getElementById('swapShiftSelect');
    sel.innerHTML = '<option value="">å…ˆã«ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</option>';

    // ç”³è«‹è€…ã‚’é¸æŠžæ™‚ã«ã‚·ãƒ•ãƒˆã‚’ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°
    document.getElementById('swapApplicant').value = '';

    openModal(document.getElementById('swapModalOverlay'));
}

// ç”³è«‹è€…ã«è©²å½“ã™ã‚‹ã‚·ãƒ•ãƒˆã®ã¿ã‚’ãƒ‰ãƒ­ãƒƒãƒ—ãƒ€ã‚¦ãƒ³ã«è¡¨ç¤ºï¼ˆäº¤ä»£ä¾é ¼ç”¨ï¼‰
function updateSwapShiftOptions(applicantName) {
    const sel = document.getElementById('swapShiftSelect');
    sel.innerHTML = '<option value="">é¸æŠžã—ã¦ãã ã•ã„</option>';

    if (!applicantName) {
        sel.innerHTML = '<option value="">å…ˆã«ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</option>';
        return;
    }

    // é€šå¸¸ã‚·ãƒ•ãƒˆã‚’è¿½åŠ ï¼ˆç”³è«‹è€…ã®ã¿ï¼‰
    state.shifts.filter(s => s.name === applicantName).forEach(s => {
        const o = document.createElement('option');
        o.value = s.id;
        o.textContent = `${s.date} ${formatTime(s.startHour)}-${formatTime(s.endHour)}`;
        sel.appendChild(o);
    });

    // ç¾åœ¨ã®é€±ã®å›ºå®šã‚·ãƒ•ãƒˆã‚‚è¿½åŠ ï¼ˆç”³è«‹è€…ã®ã¿ï¼‰
    for (let i = 0; i < 7; i++) {
        const d = new Date(state.currentWeekStart);
        d.setDate(d.getDate() + i);
        const dateStr = formatDate(d);
        const dayOfWeek = d.getDay();
        state.fixedShifts.filter(f => f.dayOfWeek === dayOfWeek && f.name === applicantName).forEach(f => {
            const virtualId = `fx-${f.id}-${dateStr}`;
            const o = document.createElement('option');
            o.value = virtualId;
            o.textContent = `${dateStr} ${formatTime(f.startHour)}-${formatTime(f.endHour)} [å›ºå®š]`;
            sel.appendChild(o);
        });
    }
}

// æ™‚åˆ»é¸æŠžè‚¢ï¼ˆ30åˆ†å˜ä½ï¼‰
function initTimeSelects() {
    [{ id: 'shiftStart', max: 23.5 }, { id: 'shiftEnd', min: 0.5, max: 24 }, { id: 'changeStart', max: 23.5 }, { id: 'changeEnd', min: 0.5, max: 24 }].forEach(({ id, min = 0, max }) => {
        const s = document.getElementById(id); if (!s) return;
        for (let i = min; i <= max; i += 0.5) {
            const o = document.createElement('option');
            o.value = i;
            o.textContent = formatTime(i);
            s.appendChild(o);
        }
    });
    document.getElementById('shiftStart').value = 9;
    document.getElementById('shiftEnd').value = 17;
    document.getElementById('changeStart').value = 9;
    document.getElementById('changeEnd').value = 17;
}

// ã‚¤ãƒ™ãƒ³ãƒˆè¨­å®š
function initEventListeners() {
    document.getElementById('prevWeek').onclick = goToPrevWeek;
    document.getElementById('nextWeek').onclick = goToNextWeek;
    document.getElementById('roleToggle').onclick = toggleRole;
    document.querySelectorAll('.admin-tab').forEach(t => t.onclick = () => { document.querySelectorAll('.admin-tab').forEach(x => x.classList.remove('active')); t.classList.add('active'); state.activeAdminTab = t.dataset.tab; renderAdminPanel(); });

    document.getElementById('addShiftBtn').onclick = () => {
        state.editingShiftId = null;
        document.getElementById('shiftModalTitle').textContent = 'ã‚·ãƒ•ãƒˆè¿½åŠ ';
        document.getElementById('shiftSubmitBtn').textContent = 'è¿½åŠ ';
        document.getElementById('editShiftId').value = '';
        document.getElementById('shiftDate').value = formatDate(new Date());
        updateShiftDateDay();
        document.getElementById('shiftName').value = '';
        document.getElementById('overnightShift').checked = false;
        document.getElementById('fixedShift').checked = false;
        document.getElementById('fixedShiftPeriod').style.display = 'none';
        document.getElementById('fixedStartDate').value = '';
        document.getElementById('fixedEndDate').value = '';
        document.getElementById('fixedNoEndDate').checked = true;
        document.getElementById('fixedEndDate').disabled = true;
        document.querySelectorAll('.color-option').forEach((o, i) => o.classList.toggle('selected', i === 0));
        state.selectedColor = '#6366f1';
        openModal(document.getElementById('modalOverlay'));
    };

    // å›ºå®šã‚·ãƒ•ãƒˆãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹ã®ãƒˆã‚°ãƒ«
    document.getElementById('fixedShift').onchange = (e) => {
        const periodDiv = document.getElementById('fixedShiftPeriod');
        periodDiv.style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked) {
            // é–‹å§‹æ—¥ã®ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã‚’é¸æŠžã•ã‚ŒãŸæ—¥ä»˜ã«
            const shiftDate = document.getElementById('shiftDate').value;
            if (shiftDate && !document.getElementById('fixedStartDate').value) {
                document.getElementById('fixedStartDate').value = shiftDate;
            }
        }
    };

    // çµ‚äº†æ—¥ãªã—ãƒã‚§ãƒƒã‚¯ãƒœãƒƒã‚¯ã‚¹ã®ãƒˆã‚°ãƒ«
    document.getElementById('fixedNoEndDate').onchange = (e) => {
        const endDateInput = document.getElementById('fixedEndDate');
        endDateInput.disabled = e.target.checked;
        if (e.target.checked) {
            endDateInput.value = '';
        }
    };

    // æ—¥ä»˜å¤‰æ›´æ™‚ã«æ›œæ—¥ã‚’è¡¨ç¤º
    document.getElementById('shiftDate').onchange = updateShiftDateDay;

    document.getElementById('modalClose').onclick = () => closeModal(document.getElementById('modalOverlay'));
    document.getElementById('cancelBtn').onclick = () => closeModal(document.getElementById('modalOverlay'));
    document.getElementById('modalOverlay').onclick = e => { if (e.target.id === 'modalOverlay') closeModal(document.getElementById('modalOverlay')); };

    document.getElementById('requestChangeBtn').onclick = openChangeModal;
    document.getElementById('changeModalClose').onclick = () => closeModal(document.getElementById('changeModalOverlay'));
    document.getElementById('changeCancelBtn').onclick = () => closeModal(document.getElementById('changeModalOverlay'));
    document.getElementById('changeModalOverlay').onclick = e => { if (e.target.id === 'changeModalOverlay') closeModal(document.getElementById('changeModalOverlay')); };
    document.getElementById('changeShiftSelect').onchange = e => {
        const sid = e.target.value;
        let shiftData = null;

        if (sid.startsWith('fx-')) {
            // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆ: fx-{originalId}-{dateStr} å½¢å¼
            const parts = sid.split('-');
            const originalId = parts[1];
            const dateStr = parts.slice(2).join('-'); // æ—¥ä»˜éƒ¨åˆ†ã‚’çµåˆ
            const fixed = state.fixedShifts.find(f => f.id === originalId);
            if (fixed) {
                shiftData = { date: dateStr, startHour: fixed.startHour, endHour: fixed.endHour };
            }
        } else {
            const s = state.shifts.find(x => x.id === sid);
            if (s) {
                shiftData = { date: s.date, startHour: s.startHour, endHour: s.endHour };
            }
        }

        if (shiftData) {
            document.getElementById('changeDate').value = shiftData.date;
            document.getElementById('changeStart').value = shiftData.startHour;
            document.getElementById('changeEnd').value = shiftData.endHour;
        }
    };

    // ç”³è«‹è€…é¸æŠžæ™‚ã«ã‚·ãƒ•ãƒˆãƒ‰ãƒ­ãƒƒãƒ—ãƒ€ã‚¦ãƒ³ã‚’æ›´æ–°
    document.getElementById('changeApplicant').onchange = e => {
        updateChangeShiftOptions(e.target.value);
    };

    document.getElementById('shiftSwapBtn').onclick = openSwapModal;
    document.getElementById('swapModalClose').onclick = () => closeModal(document.getElementById('swapModalOverlay'));
    document.getElementById('swapCancelBtn').onclick = () => closeModal(document.getElementById('swapModalOverlay'));
    document.getElementById('swapModalOverlay').onclick = e => { if (e.target.id === 'swapModalOverlay') closeModal(document.getElementById('swapModalOverlay')); };

    // ç”³è«‹è€…é¸æŠžæ™‚ã«ã‚·ãƒ•ãƒˆãƒ‰ãƒ­ãƒƒãƒ—ãƒ€ã‚¦ãƒ³ã‚’æ›´æ–°ï¼ˆäº¤ä»£ä¾é ¼ç”¨ï¼‰
    document.getElementById('swapApplicant').onchange = e => {
        updateSwapShiftOptions(e.target.value);
    };

    document.getElementById('requestLeaveBtn').onclick = () => { 
        document.getElementById('leaveName').value = '';
        document.getElementById('leaveShiftList').innerHTML = '<p class="no-shift-message">ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</p>';
        openModal(document.getElementById('leaveModalOverlay')); 
    };
    document.getElementById('leaveModalClose').onclick = () => closeModal(document.getElementById('leaveModalOverlay'));
    document.getElementById('leaveCancelBtn').onclick = () => closeModal(document.getElementById('leaveModalOverlay'));
    document.getElementById('leaveModalOverlay').onclick = e => { if (e.target.id === 'leaveModalOverlay') closeModal(document.getElementById('leaveModalOverlay')); };

    // ä¼‘æ—¥ç”³è«‹ãƒ¢ãƒ¼ãƒ€ãƒ«
    document.getElementById('requestHolidayBtn').onclick = () => {
        document.getElementById('holidayName').value = '';
        document.getElementById('holidayShiftList').innerHTML = '<p class="no-shift-message">ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</p>';
        document.getElementById('holidayTimeRangeGroup').style.display = 'none';
        document.getElementById('holidaySwapPartnerGroup').style.display = 'none';
        document.querySelectorAll('input[name="holidaySwapRequested"]').forEach(r => {
            if (r.value === 'no') r.checked = true;
        });
        openModal(document.getElementById('holidayModalOverlay'));
    };
    document.getElementById('holidayModalClose').onclick = () => closeModal(document.getElementById('holidayModalOverlay'));
    document.getElementById('holidayCancelBtn').onclick = () => closeModal(document.getElementById('holidayModalOverlay'));
    document.getElementById('holidayModalOverlay').onclick = e => { if (e.target.id === 'holidayModalOverlay') closeModal(document.getElementById('holidayModalOverlay')); };

    // ã‚·ãƒ•ãƒˆäº¤ä»£ã®æœ‰ç„¡ã§ãƒ•ã‚£ãƒ¼ãƒ«ãƒ‰ã®è¡¨ç¤ºåˆ‡ã‚Šæ›¿ãˆ
    document.querySelectorAll('input[name="holidaySwapRequested"]').forEach(radio => {
        radio.onchange = () => {
            const isYes = document.querySelector('input[name="holidaySwapRequested"]:checked').value === 'yes';
            document.getElementById('holidaySwapPartnerGroup').style.display = isYes ? 'block' : 'none';
        };
    });


    document.getElementById('pinModalClose').onclick = () => closeModal(document.getElementById('pinModalOverlay'));
    document.getElementById('pinCancelBtn').onclick = () => closeModal(document.getElementById('pinModalOverlay'));
    document.getElementById('pinModalOverlay').onclick = e => { if (e.target.id === 'pinModalOverlay') closeModal(document.getElementById('pinModalOverlay')); };
    document.getElementById('pinForm').onsubmit = e => { e.preventDefault(); if (verifyPin(document.getElementById('adminPin').value)) { closeModal(document.getElementById('pinModalOverlay')); switchToAdmin(); } else { document.getElementById('pinError').style.display = 'block'; document.getElementById('adminPin').value = ''; } };

    document.getElementById('viewMessagesBtn').onclick = () => { trackUsage('view_messages', 'åŒ¿å'); renderMessages(); openModal(document.getElementById('messagesModalOverlay')); };
    document.getElementById('messagesModalClose').onclick = () => closeModal(document.getElementById('messagesModalOverlay'));
    document.getElementById('messagesModalOverlay').onclick = e => { if (e.target.id === 'messagesModalOverlay') closeModal(document.getElementById('messagesModalOverlay')); };

    document.getElementById('employeeModalClose').onclick = () => closeModal(document.getElementById('employeeModalOverlay'));
    document.getElementById('employeeCancelBtn').onclick = () => closeModal(document.getElementById('employeeModalOverlay'));
    document.getElementById('employeeModalOverlay').onclick = e => { if (e.target.id === 'employeeModalOverlay') closeModal(document.getElementById('employeeModalOverlay')); };
    document.getElementById('employeeForm').onsubmit = e => {
        e.preventDefault();

        // ç™ºæ³¨æ‹…å½“åˆ†é¡žã‚’å–å¾—
        const orderCategories = [];
        document.querySelectorAll('input[name="orderCategory"]:checked').forEach(cb => {
            orderCategories.push(cb.value);
        });

        const employeeData = {
            name: document.getElementById('employeeName').value.trim(),
            role: document.getElementById('employeeRole').value,
            shiftTime: document.getElementById('employeeShiftTime').value,
            orderCategories: orderCategories
        };

        const editId = document.getElementById('editEmployeeId').value;
        if (editId) {
            // ç·¨é›†ãƒ¢ãƒ¼ãƒ‰
            updateEmployee(editId, employeeData);
            alert('å¾“æ¥­å“¡æƒ…å ±ã‚’æ›´æ–°ã—ã¾ã—ãŸ');
        } else {
            // è¿½åŠ ãƒ¢ãƒ¼ãƒ‰
            addEmployee(employeeData);
            alert('å¾“æ¥­å“¡ã‚’è¿½åŠ ã—ã¾ã—ãŸ');
        }

        closeModal(document.getElementById('employeeModalOverlay'));
        document.getElementById('employeeForm').reset();
        document.getElementById('editEmployeeId').value = '';
    };

    // 臨時シフト（特別イベント）モーダルのイベントリスナー
    document.getElementById('specialEventModalClose').onclick = () => closeModal(document.getElementById('specialEventModalOverlay'));
    document.getElementById('specialEventCancelBtn').onclick = () => closeModal(document.getElementById('specialEventModalOverlay'));
    document.getElementById('specialEventModalOverlay').onclick = e => { if (e.target.id === 'specialEventModalOverlay') closeModal(document.getElementById('specialEventModalOverlay')); };
    document.getElementById('specialEventForm').onsubmit = e => {
        e.preventDefault();
        const id = document.getElementById('editSpecialEventId').value;
        const d = {
            date: document.getElementById('specialEventDate').value,
            eventName: document.getElementById('specialEventName').value.trim(),
            description: document.getElementById('specialEventDescription').value.trim(),
            suppressFixed: document.getElementById('suppressFixedShifts').checked
        };
        if (!d.date || !d.eventName) { alert('日付とイベント名を入力してください'); return; }
        
        // 重複チェック（編集時は自身を除外）
        const duplicate = state.specialEvents.find(x => x.date === d.date && x.id !== id);
        if (duplicate) { alert('この日付には既にイベントが登録されています'); return; }
        
        if (id) {
            updateSpecialEvent(id, d);
            alert('イベントを更新しました');
        } else {
            addSpecialEvent(d);
            alert('イベント日を追加しました。\nこの日のシフトは「シフト追加」から個別に登録してください。');
        }
        closeModal(document.getElementById('specialEventModalOverlay'));
        document.getElementById('specialEventForm').reset();
    };

    document.getElementById('broadcastModalClose').onclick = () => closeModal(document.getElementById('broadcastModalOverlay'));
    document.getElementById('broadcastCancelBtn').onclick = () => closeModal(document.getElementById('broadcastModalOverlay'));
    document.getElementById('broadcastModalOverlay').onclick = e => { if (e.target.id === 'broadcastModalOverlay') closeModal(document.getElementById('broadcastModalOverlay')); };
    document.getElementById('broadcastForm').onsubmit = e => { e.preventDefault(); sendBroadcast(document.getElementById('broadcastTitle').value.trim(), document.getElementById('broadcastMessage').value.trim()); closeModal(document.getElementById('broadcastModalOverlay')); document.getElementById('broadcastForm').reset(); alert('å…¨å¾“æ¥­å“¡ã«ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã‚’é€ä¿¡ã—ã¾ã—ãŸ'); };

    document.querySelectorAll('.color-option').forEach(o => o.onclick = (e) => { 
        e.preventDefault();
        e.stopPropagation();
        const color = o.dataset.color;
        // è‰²ãŒæ­£ã—ãå–å¾—ã§ããŸå ´åˆã®ã¿å‡¦ç†
        if (color && color.startsWith('#')) {
            document.querySelectorAll('.color-option').forEach(x => x.classList.remove('selected')); 
            o.classList.add('selected'); 
            state.selectedColor = color;
        }
    });

    document.getElementById('shiftForm').onsubmit = e => {
        e.preventDefault();
        const id = document.getElementById('editShiftId').value;
        const isFixedChecked = document.getElementById('fixedShift').checked;
        // è‰²ã®ãƒãƒªãƒ‡ãƒ¼ã‚·ãƒ§ãƒ³ - æ­£ã—ããªã„å ´åˆã¯ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆè‰²ã‚’ä½¿ç”¨
        const validColor = (state.selectedColor && state.selectedColor.startsWith('#') && state.selectedColor.length >= 4) ? state.selectedColor : '#6366f1';
        const d = { date: document.getElementById('shiftDate').value, name: document.getElementById('shiftName').value, startHour: +document.getElementById('shiftStart').value, endHour: +document.getElementById('shiftEnd').value, color: validColor, overnight: document.getElementById('overnightShift').checked };
        if (!d.overnight && d.startHour >= d.endHour) { alert('çµ‚äº†æ™‚åˆ»ã¯é–‹å§‹æ™‚åˆ»ã‚ˆã‚Šå¾Œã«'); return; }
        if (d.overnight && d.startHour <= d.endHour) { alert('å¤œå‹¤ã¯çµ‚äº†æ™‚åˆ»ã‚’ç¿Œæ—¥ã®æ™‚åˆ»ã«'); return; }

        // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã€æœ‰åŠ¹æœŸé–“ã‚’è¿½åŠ 
        if (isFixedChecked) {
            const fixedStartDate = document.getElementById('fixedStartDate').value;
            const fixedNoEndDate = document.getElementById('fixedNoEndDate').checked;
            const fixedEndDate = document.getElementById('fixedEndDate').value;
            
            d.fixedStartDate = fixedStartDate || null;
            d.fixedEndDate = fixedNoEndDate ? null : (fixedEndDate || null);
        }

        if (id) {
            // ç·¨é›†ã®å ´åˆï¼šå›ºå®šã‚·ãƒ•ãƒˆã‹é€šå¸¸ã‚·ãƒ•ãƒˆã‹ã‚’åˆ¤å®š
            const isCurrentlyFixedShift = state.fixedShifts.some(s => s.id === id);
            const isCurrentlyNormalShift = state.shifts.some(s => s.id === id);
            
            if (isCurrentlyFixedShift) {
                // å›ºå®šã‚·ãƒ•ãƒˆã®ç·¨é›†æ™‚ã‚‚æœ‰åŠ¹æœŸé–“ã‚’å–å¾—
                const fixedStartDate = document.getElementById('fixedStartDate').value;
                const fixedNoEndDate = document.getElementById('fixedNoEndDate').checked;
                const fixedEndDate = document.getElementById('fixedEndDate').value;
                d.fixedStartDate = fixedStartDate || null;
                d.fixedEndDate = fixedNoEndDate ? null : (fixedEndDate || null);
                updateFixedShift(id, d);
            } else if (isCurrentlyNormalShift && isFixedChecked) {
                // é€šå¸¸ã‚·ãƒ•ãƒˆã‚’å›ºå®šã‚·ãƒ•ãƒˆã«å¤‰æ›ã™ã‚‹å ´åˆ
                // 1. é€šå¸¸ã‚·ãƒ•ãƒˆã‚’å‰Šé™¤
                deleteShift(id);
                // 2. å›ºå®šã‚·ãƒ•ãƒˆã¨ã—ã¦æ–°è¦è¿½åŠ 
                addFixedShift(d);
            } else {
                updateShift(id, d);
            }
        } else if (isFixedChecked) {
            addFixedShift(d);
        } else {
            addShift(d);
        }
        closeModal(document.getElementById('modalOverlay'));
        document.getElementById('shiftForm').reset();
        // æœ‰åŠ¹æœŸé–“ã‚»ã‚¯ã‚·ãƒ§ãƒ³ã‚’éžè¡¨ç¤ºã«æˆ»ã™
        document.getElementById('fixedShiftPeriod').style.display = 'none';
        document.getElementById('fixedNoEndDate').checked = true;
    };

    document.getElementById('changeForm').onsubmit = e => {
        e.preventDefault();
        const applicant = document.getElementById('changeApplicant').value;
        const d = { applicant, originalShiftId: document.getElementById('changeShiftSelect').value, newDate: document.getElementById('changeDate').value, newStartHour: +document.getElementById('changeStart').value, newEndHour: +document.getElementById('changeEnd').value, reason: document.getElementById('changeReason').value.trim() };
        if (d.newStartHour >= d.newEndHour) { alert('çµ‚äº†æ™‚åˆ»ã¯é–‹å§‹æ™‚åˆ»ã‚ˆã‚Šå¾Œã«'); return; }
        addChangeRequest(d);
        closeModal(document.getElementById('changeModalOverlay'));
        document.getElementById('changeForm').reset();
        alert('ã‚·ãƒ•ãƒˆå¤‰æ›´ç”³è«‹ã‚’é€ä¿¡ã—ã¾ã—ãŸ');
    };

    document.getElementById('swapForm').onsubmit = e => {
        e.preventDefault();
        const applicant = document.getElementById('swapApplicant').value;
        const sid = document.getElementById('swapShiftSelect').value;

        // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã¯IDã‹ã‚‰å…ƒã®ã‚·ãƒ•ãƒˆæƒ…å ±ã‚’å–å¾—
        let shiftName;
        if (sid.startsWith('fx-')) {
            const parts = sid.split('-');
            const originalId = parts[1];
            const fixed = state.fixedShifts.find(f => f.id === originalId);
            shiftName = fixed ? fixed.name : 'ä¸æ˜Ž';
        } else {
            const s = state.shifts.find(x => x.id === sid);
            shiftName = s ? s.name : 'ä¸æ˜Ž';
        }

        addSwapRequest({ applicant, shiftId: sid, fromEmployee: shiftName, targetEmployee: document.getElementById('swapTargetEmployee').value, message: document.getElementById('swapMessage').value.trim() });
        closeModal(document.getElementById('swapModalOverlay'));
        document.getElementById('swapForm').reset();
        alert('ã‚·ãƒ•ãƒˆäº¤ä»£ä¾é ¼ã‚’é€ä¿¡ã—ã¾ã—ãŸ');
    };

    document.getElementById('leaveForm').onsubmit = e => {
        e.preventDefault();
        const name = document.getElementById('leaveName').value;
        
        // é¸æŠžã•ã‚ŒãŸã‚·ãƒ•ãƒˆã‚’å–å¾—
        const selectedShifts = [];
        document.querySelectorAll('#leaveShiftList .shift-selection-checkbox:checked').forEach(cb => {
            const item = cb.closest('.shift-selection-item');
            const shiftData = JSON.parse(item.dataset.shiftInfo);
            selectedShifts.push(shiftData);
        });
        
        if (selectedShifts.length === 0) {
            alert('æœ‰çµ¦ã‚’å–å¾—ã—ãŸã„ã‚·ãƒ•ãƒˆã‚’1ã¤ä»¥ä¸Šé¸æŠžã—ã¦ãã ã•ã„');
            return;
        }
        
        // è¤‡æ•°ã‚·ãƒ•ãƒˆã®æœ‰çµ¦ç”³è«‹ã‚’ä½œæˆ
        addLeaveRequestMultiple(name, selectedShifts);
        closeModal(document.getElementById('leaveModalOverlay'));
        document.getElementById('leaveForm').reset();
        document.getElementById('leaveShiftList').innerHTML = '<p class="no-shift-message">ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</p>';
        alert('æœ‰çµ¦ç”³è«‹ã‚’é€ä¿¡ã—ã¾ã—ãŸ');
    };

    document.getElementById('holidayForm').onsubmit = e => {
        e.preventDefault();
        const name = document.getElementById('holidayName').value;
        const swapRequested = document.querySelector('input[name="holidaySwapRequested"]:checked').value === 'yes';
        
        // é¸æŠžã•ã‚ŒãŸã‚·ãƒ•ãƒˆã‚’å–å¾—
        const selectedShifts = [];
        document.querySelectorAll('#holidayShiftList .shift-selection-checkbox:checked').forEach(cb => {
            const item = cb.closest('.shift-selection-item');
            const shiftData = JSON.parse(item.dataset.shiftInfo);
            selectedShifts.push(shiftData);
        });
        
        if (selectedShifts.length === 0) {
            alert('ä¼‘æ—¥ã‚’ç”³è«‹ã—ãŸã„ã‚·ãƒ•ãƒˆã‚’1ã¤ä»¥ä¸Šé¸æŠžã—ã¦ãã ã•ã„');
            return;
        }
        
        // æ™‚é–“å¸¯æŒ‡å®šã®å–å¾—
        const customStartTime = document.getElementById('holidayStartTime').value;
        const customEndTime = document.getElementById('holidayEndTime').value;
        
        if (swapRequested && !document.getElementById('holidaySwapPartner').value) { 
            alert('ã‚·ãƒ•ãƒˆäº¤ä»£ç›¸æ‰‹ã‚’é¸æŠžã—ã¦ãã ã•ã„'); 
            return; 
        }
        
        // è¤‡æ•°ã‚·ãƒ•ãƒˆã®ä¼‘æ—¥ç”³è«‹ã‚’ä½œæˆ
        addHolidayRequestMultiple(name, selectedShifts, {
            swapRequested: swapRequested,
            swapPartner: swapRequested ? document.getElementById('holidaySwapPartner').value : null,
            reason: document.getElementById('holidayReason').value.trim(),
            customStartTime: customStartTime || null,
            customEndTime: customEndTime || null
        });
        closeModal(document.getElementById('holidayModalOverlay'));
        document.getElementById('holidayForm').reset();
        document.getElementById('holidayShiftList').innerHTML = '<p class="no-shift-message">ç”³è«‹è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</p>';
        document.getElementById('holidayTimeRangeGroup').style.display = 'none';
        alert('ä¼‘æ—¥ç”³è«‹ã‚’é€ä¿¡ã—ã¾ã—ãŸ');
    };

    document.onkeydown = e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay').forEach(m => closeModal(m)); };

    // æš—è¨¼ç•ªå·å¤‰æ›´ãƒ¢ãƒ¼ãƒ€ãƒ«
    document.getElementById('changePinModalClose').onclick = () => closeModal(document.getElementById('changePinModalOverlay'));
    document.getElementById('changePinCancelBtn').onclick = () => closeModal(document.getElementById('changePinModalOverlay'));
    document.getElementById('changePinModalOverlay').onclick = e => { if (e.target.id === 'changePinModalOverlay') closeModal(document.getElementById('changePinModalOverlay')); };
    document.getElementById('changePinForm').onsubmit = e => {
        e.preventDefault();
        const current = document.getElementById('currentPin').value;
        const newPin = document.getElementById('newPin').value;
        const confirm = document.getElementById('confirmPin').value;
        const errEl = document.getElementById('changePinError');
        if (current !== CONFIG.ADMIN_PIN) { errEl.textContent = 'ç¾åœ¨ã®æš—è¨¼ç•ªå·ãŒé•ã„ã¾ã™'; errEl.style.display = 'block'; return; }
        if (newPin !== confirm) { errEl.textContent = 'æ–°ã—ã„æš—è¨¼ç•ªå·ãŒä¸€è‡´ã—ã¾ã›ã‚“'; errEl.style.display = 'block'; return; }
        if (newPin.length !== 4) { errEl.textContent = 'æš—è¨¼ç•ªå·ã¯4æ¡ã§å…¥åŠ›ã—ã¦ãã ã•ã„'; errEl.style.display = 'block'; return; }
        CONFIG.ADMIN_PIN = newPin;
        database.ref('settings/adminPin').set(newPin);
        closeModal(document.getElementById('changePinModalOverlay'));
        document.getElementById('changePinForm').reset();
        errEl.style.display = 'none';
        alert('æš—è¨¼ç•ªå·ã‚’å¤‰æ›´ã—ã¾ã—ãŸ');
    };
}

// ========================================
// ã‚ºãƒ¼ãƒ æ©Ÿèƒ½
// ========================================
function setZoom(level) {
    // 50% - 150% ã®ç¯„å›²ã«åˆ¶é™
    state.zoomLevel = Math.min(150, Math.max(50, level));
    applyZoom();

    // UIæ›´æ–°
    const slider = document.getElementById('zoomSlider');
    const value = document.getElementById('zoomValue');
    if (slider) slider.value = state.zoomLevel;
    if (value) value.textContent = `${state.zoomLevel}%`;
}

function applyZoom() {
    const ganttContainer = document.querySelector('.gantt-container');
    if (!ganttContainer) return;

    const scale = state.zoomLevel / 100;

    // ã‚¬ãƒ³ãƒˆãƒãƒ£ãƒ¼ãƒˆã®ã‚»ãƒ«å¹…ã‚’èª¿æ•´
    const timeCells = document.querySelectorAll('.time-cell');
    const hourCells = document.querySelectorAll('.hour-cell');

    const baseWidth = window.innerWidth <= 768 ? 38 : 50;
    const newWidth = Math.round(baseWidth * scale);

    timeCells.forEach(cell => {
        cell.style.minWidth = `${newWidth}px`;
    });

    hourCells.forEach(cell => {
        cell.style.minWidth = `${newWidth}px`;
    });

    // ãƒ˜ãƒƒãƒ€ãƒ¼ã¨è¡Œã®æœ€å°å¹…ã‚’æ›´æ–°
    const minWidth = Math.round((window.innerWidth <= 768 ? 60 : 120) + (newWidth * 24));
    const ganttHeader = document.querySelector('.gantt-header');
    const ganttRows = document.querySelectorAll('.gantt-row');

    if (ganttHeader) ganttHeader.style.minWidth = `${minWidth}px`;
    ganttRows.forEach(row => {
        row.style.minWidth = `${minWidth}px`;
    });
}

function initZoomControls() {
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomReset = document.getElementById('zoomReset');

    if (zoomIn) {
        zoomIn.onclick = () => setZoom(state.zoomLevel + 10);
    }

    if (zoomOut) {
        zoomOut.onclick = () => setZoom(state.zoomLevel - 10);
    }

    if (zoomSlider) {
        zoomSlider.oninput = (e) => setZoom(parseInt(e.target.value));
    }

    if (zoomReset) {
        zoomReset.onclick = () => setZoom(100);
    }

    // ãƒ”ãƒ³ãƒã‚¸ã‚§ã‚¹ãƒãƒ£ãƒ¼å¯¾å¿œï¼ˆãƒ¢ãƒã‚¤ãƒ«ï¼‰
    let lastTouchDistance = 0;
    let isPinching = false;
    const ganttContainer = document.querySelector('.gantt-container');

    if (ganttContainer) {
        // ã‚¿ãƒƒãƒé–‹å§‹æ™‚
        ganttContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                isPinching = true;
                lastTouchDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                // 2æœ¬æŒ‡ã‚¿ãƒƒãƒã®å ´åˆã¯ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆå‹•ä½œã‚’é˜²æ­¢
                e.preventDefault();
            }
        }, { passive: false });

        // ã‚¿ãƒƒãƒç§»å‹•æ™‚ï¼ˆãƒ”ãƒ³ãƒã‚ºãƒ¼ãƒ ï¼‰
        ganttContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && isPinching) {
                // ãƒ–ãƒ©ã‚¦ã‚¶ã®ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆãƒ”ãƒ³ãƒã‚ºãƒ¼ãƒ ã‚’é˜²æ­¢
                e.preventDefault();

                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );

                if (lastTouchDistance > 0) {
                    const delta = (currentDistance - lastTouchDistance) / 3;
                    setZoom(state.zoomLevel + delta);
                }

                lastTouchDistance = currentDistance;
            }
        }, { passive: false });

        // ã‚¿ãƒƒãƒçµ‚äº†æ™‚
        ganttContainer.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                isPinching = false;
                lastTouchDistance = 0;
            }
        }, { passive: true });
    }
}

// ========================================
// PDFå‡ºåŠ›ãƒ»å°åˆ·æ©Ÿèƒ½
// ========================================
function exportToPdf() {
    trackUsage('export_pdf', state.isAdmin ? 'ç®¡ç†è€…' : 'åŒ¿å');
    const element = document.querySelector('.app-container');
    if (!element) return;

    // PDFå‡ºåŠ›ä¸­ã®ãƒ­ãƒ¼ãƒ‡ã‚£ãƒ³ã‚°è¡¨ç¤º
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'pdf-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="pdf-loading-content">
            <div class="pdf-loading-spinner"></div>
            <p>PDFã‚’ç”Ÿæˆä¸­...</p>
        </div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-size: 1.2rem;
    `;
    document.body.appendChild(loadingOverlay);

    // PDFå‡ºåŠ›ç”¨ã®ã‚¯ãƒ©ã‚¹ã‚’è¿½åŠ 
    document.body.classList.add('pdf-export-mode');

    // æœŸé–“æƒ…å ±ã‚’å–å¾—
    const periodText = document.getElementById('currentPeriod')?.textContent || 'ã‚·ãƒ•ãƒˆè¡¨';
    const fileName = `ã‚·ãƒ•ãƒˆè¡¨_${periodText.replace(/\s/g, '_')}.pdf`;

    // html2pdf ã®ã‚ªãƒ—ã‚·ãƒ§ãƒ³
    const opt = {
        margin: [10, 10, 10, 10],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1200
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: 'avoid-all' }
    };

    // PDFç”Ÿæˆ
    html2pdf().set(opt).from(element).save().then(() => {
        // ã‚¯ãƒ©ã‚¹ã‚’å‰Šé™¤
        document.body.classList.remove('pdf-export-mode');
        // ãƒ­ãƒ¼ãƒ‡ã‚£ãƒ³ã‚°å‰Šé™¤
        loadingOverlay.remove();
    }).catch(err => {
        console.error('PDFç”Ÿæˆã‚¨ãƒ©ãƒ¼:', err);
        document.body.classList.remove('pdf-export-mode');
        loadingOverlay.remove();
        alert('PDFã®ç”Ÿæˆã«å¤±æ•—ã—ã¾ã—ãŸã€‚ã‚‚ã†ä¸€åº¦ãŠè©¦ã—ãã ã•ã„ã€‚');
    });
}

function printShiftTable() {
    trackUsage('print_shift', state.isAdmin ? 'ç®¡ç†è€…' : 'åŒ¿å');
    window.print();
}

function initPdfExport() {
    const exportBtn = document.getElementById('exportPdfBtn');
    const printBtn = document.getElementById('printBtn');

    if (exportBtn) {
        exportBtn.onclick = exportToPdf;
    }

    if (printBtn) {
        printBtn.onclick = printShiftTable;
    }
}

// ========================================
// å˜æ—¥ä¸Šæ›¸ãï¼ˆã“ã®æ—¥ã®ã¿å¤‰æ›´ï¼‰æ©Ÿèƒ½
// ========================================
function openShiftOverrideModal(shift) {
    // å›ºå®šã‚·ãƒ•ãƒˆã®IDã‚’å–å¾—
    const parts = shift.id.split('-');
    const fixedShiftId = parts[1];
    const dateStr = shift.date;
    
    // å…ƒã®å›ºå®šã‚·ãƒ•ãƒˆã‚’å–å¾—
    const fixedShift = state.fixedShifts.find(f => f.id === fixedShiftId);
    if (!fixedShift) return;
    
    // æ—¢å­˜ã®ä¸Šæ›¸ããŒã‚ã‚‹ã‹ç¢ºèª
    const existingOverride = state.shiftOverrides.find(o => 
        o.fixedShiftId === fixedShiftId && o.date === dateStr
    );
    
    const currentStartHour = existingOverride ? existingOverride.startHour : fixedShift.startHour;
    const currentEndHour = existingOverride ? existingOverride.endHour : fixedShift.endHour;
    const currentOvernight = existingOverride ? existingOverride.overnight : (fixedShift.overnight || false);
    
    // ãƒ¢ãƒ¼ãƒ€ãƒ«ä½œæˆ
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay category-modal-overlay active';
    overlay.id = 'overrideModalOverlay';
    
    const hourOptions = Array.from({ length: 24 }, (_, i) => 
        `<option value="${i}" ${i === currentStartHour ? 'selected' : ''}>${i}:00</option>`
    ).join('');
    
    const hourOptionsEnd = Array.from({ length: 24 }, (_, i) => 
        `<option value="${i}" ${i === currentEndHour ? 'selected' : ''}>${i}:00</option>`
    ).join('');
    
    overlay.innerHTML = `
        <div class="modal category-modal" style="max-width: 400px;">
            <div class="modal-header">
                <h2 class="modal-title">ðŸ“ ã“ã®æ—¥ã®ã¿å¤‰æ›´</h2>
                <button class="modal-close" onclick="closeOverrideModal()">Ã—</button>
            </div>
            <div class="modal-body">
                <div class="override-info" style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                    <p style="margin: 0 0 8px 0; font-weight: 600;">ðŸ“… ${dateStr} ã®ã¿ã®å¤‰æ›´</p>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">
                        å…ƒã®å›ºå®šã‚·ãƒ•ãƒˆ: ${fixedShift.name} ${formatTime(fixedShift.startHour)}ã€œ${formatTime(fixedShift.endHour)}
                    </p>
                </div>
                
                <div class="form-group">
                    <label>é–‹å§‹æ™‚åˆ»</label>
                    <select id="overrideStartHour" class="form-control">
                        ${hourOptions}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>çµ‚äº†æ™‚åˆ»</label>
                    <select id="overrideEndHour" class="form-control">
                        ${hourOptionsEnd}
                    </select>
                </div>
                
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="overrideOvernight" ${currentOvernight ? 'checked' : ''}>
                        <span>ðŸŒ™ å¤œå‹¤ï¼ˆç¿Œæ—¥ã«è·¨ãï¼‰</span>
                    </label>
                </div>
                
                ${existingOverride ? `
                <div class="form-group" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteOverrideAndClose('${existingOverride.id}')" style="width: 100%;">
                        ðŸ—‘ï¸ å˜æ—¥å¤‰æ›´ã‚’å‰Šé™¤ï¼ˆå…ƒã®ã‚·ãƒ•ãƒˆã«æˆ»ã™ï¼‰
                    </button>
                </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeOverrideModal()">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                <button type="button" class="btn btn-primary" onclick="saveShiftOverride('${fixedShiftId}', '${dateStr}', ${existingOverride ? `'${existingOverride.id}'` : 'null'})">
                    ${existingOverride ? 'æ›´æ–°' : 'å¤‰æ›´ã‚’ä¿å­˜'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function closeOverrideModal() {
    const overlay = document.getElementById('overrideModalOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function saveShiftOverride(fixedShiftId, dateStr, existingOverrideId) {
    const startHour = parseInt(document.getElementById('overrideStartHour').value);
    const endHour = parseInt(document.getElementById('overrideEndHour').value);
    const overnight = document.getElementById('overrideOvernight').checked;
    
    const overrideData = {
        fixedShiftId,
        date: dateStr,
        startHour,
        endHour,
        overnight
    };
    
    if (existingOverrideId) {
        updateShiftOverride(existingOverrideId, overrideData);
    } else {
        addShiftOverride(overrideData);
    }
    
    closeOverrideModal();
    render();
}

function deleteOverrideAndClose(overrideId) {
    if (confirm('å˜æ—¥å¤‰æ›´ã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ\nå…ƒã®å›ºå®šã‚·ãƒ•ãƒˆã®æ™‚é–“ã«æˆ»ã‚Šã¾ã™ã€‚')) {
        deleteShiftOverride(overrideId);
        closeOverrideModal();
        render();
    }
}

// ========================================
// ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠãƒ¼
// ========================================
function initPopoverEvents() {
    const popover = document.getElementById('shiftPopover');
    const closeBtn = document.getElementById('popoverClose');
    const editBtn = document.getElementById('popoverEditBtn');
    const deleteBtn = document.getElementById('popoverDeleteBtn');

    // é–‰ã˜ã‚‹ãƒœã‚¿ãƒ³
    if (closeBtn) {
        closeBtn.onclick = closeShiftPopover;
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeShiftPopover();
        }, { passive: false });
    }

    // ç·¨é›†ãƒœã‚¿ãƒ³
    const handleEdit = () => {
        if (state.currentPopoverShift) {
            const shift = state.currentPopoverShift;
            closeShiftPopover();
            // å°‘ã—é…å»¶ã‚’å…¥ã‚Œã¦ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ãŒé–‰ã˜ã¦ã‹ã‚‰é–‹ã
            setTimeout(() => {
                openEditShiftModal(shift);
            }, 100);
        }
    };

    if (editBtn) {
        editBtn.onclick = handleEdit;
        editBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEdit();
        }, { passive: false });
    }

    // å‰Šé™¤ãƒœã‚¿ãƒ³
    const handleDelete = () => {
        if (state.currentPopoverShift) {
            const s = state.currentPopoverShift;
            closeShiftPopover();
            // å°‘ã—é…å»¶ã‚’å…¥ã‚Œã¦ã‹ã‚‰ç¢ºèªãƒ€ã‚¤ã‚¢ãƒ­ã‚°ã‚’è¡¨ç¤º
            setTimeout(() => {
                if (confirm('ã“ã®ã‚·ãƒ•ãƒˆã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ')) {
                    if (s.isFixed) {
                        // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆ
                        const parts = s.id.split('-');
                        deleteFixedShift(parts[1]);
                    } else if (s.isOvernightContinuation && s.id.startsWith('on-')) {
                        // å¤œå‹¤ç¶™ç¶šã‚·ãƒ•ãƒˆã®å ´åˆã€å…ƒã®ã‚·ãƒ•ãƒˆã‚’å‰Šé™¤
                        const originalId = s.id.replace('on-', '');
                        deleteShift(originalId);
                    } else {
                        // é€šå¸¸ã‚·ãƒ•ãƒˆã®å ´åˆ
                        deleteShift(s.id);
                    }
                }
            }, 100);
        }
    };

    if (deleteBtn) {
        deleteBtn.onclick = handleDelete;
        deleteBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDelete();
        }, { passive: false });
    }

    // ä¼‘ã¿ãƒœã‚¿ãƒ³
    const dayOffBtn = document.getElementById('popoverDayOffBtn');
    const handleDayOff = () => {
        if (state.currentPopoverShift) {
            const s = state.currentPopoverShift;
            closeShiftPopover();
            setTimeout(() => {
                if (confirm('ã“ã®ã‚·ãƒ•ãƒˆã‚’ä¼‘ã¿ã«ã—ã¾ã™ã‹ï¼Ÿ\nã‚·ãƒ•ãƒˆãŒå‰Šé™¤ã•ã‚Œã€ä¼‘æ—¥ãƒãƒ¼ãŒè¡¨ç¤ºã•ã‚Œã¾ã™ã€‚')) {
                    // ã‚·ãƒ•ãƒˆã®æ‹…å½“è€…åã¨æ—¥ä»˜ã‚’å–å¾—
                    let name, date;
                    if (s.isFixed) {
                        const parts = s.id.split('-');
                        const originalId = parts[1];
                        const fixed = state.fixedShifts.find(f => f.id === originalId);
                        if (fixed) {
                            name = fixed.name;
                            date = s.date;
                        }
                    } else if (s.isOvernightContinuation && s.id.startsWith('on-')) {
                        const originalId = s.id.replace('on-', '');
                        const original = state.shifts.find(x => x.id === originalId);
                        if (original) {
                            name = original.name;
                            date = original.date;
                        }
                    } else {
                        name = s.name;
                        date = s.date;
                    }

                    if (name && date) {
                        // ã‚·ãƒ•ãƒˆã®æ™‚é–“æƒ…å ±ã‚‚å–å¾—
                        let startHour, endHour, overnight;
                        if (s.isFixed) {
                            const parts = s.id.split('-');
                            const originalId = parts[1];
                            const fixed = state.fixedShifts.find(f => f.id === originalId);
                            if (fixed) {
                                startHour = fixed.startHour;
                                endHour = fixed.endHour;
                                overnight = fixed.overnight || false;
                            }
                        } else if (s.isOvernightContinuation && s.id.startsWith('on-')) {
                            const originalId = s.id.replace('on-', '');
                            const original = state.shifts.find(x => x.id === originalId);
                            if (original) {
                                startHour = original.startHour;
                                endHour = original.endHour;
                                overnight = original.overnight || false;
                            }
                        } else {
                            startHour = s.startHour;
                            endHour = s.endHour;
                            overnight = s.overnight || false;
                        }

                        // æ‰¿èªæ¸ˆã¿ã®ä¼‘æ—¥ãƒªã‚¯ã‚¨ã‚¹ãƒˆã‚’ç›´æŽ¥è¿½åŠ ï¼ˆç®¡ç†è€…ã«ã‚ˆã‚‹å³æ™‚æ‰¿èªï¼‰
                        const holidayRequest = {
                            id: Date.now().toString(),
                            name: name,
                            startDate: date,
                            endDate: date,
                            startHour: startHour,
                            endHour: endHour,
                            overnight: overnight,
                            reason: 'çªç™ºçš„ãªä¼‘ã¿',
                            swapRequested: false,
                            swapPartner: null,
                            status: 'approved',
                            createdAt: new Date().toISOString(),
                            approvedAt: new Date().toISOString(),
                            processedBy: 'ç®¡ç†è€…ï¼ˆå³æ™‚æ‰¿èªï¼‰'
                        };
                        state.holidayRequests.push(holidayRequest);
                        saveToFirebase('holidayRequests', state.holidayRequests);

                        // ã‚·ãƒ•ãƒˆã‚’å‰Šé™¤
                        if (s.isFixed) {
                            // å›ºå®šã‚·ãƒ•ãƒˆã®å ´åˆã¯å‰Šé™¤ã—ãªã„ï¼ˆä¼‘æ—¥ãƒãƒ¼ã ã‘è¡¨ç¤ºï¼‰
                            // å¿…è¦ã«å¿œã˜ã¦å›ºå®šã‚·ãƒ•ãƒˆã‚’å‰Šé™¤ã™ã‚‹å ´åˆã¯ã‚³ãƒ¡ãƒ³ãƒˆã‚¢ã‚¦ãƒˆã‚’è§£é™¤
                            // const parts = s.id.split('-');
                            // deleteFixedShift(parts[1]);
                        } else if (s.isOvernightContinuation && s.id.startsWith('on-')) {
                            const originalId = s.id.replace('on-', '');
                            deleteShift(originalId);
                        } else {
                            deleteShift(s.id);
                        }

                        alert('ä¼‘ã¿ã«å¤‰æ›´ã—ã¾ã—ãŸã€‚');
                        render();
                    }
                }
            }, 100);
        }
    };


    if (dayOffBtn) {
        dayOffBtn.onclick = handleDayOff;
        dayOffBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDayOff();
        }, { passive: false });
    }

    // åˆå‰åŠä¼‘ãƒœã‚¿ãƒ³
    const morningHalfDayBtn = document.getElementById('popoverMorningHalfDayBtn');
    const handleMorningHalfDay = () => {
        if (state.currentPopoverShift) {
            const s = state.currentPopoverShift;
            closeShiftPopover();
            setTimeout(() => {
                if (confirm('ã“ã®ã‚·ãƒ•ãƒˆã‚’åˆå‰åŠä¼‘ã«ã—ã¾ã™ã‹ï¼Ÿ\nåˆå‰ä¸­ï¼ˆã€œ12:00ï¼‰ãŒä¼‘ã¿ã«ãªã‚Šã¾ã™ã€‚')) {
                    createHalfDayOff(s, 'morning');
                }
            }, 100);
        }
    };

    if (morningHalfDayBtn) {
        morningHalfDayBtn.onclick = handleMorningHalfDay;
        morningHalfDayBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMorningHalfDay();
        }, { passive: false });
    }

    // åˆå¾ŒåŠä¼‘ãƒœã‚¿ãƒ³
    const afternoonHalfDayBtn = document.getElementById('popoverAfternoonHalfDayBtn');
    const handleAfternoonHalfDay = () => {
        if (state.currentPopoverShift) {
            const s = state.currentPopoverShift;
            closeShiftPopover();
            setTimeout(() => {
                if (confirm('ã“ã®ã‚·ãƒ•ãƒˆã‚’åˆå¾ŒåŠä¼‘ã«ã—ã¾ã™ã‹ï¼Ÿ\nåˆå¾Œï¼ˆ12:00ã€œï¼‰ãŒä¼‘ã¿ã«ãªã‚Šã¾ã™ã€‚')) {
                    createHalfDayOff(s, 'afternoon');
                }
            }, 100);
        }
    };

    if (afternoonHalfDayBtn) {
        afternoonHalfDayBtn.onclick = handleAfternoonHalfDay;
        afternoonHalfDayBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAfternoonHalfDay();
        }, { passive: false });
    }

    // ã€Œã“ã®æ—¥ã®ã¿å¤‰æ›´ã€ãƒœã‚¿ãƒ³
    const overrideBtn = document.getElementById('popoverOverrideBtn');
    const handleOverride = () => {
        if (state.currentPopoverShift && state.currentPopoverShift.isFixed) {
            const s = state.currentPopoverShift;
            closeShiftPopover();
            setTimeout(() => {
                openShiftOverrideModal(s);
            }, 100);
        }
    };

    if (overrideBtn) {
        overrideBtn.onclick = handleOverride;
        overrideBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOverride();
        }, { passive: false });
    }

    // å¤–å´ã‚¯ãƒªãƒƒã‚¯/ã‚¿ãƒƒãƒã§é–‰ã˜ã‚‹
    const handleOutsideInteraction = (e) => {
        if (popover && popover.classList.contains('active')) {
            // ã‚¿ãƒƒãƒã‚¤ãƒ™ãƒ³ãƒˆã®å ´åˆã¯ä½ç½®ã‹ã‚‰è¦ç´ ã‚’å–å¾—
            let targetElement = e.target;
            if (e.type === 'touchend' && e.changedTouches && e.changedTouches[0]) {
                const touch = e.changedTouches[0];
                targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
            }

            if (targetElement && !popover.contains(targetElement) && !targetElement.closest('.shift-bar')) {
                closeShiftPopover();
            }
        }
    };

    document.addEventListener('click', handleOutsideInteraction);
    document.addEventListener('touchend', handleOutsideInteraction, { passive: true });


    // Escapeã‚­ãƒ¼ã§é–‰ã˜ã‚‹
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popover && popover.classList.contains('active')) {
            closeShiftPopover();
        }
    });
}

// åˆæœŸåŒ–
function init() {
    // ã‚¢ãƒ—ãƒªé–²è¦§ã‚’ãƒˆãƒ©ãƒƒã‚­ãƒ³ã‚°
    trackUsage('app_view', 'åŒ¿å');
    
    initTimeSelects();
    initEventListeners();
    initZoomControls();
    initPdfExport();
    initPopoverEvents();
    initEventModal();
    initAdvisorGroupToggle(); // ã‚°ãƒ«ãƒ¼ãƒ—ãƒˆã‚°ãƒ«ã‚’åˆæœŸåŒ–
    initReportsGroupToggle(); // ãƒ¬ãƒãƒ¼ãƒˆã‚°ãƒ«ãƒ¼ãƒ—ã®ãƒˆã‚°ãƒ«ã‚’åˆæœŸåŒ–
    initTrendReportToggle(); // ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆã®ãƒˆã‚°ãƒ«ã‚’åˆæœŸåŒ–
    initNewProductToggle(); // é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ã®ãƒˆã‚°ãƒ«ã‚’åˆæœŸåŒ–
    loadData();
    render();

    // å¤©æ°—ãƒ‡ãƒ¼ã‚¿ã‚’å–å¾—
    fetchWeatherData();

    // ã‚¦ã‚£ãƒ³ãƒ‰ã‚¦ãƒªã‚µã‚¤ã‚ºæ™‚ã«ã‚·ãƒ•ãƒˆãƒãƒ¼ã‚’å†æç”»
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            render();
            applyZoom();
        }, 100);
    });
}

// ========================================
// ã‚¤ãƒ™ãƒ³ãƒˆï¼ˆåº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ï¼‰é–¢é€£ã®é–¢æ•°
// ========================================

// ã‚¤ãƒ™ãƒ³ãƒˆã‚¿ã‚¤ãƒ—ã¨ã‚¢ã‚¤ã‚³ãƒ³ã®ãƒžãƒƒãƒ”ãƒ³ã‚°
function getEventTypeIcons() {
    return {
        sale: 'ðŸ·ï¸',
        notice: 'ðŸ“¢',
        training: 'ðŸ“š',
        inventory: 'ðŸ“¦',
        delivery: 'ðŸšš',
        other: 'ðŸ“Œ'
    };
}

// ã‚¤ãƒ™ãƒ³ãƒˆã‚¿ã‚¤ãƒ—åã‚’å–å¾—
function getEventTypeName(type) {
    const names = {
        sale: 'ã‚»ãƒ¼ãƒ«',
        notice: 'é€£çµ¡äº‹é …',
        training: 'ç ”ä¿®',
        inventory: 'æ£šå¸',
        delivery: 'ç‰¹ç™ºç´å“',
        other: 'ãã®ä»–'
    };
    return names[type] || 'ãã®ä»–';
}

// ã‚¤ãƒ™ãƒ³ãƒˆè¿½åŠ 
function addDailyEvent(data) {
    const event = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...data
    };
    state.dailyEvents.push(event);
    saveToFirebase('dailyEvents', state.dailyEvents);
    trackUsage('add_daily_event', 'ç®¡ç†è€…');
}

// ã‚¤ãƒ™ãƒ³ãƒˆæ›´æ–°
function updateDailyEvent(id, data) {
    const index = state.dailyEvents.findIndex(e => e.id === id);
    if (index >= 0) {
        state.dailyEvents[index] = { ...state.dailyEvents[index], ...data };
        saveToFirebase('dailyEvents', state.dailyEvents);
        trackUsage('edit_daily_event', 'ç®¡ç†è€…');
    }
}

// ã‚¤ãƒ™ãƒ³ãƒˆå‰Šé™¤
function deleteDailyEvent(id) {
    state.dailyEvents = state.dailyEvents.filter(e => e.id !== id);
    saveToFirebase('dailyEvents', state.dailyEvents);
}

// ã‚¤ãƒ™ãƒ³ãƒˆè©³ç´°ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã‚’è¡¨ç¤º
function showEventPopover(dateStr, event) {
    const popover = document.getElementById('eventPopover');
    const body = document.getElementById('eventPopoverBody');

    // æœŸé–“å†…ã«ã‚ã‚‹æ—¥ä»˜ã‚’å«ã‚€ã‚¤ãƒ™ãƒ³ãƒˆã‚’å–å¾—
    const dayEvents = state.dailyEvents.filter(e => {
        const startDate = e.startDate || e.date; // å¾Œæ–¹äº’æ›æ€§
        const endDate = e.endDate || e.date;
        return dateStr >= startDate && dateStr <= endDate;
    });
    if (dayEvents.length === 0) return;

    // æ—¥ä»˜ã‚’è¡¨ç¤ºç”¨ã«ãƒ•ã‚©ãƒ¼ãƒžãƒƒãƒˆ
    const dateObj = new Date(dateStr);
    const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
    const dateDisplay = `${dateObj.getMonth() + 1}æœˆ${dateObj.getDate()}æ—¥ï¼ˆ${dayNames[dateObj.getDay()]}ï¼‰`;

    document.getElementById('eventPopoverTitle').textContent = `ðŸ“… ${dateDisplay}`;

    const icons = getEventTypeIcons();

    // ã‚¤ãƒ™ãƒ³ãƒˆä¸€è¦§ã‚’ç”Ÿæˆ
    let html = '';
    dayEvents.forEach(e => {
        const icon = icons[e.type] || icons.other;
        html += `
            <div class="event-list-item">
                <div class="event-item-header">
                    <span class="event-item-icon">${icon}</span>
                    <span class="event-item-title">${e.title}</span>
                </div>
                ${e.description ? `<div class="event-item-description">${e.description.replace(/\n/g, '<br>')}</div>` : ''}
                ${state.isAdmin ? `
                <div class="event-item-actions">
                    <button class="btn btn-sm btn-secondary" onclick="openEditEventModal('${e.id}')">âœï¸ ç·¨é›†</button>
                    <button class="btn btn-sm btn-danger" onclick="confirmDeleteEvent('${e.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                </div>` : ''}
            </div>
        `;
    });

    body.innerHTML = html;

    // ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã®ä½ç½®ã‚’è¨ˆç®—
    const popoverWidth = 320;
    const popoverHeight = 250;
    let left, top;

    if (event.target) {
        const rect = event.target.getBoundingClientRect();
        left = rect.right + 10;
        top = rect.top;

        // å³ã«ã¯ã¿å‡ºã™å ´åˆã¯å·¦ã«é…ç½®
        if (left + popoverWidth > window.innerWidth - 10) {
            left = rect.left - popoverWidth - 10;
        }
    } else if (event.clientX !== undefined) {
        left = event.clientX;
        top = event.clientY;
    } else {
        left = (window.innerWidth - popoverWidth) / 2;
        top = (window.innerHeight - popoverHeight) / 2;
    }

    // ã¯ã¿å‡ºã—èª¿æ•´
    if (left < 10) left = 10;
    if (left + popoverWidth > window.innerWidth - 10) {
        left = window.innerWidth - popoverWidth - 10;
    }
    if (top < 10) top = 10;
    if (top + popoverHeight > window.innerHeight - 10) {
        top = window.innerHeight - popoverHeight - 10;
    }

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.classList.add('show');
}

// ã‚¤ãƒ™ãƒ³ãƒˆãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã‚’é–‰ã˜ã‚‹
function closeEventPopover() {
    const popover = document.getElementById('eventPopover');
    popover.classList.remove('show');
}

// ã‚¤ãƒ™ãƒ³ãƒˆå‰Šé™¤ç¢ºèª
function confirmDeleteEvent(id) {
    const event = state.dailyEvents.find(e => e.id === id);
    if (event && confirm(`ã€Œ${event.title}ã€ã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ`)) {
        trackUsage('delete_daily_event', 'ç®¡ç†è€…');
        deleteDailyEvent(id);
        closeEventPopover();
        render();
        if (state.isAdmin) renderAdminPanel();
    }
}

// ã‚¤ãƒ™ãƒ³ãƒˆè¿½åŠ ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openEventModal(date = null) {
    const overlay = document.getElementById('eventModalOverlay');
    const today = formatDate(new Date());
    document.getElementById('eventModalTitle').textContent = 'ðŸ“… ã‚¤ãƒ™ãƒ³ãƒˆè¿½åŠ ';
    document.getElementById('editEventId').value = '';
    document.getElementById('eventStartDate').value = date || today;
    document.getElementById('eventEndDate').value = date || today;
    document.getElementById('eventType').value = 'notice';
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDescription').value = '';
    document.getElementById('eventSubmitBtn').textContent = 'è¿½åŠ ';
    overlay.classList.add('active');
}

// ã‚¤ãƒ™ãƒ³ãƒˆç·¨é›†ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openEditEventModal(id) {
    closeEventPopover();
    const event = state.dailyEvents.find(e => e.id === id);
    if (!event) return;

    const overlay = document.getElementById('eventModalOverlay');
    document.getElementById('eventModalTitle').textContent = 'ðŸ“… ã‚¤ãƒ™ãƒ³ãƒˆç·¨é›†';
    document.getElementById('editEventId').value = id;
    // å¾Œæ–¹äº’æ›æ€§: æ—§ãƒ‡ãƒ¼ã‚¿ã¯dateã®ã¿ã®å ´åˆ
    document.getElementById('eventStartDate').value = event.startDate || event.date;
    document.getElementById('eventEndDate').value = event.endDate || event.date;
    document.getElementById('eventType').value = event.type;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventSubmitBtn').textContent = 'ä¿å­˜';
    overlay.classList.add('active');
}

// ã‚¤ãƒ™ãƒ³ãƒˆãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‰ã˜ã‚‹
function closeEventModal() {
    document.getElementById('eventModalOverlay').classList.remove('active');
}

// ã‚¤ãƒ™ãƒ³ãƒˆãƒ¢ãƒ¼ãƒ€ãƒ«ã®åˆæœŸåŒ–
function initEventModal() {
    const overlay = document.getElementById('eventModalOverlay');
    const closeBtn = document.getElementById('eventModalClose');
    const cancelBtn = document.getElementById('eventCancelBtn');
    const form = document.getElementById('eventForm');

    if (closeBtn) closeBtn.addEventListener('click', closeEventModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeEventModal);
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeEventModal();
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('editEventId').value;
            const data = {
                startDate: document.getElementById('eventStartDate').value,
                endDate: document.getElementById('eventEndDate').value,
                type: document.getElementById('eventType').value,
                title: document.getElementById('eventTitle').value,
                description: document.getElementById('eventDescription').value
            };

            if (id) {
                updateDailyEvent(id, data);
            } else {
                addDailyEvent(data);
            }

            closeEventModal();
            render();
            if (state.isAdmin) renderAdminPanel();
        });
    }

    // ã‚¤ãƒ™ãƒ³ãƒˆãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼ã®é–‰ã˜ã‚‹ãƒœã‚¿ãƒ³
    const popoverClose = document.getElementById('eventPopoverClose');
    if (popoverClose) {
        popoverClose.addEventListener('click', closeEventPopover);
    }

    // ãƒãƒƒãƒ—ã‚ªãƒ¼ãƒãƒ¼å¤–ã‚¯ãƒªãƒƒã‚¯ã§é–‰ã˜ã‚‹
    document.addEventListener('click', (e) => {
        const popover = document.getElementById('eventPopover');
        if (popover && popover.classList.contains('show')) {
            if (!popover.contains(e.target) && !e.target.closest('.event-icon')) {
                closeEventPopover();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init);

// ========================================
// æ—¥æœ¬ã®ç¥æ—¥é–¢é€£ã®é–¢æ•°
// ========================================

// æ—¥æœ¬ã®ç¥æ—¥ã‚’å–å¾—ï¼ˆ2024å¹´ã€œ2030å¹´å¯¾å¿œï¼‰
function getJapaneseHoliday(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dateStr = `${month}/${day}`;
    
    // å›ºå®šç¥æ—¥
    const fixedHolidays = {
        '1/1': 'å…ƒæ—¥',
        '2/11': 'å»ºå›½è¨˜å¿µã®æ—¥',
        '2/23': 'å¤©çš‡èª•ç”Ÿæ—¥',
        '4/29': 'æ˜­å’Œã®æ—¥',
        '5/3': 'æ†²æ³•è¨˜å¿µæ—¥',
        '5/4': 'ã¿ã©ã‚Šã®æ—¥',
        '5/5': 'ã“ã©ã‚‚ã®æ—¥',
        '8/11': 'å±±ã®æ—¥',
        '11/3': 'æ–‡åŒ–ã®æ—¥',
        '11/23': 'å‹¤åŠ´æ„Ÿè¬ã®æ—¥'
    };
    
    // å›ºå®šç¥æ—¥ãƒã‚§ãƒƒã‚¯
    if (fixedHolidays[dateStr]) {
        return fixedHolidays[dateStr];
    }
    
    // ãƒãƒƒãƒ”ãƒ¼ãƒžãƒ³ãƒ‡ãƒ¼ï¼ˆç¬¬næœˆæ›œæ—¥ï¼‰
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 1) { // æœˆæ›œæ—¥ã®ã¿ãƒã‚§ãƒƒã‚¯
        const weekNum = Math.ceil(day / 7);
        
        // æˆäººã®æ—¥ï¼ˆ1æœˆç¬¬2æœˆæ›œï¼‰
        if (month === 1 && weekNum === 2) return 'æˆäººã®æ—¥';
        // æµ·ã®æ—¥ï¼ˆ7æœˆç¬¬3æœˆæ›œï¼‰
        if (month === 7 && weekNum === 3) return 'æµ·ã®æ—¥';
        // æ•¬è€ã®æ—¥ï¼ˆ9æœˆç¬¬3æœˆæ›œï¼‰
        if (month === 9 && weekNum === 3) return 'æ•¬è€ã®æ—¥';
        // ã‚¹ãƒãƒ¼ãƒ„ã®æ—¥ï¼ˆ10æœˆç¬¬2æœˆæ›œï¼‰
        if (month === 10 && weekNum === 2) return 'ã‚¹ãƒãƒ¼ãƒ„ã®æ—¥';
    }
    
    // æ˜¥åˆ†ã®æ—¥ï¼ˆ3æœˆ20æ—¥ã¾ãŸã¯21æ—¥ï¼‰
    if (month === 3) {
        const vernalEquinox = calcVernalEquinox(year);
        if (day === vernalEquinox) return 'æ˜¥åˆ†ã®æ—¥';
    }
    
    // ç§‹åˆ†ã®æ—¥ï¼ˆ9æœˆ22æ—¥ã¾ãŸã¯23æ—¥ï¼‰
    if (month === 9) {
        const autumnalEquinox = calcAutumnalEquinox(year);
        if (day === autumnalEquinox) return 'ç§‹åˆ†ã®æ—¥';
    }
    
    // æŒ¯æ›¿ä¼‘æ—¥ãƒã‚§ãƒƒã‚¯ï¼ˆç¥æ—¥ãŒæ—¥æ›œã®å ´åˆã€ç¿Œæ—¥ãŒä¼‘ã¿ï¼‰
    if (dayOfWeek === 1) { // æœˆæ›œæ—¥
        const yesterday = new Date(d);
        yesterday.setDate(day - 1);
        const yesterdayHoliday = getHolidayName(yesterday);
        if (yesterdayHoliday) {
            return 'æŒ¯æ›¿ä¼‘æ—¥';
        }
    }
    
    // å›½æ°‘ã®ä¼‘æ—¥ï¼ˆç¥æ—¥ã«æŒŸã¾ã‚ŒãŸå¹³æ—¥ï¼‰
    if (month === 9) {
        // æ•¬è€ã®æ—¥ã¨ç§‹åˆ†ã®æ—¥ã«æŒŸã¾ã‚Œã‚‹å ´åˆ
        const keirouDay = getHappyMonday(year, 9, 3); // 9æœˆç¬¬3æœˆæ›œ
        const autumnalEquinox = calcAutumnalEquinox(year);
        if (day > keirouDay && day < autumnalEquinox && autumnalEquinox - keirouDay === 2) {
            return 'å›½æ°‘ã®ä¼‘æ—¥';
        }
    }
    
    return null;
}

// ç¥æ—¥åã‚’å–å¾—ï¼ˆæŒ¯æ›¿ä¼‘æ—¥åˆ¤å®šç”¨ã®ãƒ˜ãƒ«ãƒ‘ãƒ¼ï¼‰
function getHolidayName(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dateStr = `${month}/${day}`;
    
    const fixedHolidays = {
        '1/1': 'å…ƒæ—¥',
        '2/11': 'å»ºå›½è¨˜å¿µã®æ—¥',
        '2/23': 'å¤©çš‡èª•ç”Ÿæ—¥',
        '4/29': 'æ˜­å’Œã®æ—¥',
        '5/3': 'æ†²æ³•è¨˜å¿µæ—¥',
        '5/4': 'ã¿ã©ã‚Šã®æ—¥',
        '5/5': 'ã“ã©ã‚‚ã®æ—¥',
        '8/11': 'å±±ã®æ—¥',
        '11/3': 'æ–‡åŒ–ã®æ—¥',
        '11/23': 'å‹¤åŠ´æ„Ÿè¬ã®æ—¥'
    };
    
    if (fixedHolidays[dateStr]) return fixedHolidays[dateStr];
    
    // ãƒãƒƒãƒ”ãƒ¼ãƒžãƒ³ãƒ‡ãƒ¼
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 1) {
        const weekNum = Math.ceil(day / 7);
        if (month === 1 && weekNum === 2) return 'æˆäººã®æ—¥';
        if (month === 7 && weekNum === 3) return 'æµ·ã®æ—¥';
        if (month === 9 && weekNum === 3) return 'æ•¬è€ã®æ—¥';
        if (month === 10 && weekNum === 2) return 'ã‚¹ãƒãƒ¼ãƒ„ã®æ—¥';
    }
    
    // æ˜¥åˆ†ãƒ»ç§‹åˆ†
    if (month === 3 && day === calcVernalEquinox(year)) return 'æ˜¥åˆ†ã®æ—¥';
    if (month === 9 && day === calcAutumnalEquinox(year)) return 'ç§‹åˆ†ã®æ—¥';
    
    return null;
}

// ãƒãƒƒãƒ”ãƒ¼ãƒžãƒ³ãƒ‡ãƒ¼ã®æ—¥ä»˜ã‚’è¨ˆç®—
function getHappyMonday(year, month, weekNum) {
    const firstDay = new Date(year, month - 1, 1);
    const firstMonday = firstDay.getDay() <= 1 
        ? 1 + (1 - firstDay.getDay())
        : 1 + (8 - firstDay.getDay());
    return firstMonday + (weekNum - 1) * 7;
}

// æ˜¥åˆ†ã®æ—¥ã‚’è¨ˆç®—ï¼ˆç°¡æ˜“ç‰ˆï¼š2000å¹´ã€œ2099å¹´å¯¾å¿œï¼‰
function calcVernalEquinox(year) {
    if (year >= 2000 && year <= 2099) {
        return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    }
    return 21; // ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆ
}

// ç§‹åˆ†ã®æ—¥ã‚’è¨ˆç®—ï¼ˆç°¡æ˜“ç‰ˆï¼š2000å¹´ã€œ2099å¹´å¯¾å¿œï¼‰
function calcAutumnalEquinox(year) {
    if (year >= 2000 && year <= 2099) {
        return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
    }
    return 23; // ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆ
}

// ç¥æ—¥ã‹ã©ã†ã‹ã‚’åˆ¤å®šï¼ˆå¤–éƒ¨ã‹ã‚‰å‘¼ã³å‡ºã—å¯èƒ½ï¼‰
function isJapaneseHoliday(date) {
    return getJapaneseHoliday(date) !== null;
}

// ========================================
// çµ¦æ–™æ—¥ãƒ»å¹´é‡‘æ”¯çµ¦æ—¥é–¢é€£ã®é–¢æ•°
// ========================================

// çµ¦æ–™æ—¥è¨­å®šï¼ˆãƒ‡ãƒ•ã‚©ãƒ«ãƒˆå€¤ï¼‰
const PAYDAY_SETTINGS = {
    salaryDays: [25], // çµ¦æ–™æ—¥ï¼ˆè¤‡æ•°è¨­å®šå¯èƒ½ï¼‰
    pensionEnabled: true // å¹´é‡‘æ”¯çµ¦æ—¥ã‚’è¡¨ç¤ºã™ã‚‹ã‹
};

// çµ¦æ–™æ—¥ãƒ»å¹´é‡‘æ”¯çµ¦æ—¥ã®æƒ…å ±ã‚’å–å¾—
function getPayDayInfo(date) {
    const result = [];
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // 1-12
    const dayOfWeek = d.getDay(); // 0=æ—¥, 6=åœŸ
    
    // çµ¦æ–™æ—¥ãƒã‚§ãƒƒã‚¯
    PAYDAY_SETTINGS.salaryDays.forEach(salaryDay => {
        if (isPayDay(d, salaryDay)) {
            result.push({
                type: 'salary',
                icon: 'ðŸ’°',
                label: 'çµ¦æ–™æ—¥',
                shortLabel: 'çµ¦æ–™æ—¥'
            });
        }
    });
    
    // å¹´é‡‘æ”¯çµ¦æ—¥ãƒã‚§ãƒƒã‚¯ï¼ˆå¶æ•°æœˆã®15æ—¥ã€åœŸæ—¥ç¥ã®å ´åˆã¯ç›´å‰ã®å¹³æ—¥ï¼‰
    if (PAYDAY_SETTINGS.pensionEnabled && isPensionDay(d)) {
        result.push({
            type: 'pension',
            icon: 'ðŸ‘´',
            label: 'å¹´é‡‘æ”¯çµ¦æ—¥',
            shortLabel: 'å¹´é‡‘'
        });
    }
    
    return result;
}

// çµ¦æ–™æ—¥ã‹ã©ã†ã‹ã‚’åˆ¤å®šï¼ˆåœŸæ—¥ã®å ´åˆã¯ç›´å‰ã®å¹³æ—¥ï¼‰
function isPayDay(date, salaryDay) {
    const d = new Date(date);
    const day = d.getDate();
    const year = d.getFullYear();
    const month = d.getMonth();
    
    // ãã®æœˆã®çµ¦æ–™æ—¥ã‚’è¨ˆç®—
    let payDate = new Date(year, month, salaryDay);
    
    // çµ¦æ–™æ—¥ãŒå­˜åœ¨ã—ãªã„å ´åˆï¼ˆä¾‹ï¼š2æœˆ30æ—¥ï¼‰ã¯æœˆæœ«ã«èª¿æ•´
    if (payDate.getMonth() !== month) {
        payDate = new Date(year, month + 1, 0); // æœˆæœ«æ—¥
    }
    
    // åœŸæ—¥ã®å ´åˆã¯ç›´å‰ã®å¹³æ—¥ã«èª¿æ•´
    while (payDate.getDay() === 0 || payDate.getDay() === 6) {
        payDate.setDate(payDate.getDate() - 1);
    }
    
    return d.getDate() === payDate.getDate() && 
           d.getMonth() === payDate.getMonth() && 
           d.getFullYear() === payDate.getFullYear();
}

// å¹´é‡‘æ”¯çµ¦æ—¥ã‹ã©ã†ã‹ã‚’åˆ¤å®šï¼ˆå¶æ•°æœˆã®15æ—¥ã€åœŸæ—¥ã®å ´åˆã¯ç›´å‰ã®å¹³æ—¥ï¼‰
function isPensionDay(date) {
    const d = new Date(date);
    const month = d.getMonth() + 1; // 1-12
    
    // å¶æ•°æœˆã®ã¿
    if (month % 2 !== 0) return false;
    
    const year = d.getFullYear();
    
    // ãã®æœˆã®15æ—¥ã‚’å–å¾—
    let pensionDate = new Date(year, d.getMonth(), 15);
    
    // åœŸæ—¥ã®å ´åˆã¯ç›´å‰ã®å¹³æ—¥ã«èª¿æ•´
    while (pensionDate.getDay() === 0 || pensionDate.getDay() === 6) {
        pensionDate.setDate(pensionDate.getDate() - 1);
    }
    
    return d.getDate() === pensionDate.getDate() && 
           d.getMonth() === pensionDate.getMonth() && 
           d.getFullYear() === pensionDate.getFullYear();
}

// ========================================
// å¤©æ°—äºˆå ±é–¢é€£ã®é–¢æ•°
// ========================================

// å¤©æ°—ã‚³ãƒ¼ãƒ‰ã‹ã‚‰ã‚¢ã‚¤ã‚³ãƒ³ã¨èª¬æ˜Žã‚’å–å¾—
function getWeatherInfo(weatherCode) {
    const weatherMap = {
        0: { icon: 'â˜€ï¸', desc: 'å¿«æ™´' },
        1: { icon: 'ðŸŒ¤ï¸', desc: 'æ™´ã‚Œ' },
        2: { icon: 'â›…', desc: 'æ›‡ã‚ŠãŒã¡' },
        3: { icon: 'â˜ï¸', desc: 'æ›‡ã‚Š' },
        45: { icon: 'ðŸŒ«ï¸', desc: 'éœ§' },
        48: { icon: 'ðŸŒ«ï¸', desc: 'ç€æ°·éœ§' },
        51: { icon: 'ðŸŒ§ï¸', desc: 'å¼±ã„éœ§é›¨' },
        53: { icon: 'ðŸŒ§ï¸', desc: 'éœ§é›¨' },
        55: { icon: 'ðŸŒ§ï¸', desc: 'å¼·ã„éœ§é›¨' },
        56: { icon: 'ðŸŒ§ï¸', desc: 'ç€æ°·éœ§é›¨' },
        57: { icon: 'ðŸŒ§ï¸', desc: 'å¼·ã„ç€æ°·éœ§é›¨' },
        61: { icon: 'ðŸŒ§ï¸', desc: 'å¼±ã„é›¨' },
        63: { icon: 'ðŸŒ§ï¸', desc: 'é›¨' },
        65: { icon: 'ðŸŒ§ï¸', desc: 'å¼·ã„é›¨' },
        66: { icon: 'ðŸŒ§ï¸', desc: 'ç€æ°·æ€§ã®é›¨' },
        67: { icon: 'ðŸŒ§ï¸', desc: 'å¼·ã„ç€æ°·æ€§ã®é›¨' },
        71: { icon: 'â„ï¸', desc: 'å¼±ã„é›ª' },
        73: { icon: 'â„ï¸', desc: 'é›ª' },
        75: { icon: 'â„ï¸', desc: 'å¼·ã„é›ª' },
        77: { icon: 'ðŸŒ¨ï¸', desc: 'éœ§é›ª' },
        80: { icon: 'ðŸŒ¦ï¸', desc: 'ã«ã‚ã‹é›¨' },
        81: { icon: 'ðŸŒ§ï¸', desc: 'å¼·ã„ã«ã‚ã‹é›¨' },
        82: { icon: 'â›ˆï¸', desc: 'æ¿€ã—ã„ã«ã‚ã‹é›¨' },
        85: { icon: 'ðŸŒ¨ï¸', desc: 'ã«ã‚ã‹é›ª' },
        86: { icon: 'â„ï¸', desc: 'å¼·ã„ã«ã‚ã‹é›ª' },
        95: { icon: 'â›ˆï¸', desc: 'é›·é›¨' },
        96: { icon: 'â›ˆï¸', desc: 'é›·é›¨ï¼ˆé›¹ï¼‰' },
        99: { icon: 'â›ˆï¸', desc: 'æ¿€ã—ã„é›·é›¨ï¼ˆé›¹ï¼‰' }
    };
    return weatherMap[weatherCode] || { icon: 'â“', desc: 'ä¸æ˜Ž' };
}

// é€±é–“å¤©æ°—äºˆå ±ã‚’å–å¾—ï¼ˆä»Šå¹´ï¼‹æ˜¨å¹´æ¯”è¼ƒï¼‰
async function fetchWeatherData() {
    try {
        // è¡¨ç¤ºã—ã¦ã„ã‚‹é€±ã®æ—¥ä»˜ç¯„å›²ã‚’è¨ˆç®—
        const startDate = formatDate(state.currentWeekStart);
        const endDate = new Date(state.currentWeekStart);
        endDate.setDate(endDate.getDate() + 6);
        const endDateStr = formatDate(endDate);

        // æ˜¨å¹´ã®åŒã˜æœŸé–“ã‚’è¨ˆç®—
        const lastYearStart = new Date(state.currentWeekStart);
        lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
        const lastYearEnd = new Date(endDate);
        lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
        const lastYearStartStr = formatDate(lastYearStart);
        const lastYearEndStr = formatDate(lastYearEnd);

        // ä»Šå¹´ã®å¤©æ°—äºˆå ±ã‚’å–å¾—
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${STORE_LOCATION.latitude}&longitude=${STORE_LOCATION.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Tokyo&start_date=${startDate}&end_date=${endDateStr}`;

        // æ˜¨å¹´ã®éŽåŽ»ãƒ‡ãƒ¼ã‚¿ã‚’å–å¾—ï¼ˆOpen-Meteo Archive APIï¼‰
        const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${STORE_LOCATION.latitude}&longitude=${STORE_LOCATION.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Tokyo&start_date=${lastYearStartStr}&end_date=${lastYearEndStr}`;

        // ä¸¡æ–¹ã®APIã‚’ä¸¦åˆ—ã§å‘¼ã³å‡ºã—
        const [forecastRes, archiveRes] = await Promise.all([
            fetch(forecastUrl),
            fetch(archiveUrl)
        ]);

        if (!forecastRes.ok) throw new Error('å¤©æ°—ãƒ‡ãƒ¼ã‚¿ã®å–å¾—ã«å¤±æ•—ã—ã¾ã—ãŸ');

        const forecastData = await forecastRes.json();

        // æ˜¨å¹´ãƒ‡ãƒ¼ã‚¿ã‚’æ—¥ä»˜ãƒžãƒƒãƒ—ã«æ•´ç†
        const lastYearData = {};
        if (archiveRes.ok) {
            const archiveData = await archiveRes.json();
            if (archiveData.daily && archiveData.daily.time) {
                archiveData.daily.time.forEach((date, index) => {
                    lastYearData[date] = {
                        tempMax: Math.round(archiveData.daily.temperature_2m_max[index]),
                        tempMin: Math.round(archiveData.daily.temperature_2m_min[index])
                    };
                });
            }
        }

        // æ—¥ä»˜åˆ¥ã«å¤©æ°—ãƒ‡ãƒ¼ã‚¿ã‚’æ•´ç†
        state.weatherData = {};
        if (forecastData.daily && forecastData.daily.time) {
            forecastData.daily.time.forEach((date, index) => {
                // ä»Šå¹´ã®æ—¥ä»˜ã‹ã‚‰æ˜¨å¹´ã®å¯¾å¿œæ—¥ä»˜ã‚’è¨ˆç®—
                const currentDate = new Date(date);
                const lastYearDate = new Date(currentDate);
                lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
                const lastYearDateStr = formatDate(lastYearDate);

                const lastYear = lastYearData[lastYearDateStr];

                state.weatherData[date] = {
                    weatherCode: forecastData.daily.weather_code[index],
                    tempMax: Math.round(forecastData.daily.temperature_2m_max[index]),
                    tempMin: Math.round(forecastData.daily.temperature_2m_min[index]),
                    // æ˜¨å¹´ãƒ‡ãƒ¼ã‚¿
                    lastYearTempMax: lastYear ? lastYear.tempMax : null,
                    lastYearTempMin: lastYear ? lastYear.tempMin : null
                };
            });
        }

        // å¤©æ°—ãƒ‡ãƒ¼ã‚¿ãŒæ›´æ–°ã•ã‚ŒãŸã‚‰å†æç”»
        render();
        // æ‹¡å¼µç‰ˆç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼ã‚’æ›´æ–°
        renderOrderAdvisorExtended();
        console.log('å¤©æ°—ãƒ‡ãƒ¼ã‚¿ã‚’å–å¾—ã—ã¾ã—ãŸ:', state.weatherData);
    } catch (error) {
        console.error('å¤©æ°—ãƒ‡ãƒ¼ã‚¿å–å¾—ã‚¨ãƒ©ãƒ¼:', error);
    }
}

// ========================================
// ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼æ©Ÿèƒ½ï¼ˆæ‹¡å¼µç‰ˆï¼‰
// ========================================

// 8ã‚«ãƒ†ã‚´ãƒªã®å®šç¾©ï¼ˆã‚µãƒ–ã‚«ãƒ†ã‚´ãƒªä»˜ãï¼‰
const ORDER_CATEGORIES = [
    {
        id: 'rice', name: 'ç±³é£¯', icon: 'ðŸ™', stable: true,
        subcategories: [
            { id: 'bento', name: 'å¼å½“', tempEffect: 'slight_warm' },
            { id: 'onigiri', name: 'ãŠã«ãŽã‚Š', tempEffect: 'neutral' },
            { id: 'sushi', name: 'å¯¿å¸é¡ž', tempEffect: 'neutral' }
        ]
    },
    {
        id: 'bread', name: 'èª¿ç†ãƒ‘ãƒ³', icon: 'ðŸ¥',
        subcategories: [
            { id: 'savory_warm', name: 'æƒ£èœãƒ‘ãƒ³ï¼ˆæ¸©ï¼‰', tempEffect: 'warm' },
            { id: 'sandwich_cold', name: 'ã‚µãƒ³ãƒ‰é¡žï¼ˆå†·ï¼‰', tempEffect: 'cold' },
            { id: 'sweet_bread', name: 'è“å­ãƒ‘ãƒ³', tempEffect: 'neutral' }
        ]
    },
    {
        id: 'noodles', name: 'éººé¡žãã®ä»–', icon: 'ðŸœ', highImpact: true,
        subcategories: [
            { id: 'ramen', name: 'ãƒ©ãƒ¼ãƒ¡ãƒ³ï¼ˆæ¸©ï¼‰', tempEffect: 'hot_strong' },
            { id: 'udon_soba', name: 'ã†ã©ã‚“ãƒ»ãã°ï¼ˆæ¸©ï¼‰', tempEffect: 'hot_strong' },
            { id: 'cup_noodle', name: 'ã‚«ãƒƒãƒ—éºº', tempEffect: 'warm' },
            { id: 'cold_noodle', name: 'å†·ã‚„ã—éºº', tempEffect: 'cold_strong' }
        ]
    },
    {
        id: 'dessert', name: 'ãƒ‡ã‚¶ãƒ¼ãƒˆ', icon: 'ðŸ°',
        subcategories: [
            { id: 'ice', name: 'ã‚¢ã‚¤ã‚¹', tempEffect: 'cold_strong' },
            { id: 'jelly', name: 'ã‚¼ãƒªãƒ¼ãƒ»ãƒ—ãƒªãƒ³', tempEffect: 'cold' },
            { id: 'cream_puff', name: 'ã‚·ãƒ¥ãƒ¼ã‚¯ãƒªãƒ¼ãƒ ç³»', tempEffect: 'slight_cold' }
        ]
    },
    {
        id: 'pastry', name: 'ãƒšã‚¹ãƒˆãƒªãƒ¼', icon: 'ðŸ¥§', stable: true,
        subcategories: [
            { id: 'baked', name: 'ç„¼ãè“å­', tempEffect: 'neutral' },
            { id: 'donut', name: 'ãƒ‰ãƒ¼ãƒŠãƒ„', tempEffect: 'neutral' },
            { id: 'tart', name: 'ã‚¿ãƒ«ãƒˆ', tempEffect: 'neutral' }
        ]
    },
    {
        id: 'salad', name: 'ã‚µãƒ©ãƒ€ãƒ»æƒ£èœ', icon: 'ðŸ¥—',
        subcategories: [
            { id: 'salad', name: 'ã‚µãƒ©ãƒ€', tempEffect: 'cold' },
            { id: 'hot_deli', name: 'æ¸©æƒ£èœï¼ˆã‚°ãƒ©ã‚¿ãƒ³ç­‰ï¼‰', tempEffect: 'hot_strong' },
            { id: 'chilled_deli', name: 'ãƒãƒ«ãƒ‰æƒ£èœ', tempEffect: 'slight_cold' }
        ]
    },
    {
        id: 'delica', name: '7Pãƒ‡ãƒªã‚«', icon: 'ðŸ±',
        subcategories: [
            { id: 'oden', name: 'ãŠã§ã‚“', tempEffect: 'hot_max' },
            { id: 'nikuman', name: 'ä¸­è¯ã¾ã‚“', tempEffect: 'hot_max' },
            { id: 'fryer', name: 'ãƒ•ãƒ©ã‚¤ãƒ¤ãƒ¼å•†å“', tempEffect: 'warm' }
        ]
    },
    {
        id: 'milk', name: 'ç‰›ä¹³ä¹³é£²æ–™', icon: 'ðŸ¥›', stable: true,
        subcategories: [
            { id: 'milk', name: 'ç‰›ä¹³', tempEffect: 'neutral' },
            { id: 'yogurt', name: 'ãƒ¨ãƒ¼ã‚°ãƒ«ãƒˆ', tempEffect: 'neutral' },
            { id: 'coffee', name: 'ã‚³ãƒ¼ãƒ’ãƒ¼é£²æ–™', tempEffect: 'neutral' }
        ]
    }
];

// æ—§ã‚«ãƒ†ã‚´ãƒªï¼ˆäº’æ›æ€§ã®ãŸã‚ä¿æŒï¼‰
const PRODUCT_CATEGORIES = [
    { id: 'onigiri', name: 'ãŠã«ãŽã‚Š', icon: 'ðŸ™' },
    { id: 'bento', name: 'å¼å½“', icon: 'ðŸ±' },
    { id: 'sandwich', name: 'ã‚µãƒ³ãƒ‰ã‚¤ãƒƒãƒ', icon: 'ðŸ¥ª' },
    { id: 'cold_noodle', name: 'èª¿ç†éºº(å†·)', icon: 'ðŸœ' },
    { id: 'hot_noodle', name: 'èª¿ç†éºº(æ¸©)', icon: 'ðŸ²' },
    { id: 'gratin', name: 'ã‚°ãƒ©ã‚¿ãƒ³ãƒ»ãƒ‰ãƒªã‚¢', icon: 'ðŸ§€' },
    { id: 'spaghetti', name: 'ã‚¹ãƒ‘ã‚²ãƒ†ã‚£', icon: 'ðŸ' },
    { id: 'salad', name: 'ã‚µãƒ©ãƒ€', icon: 'ðŸ¥—' },
    { id: 'sozai', name: 'æƒ£èœ', icon: 'ðŸ³' },
    { id: 'pastry', name: 'ãƒšã‚¹ãƒˆãƒªãƒ¼', icon: 'ðŸ¥' },
    { id: 'dessert', name: 'ãƒ‡ã‚¶ãƒ¼ãƒˆ', icon: 'ðŸ°' }
];

// æ°—æ¸©å¸¯ã®åˆ¤å®š
function getTemperatureZone(temp) {
    if (temp <= 0) return { zone: 'extreme_cold', label: 'æ¥µå¯’', effect: 'hot_max', color: '#3b82f6' };
    if (temp <= 5) return { zone: 'severe_cold', label: 'åŽ³å¯’', effect: 'hot_high', color: '#60a5fa' };
    if (temp <= 10) return { zone: 'cold', label: 'å¯’ã„', effect: 'hot_mid', color: '#93c5fd' };
    if (temp <= 15) return { zone: 'cool', label: 'æ¶¼ã—ã„', effect: 'slight_hot', color: '#a5b4fc' };
    if (temp <= 20) return { zone: 'comfortable', label: 'å¿«é©', effect: 'neutral', color: '#c4b5fd' };
    if (temp <= 25) return { zone: 'warm', label: 'æš–ã‹ã„', effect: 'slight_cold', color: '#fcd34d' };
    if (temp <= 30) return { zone: 'hot', label: 'æš‘ã„', effect: 'cold_mid', color: '#fb923c' };
    return { zone: 'extreme_hot', label: 'çŒ›æš‘', effect: 'cold_max', color: '#ef4444' };
}

// tempEffectã«åŸºã¥ã„ã¦æŽ¨å¥¨å€¤ï¼ˆ%ï¼‰ã‚’è¨ˆç®—
function calculateTempEffectPercentage(tempEffect, tempZone) {
    const effectMatrix = {
        // æ¸©ã‹ã„å•†å“ã¸ã®å½±éŸ¿
        hot_max: { extreme_cold: 35, severe_cold: 30, cold: 25, cool: 15, comfortable: 0, warm: -10, hot: -20, extreme_hot: -30 },
        hot_strong: { extreme_cold: 30, severe_cold: 25, cold: 20, cool: 10, comfortable: 0, warm: -15, hot: -25, extreme_hot: -35 },
        warm: { extreme_cold: 15, severe_cold: 12, cold: 10, cool: 5, comfortable: 0, warm: -5, hot: -10, extreme_hot: -15 },
        slight_warm: { extreme_cold: 10, severe_cold: 8, cold: 5, cool: 3, comfortable: 0, warm: -3, hot: -5, extreme_hot: -8 },
        // ä¸­ç«‹
        neutral: { extreme_cold: 0, severe_cold: 0, cold: 0, cool: 0, comfortable: 0, warm: 0, hot: 0, extreme_hot: 0 },
        // å†·ãŸã„å•†å“ã¸ã®å½±éŸ¿
        slight_cold: { extreme_cold: -8, severe_cold: -5, cold: -3, cool: 0, comfortable: 0, warm: 3, hot: 5, extreme_hot: 8 },
        cold: { extreme_cold: -15, severe_cold: -12, cold: -10, cool: -5, comfortable: 0, warm: 5, hot: 10, extreme_hot: 15 },
        cold_strong: { extreme_cold: -40, severe_cold: -35, cold: -25, cool: -15, comfortable: 0, warm: 10, hot: 20, extreme_hot: 30 }
    };

    return effectMatrix[tempEffect]?.[tempZone.zone] || 0;
}

// ã‚«ãƒ†ã‚´ãƒªåˆ¥ã‚¢ãƒ‰ãƒã‚¤ã‚¹è¨ˆç®—
function calculateCategoryAdvice(category, weatherData, dayOfWeek) {
    if (!weatherData) return null;

    const { tempMax, tempMin, lastYearTempMax } = weatherData;
    const avgTemp = (tempMax + tempMin) / 2;
    const tempZone = getTemperatureZone(avgTemp);

    // æ˜¨å¹´æ¯”ã‚’è¨ˆç®—
    const lastYearDiff = lastYearTempMax !== null ? tempMax - lastYearTempMax : null;

    // ã‚µãƒ–ã‚«ãƒ†ã‚´ãƒªåˆ¥ã®æŽ¨å¥¨å€¤ã‚’è¨ˆç®—
    const subcategoryAdvice = category.subcategories.map(sub => {
        let percentage = calculateTempEffectPercentage(sub.tempEffect, tempZone);

        // æ˜¨å¹´æ¯”ã«ã‚ˆã‚‹èª¿æ•´ï¼ˆÂ±5Â°Cä»¥ä¸Šã®å·®ãŒã‚ã‚‹å ´åˆï¼‰
        if (lastYearDiff !== null && Math.abs(lastYearDiff) >= 5) {
            const isHotProduct = ['hot_max', 'hot_strong', 'warm', 'slight_warm'].includes(sub.tempEffect);
            const isColdProduct = ['cold_strong', 'cold', 'slight_cold'].includes(sub.tempEffect);

            if (lastYearDiff < 0 && isHotProduct) {
                percentage += Math.min(10, Math.abs(lastYearDiff));
            } else if (lastYearDiff > 0 && isColdProduct) {
                percentage += Math.min(10, lastYearDiff);
            }
        }

        return {
            ...sub,
            percentage: Math.round(percentage)
        };
    });

    // ã‚«ãƒ†ã‚´ãƒªå…¨ä½“ã®æŽ¨å¥¨å€¤ï¼ˆã‚µãƒ–ã‚«ãƒ†ã‚´ãƒªã®å¹³å‡ï¼‰
    const avgPercentage = Math.round(
        subcategoryAdvice.reduce((sum, sub) => sum + sub.percentage, 0) / subcategoryAdvice.length
    );

    return {
        ...category,
        percentage: avgPercentage,
        subcategoryAdvice,
        tempZone
    };
}

// å…¨ã‚«ãƒ†ã‚´ãƒªã®ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç”Ÿæˆ
function generateAllCategoryAdvice(weatherData) {
    if (!weatherData) return null;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayNames = ['æ—¥æ›œæ—¥', 'æœˆæ›œæ—¥', 'ç«æ›œæ—¥', 'æ°´æ›œæ—¥', 'æœ¨æ›œæ—¥', 'é‡‘æ›œæ—¥', 'åœŸæ›œæ—¥'];

    const { weatherCode, tempMax, tempMin, lastYearTempMax, lastYearTempMin } = weatherData;
    const avgTemp = (tempMax + tempMin) / 2;
    const tempZone = getTemperatureZone(avgTemp);
    const weatherInfo = getWeatherInfo(weatherCode);
    const lastYearDiff = lastYearTempMax !== null ? tempMax - lastYearTempMax : null;

    const categories = ORDER_CATEGORIES.map(cat =>
        calculateCategoryAdvice(cat, weatherData, dayOfWeek)
    );

    return {
        weather: weatherInfo,
        tempMax,
        tempMin,
        avgTemp,
        tempZone,
        lastYearDiff,
        dayOfWeek,
        dayName: dayNames[dayOfWeek],
        categories
    };
}

// æ—¥æ¬¡ãƒã‚§ãƒƒã‚¯ãƒªã‚¹ãƒˆä¿å­˜
function saveDailyChecklist(categoryId, date, data) {
    const key = `${date}-${categoryId}`;
    const checklistData = {
        id: key,
        date,
        categoryId,
        ...data,
        updatedAt: new Date().toISOString()
    };

    database.ref(`dailyChecklist/${key}`).set(checklistData);
    state.dailyChecklist[key] = checklistData;
}

// ã‚«ãƒ†ã‚´ãƒªãƒ¡ãƒ¢ä¿å­˜
function saveCategoryMemo(categoryId, date, content, tags = []) {
    const id = Date.now().toString();
    const memoData = {
        id,
        date,
        categoryId,
        content,
        tags,
        createdAt: new Date().toISOString()
    };

    state.categoryMemos.push(memoData);
    saveToFirebase('categoryMemos', state.categoryMemos);
}

// è“„ç©ãƒ‡ãƒ¼ã‚¿ã‹ã‚‰ã®å‚¾å‘è¨ˆç®—
function calculateTrends(categoryId, days = 7) {
    const today = new Date();
    const trends = {
        avgWaste: null,
        avgShortage: null,
        avgSales: null,
        memoCount: 0,
        commonTags: []
    };

    const wasteScores = [];
    const shortageScores = [];
    const salesScores = [];
    const tagCounts = {};

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        const key = `${dateStr}-${categoryId}`;

        const checklist = state.dailyChecklist[key];
        if (checklist) {
            const wasteScore = { high: 3, normal: 2, low: 1 }[checklist.waste] || 2;
            const shortageScore = { yes: 3, few: 2, none: 1 }[checklist.shortage] || 1;
            const salesScore = { good: 3, normal: 2, poor: 1 }[checklist.sales] || 2;

            wasteScores.push(wasteScore);
            shortageScores.push(shortageScore);
            salesScores.push(salesScore);
        }
    }

    // ãƒ¡ãƒ¢ã¨ã‚¿ã‚°ã®é›†è¨ˆ
    state.categoryMemos
        .filter(m => m.categoryId === categoryId)
        .forEach(m => {
            trends.memoCount++;
            m.tags?.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

    if (wasteScores.length > 0) {
        trends.avgWaste = wasteScores.reduce((a, b) => a + b, 0) / wasteScores.length;
        trends.avgShortage = shortageScores.reduce((a, b) => a + b, 0) / shortageScores.length;
        trends.avgSales = salesScores.reduce((a, b) => a + b, 0) / salesScores.length;
    }

    // ã‚ˆãä½¿ã‚ã‚Œã‚‹ã‚¿ã‚°ä¸Šä½3ã¤
    trends.commonTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag);

    return trends;
}

// å¤©æ°—ãƒ»æ°—æ¸©ã«åŸºã¥ãç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’ç”Ÿæˆ
function generateOrderAdvice(weatherData) {
    if (!weatherData) return null;

    const { weatherCode, tempMax, tempMin, lastYearTempMax, lastYearTempMin } = weatherData;
    const avgTemp = (tempMax + tempMin) / 2;
    const weatherInfo = getWeatherInfo(weatherCode);

    // å¤©æ°—ã®çŠ¶æ…‹ã‚’åˆ¤å®š
    const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode);
    const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);
    const isSunny = [0, 1].includes(weatherCode);
    const isCloudy = [2, 3].includes(weatherCode);

    // æ˜¨å¹´ã¨ã®æ°—æ¸©å·®
    const tempDiff = lastYearTempMax !== null ? tempMax - lastYearTempMax : null;

    // å„ã‚«ãƒ†ã‚´ãƒªã®ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’ç”Ÿæˆ
    const advice = PRODUCT_CATEGORIES.map(category => {
        let trend = 0; // -2ã€œ+2 ã®ç¯„å›²
        let reasons = [];

        // æ°—æ¸©ã«ã‚ˆã‚‹å½±éŸ¿
        if (avgTemp >= 28) {
            // çŒ›æš‘æ—¥
            switch (category.id) {
                case 'cold_noodle':
                    trend += 2;
                    reasons.push('çŒ›æš‘ã§å†·ãŸã„éººé¡žã®éœ€è¦å¢—');
                    break;
                case 'salad':
                    trend += 2;
                    reasons.push('æš‘ã•ã§ã•ã£ã±ã‚Šéœ€è¦å¢—');
                    break;
                case 'dessert':
                    trend += 2;
                    reasons.push('å†·ãŸã„ãƒ‡ã‚¶ãƒ¼ãƒˆéœ€è¦å¢—');
                    break;
                case 'hot_noodle':
                    trend -= 2;
                    reasons.push('æš‘ã•ã§æ¸©ã‹ã„éººé¡žã®éœ€è¦æ¸›');
                    break;
                case 'gratin':
                    trend -= 2;
                    reasons.push('æš‘ã•ã§æ¸©ã‹ã„æ–™ç†ã®éœ€è¦æ¸›');
                    break;
                case 'spaghetti':
                    trend -= 1;
                    reasons.push('æš‘ã•ã§æ¸©ã‹ã„æ–™ç†ã®éœ€è¦ã‚„ã‚„æ¸›');
                    break;
            }
        } else if (avgTemp >= 25) {
            // å¤æ—¥
            switch (category.id) {
                case 'cold_noodle':
                    trend += 1;
                    reasons.push('æš‘ã•ã§å†·ãŸã„éººé¡žã®éœ€è¦å¢—');
                    break;
                case 'salad':
                    trend += 1;
                    reasons.push('æš‘ã•ã§ã•ã£ã±ã‚Šéœ€è¦å¢—');
                    break;
                case 'dessert':
                    trend += 1;
                    reasons.push('å†·ãŸã„ãƒ‡ã‚¶ãƒ¼ãƒˆéœ€è¦å¢—');
                    break;
                case 'hot_noodle':
                    trend -= 1;
                    reasons.push('æš‘ã•ã§æ¸©ã‹ã„éººé¡žã®éœ€è¦æ¸›');
                    break;
                case 'gratin':
                    trend -= 1;
                    reasons.push('æš‘ã•ã§æ¸©ã‹ã„æ–™ç†ã®éœ€è¦æ¸›');
                    break;
            }
        } else if (avgTemp <= 5) {
            // åŽ³å†¬
            switch (category.id) {
                case 'hot_noodle':
                    trend += 2;
                    reasons.push('å¯’ã•ã§æ¸©ã‹ã„éººé¡žã®éœ€è¦å¢—');
                    break;
                case 'gratin':
                    trend += 2;
                    reasons.push('å¯’ã•ã§æ¸©ã‹ã„æ–™ç†ã®éœ€è¦å¢—');
                    break;
                case 'sozai':
                    trend += 1;
                    reasons.push('æ¸©ã‹ã„æƒ£èœã®éœ€è¦å¢—');
                    break;
                case 'cold_noodle':
                    trend -= 2;
                    reasons.push('å¯’ã•ã§å†·ãŸã„éººé¡žã®éœ€è¦æ¸›');
                    break;
                case 'salad':
                    trend -= 1;
                    reasons.push('å¯’ã•ã§å†·ãŸã„é£Ÿå“ã®éœ€è¦æ¸›');
                    break;
            }
        } else if (avgTemp <= 10) {
            // å¯’ã„æ—¥
            switch (category.id) {
                case 'hot_noodle':
                    trend += 1;
                    reasons.push('å¯’ã•ã§æ¸©ã‹ã„éººé¡žã®éœ€è¦å¢—');
                    break;
                case 'gratin':
                    trend += 1;
                    reasons.push('å¯’ã•ã§æ¸©ã‹ã„æ–™ç†ã®éœ€è¦å¢—');
                    break;
                case 'cold_noodle':
                    trend -= 1;
                    reasons.push('å¯’ã•ã§å†·ãŸã„éººé¡žã®éœ€è¦æ¸›');
                    break;
            }
        }

        // å¤©æ°—ã«ã‚ˆã‚‹å½±éŸ¿
        if (isRainy) {
            switch (category.id) {
                case 'bento':
                    trend += 1;
                    reasons.push('é›¨å¤©ã§è‡ªå®…éœ€è¦å¢—');
                    break;
                case 'sozai':
                    trend += 1;
                    reasons.push('é›¨å¤©ã§å·£ã”ã‚‚ã‚Šéœ€è¦å¢—');
                    break;
                case 'sandwich':
                    trend -= 1;
                    reasons.push('é›¨å¤©ã§å¤–å‡ºæ¸›å°‘');
                    break;
            }
        } else if (isSnowy) {
            // é›ªã®æ—¥ã¯å…¨ä½“çš„ã«æ¥åº—æ¸›å°‘
            if (!['bento', 'sozai', 'hot_noodle', 'gratin'].includes(category.id)) {
                trend -= 1;
                reasons.push('é›ªå¤©ã§æ¥åº—æ¸›å°‘');
            }
        } else if (isSunny) {
            switch (category.id) {
                case 'sandwich':
                    trend += 1;
                    reasons.push('è¡Œæ¥½éœ€è¦å¢—');
                    break;
                case 'onigiri':
                    trend += 1;
                    reasons.push('å¤–å‡ºãƒ»è¡Œæ¥½éœ€è¦å¢—');
                    break;
            }
        }

        // æ›œæ—¥ã«ã‚ˆã‚‹å½±éŸ¿ï¼ˆé€±æœ«ã¯è¡Œæ¥½éœ€è¦ï¼‰
        const today = new Date();
        const dayOfWeek = today.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            if (['onigiri', 'sandwich', 'bento'].includes(category.id) && isSunny) {
                trend += 1;
                if (!reasons.some(r => r.includes('è¡Œæ¥½'))) {
                    reasons.push('é€±æœ«è¡Œæ¥½éœ€è¦');
                }
            }
        }

        // æ˜¨å¹´æ¯”è¼ƒã«ã‚ˆã‚‹èª¿æ•´
        if (tempDiff !== null && Math.abs(tempDiff) >= 5) {
            if (tempDiff > 0) {
                // æ˜¨å¹´ã‚ˆã‚Šæš‘ã„
                if (['cold_noodle', 'salad', 'dessert'].includes(category.id)) {
                    trend += 1;
                    reasons.push(`æ˜¨å¹´ã‚ˆã‚Š${tempDiff}Â°Cé«˜ã„`);
                }
            } else {
                // æ˜¨å¹´ã‚ˆã‚Šå¯’ã„
                if (['hot_noodle', 'gratin', 'sozai'].includes(category.id)) {
                    trend += 1;
                    reasons.push(`æ˜¨å¹´ã‚ˆã‚Š${Math.abs(tempDiff)}Â°Cä½Žã„`);
                }
            }
        }

        // trendã‚’-2ã€œ+2ã«åˆ¶é™
        trend = Math.max(-2, Math.min(2, trend));

        return {
            ...category,
            trend,
            reasons: reasons.length > 0 ? reasons : ['é€šå¸¸é€šã‚Š']
        };
    });

    // æ³¨æ„äº‹é …ã‚’ç”Ÿæˆ
    const notes = [];
    if (isSnowy) {
        notes.push('é›ªå¤©ã®ãŸã‚æ¥åº—å®¢æ•°ã®å¤§å¹…æ¸›å°‘ãŒäºˆæƒ³ã•ã‚Œã¾ã™ã€‚å»ƒæ£„ãƒªã‚¹ã‚¯ã‚’è€ƒæ…®ã—ã€ç™ºæ³¨é‡ã‚’æŽ§ãˆã‚ã«ã€‚');
    }
    if (isRainy) {
        notes.push('é›¨å¤©ã®ãŸã‚æ¥åº—å®¢æ•°ãŒã‚„ã‚„æ¸›å°‘ã™ã‚‹å¯èƒ½æ€§ãŒã‚ã‚Šã¾ã™ã€‚');
    }
    if (tempDiff !== null && tempDiff >= 5) {
        notes.push(`æ˜¨å¹´åŒæœŸã‚ˆã‚Š${tempDiff}Â°Cé«˜ã„ãŸã‚ã€å­£ç¯€ã‚’å…ˆå–ã‚Šã—ãŸå•†å“æ§‹æˆã‚’æ¤œè¨Žã€‚`);
    }
    if (tempDiff !== null && tempDiff <= -5) {
        notes.push(`æ˜¨å¹´åŒæœŸã‚ˆã‚Š${Math.abs(tempDiff)}Â°Cä½Žã„ãŸã‚ã€å­£ç¯€å•†å“ã®åˆ‡ã‚Šæ›¿ãˆã‚’é…ã‚‰ã›ã‚‹ã“ã¨ã‚’æ¤œè¨Žã€‚`);
    }

    return {
        weather: weatherInfo,
        tempMax,
        tempMin,
        tempDiff,
        categories: advice,
        notes
    };
}

// ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼ã‚’æç”»
function renderOrderAdvisor() {
    const container = document.getElementById('orderAdvisor');
    const content = document.getElementById('advisorContent');
    if (!container || !content) return;

    // ä»Šæ—¥ã®å¤©æ°—ãƒ‡ãƒ¼ã‚¿ã‚’å–å¾—
    const today = formatDate(new Date());
    const todayWeather = state.weatherData[today];

    if (!todayWeather) {
        container.style.display = 'none';
        return;
    }

    const advice = generateOrderAdvice(todayWeather);
    if (!advice) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    // å¤©æ°—ã‚µãƒžãƒªãƒ¼
    let html = `
        <div class="advisor-weather-summary">
            <div class="weather-summary-item">
                <span class="weather-summary-label">å¤©æ°—:</span>
                <span class="weather-summary-value">${advice.weather.icon} ${advice.weather.desc}</span>
            </div>
            <div class="weather-summary-item">
                <span class="weather-summary-label">æ°—æ¸©:</span>
                <span class="weather-summary-value">
                    <span style="color: #ef4444;">${advice.tempMax}Â°</span>/<span style="color: #60a5fa;">${advice.tempMin}Â°</span>
                </span>
            </div>
            ${advice.tempDiff !== null ? `
            <div class="weather-summary-item">
                <span class="weather-summary-label">æ˜¨å¹´æ¯”:</span>
                <span class="weather-summary-value ${advice.tempDiff > 0 ? 'temp-diff-plus' : 'temp-diff-minus'}">
                    ${advice.tempDiff > 0 ? '+' : ''}${advice.tempDiff}Â°C
                </span>
            </div>
            ` : ''}
        </div>
    `;

    // ã‚«ãƒ†ã‚´ãƒªã‚«ãƒ¼ãƒ‰
    html += '<div class="advisor-grid">';
    advice.categories.forEach(cat => {
        const trendClass = cat.trend > 0 ? 'increase' : (cat.trend < 0 ? 'decrease' : '');
        const trendArrow = cat.trend > 0 ? 'â†‘' : (cat.trend < 0 ? 'â†“' : 'â†’');
        const trendText = cat.trend > 0 ? 'å¢—åŠ ' : (cat.trend < 0 ? 'æ¸›å°‘' : 'é€šå¸¸');
        const trendColorClass = cat.trend > 0 ? 'up' : (cat.trend < 0 ? 'down' : 'neutral');

        html += `
            <div class="advisor-card ${trendClass}" title="${cat.reasons.join('ã€')}">
                <span class="advisor-card-icon">${cat.icon}</span>
                <span class="advisor-card-name">${cat.name}</span>
                <span class="advisor-card-trend ${trendColorClass}">
                    ${trendArrow} ${trendText}
                </span>
                <span class="advisor-card-reason">${cat.reasons[0] || ''}</span>
            </div>
        `;
    });
    html += '</div>';

    // æ³¨æ„äº‹é …
    if (advice.notes.length > 0) {
        html += `
            <div class="advisor-notes">
                <div class="advisor-notes-title">
                    <span>âš ï¸</span>
                    <span>æ³¨æ„äº‹é …</span>
                </div>
                <ul class="advisor-notes-list">
                    ${advice.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    content.innerHTML = html;

    // ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã®åˆæœŸåŒ–
    initAdvisorToggle();
}

// ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼ã®ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã‚’åˆæœŸåŒ–
function initAdvisorToggle() {
    const header = document.querySelector('.advisor-header');
    const toggle = document.getElementById('advisorToggle');
    const content = document.getElementById('advisorContent');

    if (header && toggle && content) {
        header.onclick = () => {
            toggle.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        };
    }

    // ã‚°ãƒ«ãƒ¼ãƒ—ãƒˆã‚°ãƒ«ã®åˆæœŸåŒ–
    initAdvisorGroupToggle();
    initReportsGroupToggle();
}

// ç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«æƒ…å ±ã‚°ãƒ«ãƒ¼ãƒ—ã®ãƒˆã‚°ãƒ«
function initAdvisorGroupToggle() {
    const groupHeader = document.getElementById('advisorGroupHeader');
    const groupToggle = document.getElementById('advisorGroupToggle');
    const groupContent = document.getElementById('advisorGroupContent');

    if (groupHeader && groupToggle && groupContent) {
        groupHeader.onclick = () => {
            groupToggle.classList.toggle('collapsed');
            groupContent.classList.toggle('collapsed');
        };
    }
    
    // å°åˆ·ç”»é¢ã‚°ãƒ«ãƒ¼ãƒ—ã®ãƒˆã‚°ãƒ«ã‚‚åˆæœŸåŒ–
    initPrintGroupToggle();
}

// å°åˆ·ç”»é¢ã‚°ãƒ«ãƒ¼ãƒ—ã®ãƒˆã‚°ãƒ«
function initPrintGroupToggle() {
    const groupHeader = document.getElementById('printGroupHeader');
    const groupToggle = document.getElementById('printGroupToggle');
    const groupContent = document.getElementById('printGroupContent');

    if (groupHeader && groupToggle && groupContent) {
        groupHeader.onclick = () => {
            groupToggle.classList.toggle('collapsed');
            groupContent.classList.toggle('collapsed');
        };
    }
}

// ãƒ¬ãƒãƒ¼ãƒˆã‚°ãƒ«ãƒ¼ãƒ—ã®ãƒˆã‚°ãƒ«
function initReportsGroupToggle() {
    const header = document.getElementById('reportsGroupHeader');
    const toggle = document.getElementById('reportsGroupToggle');
    const content = document.getElementById('reportsGroupContent');

    console.log('initReportsGroupToggle called:', { header, toggle, content });

    if (header && toggle && content) {
        // æ—¢å­˜ã®ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠãƒ¼ã‚’å‰Šé™¤ã™ã‚‹ãŸã‚ã«cloneã§ç½®ãæ›ãˆ
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
        
        // æ–°ã—ã„ãƒ˜ãƒƒãƒ€ãƒ¼ã«å¯¾ã—ã¦ã‚¤ãƒ™ãƒ³ãƒˆã‚’è¨­å®š
        newHeader.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Reports header clicked');
            
            const currentToggle = document.getElementById('reportsGroupToggle');
            const currentContent = document.getElementById('reportsGroupContent');
            
            if (currentContent.classList.contains('collapsed')) {
                currentContent.classList.remove('collapsed');
                currentToggle.textContent = 'â–²';
                currentToggle.classList.remove('collapsed');
            } else {
                currentContent.classList.add('collapsed');
                currentToggle.textContent = 'â–¼';
                currentToggle.classList.add('collapsed');
            }
        });
        
        // ã‚¿ãƒƒãƒã‚¤ãƒ™ãƒ³ãƒˆã‚‚è¿½åŠ 
        newHeader.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentToggle = document.getElementById('reportsGroupToggle');
            const currentContent = document.getElementById('reportsGroupContent');
            
            if (currentContent.classList.contains('collapsed')) {
                currentContent.classList.remove('collapsed');
                currentToggle.textContent = 'â–²';
                currentToggle.classList.remove('collapsed');
            } else {
                currentContent.classList.add('collapsed');
                currentToggle.textContent = 'â–¼';
                currentToggle.classList.add('collapsed');
            }
        }, { passive: false });
    }
}

// æ‹¡å¼µç‰ˆç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼ã‚’æç”»
function renderOrderAdvisorExtended() {
    const container = document.getElementById('orderAdvisor');
    const content = document.getElementById('advisorContent');
    if (!container || !content) return;

    // ä»Šæ—¥ã®å¤©æ°—ãƒ‡ãƒ¼ã‚¿ã‚’å–å¾—
    const today = formatDate(new Date());
    const todayWeather = state.weatherData[today];

    if (!todayWeather) {
        container.style.display = 'none';
        return;
    }

    const advice = generateAllCategoryAdvice(todayWeather);
    if (!advice) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    // å¤©æ°—ãƒ»è³¼è²·è¡Œå‹•ãƒ‘ãƒãƒ«
    let html = `
        <div class="advisor-extended">
            <div class="advisor-top-panel">
                <div class="advisor-weather-panel">
                    <div class="weather-main">
                        <span class="weather-icon-large">${advice.weather.icon}</span>
                        <div class="weather-details">
                            <span class="weather-desc">${advice.weather.desc}</span>
                            <span class="weather-temps">
                                <span class="temp-high">${advice.tempMax}Â°</span> / 
                                <span class="temp-low">${advice.tempMin}Â°</span>
                            </span>
                            ${advice.lastYearDiff !== null ? `
                            <span class="weather-diff ${advice.lastYearDiff >= 0 ? 'plus' : 'minus'}">
                                æ˜¨å¹´æ¯”${advice.lastYearDiff >= 0 ? '+' : ''}${advice.lastYearDiff}Â°C
                            </span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="advisor-behavior-panel">
                    <div class="behavior-title">ðŸ§  è³¼è²·è¡Œå‹•ã¸ã®å½±éŸ¿åˆ†æž</div>
                    <div class="behavior-items">
                        <div class="behavior-item">
                            <span class="behavior-label">æ°—æ¸©å¸¯ã®å½±éŸ¿:</span>
                            <span class="behavior-value" style="color: ${advice.tempZone.color}">${advice.avgTemp.toFixed(0)}Â°Cï¼ˆ${advice.tempZone.label}ï¼‰</span>
                        </div>
                        ${advice.lastYearDiff !== null ? `
                        <div class="behavior-item">
                            <span class="behavior-label">æ˜¨å¹´æ¯”ã®å½±éŸ¿:</span>
                            <span class="behavior-value ${advice.lastYearDiff >= 0 ? 'plus' : 'minus'}">${advice.lastYearDiff >= 0 ? '+' : ''}${advice.lastYearDiff}Â°C</span>
                        </div>` : ''}
                        <div class="behavior-item">
                            <span class="behavior-label">æ›œæ—¥ã®å½±éŸ¿:</span>
                            <span class="behavior-value">${advice.dayName}</span>
                        </div>
                    </div>
                </div>
            </div>
    `;

    // ã‚«ãƒ†ã‚´ãƒªãƒãƒƒãƒ—
    html += '<div class="category-chips">';
    advice.categories.forEach(cat => {
        const percentClass = cat.percentage > 0 ? 'positive' : (cat.percentage < 0 ? 'negative' : 'neutral');
        const percentSign = cat.percentage > 0 ? '+' : '';
        const isSelected = state.selectedAdvisorCategory === cat.id;

        html += `
            <button class="category-chip ${percentClass} ${isSelected ? 'selected' : ''}" 
                    data-category-id="${cat.id}"
                    onclick="selectAdvisorCategory('${cat.id}')">
                <span class="chip-icon">${cat.icon}</span>
                <span class="chip-name">${cat.name}</span>
                <span class="chip-percent">${percentSign}${cat.percentage}%</span>
            </button>
        `;
    });
    html += '</div>';

    // é¸æŠžä¸­ã‚«ãƒ†ã‚´ãƒªã®è©³ç´°ãƒ‘ãƒãƒ«
    const selectedCat = advice.categories.find(c => c.id === state.selectedAdvisorCategory);
    if (selectedCat) {
        const percentSign = selectedCat.percentage > 0 ? '+' : '';
        const percentClass = selectedCat.percentage > 0 ? 'positive' : (selectedCat.percentage < 0 ? 'negative' : 'neutral');

        html += `
            <div class="category-detail-panel">
                <div class="detail-header">
                    <span class="detail-icon">${selectedCat.icon}</span>
                    <span class="detail-name">${selectedCat.name}</span>
                    <span class="detail-percent ${percentClass}">${percentSign}${selectedCat.percentage}%</span>
                </div>
                <div class="detail-subcategories">
                    <div class="subcategory-title">ã‚µãƒ–ã‚«ãƒ†ã‚´ãƒª:</div>
                    <div class="subcategory-list">
        `;

        selectedCat.subcategoryAdvice.forEach(sub => {
            const subPercentSign = sub.percentage > 0 ? '+' : '';
            const subPercentClass = sub.percentage > 0 ? 'positive' : (sub.percentage < 0 ? 'negative' : 'neutral');
            html += `
                <div class="subcategory-item">
                    <span class="subcategory-name">ãƒ»${sub.name}</span>
                    <span class="subcategory-percent ${subPercentClass}">${subPercentSign}${sub.percentage}%</span>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
        `;

        // æ—¥æ¬¡ãƒã‚§ãƒƒã‚¯
        const checklistKey = `${today}-${selectedCat.id}`;
        const existingChecklist = state.dailyChecklist[checklistKey] || {};

        html += `
                <div class="daily-checklist">
                    <div class="checklist-title">âœ… ä»Šæ—¥ã®æŒ¯ã‚Šè¿”ã‚Šãƒã‚§ãƒƒã‚¯</div>
                    <div class="checklist-row">
                        <span class="checklist-label">å»ƒæ£„é‡:</span>
                        <div class="checklist-options">
                            <button class="checklist-btn ${existingChecklist.waste === 'high' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'waste', 'high')">å¤šã„</button>
                            <button class="checklist-btn ${existingChecklist.waste === 'normal' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'waste', 'normal')">æ™®é€š</button>
                            <button class="checklist-btn ${existingChecklist.waste === 'low' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'waste', 'low')">å°‘ãªã„</button>
                        </div>
                    </div>
                    <div class="checklist-row">
                        <span class="checklist-label">æ¬ å“:</span>
                        <div class="checklist-options">
                            <button class="checklist-btn ${existingChecklist.shortage === 'yes' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'shortage', 'yes')">ã‚ã£ãŸ</button>
                            <button class="checklist-btn ${existingChecklist.shortage === 'few' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'shortage', 'few')">å°‘ã—</button>
                            <button class="checklist-btn ${existingChecklist.shortage === 'none' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'shortage', 'none')">ãªã—</button>
                        </div>
                    </div>
                    <div class="checklist-row">
                        <span class="checklist-label">å£²ã‚Œè¡Œã:</span>
                        <div class="checklist-options">
                            <button class="checklist-btn ${existingChecklist.sales === 'good' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'sales', 'good')">å¥½èª¿</button>
                            <button class="checklist-btn ${existingChecklist.sales === 'normal' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'sales', 'normal')">æ™®é€š</button>
                            <button class="checklist-btn ${existingChecklist.sales === 'poor' ? 'selected' : ''}" 
                                    onclick="updateChecklist('${selectedCat.id}', 'sales', 'poor')">ä¸èª¿</button>
                        </div>
                    </div>
                </div>
        `;

        // ãƒ¡ãƒ¢å…¥åŠ›
        html += `
                <div class="category-memo">
                    <div class="memo-title">ðŸ“ ãƒ¡ãƒ¢</div>
                    <div class="memo-input-row">
                        <input type="text" id="categoryMemoInput" class="memo-input" 
                               placeholder="æ°—ã¥ã„ãŸã“ã¨ã‚’ãƒ¡ãƒ¢..." />
                        <button class="memo-save-btn" onclick="saveCurrentMemo('${selectedCat.id}')">ä¿å­˜</button>
                    </div>
                    <div class="quick-tags">
                        <span class="quick-tag-label">ã‚¯ã‚¤ãƒƒã‚¯ã‚¿ã‚°:</span>
        `;

        // ã‚«ãƒ†ã‚´ãƒªã«å¿œã˜ãŸã‚¯ã‚¤ãƒƒã‚¯ã‚¿ã‚°
        const quickTags = getQuickTagsForCategory(selectedCat.id);
        quickTags.forEach(tag => {
            html += `<button class="quick-tag" onclick="addQuickTag('${selectedCat.id}', '${tag}')">${tag}</button>`;
        });

        html += `
                    </div>
                </div>
            </div>
        `;
    }

    html += '</div>';
    content.innerHTML = html;

    // ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã®åˆæœŸåŒ–
    initAdvisorToggle();
}

// ã‚«ãƒ†ã‚´ãƒªé¸æŠž
function selectAdvisorCategory(categoryId) {
    state.selectedAdvisorCategory = state.selectedAdvisorCategory === categoryId ? null : categoryId;
    renderOrderAdvisorExtended();
}

// ãƒã‚§ãƒƒã‚¯ãƒªã‚¹ãƒˆæ›´æ–°
function updateChecklist(categoryId, field, value) {
    const today = formatDate(new Date());
    const key = `${today}-${categoryId}`;
    const existing = state.dailyChecklist[key] || {};

    saveDailyChecklist(categoryId, today, {
        ...existing,
        [field]: value
    });

    renderOrderAdvisorExtended();
}

// ç¾åœ¨ã®ãƒ¡ãƒ¢ã‚’ä¿å­˜
function saveCurrentMemo(categoryId) {
    const input = document.getElementById('categoryMemoInput');
    if (!input || !input.value.trim()) return;

    const today = formatDate(new Date());
    saveCategoryMemo(categoryId, today, input.value.trim());
    input.value = '';

    alert('ãƒ¡ãƒ¢ã‚’ä¿å­˜ã—ã¾ã—ãŸ');
}

// ã‚¯ã‚¤ãƒƒã‚¯ã‚¿ã‚°ã‚’è¿½åŠ 
function addQuickTag(categoryId, tag) {
    const today = formatDate(new Date());
    saveCategoryMemo(categoryId, today, tag, [tag]);
    alert(`"${tag}" ã‚’ä¿å­˜ã—ã¾ã—ãŸ`);
}

// ã‚«ãƒ†ã‚´ãƒªåˆ¥ã‚¯ã‚¤ãƒƒã‚¯ã‚¿ã‚°å–å¾—
function getQuickTagsForCategory(categoryId) {
    const tagMap = {
        rice: ['å¼å½“å¥½èª¿', 'å¼å½“å»ƒæ£„å¤š', 'ãŠã«ãŽã‚Šæ¬ å“'],
        bread: ['ã‚µãƒ³ãƒ‰å¥½èª¿', 'æƒ£èœãƒ‘ãƒ³äººæ°—', 'ãƒ‘ãƒ³å…¨ä½“å»ƒæ£„'],
        noodles: ['ãƒ©ãƒ¼ãƒ¡ãƒ³çµ¶å¥½èª¿', 'å†·ã‚„ã—éººå»ƒæ£„', 'ã‚«ãƒƒãƒ—éººæ¬ å“'],
        dessert: ['ã‚¢ã‚¤ã‚¹å¥½èª¿', 'ãƒ‡ã‚¶ãƒ¼ãƒˆå»ƒæ£„', 'ãƒ—ãƒªãƒ³æ¬ å“'],
        pastry: ['ãƒ‰ãƒ¼ãƒŠãƒ„äººæ°—', 'ç„¼ãè“å­å»ƒæ£„', 'ã‚¿ãƒ«ãƒˆå¥½èª¿'],
        salad: ['ã‚µãƒ©ãƒ€å¥½èª¿', 'ã‚°ãƒ©ã‚¿ãƒ³äººæ°—', 'æƒ£èœå»ƒæ£„'],
        delica: ['ãŠã§ã‚“çµ¶å¥½èª¿', 'ä¸­è¯ã¾ã‚“äººæ°—', 'ãƒ•ãƒ©ã‚¤ãƒ¤ãƒ¼æ¬ å“'],
        milk: ['ç‰›ä¹³å®‰å®š', 'ã‚³ãƒ¼ãƒ’ãƒ¼äººæ°—', 'ãƒ¨ãƒ¼ã‚°ãƒ«ãƒˆå»ƒæ£„']
    };
    return tagMap[categoryId] || ['å¥½èª¿', 'å»ƒæ£„', 'æ¬ å“'];
}

// ========================================
// éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼æ©Ÿèƒ½
// ========================================

// éžãƒ‡ã‚¤ãƒªãƒ¼å•†å“ã‚«ãƒ†ã‚´ãƒª
const NON_DAILY_CATEGORIES = {
    snacks: { name: 'ãŠè“å­', icon: 'ðŸª' },
    drinks: { name: 'ãƒ‰ãƒªãƒ³ã‚¯', icon: 'ðŸ¥¤' },
    ice: { name: 'ã‚¢ã‚¤ã‚¹', icon: 'ðŸ¦' },
    misc: { name: 'é›‘è²¨', icon: 'ðŸ§´' },
    processed: { name: 'åŠ å·¥é£Ÿå“', icon: 'ðŸ¥«' },
    character: { name: 'æµè¡Œã—ã¦ã„ã‚‹ã‚­ãƒ£ãƒ©ã‚¯ã‚¿ãƒ¼', icon: 'â­' }
};

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼ã‚’æç”»
function renderNonDailyAdvisor() {
    const container = document.getElementById('nonDailyAdvisor');
    const content = document.getElementById('nonDailyContent');
    if (!container || !content) return;

    // ç®¡ç†è€…ã®å ´åˆã¯ãƒ‡ãƒ¼ã‚¿ãŒãªãã¦ã‚‚è¡¨ç¤ºï¼ˆè¿½åŠ ã§ãã‚‹ã‚ˆã†ã«ï¼‰
    if (state.nonDailyAdvice.length === 0 && !state.isAdmin) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    // ç¾åœ¨ã®ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼çŠ¶æ…‹ã‚’å–å¾—
    const currentFilter = state.nonDailyFilter || 'all';

    // ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°
    let filteredAdvice = [...state.nonDailyAdvice];
    if (currentFilter !== 'all') {
        filteredAdvice = filteredAdvice.filter(a => a.category === currentFilter);
    }

    // æ›´æ–°æ—¥æ™‚é †ã«ã‚½ãƒ¼ãƒˆ
    const sortedAdvice = filteredAdvice.sort((a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼ã‚¿ãƒ–ã‚’æ§‹ç¯‰
    let html = `
        <div class="filter-tabs non-daily-filter-tabs">
            <button class="filter-tab ${currentFilter === 'all' ? 'active' : ''}" onclick="filterNonDailyByCategory('all')">ã™ã¹ã¦</button>
            ${Object.entries(NON_DAILY_CATEGORIES).map(([key, cat]) =>
        `<button class="filter-tab ${currentFilter === key ? 'active' : ''}" onclick="filterNonDailyByCategory('${key}')">${cat.icon} ${cat.name}</button>`
    ).join('')}
        </div>
    `;

    // ç®¡ç†è€…å‘ã‘ã«è¿½åŠ ãƒœã‚¿ãƒ³ã‚’è¡¨ç¤º
    if (state.isAdmin) {
        const selectedCategory = currentFilter !== 'all' ? currentFilter : '';
        html += `
            <div class="non-daily-admin-actions">
                <button class="btn btn-primary btn-sm" onclick="openNonDailyAdviceFormWithCategory('${selectedCategory}')">+ æ–°è¦è¿½åŠ </button>
            </div>
        `;
    }

    html += '<div class="non-daily-advice-grid">';

    if (sortedAdvice.length === 0) {
        html += '<p class="no-advice-message">è©²å½“ã™ã‚‹ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
    } else {
        sortedAdvice.forEach(advice => {
            const category = NON_DAILY_CATEGORIES[advice.category] || NON_DAILY_CATEGORIES.character;
            const updatedDate = new Date(advice.updatedAt);
            const dateStr = `${updatedDate.getMonth() + 1}/${updatedDate.getDate()}`;

            html += `
                <div class="non-daily-advice-card" data-category="${advice.category}">
                    <span class="advice-card-icon">${category.icon}</span>
                    <div class="advice-card-body">
                        <div class="advice-card-title">${advice.title}</div>
                        <div class="advice-card-content">${advice.content.replace(/\n/g, '<br>')}</div>
                        <div class="advice-card-meta">
                            <span class="advice-card-category">${category.name}</span>
                            ${advice.source ? `<span class="advice-card-source">ðŸ“± ${advice.source}</span>` : ''}
                            <span class="advice-card-date">ðŸ• ${dateStr}</span>
                        </div>
                        ${state.isAdmin ? `
                        <div class="advice-card-actions">
                            <button class="btn btn-sm btn-secondary" onclick="openNonDailyAdviceForm('${advice.id}')">âœï¸ ç·¨é›†</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteNonDailyAdvice('${advice.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }

    html += '</div>';
    content.innerHTML = html;

    // ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã®åˆæœŸåŒ–
    initNonDailyToggle();
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¶ãƒ¼ã®ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã‚’åˆæœŸåŒ–
function initNonDailyToggle() {
    const container = document.getElementById('nonDailyAdvisor');
    if (!container) return;

    const header = container.querySelector('.advisor-header');
    const toggle = document.getElementById('nonDailyToggle');
    const content = document.getElementById('nonDailyContent');

    if (header && toggle && content) {
        header.onclick = () => {
            toggle.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        };
    }
}

// ========================================
// é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰
// ========================================

// ç®¡ç†è€…ç”¨ é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ç®¡ç†ç”»é¢
// ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆç®¡ç†ç”»é¢
function renderTrendReportsAdmin(container) {
    const reports = state.trendReports || [];
    
    // æ›´æ–°æ—¥æ™‚é †ã«ã‚½ãƒ¼ãƒˆï¼ˆæ–°ã—ã„é †ï¼‰
    const sortedReports = [...reports].sort((a, b) => 
        new Date(b.updatedAt || b.createdAt || b.uploadedAt) - new Date(a.updatedAt || a.createdAt || a.uploadedAt)
    );

    let html = `
        <div class="new-product-admin-container">
            <div class="new-product-admin-header">
                <h3>ðŸ“Š ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆç®¡ç†</h3>
                <p class="header-description">ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆã‚’ç™»éŒ²ãƒ»ç®¡ç†ã—ã¾ã™ã€‚ç™»éŒ²ã—ãŸå†…å®¹ã¯ã€Œç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«æƒ…å ±ã€â†’ã€Œãƒ¬ãƒãƒ¼ãƒˆã€ã«è¡¨ç¤ºã•ã‚Œã¾ã™ã€‚</p>
                <button class="btn btn-primary" onclick="openAddTrendReportModal()">+ ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆè¿½åŠ </button>
            </div>
            
            <div class="new-product-admin-list">
    `;

    if (sortedReports.length === 0) {
        html += '<p class="no-data-message">ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆãŒã¾ã ç™»éŒ²ã•ã‚Œã¦ã„ã¾ã›ã‚“ã€‚<br>ã€Œ+ ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆè¿½åŠ ã€ãƒœã‚¿ãƒ³ã‹ã‚‰è¿½åŠ ã—ã¦ãã ã•ã„ã€‚</p>';
    } else {
        sortedReports.forEach(report => {
            const createdDate = new Date(report.createdAt || report.uploadedAt);
            const dateStr = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;
            const updatedDate = report.updatedAt ? new Date(report.updatedAt) : null;
            const updatedStr = updatedDate ? `${updatedDate.getFullYear()}/${updatedDate.getMonth() + 1}/${updatedDate.getDate()}` : null;
            
            // å¤ã„å½¢å¼ï¼ˆãƒ•ã‚¡ã‚¤ãƒ«ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰ï¼‰ã‹æ–°ã—ã„å½¢å¼ï¼ˆè¨˜è¿°å¼ï¼‰ã‹ã‚’åˆ¤å®š
            const isOldFormat = report.fileData && !report.content;
            
            html += `
                <div class="new-product-admin-card">
                    <div class="admin-card-header">
                        <div class="admin-card-title">${report.title}</div>
                        <div class="admin-card-meta">
                            <span>ðŸ“… ä½œæˆ: ${dateStr}</span>
                            ${updatedStr && updatedStr !== dateStr ? `<span>âœï¸ æ›´æ–°: ${updatedStr}</span>` : ''}
                            ${isOldFormat ? '<span style="color:#f59e0b;">âš ï¸ æ—§å½¢å¼</span>' : ''}
                        </div>
                    </div>
                    <div class="admin-card-content">
                        ${isOldFormat 
                            ? `<p style="color:var(--text-muted);">ã“ã®ãƒ¬ãƒãƒ¼ãƒˆã¯ãƒ•ã‚¡ã‚¤ãƒ«å½¢å¼ã§ã™ã€‚è¨˜è¿°å¼ã«å¤‰æ›´ã™ã‚‹ã«ã¯å‰Šé™¤ã—ã¦æ–°è¦ä½œæˆã—ã¦ãã ã•ã„ã€‚<br>ãƒ•ã‚¡ã‚¤ãƒ«: ${report.fileName || 'ä¸æ˜Ž'} (${formatFileSize(report.fileSize) || 'ä¸æ˜Ž'})</p>`
                            : (report.content || '').replace(/\n/g, '<br>')
                        }
                    </div>
                    <div class="admin-card-actions">
                        ${!isOldFormat ? `<button class="btn btn-sm btn-secondary" onclick="openEditTrendReportModal('${report.id}')">âœï¸ ç·¨é›†</button>` : ''}
                        <button class="btn btn-sm btn-danger" onclick="deleteTrendReport('${report.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                    </div>
                </div>
            `;
        });
    }

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderNewProductReportAdmin(container) {
    const reports = state.newProductReports || [];
    
    // æ›´æ–°æ—¥æ™‚é †ã«ã‚½ãƒ¼ãƒˆï¼ˆæ–°ã—ã„é †ï¼‰
    const sortedReports = [...reports].sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );

    let html = `
        <div class="new-product-admin-container">
            <div class="new-product-admin-header">
                <h3>ðŸ†• é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ç®¡ç†</h3>
                <p class="header-description">æ–°å•†å“ã®æƒ…å ±ã‚’ç™»éŒ²ãƒ»ç®¡ç†ã—ã¾ã™ã€‚ç™»éŒ²ã—ãŸå†…å®¹ã¯ã€Œç™ºæ³¨ãƒ»ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«æƒ…å ±ã€ã«è¡¨ç¤ºã•ã‚Œã¾ã™ã€‚</p>
                <button class="btn btn-primary" onclick="openAddNewProductReportModal()">+ é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰è¿½åŠ </button>
            </div>
            
            <div class="new-product-admin-list">
    `;

    if (sortedReports.length === 0) {
        html += '<p class="no-data-message">é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ãŒã¾ã ç™»éŒ²ã•ã‚Œã¦ã„ã¾ã›ã‚“ã€‚<br>ã€Œ+ é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰è¿½åŠ ã€ãƒœã‚¿ãƒ³ã‹ã‚‰è¿½åŠ ã—ã¦ãã ã•ã„ã€‚</p>';
    } else {
        sortedReports.forEach(report => {
            const createdDate = new Date(report.createdAt);
            const dateStr = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;
            const updatedDate = report.updatedAt ? new Date(report.updatedAt) : null;
            const updatedStr = updatedDate ? `${updatedDate.getFullYear()}/${updatedDate.getMonth() + 1}/${updatedDate.getDate()}` : null;
            
            html += `
                <div class="new-product-admin-card">
                    <div class="admin-card-header">
                        <div class="admin-card-title">${report.title}</div>
                        <div class="admin-card-meta">
                            <span>ðŸ“… ä½œæˆ: ${dateStr}</span>
                            ${updatedStr && updatedStr !== dateStr ? `<span>âœï¸ æ›´æ–°: ${updatedStr}</span>` : ''}
                        </div>
                    </div>
                    <div class="admin-card-content">${report.content.replace(/\n/g, '<br>')}</div>
                    <div class="admin-card-actions">
                        <button class="btn btn-sm btn-secondary" onclick="openEditNewProductReportModal('${report.id}')">âœï¸ ç·¨é›†</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteNewProductReport('${report.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                    </div>
                </div>
            `;
        });
    }

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ã‚’æç”»ï¼ˆãƒ•ãƒ­ãƒ³ãƒˆè¡¨ç¤ºç”¨ï¼‰
function renderNewProductReport() {
    const container = document.getElementById('newProductReportSection');
    const content = document.getElementById('newProductContent');
    if (!container || !content) return;

    const reports = state.newProductReports || [];
    
    // æ›´æ–°æ—¥æ™‚é †ã«ã‚½ãƒ¼ãƒˆï¼ˆæ–°ã—ã„é †ï¼‰
    const sortedReports = [...reports].sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );

    let html = '';

    if (sortedReports.length === 0) {
        html += '<p class="no-report-message">é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ã¯ã¾ã ã‚ã‚Šã¾ã›ã‚“ã€‚</p>';
    } else {
        html += '<div class="new-product-reports-list">';
        sortedReports.forEach(report => {
            const createdDate = new Date(report.createdAt);
            const dateStr = `${createdDate.getFullYear()}/${createdDate.getMonth() + 1}/${createdDate.getDate()}`;
            
            html += `
                <div class="new-product-report-card">
                    <div class="report-header">
                        <span class="report-title">${report.title}</span>
                        <span class="report-date">ðŸ“… ${dateStr}</span>
                    </div>
                    <div class="report-content">${report.content.replace(/\n/g, '<br>')}</div>
                    ${state.isAdmin ? `
                        <div class="report-actions">
                            <button class="btn btn-sm btn-secondary" onclick="openEditNewProductReportModal('${report.id}')">âœï¸ ç·¨é›†</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteNewProductReport('${report.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    content.innerHTML = html;

    // ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã®åˆæœŸåŒ–
    initNewProductToggle();
}

// é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ã®ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã‚’åˆæœŸåŒ–
function initNewProductToggle() {
    const container = document.getElementById('newProductReportSection');
    if (!container) return;

    const header = container.querySelector('.advisor-header');
    const toggle = document.getElementById('newProductToggle');
    const content = document.getElementById('newProductContent');

    if (header && toggle && content) {
        header.onclick = (e) => {
            e.stopPropagation();
            toggle.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
            toggle.textContent = content.classList.contains('collapsed') ? 'â–¼' : 'â–²';
        };
    }
}

// é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰è¿½åŠ ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openAddNewProductReportModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay category-modal-overlay active';
    modal.innerHTML = `
        <div class="modal category-modal" style="max-width: 600px;">
            <div class="modal-header">
                <h2 class="modal-title">ðŸ†• é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰è¿½åŠ </h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">Ã—</button>
            </div>
            <form class="modal-body" onsubmit="submitNewProductReport(event, this)">
                <div class="form-group">
                    <label>ã‚¿ã‚¤ãƒˆãƒ« <span class="required">*</span></label>
                    <input type="text" name="title" placeholder="ä¾‹: 2026å¹´1æœˆ æ–°å•†å“æƒ…å ±" required>
                </div>
                <div class="form-group">
                    <label>å†…å®¹ <span class="required">*</span></label>
                    <textarea name="content" rows="10" placeholder="æ–°å•†å“ã®æƒ…å ±ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„..." required></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                    <button type="submit" class="btn btn-primary">ä¿å­˜</button>
                </div>
            </form>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ç·¨é›†ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openEditNewProductReportModal(reportId) {
    const report = state.newProductReports.find(r => r.id === reportId);
    if (!report) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay category-modal-overlay active';
    modal.innerHTML = `
        <div class="modal category-modal" style="max-width: 600px;">
            <div class="modal-header">
                <h2 class="modal-title">ðŸ†• é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰ç·¨é›†</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">Ã—</button>
            </div>
            <form class="modal-body" onsubmit="submitNewProductReport(event, this, '${reportId}')">
                <div class="form-group">
                    <label>ã‚¿ã‚¤ãƒˆãƒ« <span class="required">*</span></label>
                    <input type="text" name="title" value="${report.title}" required>
                </div>
                <div class="form-group">
                    <label>å†…å®¹ <span class="required">*</span></label>
                    <textarea name="content" rows="10" required>${report.content}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                    <button type="submit" class="btn btn-primary">ä¿å­˜</button>
                </div>
            </form>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰é€ä¿¡
function submitNewProductReport(event, form, reportId = null) {
    event.preventDefault();
    const formData = new FormData(form);
    const title = formData.get('title');
    const content = formData.get('content');
    
    if (reportId) {
        // ç·¨é›†
        const report = state.newProductReports.find(r => r.id === reportId);
        if (report) {
            report.title = title;
            report.content = content;
            report.updatedAt = new Date().toISOString();
        }
        trackUsage('edit_new_product', 'ç®¡ç†è€…');
    } else {
        // æ–°è¦è¿½åŠ 
        const newReport = {
            id: 'report-' + Date.now(),
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        state.newProductReports.push(newReport);
        trackUsage('add_new_product', 'ç®¡ç†è€…');
    }
    
    saveToFirebase('newProductReports', state.newProductReports);
    form.closest('.modal-overlay').remove();
    renderNewProductReport();
}

// é€±æ¬¡ã‚¤ãƒ³ãƒ†ãƒªã‚¸ã‚§ãƒ³ã‚¹ï¼ˆãƒžã‚¯ãƒ­ç’°å¢ƒï¼‰å‰Šé™¤
function deleteNewProductReport(reportId) {
    if (!confirm('ã“ã®ãƒ¬ãƒãƒ¼ãƒˆã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ')) return;
    
    state.newProductReports = state.newProductReports.filter(r => r.id !== reportId);
    saveToFirebase('newProductReports', state.newProductReports);
    trackUsage('delete_new_product', 'ç®¡ç†è€…');
    renderNewProductReport();
}

// ========================================
// åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ä¸€è¦§
// ========================================

// åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ä¸€è¦§ã‚’æç”»
function renderScheduleList() {
    const container = document.getElementById('scheduleListSection');
    const content = document.getElementById('scheduleListContent');
    if (!container || !content) return;

    // ç¾åœ¨è¡¨ç¤ºä¸­ã®é€±ã®æ—¥ä»˜ç¯„å›²ã‚’å–å¾—
    const startDate = formatDate(state.currentWeekStart);
    const endDate = new Date(state.currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    const endDateStr = formatDate(endDate);

    // ä»Šé€±ã®ã‚¤ãƒ™ãƒ³ãƒˆã‚’ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°
    const weekEvents = state.dailyEvents.filter(event => {
        const eventStart = event.startDate || event.date;
        const eventEnd = event.endDate || event.date;
        // ã‚¤ãƒ™ãƒ³ãƒˆæœŸé–“ãŒä»Šé€±ã®ç¯„å›²ã¨é‡ãªã‚‹ã‹ã‚’ãƒã‚§ãƒƒã‚¯
        return eventEnd >= startDate && eventStart <= endDateStr;
    });

    // ã‚¤ãƒ™ãƒ³ãƒˆãŒãªã‘ã‚Œã°éžè¡¨ç¤º
    if (weekEvents.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    // ã‚¤ãƒ™ãƒ³ãƒˆã‚’é–‹å§‹æ—¥ã§ã‚½ãƒ¼ãƒˆ
    weekEvents.sort((a, b) => {
        const dateA = a.startDate || a.date;
        const dateB = b.startDate || b.date;
        return dateA.localeCompare(dateB);
    });

    const icons = getEventTypeIcons();
    const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];

    let html = '<div class="schedule-list-grid">';

    weekEvents.forEach(event => {
        const icon = icons[event.type] || icons.other;
        const typeName = getEventTypeName(event.type);

        // æ—¥ä»˜è¡¨ç¤ºã‚’ä½œæˆ
        const startDateObj = new Date(event.startDate || event.date);
        const endDateObj = new Date(event.endDate || event.date);

        let dateDisplay;
        if ((event.startDate || event.date) === (event.endDate || event.date)) {
            // 1æ—¥ã®ã¿
            dateDisplay = `${startDateObj.getMonth() + 1}/${startDateObj.getDate()}ï¼ˆ${dayNames[startDateObj.getDay()]}ï¼‰`;
        } else {
            // æœŸé–“
            dateDisplay = `${startDateObj.getMonth() + 1}/${startDateObj.getDate()}ï¼ˆ${dayNames[startDateObj.getDay()]}ï¼‰ã€œ ${endDateObj.getMonth() + 1}/${endDateObj.getDate()}ï¼ˆ${dayNames[endDateObj.getDay()]}ï¼‰`;
        }

        html += `
            <div class="schedule-list-item" data-type="${event.type}">
                <div class="schedule-item-icon">${icon}</div>
                <div class="schedule-item-body">
                    <div class="schedule-item-date">${dateDisplay}</div>
                    <div class="schedule-item-title">
                        ${event.title}
                        <span class="schedule-item-type">${typeName}</span>
                    </div>
                    ${event.description ? `<div class="schedule-item-description">${event.description.replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    content.innerHTML = html;

    // ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã®åˆæœŸåŒ–
    initScheduleToggle();
}

// åº—èˆ—ã‚¹ã‚±ã‚¸ãƒ¥ãƒ¼ãƒ«ä¸€è¦§ã®ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã‚’åˆæœŸåŒ–
function initScheduleToggle() {
    const container = document.getElementById('scheduleListSection');
    if (!container) return;

    const header = container.querySelector('.advisor-header');
    const toggle = document.getElementById('scheduleToggle');
    const content = document.getElementById('scheduleListContent');

    if (header && toggle && content) {
        header.onclick = () => {
            toggle.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        };
    }
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’è¿½åŠ 
function addNonDailyAdvice(data) {
    const advice = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
    };
    state.nonDailyAdvice.push(advice);
    saveToFirebase('nonDailyAdvice', state.nonDailyAdvice);
    trackUsage('add_non_daily', 'ç®¡ç†è€…');
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’æ›´æ–°
function updateNonDailyAdvice(id, data) {
    const index = state.nonDailyAdvice.findIndex(a => a.id === id);
    if (index >= 0) {
        state.nonDailyAdvice[index] = {
            ...state.nonDailyAdvice[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        saveToFirebase('nonDailyAdvice', state.nonDailyAdvice);
        trackUsage('edit_non_daily', 'ç®¡ç†è€…');
    }
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’å‰Šé™¤
function deleteNonDailyAdvice(id) {
    if (confirm('ã“ã®ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ')) {
        state.nonDailyAdvice = state.nonDailyAdvice.filter(a => a.id !== id);
        
        // Firebaseã«ä¿å­˜ï¼ˆç©ºã®å ´åˆã¯nullã§æ˜Žç¤ºçš„ã«ã‚¯ãƒªã‚¢ï¼‰
        if (state.nonDailyAdvice.length === 0) {
            database.ref('nonDailyAdvice').set(null);
        } else {
            saveToFirebase('nonDailyAdvice', state.nonDailyAdvice);
        }
        
        trackUsage('delete_non_daily', 'ç®¡ç†è€…');
        
        // ä¸€èˆ¬ãƒ¦ãƒ¼ã‚¶ãƒ¼å‘ã‘ç”»é¢ã‚’æ›´æ–°
        renderNonDailyAdvisor();
        
        // ç®¡ç†è€…ãƒ‘ãƒãƒ«ã‚’ç¢ºå®Ÿã«æ›´æ–°
        if (state.isAdmin && state.activeAdminTab === 'nonDailyAdvice') {
            const container = document.getElementById('adminContent');
            if (container) {
                renderNonDailyAdminPanel(container);
            }
        }
    }
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç·¨é›†ï¼ˆãƒ—ãƒ­ãƒ³ãƒ—ãƒˆä½¿ç”¨ï¼‰
function editNonDailyAdvice(id) {
    const advice = state.nonDailyAdvice.find(a => a.id === id);
    if (!advice) return;

    const newTitle = prompt('ã‚¿ã‚¤ãƒˆãƒ«ã‚’å…¥åŠ›:', advice.title);
    if (newTitle === null) return;

    const newContent = prompt('å†…å®¹ã‚’å…¥åŠ›:', advice.content);
    if (newContent === null) return;

    updateNonDailyAdvice(id, { title: newTitle, content: newContent });
    renderNonDailyAdvisor();
    if (state.isAdmin) renderAdminPanel();
}

// ç®¡ç†è€…ãƒ‘ãƒãƒ«ç”¨: éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ä¸€è¦§ã‚’è¡¨ç¤º
function renderNonDailyAdminPanel(container) {
    let html = `
        <div class="daily-events-header">
            <h3>ðŸ“ˆ éžãƒ‡ã‚¤ãƒªãƒ¼ç™ºæ³¨å‚è€ƒæƒ…å ±ç®¡ç†</h3>
            <button class="btn btn-primary btn-sm" onclick="openNonDailyAdviceForm()">+ å‚è€ƒæƒ…å ±è¿½åŠ </button>
        </div>
    `;

    if (state.nonDailyAdvice.length === 0) {
        html += '<p class="no-events-message">ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
    } else {
        html += '<div class="daily-events-list">';
        const sorted = [...state.nonDailyAdvice].sort((a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        sorted.forEach(advice => {
            const category = NON_DAILY_CATEGORIES[advice.category] || NON_DAILY_CATEGORIES.other;
            const updatedDate = new Date(advice.updatedAt);
            const dateStr = `${updatedDate.getFullYear()}/${updatedDate.getMonth() + 1}/${updatedDate.getDate()}`;
            html += `
                <div class="daily-event-card">
                    <div class="event-info">
                        <div class="event-header">
                            <span class="event-type-icon">${category.icon}</span>
                            <span class="event-title">${advice.title}</span>
                            <span class="event-date">${dateStr}</span>
                        </div>
                        <div class="event-description">${advice.content.substring(0, 100)}${advice.content.length > 100 ? '...' : ''}</div>
                        ${advice.source ? `<p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;">æƒ…å ±æº: ${advice.source}</p>` : ''}
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-sm btn-secondary" onclick="openNonDailyAdviceForm('${advice.id}')">ç·¨é›†</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteNonDailyAdvice('${advice.id}')">å‰Šé™¤</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹å…¥åŠ›ãƒ•ã‚©ãƒ¼ãƒ ã‚’é–‹ã
function openNonDailyAdviceForm(editId = null, defaultCategory = '') {
    const advice = editId ? state.nonDailyAdvice.find(a => a.id === editId) : null;
    const isEdit = !!advice;

    const categoryOptions = Object.entries(NON_DAILY_CATEGORIES)
        .map(([key, val]) => `<option value="${key}" ${advice?.category === key || (!advice && defaultCategory === key) ? 'selected' : ''}>${val.icon} ${val.name}</option>`)
        .join('');

    const formHtml = `
        <div class="modal-overlay active" id="nonDailyFormOverlay" onclick="if(event.target===this)closeNonDailyAdviceForm()">
            <div class="modal modal-lg">
                <div class="modal-header">
                    <h2 class="modal-title">ðŸ“ˆ ${isEdit ? 'å‚è€ƒæƒ…å ±ç·¨é›†' : 'å‚è€ƒæƒ…å ±è¿½åŠ '}</h2>
                    <button class="modal-close" onclick="closeNonDailyAdviceForm()">Ã—</button>
                </div>
                <form id="nonDailyAdviceForm" class="modal-body" onsubmit="submitNonDailyAdviceForm(event, '${editId || ''}')">
                    <div class="form-group">
                        <label for="ndCategory">ã‚«ãƒ†ã‚´ãƒª</label>
                        <select id="ndCategory" required>${categoryOptions}</select>
                    </div>
                    <div class="form-group">
                        <label for="ndTitle">ã‚¿ã‚¤ãƒˆãƒ«</label>
                        <input type="text" id="ndTitle" placeholder="ä¾‹ï¼šè©±é¡Œã®ãƒãƒ†ãƒˆãƒãƒƒãƒ—ã‚¹æ–°å•†å“" value="${advice?.title || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="ndContent">å†…å®¹</label>
                        <textarea id="ndContent" class="non-daily-content-textarea" placeholder="ä¾‹ï¼šSNSã§è©±é¡Œã®XXå‘³ãŒäººæ°—ã€‚å£²ã‚Šå ´ã§ã®ç›®ç«‹ã¤é™³åˆ—ã‚’æŽ¨å¥¨ã€‚" rows="10" required>${advice?.content || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="ndSource">æƒ…å ±æºï¼ˆä»»æ„ï¼‰</label>
                        <input type="text" id="ndSource" placeholder="ä¾‹ï¼šChatGPT / X / Instagram" value="${advice?.source || ''}">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeNonDailyAdviceForm()">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                        <button type="submit" class="btn btn-primary">${isEdit ? 'ä¿å­˜' : 'è¿½åŠ '}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // ãƒ•ã‚©ãƒ¼ãƒ ã‚’è¿½åŠ 
    const div = document.createElement('div');
    div.id = 'nonDailyFormContainer';
    div.innerHTML = formHtml;
    document.body.appendChild(div);
}

// ã‚«ãƒ†ã‚´ãƒªã‚’æŒ‡å®šã—ã¦éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ãƒ•ã‚©ãƒ¼ãƒ ã‚’é–‹ã
function openNonDailyAdviceFormWithCategory(category) {
    openNonDailyAdviceForm(null, category);
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ãƒ•ã‚©ãƒ¼ãƒ ã‚’é–‰ã˜ã‚‹
function closeNonDailyAdviceForm() {
    const container = document.getElementById('nonDailyFormContainer');
    if (container) container.remove();
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ãƒ•ã‚©ãƒ¼ãƒ ã‚’é€ä¿¡
function submitNonDailyAdviceForm(event, editId) {
    event.preventDefault();

    const data = {
        category: document.getElementById('ndCategory').value,
        title: document.getElementById('ndTitle').value,
        content: document.getElementById('ndContent').value,
        source: document.getElementById('ndSource').value || null
    };

    if (editId) {
        updateNonDailyAdvice(editId, data);
    } else {
        addNonDailyAdvice(data);
    }

    closeNonDailyAdviceForm();
    renderNonDailyAdvisor();
    if (state.isAdmin) renderAdminPanel();
}

// ã‚¤ãƒ™ãƒ³ãƒˆã‚¿ã‚¤ãƒ—ã§ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°
function filterEventsByType(type) {
    state.eventTypeFilter = type;
    renderAdminPanel();
}

// éžãƒ‡ã‚¤ãƒªãƒ¼ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’ã‚«ãƒ†ã‚´ãƒªã§ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°
function filterNonDailyByCategory(category) {
    state.nonDailyFilter = category;
    renderNonDailyAdvisor();
}

// ========================================
// ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆæ©Ÿèƒ½
// ========================================

// ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆã‚’æç”»
function renderTrendReports() {
    const section = document.getElementById('trendReportSection');
    const content = document.getElementById('trendReportContent');
    if (!section || !content) return;

    // å¸¸ã«ã‚»ã‚¯ã‚·ãƒ§ãƒ³ã‚’è¡¨ç¤º
    section.style.display = 'block';

    const reports = state.trendReports || [];
    
    // æ›´æ–°æ—¥æ™‚é †ã«ã‚½ãƒ¼ãƒˆï¼ˆæ–°ã—ã„é †ï¼‰
    const sortedReports = [...reports].sort((a, b) => 
        new Date(b.updatedAt || b.createdAt || b.uploadedAt) - new Date(a.updatedAt || a.createdAt || a.uploadedAt)
    );

    let html = '';

    if (sortedReports.length === 0) {
        html = '<div class="no-reports-message"><p>ðŸ“­ ç¾åœ¨ã€ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆã¯ã‚ã‚Šã¾ã›ã‚“</p></div>';
    } else {
        html = '<div class="trend-reports-list">';
        
        sortedReports.forEach(report => {
            const reportDate = new Date(report.updatedAt || report.createdAt || report.uploadedAt);
            const dateStr = `${reportDate.getFullYear()}/${reportDate.getMonth() + 1}/${reportDate.getDate()}`;
            const isNew = (new Date() - reportDate) < 7 * 24 * 60 * 60 * 1000;
            
            // æ—§å½¢å¼ï¼ˆãƒ•ã‚¡ã‚¤ãƒ«ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰ï¼‰ã‹æ–°å½¢å¼ï¼ˆè¨˜è¿°å¼ï¼‰ã‹ã‚’åˆ¤å®š
            const isOldFormat = report.fileData && !report.content;
            
            if (isOldFormat) {
                // æ—§å½¢å¼ï¼šãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰ãƒœã‚¿ãƒ³è¡¨ç¤º
                html += `
                    <div class="trend-report-item">
                        <div class="trend-report-info">
                            <div class="trend-report-title">
                                ${isNew ? '<span class="new-badge">NEW</span>' : ''}
                                ðŸ“„ ${report.title}
                            </div>
                            <div class="trend-report-meta">
                                <span class="report-date">ðŸ“… ${dateStr}</span>
                                <span class="report-size">${formatFileSize(report.fileSize)}</span>
                            </div>
                        </div>
                        <div class="trend-report-actions">
                            <button class="btn btn-sm btn-primary" onclick="downloadTrendReport('${report.id}')">
                                ðŸ“¥ ãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰
                            </button>
                            ${state.isAdmin ? `
                            <button class="btn btn-sm btn-danger" onclick="deleteTrendReport('${report.id}')">
                                ðŸ—‘ï¸
                            </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            } else {
                // æ–°å½¢å¼ï¼šè¨˜è¿°å¼è¡¨ç¤º
                html += `
                    <div class="trend-report-card">
                        <div class="report-header">
                            ${isNew ? '<span class="new-badge">NEW</span>' : ''}
                            <span class="report-title">${report.title}</span>
                            <span class="report-date">ðŸ“… ${dateStr}</span>
                        </div>
                        <div class="report-content">${(report.content || '').replace(/\n/g, '<br>')}</div>
                        ${state.isAdmin ? `
                            <div class="report-actions">
                                <button class="btn btn-sm btn-secondary" onclick="openEditTrendReportModal('${report.id}')">âœï¸ ç·¨é›†</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteTrendReport('${report.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        });

        html += '</div>';
    }

    // ç®¡ç†è€…ã®ã¿è¿½åŠ ãƒœã‚¿ãƒ³ã‚’è¡¨ç¤º
    if (state.isAdmin) {
        html += `
            <div class="trend-report-upload-section">
                <button class="btn btn-primary" onclick="openAddTrendReportModal()">
                    + ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆè¿½åŠ 
                </button>
            </div>
        `;
    }

    content.innerHTML = html;
    initTrendReportToggle();
}

// ãƒˆãƒ¬ãƒ³ãƒ‰ãƒ¬ãƒãƒ¼ãƒˆã®ãƒˆã‚°ãƒ«æ©Ÿèƒ½ã‚’åˆæœŸåŒ–
function initTrendReportToggle() {
    const section = document.getElementById('trendReportSection');
    if (!section) return;

    const header = section.querySelector('.advisor-header');
    const content = section.querySelector('.advisor-content');
    const toggle = section.querySelector('.advisor-toggle');

    if (header && content && toggle) {
        header.onclick = (e) => {
            e.stopPropagation();
            content.classList.toggle('collapsed');
            toggle.classList.toggle('collapsed');
            toggle.textContent = content.classList.contains('collapsed') ? 'â–¼' : 'â–²';
        };
    }
}

// ãƒ•ã‚¡ã‚¤ãƒ«ã‚µã‚¤ã‚ºã‚’ãƒ•ã‚©ãƒ¼ãƒžãƒƒãƒˆ
function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ãƒ¬ãƒãƒ¼ãƒˆã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openTrendReportUploadModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay category-modal-overlay active';
    overlay.id = 'trendReportUploadOverlay';
    
    overlay.innerHTML = `
        <div class="modal category-modal" style="max-width: 450px;">
            <div class="modal-header">
                <h2 class="modal-title">ðŸ“¤ ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆã‚’ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰</h2>
                <button class="modal-close" onclick="closeTrendReportUploadModal()">Ã—</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>ãƒ¬ãƒãƒ¼ãƒˆã‚¿ã‚¤ãƒˆãƒ«</label>
                    <input type="text" id="trendReportTitle" class="form-control" 
                           placeholder="ä¾‹: ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆ 2026å¹´1æœˆ27æ—¥å·" required>
                </div>
                
                <div class="form-group">
                    <label>ãƒ•ã‚¡ã‚¤ãƒ«ã‚’é¸æŠž</label>
                    <div class="file-upload-area" id="fileUploadArea">
                        <input type="file" id="trendReportFile" accept=".docx,.doc,.pdf,.xlsx,.xls" 
                               style="display: none;" onchange="handleTrendReportFileSelect(event)">
                        <div class="file-upload-placeholder" onclick="document.getElementById('trendReportFile').click()">
                            <span class="upload-icon">ðŸ“</span>
                            <span class="upload-text">ã‚¯ãƒªãƒƒã‚¯ã—ã¦ãƒ•ã‚¡ã‚¤ãƒ«ã‚’é¸æŠž</span>
                            <span class="upload-hint">å¯¾å¿œå½¢å¼: Word (.docx), PDF, Excel (.xlsx)</span>
                        </div>
                        <div class="file-selected-info" id="fileSelectedInfo" style="display: none;">
                            <span class="file-icon">ðŸ“„</span>
                            <span class="file-name" id="selectedFileName"></span>
                            <span class="file-size" id="selectedFileSize"></span>
                            <button type="button" class="btn btn-xs btn-secondary" onclick="clearSelectedFile()">âœ•</button>
                        </div>
                    </div>
                </div>
                
                <div class="upload-progress" id="uploadProgress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <span class="progress-text" id="progressText">ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰ä¸­...</span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeTrendReportUploadModal()">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                <button type="button" class="btn btn-primary" id="uploadTrendReportBtn" onclick="uploadTrendReport()" disabled>
                    ðŸ“¤ ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‰ã˜ã‚‹
function closeTrendReportUploadModal() {
    const overlay = document.getElementById('trendReportUploadOverlay');
    if (overlay) overlay.remove();
    state.selectedTrendReportFile = null;
}

// ãƒ•ã‚¡ã‚¤ãƒ«é¸æŠžæ™‚ã®å‡¦ç†
function handleTrendReportFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // ãƒ•ã‚¡ã‚¤ãƒ«ã‚µã‚¤ã‚ºãƒã‚§ãƒƒã‚¯ (5MBåˆ¶é™)
    if (file.size > 5 * 1024 * 1024) {
        alert('ãƒ•ã‚¡ã‚¤ãƒ«ã‚µã‚¤ã‚ºã¯5MBä»¥ä¸‹ã«ã—ã¦ãã ã•ã„ã€‚');
        return;
    }
    
    state.selectedTrendReportFile = file;
    
    // UIæ›´æ–°
    document.getElementById('fileUploadArea').querySelector('.file-upload-placeholder').style.display = 'none';
    document.getElementById('fileSelectedInfo').style.display = 'flex';
    document.getElementById('selectedFileName').textContent = file.name;
    document.getElementById('selectedFileSize').textContent = formatFileSize(file.size);
    document.getElementById('uploadTrendReportBtn').disabled = false;
    
    // ã‚¿ã‚¤ãƒˆãƒ«ãŒç©ºãªã‚‰è‡ªå‹•è¨­å®š
    const titleInput = document.getElementById('trendReportTitle');
    if (!titleInput.value) {
        const today = new Date();
        titleInput.value = `ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆ ${today.getFullYear()}å¹´${today.getMonth() + 1}æœˆ${today.getDate()}æ—¥å·`;
    }
}

// é¸æŠžã—ãŸãƒ•ã‚¡ã‚¤ãƒ«ã‚’ã‚¯ãƒªã‚¢
function clearSelectedFile() {
    state.selectedTrendReportFile = null;
    document.getElementById('trendReportFile').value = '';
    document.getElementById('fileUploadArea').querySelector('.file-upload-placeholder').style.display = 'flex';
    document.getElementById('fileSelectedInfo').style.display = 'none';
    document.getElementById('uploadTrendReportBtn').disabled = true;
}

// ãƒ¬ãƒãƒ¼ãƒˆã‚’ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰
async function uploadTrendReport() {
    const title = document.getElementById('trendReportTitle').value.trim();
    const file = state.selectedTrendReportFile;
    
    if (!title || !file) {
        alert('ã‚¿ã‚¤ãƒˆãƒ«ã¨ãƒ•ã‚¡ã‚¤ãƒ«ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„ã€‚');
        return;
    }
    
    // ãƒ—ãƒ­ã‚°ãƒ¬ã‚¹è¡¨ç¤º
    document.getElementById('uploadProgress').style.display = 'block';
    document.getElementById('uploadTrendReportBtn').disabled = true;
    
    try {
        // ãƒ•ã‚¡ã‚¤ãƒ«ã‚’Base64ã«å¤‰æ›
        const base64Data = await fileToBase64(file);
        
        const report = {
            id: Date.now().toString(),
            title: title,
            fileName: file.name,
            fileType: file.type || getFileTypeFromName(file.name),
            fileSize: file.size,
            fileData: base64Data,
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'ç®¡ç†è€…'
        };
        
        state.trendReports.push(report);
        
        // 1ãƒ¶æœˆã‚ˆã‚Šå¤ã„ãƒ¬ãƒãƒ¼ãƒˆã‚’å‰Šé™¤
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        state.trendReports = state.trendReports.filter(r => new Date(r.uploadedAt) >= oneMonthAgo);
        
        saveToFirebase('trendReports', state.trendReports);
        
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('progressText').textContent = 'ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰å®Œäº†ï¼';
        
        setTimeout(() => {
            closeTrendReportUploadModal();
            renderTrendReports();
            alert('ãƒ¬ãƒãƒ¼ãƒˆã‚’ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰ã—ã¾ã—ãŸã€‚');
        }, 500);
        
    } catch (error) {
        console.error('Upload error:', error);
        alert('ã‚¢ãƒƒãƒ—ãƒ­ãƒ¼ãƒ‰ã«å¤±æ•—ã—ã¾ã—ãŸã€‚ãƒ•ã‚¡ã‚¤ãƒ«ã‚µã‚¤ã‚ºã‚’ç¢ºèªã—ã¦ãã ã•ã„ã€‚');
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('uploadTrendReportBtn').disabled = false;
    }
}

// ãƒ•ã‚¡ã‚¤ãƒ«ã‚’Base64ã«å¤‰æ›
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ãƒ•ã‚¡ã‚¤ãƒ«åã‹ã‚‰æ‹¡å¼µå­ã§ã‚¿ã‚¤ãƒ—ã‚’å–å¾—
function getFileTypeFromName(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const types = {
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'doc': 'application/msword',
        'pdf': 'application/pdf',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.ms-excel'
    };
    return types[ext] || 'application/octet-stream';
}

// ãƒ¬ãƒãƒ¼ãƒˆã‚’ãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰
function downloadTrendReport(reportId) {
    const report = state.trendReports.find(r => r.id === reportId);
    if (!report) {
        alert('ãƒ¬ãƒãƒ¼ãƒˆãŒè¦‹ã¤ã‹ã‚Šã¾ã›ã‚“ã€‚');
        return;
    }
    
    try {
        // Base64ãƒ‡ãƒ¼ã‚¿ã‹ã‚‰Blobã‚’ä½œæˆ
        const byteCharacters = atob(report.fileData.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: report.fileType });
        
        // ãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰ãƒªãƒ³ã‚¯ã‚’ä½œæˆ
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = report.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
        alert('ãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰ã«å¤±æ•—ã—ã¾ã—ãŸã€‚');
    }
}

// ãƒ¬ãƒãƒ¼ãƒˆã‚’å‰Šé™¤
function deleteTrendReport(reportId) {
    if (!confirm('ã“ã®ãƒ¬ãƒãƒ¼ãƒˆã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ')) return;
    
    state.trendReports = state.trendReports.filter(r => r.id !== reportId);
    saveToFirebase('trendReports', state.trendReports);
    trackUsage('delete_trend_report', 'ç®¡ç†è€…');
    renderTrendReports();
}

// ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆè¿½åŠ ãƒ¢ãƒ¼ãƒ€ãƒ«ï¼ˆè¨˜è¿°å¼ï¼‰
function openAddTrendReportModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay category-modal-overlay active';
    modal.innerHTML = `
        <div class="modal category-modal" style="max-width: 600px;">
            <div class="modal-header">
                <h2 class="modal-title">ðŸ“Š ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆè¿½åŠ </h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">Ã—</button>
            </div>
            <form class="modal-body" onsubmit="submitTrendReport(event, this)">
                <div class="form-group">
                    <label>ã‚¿ã‚¤ãƒˆãƒ« <span class="required">*</span></label>
                    <input type="text" name="title" placeholder="ä¾‹: ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆ 2026å¹´1æœˆ27æ—¥å·" required>
                </div>
                <div class="form-group">
                    <label>å†…å®¹ <span class="required">*</span></label>
                    <textarea name="content" rows="15" placeholder="ãƒˆãƒ¬ãƒ³ãƒ‰æƒ…å ±ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„..." required></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                    <button type="submit" class="btn btn-primary">ä¿å­˜</button>
                </div>
            </form>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆç·¨é›†ãƒ¢ãƒ¼ãƒ€ãƒ«ï¼ˆè¨˜è¿°å¼ï¼‰
function openEditTrendReportModal(reportId) {
    const report = state.trendReports.find(r => r.id === reportId);
    if (!report) return;

    // HTMLã‚¨ã‚¹ã‚±ãƒ¼ãƒ—é–¢æ•°
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const modal = document.createElement('div');
    modal.className = 'modal-overlay category-modal-overlay active';
    modal.innerHTML = `
        <div class="modal category-modal" style="max-width: 600px;">
            <div class="modal-header">
                <h2 class="modal-title">ðŸ“Š ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆç·¨é›†</h2>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">Ã—</button>
            </div>
            <form class="modal-body" onsubmit="submitTrendReport(event, this, '${reportId}')">
                <div class="form-group">
                    <label>ã‚¿ã‚¤ãƒˆãƒ« <span class="required">*</span></label>
                    <input type="text" name="title" value="${escapeHtml(report.title)}" required>
                </div>
                <div class="form-group">
                    <label>å†…å®¹ <span class="required">*</span></label>
                    <textarea name="content" rows="15" required>${escapeHtml(report.content || '')}</textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                    <button type="submit" class="btn btn-primary">ä¿å­˜</button>
                </div>
            </form>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// ã‚³ãƒ³ãƒ“ãƒ‹3ç¤¾ æ–°å•†å“ãƒ’ãƒƒãƒˆäºˆæ¸¬ãƒ¬ãƒãƒ¼ãƒˆé€ä¿¡ï¼ˆè¨˜è¿°å¼ï¼‰
function submitTrendReport(event, form, reportId = null) {
    event.preventDefault();
    
    const title = form.title.value.trim();
    const content = form.content.value.trim();
    
    if (!title || !content) {
        alert('ã‚¿ã‚¤ãƒˆãƒ«ã¨å†…å®¹ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„ã€‚');
        return;
    }
    
    if (reportId) {
        // ç·¨é›†
        const index = state.trendReports.findIndex(r => r.id === reportId);
        if (index !== -1) {
            state.trendReports[index] = {
                ...state.trendReports[index],
                title,
                content,
                updatedAt: new Date().toISOString()
            };
        }
        trackUsage('edit_trend_report', 'ç®¡ç†è€…');
    } else {
        // æ–°è¦è¿½åŠ 
        const report = {
            id: Date.now().toString(),
            title,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        state.trendReports.push(report);
        trackUsage('add_trend_report', 'ç®¡ç†è€…');
    }
    
    saveToFirebase('trendReports', state.trendReports);
    form.closest('.modal-overlay').remove();
    renderTrendReports();
    alert(reportId ? 'ãƒ¬ãƒãƒ¼ãƒˆã‚’æ›´æ–°ã—ã¾ã—ãŸã€‚' : 'ãƒ¬ãƒãƒ¼ãƒˆã‚’è¿½åŠ ã—ã¾ã—ãŸã€‚');
}

// ========================================
// ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹æ©Ÿèƒ½
// ========================================

// ç™ºæ³¨æ‹…å½“è€…ãƒ‡ãƒ¼ã‚¿
const ORDER_STAFF = [
    { id: 1, name: 'å¸‚åŽŸ', role: 'ãƒžãƒãƒ¼ã‚¸ãƒ£ãƒ¼/æ—¥å‹¤', categories: ['tobacco'] },
    { id: 2, name: 'ç¯ åŽŸ', role: 'ç¤¾å“¡/å¤•å‹¤', categories: ['deli', 'ff', 'drink', 'pastry', 'frozenIce'] },
    { id: 3, name: 'æ©‹æœ¬', role: 'ç¤¾å“¡/æ—¥å‹¤', categories: ['supply', 'noodle', 'goods', 'frozen'] },
    { id: 4, name: 'æ£®ä¸‹', role: 'ã‚¹ã‚¿ãƒƒãƒ•/æ—¥å‹¤', categories: ['rice', 'sevenPDeli', 'deliOther', 'milk', 'frozen'] },
    { id: 5, name: 'é«˜æ©‹', role: 'ã‚¹ã‚¿ãƒƒãƒ•/æ—¥å‹¤', categories: ['bread'] },
    { id: 6, name: 'è©', role: 'ã‚¹ã‚¿ãƒƒãƒ•/æ—¥å‹¤', categories: ['processed'] },
    { id: 7, name: 'å°å®®å±±', role: 'ã‚¹ã‚¿ãƒƒãƒ•/å¤•å‹¤', categories: ['sweetsChoco'] },
    { id: 8, name: 'åŠ è—¤', role: 'ã‚¹ã‚¿ãƒƒãƒ•/æ—¥å‹¤', categories: ['dessert', 'sweetsGummy'] },
    { id: 9, name: 'ä¸­ç€¬', role: 'ã‚¹ã‚¿ãƒƒãƒ•/å¤•å‹¤', categories: ['sweetsSnack'] },
];

// ç™ºæ³¨ã‚«ãƒ†ã‚´ãƒªãƒ‡ãƒ¼ã‚¿
const ORDER_ADVICE_CATEGORIES = [
    { id: 'tobacco', name: 'ã‚¿ãƒã‚³', icon: 'ðŸš¬', items: ['ã‚¿ãƒã‚³'], color: '#6B7280' },
    { id: 'noodle', name: 'éººé¡žãã®ä»–', icon: 'ðŸœ', items: ['ã‚«ãƒƒãƒ—éºº(æ¸©)', 'èª¿ç†éºº(å†·)', 'ã‚¹ãƒ‘ã‚²ãƒ†ã‚£', 'ã‚°ãƒ©ã‚¿ãƒ³ãƒ‰ãƒªã‚¢', 'ç„¼ããã°é¡ž'], color: '#EF4444' },
    { id: 'deli', name: 'ãƒ‡ãƒªã‚«ãƒ†ãƒƒã‚»ãƒ³ï¼ˆã‚µãƒ©ãƒ€ã€æƒ£èœï¼‰', icon: 'ðŸ¥—', items: ['ã‚µãƒ©ãƒ€', 'æƒ£èœé¡ž'], color: '#22C55E' },
    { id: 'ff', name: 'FFï¼ˆãŠã§ã‚“ã€ä¸­è¯ã¾ã‚“ï¼‰', icon: 'ðŸ¢', items: ['ãŠã§ã‚“', 'ä¸­è¯ã¾ã‚“', 'ãƒ•ãƒ©ãƒ³ã‚¯'], color: '#F97316' },
    { id: 'drink', name: 'ãƒ‰ãƒªãƒ³ã‚¯é¡ž', icon: 'ðŸ¥¤', items: ['ã‚½ãƒ•ãƒˆãƒ‰ãƒªãƒ³ã‚¯', 'ãŠèŒ¶', 'ã‚³ãƒ¼ãƒ’ãƒ¼'], color: '#3B82F6' },
    { id: 'milk', name: 'ç‰›ä¹³ä¹³é£²æ–™', icon: 'ðŸ¥›', items: ['ç‰›ä¹³', 'ä¹³é£²æ–™', 'ã‚³ãƒ¼ãƒ’ãƒ¼ç‰›ä¹³'], color: '#60A5FA' },
    { id: 'supply', name: 'æ¶ˆè€—å“', icon: 'ðŸ§»', items: ['æ¶ˆè€—å“'], color: '#9CA3AF' },
    { id: 'rice', name: 'ç±³é£¯', icon: 'ðŸ™', items: ['ãŠã«ãŽã‚Š', 'å¯¿å¸', 'å¼å½“', 'ãƒãƒ«ãƒ‰å¼å½“'], color: '#F59E0B' },
    { id: 'sevenPDeli', name: '7Pãƒ‡ãƒªã‚«', icon: 'ðŸ±', items: ['7Pãƒ‡ãƒªã‚«å•†å“'], color: '#FBBF24' },
    { id: 'deliOther', name: 'ãƒ‡ãƒªãƒ†ãƒƒã‚»ãƒ³ï¼ˆãã®ä»–ï¼‰', icon: 'ðŸ¥¡', items: ['ãã®ä»–ãƒ‡ãƒªã‚«'], color: '#34D399' },
    { id: 'goods', name: 'é›‘è²¨é¡ž', icon: 'ðŸ›’', items: ['é›‘è²¨'], color: '#8B5CF6' },
    { id: 'frozen', name: 'ãƒ•ãƒ­ãƒ¼ã‚ºãƒ³ï¼ˆãƒ•ãƒ©ã‚¤ãƒ¤ãƒ¼ã€ç„¼æˆãƒ‘ãƒ³ï¼‰', icon: 'ðŸ§Š', items: ['ãƒ•ãƒ©ã‚¤ãƒ¤ãƒ¼', 'ç„¼æˆãƒ‘ãƒ³'], color: '#06B6D4' },
    { id: 'frozenIce', name: 'ãƒ•ãƒ­ãƒ¼ã‚ºãƒ³ï¼ˆã‚¢ã‚¤ã‚¹ã€å†·å‡é£Ÿå“ï¼‰', icon: 'ðŸ¦', items: ['ã‚¢ã‚¤ã‚¹', 'å†·å‡é£Ÿå“'], color: '#0EA5E9' },
    { id: 'pastry', name: 'ãƒšã‚¹ãƒˆãƒªãƒ¼', icon: 'ðŸ¥', items: ['ãƒ‰ãƒ¼ãƒŠãƒ„', 'ãƒ‘ã‚¤', 'ãƒ‡ãƒ‹ãƒƒã‚·ãƒ¥'], color: '#D97706' },
    { id: 'bread', name: 'èª¿ç†ãƒ‘ãƒ³', icon: 'ðŸ¥ª', items: ['ã‚µãƒ³ãƒ‰ã‚¤ãƒƒãƒ', 'ãƒ­ãƒ¼ãƒ«é¡ž', 'ãƒ–ãƒªãƒˆãƒ¼'], color: '#EAB308' },
    { id: 'processed', name: 'åŠ å·¥é£Ÿå“ï¼ˆèª¿å‘³æ–™é¡žã€çå‘³ï¼‰', icon: 'ðŸ«™', items: ['èª¿å‘³æ–™', 'çå‘³'], color: '#A855F7' },
    { id: 'sweetsChoco', name: 'ãŠè“å­ï¼ˆãƒãƒ§ã‚³ãƒ¬ãƒ¼ãƒˆã€å’Œè“å­é¡žï¼‰', icon: 'ðŸ«', items: ['ãƒãƒ§ã‚³ãƒ¬ãƒ¼ãƒˆ', 'å’Œè“å­'], color: '#EC4899' },
    { id: 'dessert', name: 'ãƒ‡ã‚¶ãƒ¼ãƒˆ', icon: 'ðŸ°', items: ['ãƒãƒ«ãƒ‰ç”¨ç”Ÿè“å­', 'ãƒ¨ãƒ¼ã‚°ãƒ«ãƒˆ', 'ã‚¼ãƒªãƒ¼é¡ž'], color: '#F472B6' },
    { id: 'sweetsGummy', name: 'ãŠè“å­ï¼ˆã‚°ãƒŸã€é§„è“å­ã€é£´é¡žï¼‰', icon: 'ðŸ¬', items: ['ã‚°ãƒŸ', 'é§„è“å­', 'é£´é¡ž'], color: '#FB7185' },
    { id: 'sweetsSnack', name: 'ãŠè“å­ï¼ˆãƒãƒ†ãƒˆãƒãƒƒãƒ—ã‚¹ã€ç®±ã‚¹ãƒŠãƒƒã‚¯ã€ç±³è“ï¼‰', icon: 'ðŸ¿', items: ['ãƒãƒ†ãƒˆãƒãƒƒãƒ—ã‚¹', 'ç®±ã‚¹ãƒŠãƒƒã‚¯', 'ç±³è“'], color: '#FDBA74' },
];

// ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç”¨ã®çŠ¶æ…‹ç®¡ç†ã‚’æ‹¡å¼µ
state.orderAdvice = {
    selectedStaffId: null,
    activeTab: 'advice',
    feedbackData: {},
};

// ç™ºæ³¨å¯¾è±¡æ—¥ã¨ç· åˆ‡ã‚’è¨ˆç®—
function getOrderTargetInfo() {
    const now = new Date();
    const hour = now.getHours();
    const deadline = new Date(now);
    deadline.setHours(11, 0, 0, 0);
    
    let targetDate;
    let isBeforeDeadline;
    
    if (hour < 11) {
        targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + 1);
        isBeforeDeadline = true;
    } else {
        targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + 2);
        isBeforeDeadline = false;
        deadline.setDate(deadline.getDate() + 1);
    }
    
    const timeUntilDeadline = deadline - now;
    const hoursUntil = Math.floor(timeUntilDeadline / (1000 * 60 * 60));
    const minutesUntil = Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
        targetDate,
        targetDateStr: formatDate(targetDate),
        deadline,
        isBeforeDeadline,
        hoursUntil,
        minutesUntil,
        isUrgent: hoursUntil < 1 && isBeforeDeadline
    };
}

// ã‚«ãƒ†ã‚´ãƒªåˆ¥ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç”Ÿæˆ
function generateOrderAdvice(categoryId, weather, targetDate) {
    const temp = weather ? (weather.tempMax + weather.tempMin) / 2 : 15;
    const weatherType = weather ? getWeatherInfo(weather.weatherCode).type : 'sunny';
    const dayOfWeek = targetDate.getDay();
    const dayOfMonth = targetDate.getDate();
    
    const advice = {
        categoryId,
        recommendations: [],
        warnings: [],
        confidence: 70,
    };

    switch (categoryId) {
        case 'rice':
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã•ã§æ¸©ã‹ã„ã”é£¯éœ€è¦â†‘',
                    items: ['å¹•ã®å†…å¼å½“', 'ã®ã‚Šå¼', 'ç‚Šãè¾¼ã¿ã”é£¯ãŠã«ãŽã‚Š'],
                    psychology: 'ä½“ã‚’æ¸©ã‚ãŸã„æ¬²æ±‚',
                });
            }
            if (temp >= 25) {
                advice.recommendations.push({
                    text: 'æš‘ã•ã§å¡©åˆ†ãƒ»ã•ã£ã±ã‚Šéœ€è¦â†‘',
                    items: ['æ¢…ãŠã«ãŽã‚Š', 'å¡©ã‚€ã™ã³', 'å†·ã‚„ã—å¯¿å¸'],
                    psychology: 'æ±—ã§å¤±ã£ãŸå¡©åˆ†ã‚’è£œã„ãŸã„',
                });
            }
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                advice.recommendations.push({
                    text: 'é€±æœ«ã¯è¡Œæ¥½éœ€è¦â†‘',
                    items: ['ãŠã«ãŽã‚Šã‚»ãƒƒãƒˆ', 'åŠ©å…­å¯¿å¸', 'ãƒ•ã‚¡ãƒŸãƒªãƒ¼å¼å½“'],
                    psychology: 'ãŠå‡ºã‹ã‘ãƒ»ãƒ”ã‚¯ãƒ‹ãƒƒã‚¯æ°—åˆ†',
                });
            }
            if (weatherType === 'rainy') {
                advice.warnings.push({
                    text: 'é›¨å¤©ã§æ¥å®¢æ¸›å°‘è¦‹è¾¼ã¿',
                    suggestion: 'ç™ºæ³¨æŽ§ãˆã‚ã«ï¼ˆ-15%ç›®å®‰ï¼‰',
                });
            }
            advice.confidence = 78;
            break;

        case 'noodle':
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã•ã§æ¸©ã‹ã„éººâ†‘â†‘',
                    items: ['ã‚«ãƒƒãƒ—ã†ã©ã‚“', 'ã‚«ãƒƒãƒ—ãƒ©ãƒ¼ãƒ¡ãƒ³', 'ã‚°ãƒ©ã‚¿ãƒ³', 'ãƒ‰ãƒªã‚¢'],
                    psychology: 'ä½“ã®èŠ¯ã‹ã‚‰æ¸©ã¾ã‚ŠãŸã„',
                });
                advice.confidence = 85;
            }
            if (temp >= 25) {
                advice.recommendations.push({
                    text: 'æš‘ã•ã§å†·ãŸã„éººâ†‘',
                    items: ['å†·ã‚„ã—ä¸­è¯', 'å†·è£½ãƒ‘ã‚¹ã‚¿', 'ã–ã‚‹ãã°'],
                    psychology: 'ã•ã£ã±ã‚Šãƒ»ã²ã‚“ã‚„ã‚Šé£Ÿã¹ãŸã„',
                });
                advice.warnings.push({
                    text: 'ã‚«ãƒƒãƒ—éºº(æ¸©)ã¯éœ€è¦æ¸›',
                    suggestion: 'é€šå¸¸ã‚ˆã‚ŠæŽ§ãˆã‚ã«ï¼ˆ-20%ç›®å®‰ï¼‰',
                });
            }
            break;

        case 'ff':
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã•ã§ãƒ›ãƒƒãƒˆã‚¹ãƒŠãƒƒã‚¯éœ€è¦â†‘â†‘',
                    items: ['è‚‰ã¾ã‚“', 'ã‚ã‚“ã¾ã‚“', 'ãŠã§ã‚“å„ç¨®', 'ãƒ•ãƒ©ãƒ³ã‚¯'],
                    psychology: 'æ¸©ã‹ã„ã‚‚ã®ã‚’æ‰‹è»½ã«é£Ÿã¹ãŸã„',
                });
                advice.confidence = 88;
            }
            if (temp >= 25) {
                advice.warnings.push({
                    text: 'æš‘ã•ã§ãƒ›ãƒƒãƒˆã‚¹ãƒŠãƒƒã‚¯éœ€è¦â†“',
                    suggestion: 'è‚‰ã¾ã‚“ãƒ»ãŠã§ã‚“æŽ§ãˆã‚ã«',
                });
                advice.confidence = 60;
            }
            break;

        case 'deli':
            if (dayOfWeek === 5) {
                advice.recommendations.push({
                    text: 'é‡‘æ›œã¯æƒ£èœéœ€è¦â†‘',
                    items: ['å”æšã’', 'ãƒãƒ†ãƒˆã‚µãƒ©ãƒ€', 'ãŠã¤ã¾ã¿ç³»'],
                    psychology: 'ä»•äº‹å¸°ã‚Šã«è²·ã£ã¦å¸°ã‚ŠãŸã„',
                });
            }
            if (temp >= 25) {
                advice.recommendations.push({
                    text: 'æš‘ã•ã§ã‚µãƒ©ãƒ€éœ€è¦â†‘',
                    items: ['ã‚°ãƒªãƒ¼ãƒ³ã‚µãƒ©ãƒ€', 'æ˜¥é›¨ã‚µãƒ©ãƒ€', 'å†·ã—ã‚ƒã¶ã‚µãƒ©ãƒ€'],
                    psychology: 'ã•ã£ã±ã‚Šã—ãŸã‚‚ã®ãŒé£Ÿã¹ãŸã„',
                });
            }
            break;

        case 'dessert':
            if (temp >= 25) {
                advice.recommendations.push({
                    text: 'æš‘ã•ã§å†·ãŸã„ãƒ‡ã‚¶ãƒ¼ãƒˆâ†‘â†‘',
                    items: ['ã‚¼ãƒªãƒ¼é¡ž', 'ãƒ—ãƒªãƒ³', 'æä»è±†è…', 'ãƒ•ãƒ«ãƒ¼ãƒ„ãƒ¨ãƒ¼ã‚°ãƒ«ãƒˆ'],
                    psychology: 'ã²ã‚“ã‚„ã‚Šç”˜ã„ã‚‚ã®ã§ç™’ã•ã‚ŒãŸã„',
                });
                advice.confidence = 88;
            }
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                advice.recommendations.push({
                    text: 'é€±æœ«ã”è¤’ç¾Žéœ€è¦â†‘',
                    items: ['ãƒ—ãƒ¬ãƒŸã‚¢ãƒ ã‚¹ã‚¤ãƒ¼ãƒ„', 'ç”Ÿè“å­'],
                    psychology: 'é ‘å¼µã£ãŸè‡ªåˆ†ã¸ã®ã”è¤’ç¾Ž',
                });
            }
            break;

        case 'bread':
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                advice.recommendations.push({
                    text: 'å¹³æ—¥æœã®éœ€è¦',
                    items: ['ãŸã¾ã”ã‚µãƒ³ãƒ‰', 'ãƒãƒ ã‚µãƒ³ãƒ‰', 'ãƒ„ãƒŠãƒ­ãƒ¼ãƒ«'],
                    psychology: 'æ‰‹è»½ã«æœé£Ÿã‚’æ¸ˆã¾ã›ãŸã„',
                });
            }
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã„æ—¥ã¯ãƒœãƒªãƒ¥ãƒ¼ãƒ ç³»â†‘',
                    items: ['ã‚«ãƒ„ã‚µãƒ³ãƒ‰', 'ãƒ–ãƒªãƒˆãƒ¼ï¼ˆãƒŸãƒ¼ãƒˆç³»ï¼‰'],
                    psychology: 'ã—ã£ã‹ã‚Šé£Ÿã¹ã¦æ¸©ã¾ã‚ŠãŸã„',
                });
            }
            break;

        case 'milk':
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã„æ—¥ã¯ãƒ›ãƒƒãƒˆéœ€è¦â†‘',
                    items: ['ãƒ›ãƒƒãƒˆãƒŸãƒ«ã‚¯ç”¨ç‰›ä¹³', 'ã‚³ã‚³ã‚¢åŽŸæ–™'],
                    psychology: 'æ¸©ã‹ã„é£²ã¿ç‰©ã§æ¸©ã¾ã‚ŠãŸã„',
                });
            }
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                advice.recommendations.push({
                    text: 'é€±æœ«ã¯å®¶æ—éœ€è¦â†‘',
                    items: ['å¤§å®¹é‡ç‰›ä¹³', 'ãƒ•ã‚¡ãƒŸãƒªãƒ¼ãƒ‘ãƒƒã‚¯'],
                    psychology: 'å®¶æ—ã§æ¶ˆè²»ã€ã¾ã¨ã‚è²·ã„',
                });
            }
            break;

        case 'drink':
            if (temp >= 25) {
                advice.recommendations.push({
                    text: 'æš‘ã•ã§å†·ãŸã„é£²æ–™â†‘â†‘',
                    items: ['ã‚¹ãƒãƒ¼ãƒ„ãƒ‰ãƒªãƒ³ã‚¯', 'ãŠèŒ¶', 'ç‚­é…¸é£²æ–™'],
                    psychology: 'æ°´åˆ†è£œçµ¦ãƒ»ã‚¯ãƒ¼ãƒ«ãƒ€ã‚¦ãƒ³',
                });
                advice.confidence = 90;
            }
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã•ã§ãƒ›ãƒƒãƒˆé£²æ–™â†‘',
                    items: ['ãƒ›ãƒƒãƒˆã‚³ãƒ¼ãƒ’ãƒ¼', 'ãƒ›ãƒƒãƒˆãŠèŒ¶', 'ã‚¹ãƒ¼ãƒ—'],
                    psychology: 'æ¸©ã‹ã„é£²ã¿ç‰©ã§æ¸©ã¾ã‚ŠãŸã„',
                });
            }
            break;

        case 'sweetsChoco':
            if (temp <= 15) {
                advice.recommendations.push({
                    text: 'ãƒãƒ§ã‚³ãƒ¬ãƒ¼ãƒˆéœ€è¦â†‘',
                    items: ['æ¿ãƒãƒ§ã‚³', 'ãƒãƒ§ã‚³è“å­'],
                    psychology: 'å¯’ã„æ™‚æœŸã¯ãƒãƒ§ã‚³ãŒç¾Žå‘³ã—ã„',
                });
            }
            if (temp >= 25) {
                advice.warnings.push({
                    text: 'æš‘ã•ã§ãƒãƒ§ã‚³æº¶ã‘æ³¨æ„',
                    suggestion: 'åœ¨åº«ç®¡ç†ãƒ»é™³åˆ—å ´æ‰€æ³¨æ„',
                });
            }
            break;

        case 'sweetsGummy':
            advice.recommendations.push({
                text: 'é€šå¹´å®‰å®šéœ€è¦',
                items: ['äººæ°—ã‚°ãƒŸ', 'å®šç•ªé§„è“å­'],
                psychology: 'æ‰‹è»½ãªãŠã‚„ã¤éœ€è¦',
            });
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                advice.recommendations.push({
                    text: 'é€±æœ«ã¯ãƒ•ã‚¡ãƒŸãƒªãƒ¼éœ€è¦â†‘',
                    items: ['å¤§è¢‹ã‚°ãƒŸ', 'ãƒãƒ©ã‚¨ãƒ†ã‚£ãƒ‘ãƒƒã‚¯'],
                    psychology: 'å­ä¾›ã®ãŠã‚„ã¤ã€ã¾ã¨ã‚è²·ã„',
                });
            }
            break;

        case 'sweetsSnack':
            advice.recommendations.push({
                text: 'é€šå¹´å®‰å®šéœ€è¦',
                items: ['å®šç•ªãƒãƒ†ãƒ', 'äººæ°—ã‚¹ãƒŠãƒƒã‚¯'],
                psychology: 'å®šç•ªã®ãŠã‚„ã¤éœ€è¦',
            });
            if (dayOfWeek === 5 || dayOfWeek === 6) {
                advice.recommendations.push({
                    text: 'é€±æœ«ãƒ‘ãƒ¼ãƒ†ã‚£ãƒ¼éœ€è¦â†‘',
                    items: ['å¤§è¢‹ãƒãƒ†ãƒ', 'ãƒ‘ãƒ¼ãƒ†ã‚£ãƒ¼ã‚µã‚¤ã‚º'],
                    psychology: 'é›†ã¾ã‚Šãƒ»å®´ä¼šç”¨',
                });
            }
            break;

        case 'frozen':
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã•ã§ãƒ•ãƒ©ã‚¤ãƒ¤ãƒ¼å•†å“â†‘',
                    items: ['ã‚³ãƒ­ãƒƒã‚±', 'ã‹ã‚‰æšã’', 'ãƒãƒ†ãƒˆ'],
                    psychology: 'æ¸©ã‹ã„æšã’ç‰©ã§æ¸©ã¾ã‚ŠãŸã„',
                });
            }
            advice.recommendations.push({
                text: 'ç„¼æˆãƒ‘ãƒ³æœéœ€è¦',
                items: ['ã‚¯ãƒ­ãƒ¯ãƒƒã‚µãƒ³', 'ãƒ¡ãƒ­ãƒ³ãƒ‘ãƒ³'],
                psychology: 'ç„¼ããŸã¦ã®é¦™ã‚Šã§è³¼è²·æ„æ¬²â†‘',
            });
            break;

        case 'sevenPDeli':
            if (temp <= 10) {
                advice.recommendations.push({
                    text: 'å¯’ã•ã§ãŠã§ã‚“ãƒ»ä¸­è¯ã¾ã‚“â†‘â†‘',
                    items: ['ãŠã§ã‚“ã‚»ãƒƒãƒˆ', 'è‚‰ã¾ã‚“', 'ã‚ã‚“ã¾ã‚“'],
                    psychology: 'æ¸©ã‹ã„ã‚‚ã®ã§ã™ãæ¸©ã¾ã‚ŠãŸã„',
                });
                advice.confidence = 90;
            }
            break;

        case 'tobacco':
            advice.recommendations.push({
                text: 'å®šç•ªéŠ˜æŸ„ã‚’åˆ‡ã‚‰ã•ãªã„',
                items: ['äººæ°—éŠ˜æŸ„TOP10', 'æ–°å•†å“'],
                psychology: 'æŒ‡åè²·ã„ãŒå¤šã„',
            });
            advice.confidence = 85;
            break;

        case 'supply':
        case 'goods':
        case 'processed':
            advice.recommendations.push({
                text: 'é€šå¸¸ç™ºæ³¨ã§OK',
                items: [],
                psychology: '',
            });
            break;

        case 'deliOther':
            if (dayOfWeek === 5) {
                advice.recommendations.push({
                    text: 'é‡‘æ›œã¯ãŠæƒ£èœéœ€è¦â†‘',
                    items: ['ãŠã¤ã¾ã¿ç³»æƒ£èœ'],
                    psychology: 'é€±æœ«å‰ã®è²·ã„è¶³ã—',
                });
            }
            break;

        default:
            advice.recommendations.push({
                text: 'é€šå¸¸ç™ºæ³¨ã§OK',
                items: [],
                psychology: '',
            });
            break;
    }

    if (dayOfMonth >= 23 && dayOfMonth <= 27) {
        advice.recommendations.push({
            text: 'ðŸ’° çµ¦æ–™æ—¥å‰å¾Œã§æ¶ˆè²»æ„æ¬²â†‘',
            items: ['ãƒ—ãƒ¬ãƒŸã‚¢ãƒ å•†å“', 'é«˜å˜ä¾¡å•†å“'],
            psychology: 'è²¡å¸ƒã®ç´ãŒç·©ã‚€',
        });
    }
    if (dayOfMonth >= 26 && dayOfMonth <= 31) {
        advice.warnings.push({
            text: 'æœˆæœ«ã§ç¯€ç´„å¿—å‘',
            suggestion: 'é«˜å˜ä¾¡å•†å“æŽ§ãˆã‚ã€PBå•†å“å¼·åŒ–',
        });
    }

    return advice;
}

// ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç”»é¢ã‚’è¡¨ç¤º
function showOrderAdviceScreen() {
    // åˆ©ç”¨è¿½è·¡
    const staffName = state.orderAdvice.selectedStaffId ? 
        (state.employees.find(e => e.id === state.orderAdvice.selectedStaffId)?.name || 'åŒ¿å') : 'åŒ¿å';
    trackUsage('view_order_advice', staffName);
    
    const mainContent = document.querySelector('.app-container');
    const existingScreen = document.getElementById('orderAdviceScreen');
    if (existingScreen) {
        existingScreen.remove();
    }
    
    const screen = document.createElement('div');
    screen.id = 'orderAdviceScreen';
    screen.className = 'order-advice-screen';
    
    if (!state.orderAdvice.selectedStaffId) {
        screen.innerHTML = renderStaffSelection();
    } else {
        screen.innerHTML = renderAdviceScreen();
    }
    
    mainContent.appendChild(screen);
    startDeadlineTimer();
}

// æ‹…å½“è€…é¸æŠžç”»é¢ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderStaffSelection() {
    let html = `
        <div class="order-advice-header">
            <h2>ðŸ“¦ ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹</h2>
            <button class="btn btn-secondary" onclick="closeOrderAdviceScreen()">âœ• é–‰ã˜ã‚‹</button>
        </div>
        <div class="staff-selection">
            <h3>æ‹…å½“è€…ã‚’é¸æŠžã—ã¦ãã ã•ã„</h3>
            <div class="staff-grid">
    `;
    
    ORDER_STAFF.forEach(staff => {
        const categories = staff.categories.map(catId => {
            const cat = ORDER_ADVICE_CATEGORIES.find(c => c.id === catId);
            return cat ? `<span class="staff-category-tag" style="background:${cat.color}">${cat.icon} ${cat.name}</span>` : '';
        }).join('');
        
        html += `
            <div class="staff-card" onclick="selectOrderStaff(${staff.id})">
                <div class="staff-card-header">
                    <span class="staff-name">${staff.name}</span>
                    <span class="staff-role">${staff.role}</span>
                </div>
                <div class="staff-categories">
                    ${categories}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// æ‹…å½“è€…ã‚’é¸æŠž
function selectOrderStaff(staffId) {
    state.orderAdvice.selectedStaffId = staffId;
    showOrderAdviceScreen();
}

// ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç”»é¢ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderAdviceScreen() {
    const staff = ORDER_STAFF.find(s => s.id === state.orderAdvice.selectedStaffId);
    if (!staff) return '';
    
    const orderInfo = getOrderTargetInfo();
    const targetDateStr = orderInfo.targetDateStr;
    const weather = state.weatherData[targetDateStr];
    const targetDate = orderInfo.targetDate;
    const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
    
    let html = `
        <div class="order-advice-header">
            <div class="header-left">
                <h2>ðŸ“¦ ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹</h2>
                <span class="current-staff">æ‹…å½“: ${staff.name}</span>
            </div>
            <div class="header-right">
                <button class="btn btn-secondary btn-sm" onclick="changeOrderStaff()">ðŸ‘¤ æ‹…å½“è€…åˆ‡æ›¿</button>
                <button class="btn btn-secondary" onclick="closeOrderAdviceScreen()">âœ• é–‰ã˜ã‚‹</button>
            </div>
        </div>
        
        <div class="order-info-bar">
            <div class="target-date">
                <span class="label">ç™ºæ³¨å¯¾è±¡æ—¥:</span>
                <span class="date">${targetDate.getMonth() + 1}/${targetDate.getDate()}ï¼ˆ${dayNames[targetDate.getDay()]}ï¼‰</span>
                <span class="note">${orderInfo.isBeforeDeadline ? 'ç¿Œæ—¥åˆ†' : 'ç¿Œã€…æ—¥åˆ†'}</span>
            </div>
            <div class="deadline ${orderInfo.isUrgent ? 'urgent' : ''}">
                <span class="label">ç· åˆ‡ã¾ã§:</span>
                <span class="time" id="deadlineTimer">${orderInfo.hoursUntil}æ™‚é–“${orderInfo.minutesUntil}åˆ†</span>
            </div>
        </div>
    `;
    
    if (weather) {
        const weatherInfo = getWeatherInfo(weather.weatherCode);
        html += `
            <div class="weather-special-card">
                <div class="weather-section">
                    <span class="weather-icon-large">${weatherInfo.icon}</span>
                    <div class="weather-details">
                        <span class="weather-desc">${weatherInfo.desc}</span>
                        <span class="weather-temp">
                            <span class="temp-high">${weather.tempMax}Â°</span> / 
                            <span class="temp-low">${weather.tempMin}Â°</span>
                        </span>
                    </div>
                </div>
                <div class="special-day-section">
                    ${renderSpecialDayBadges(targetDate)}
                </div>
            </div>
        `;
    }
    
    html += `
        <div class="advice-tabs">
            <button class="advice-tab ${state.orderAdvice.activeTab === 'advice' ? 'active' : ''}" 
                    onclick="switchAdviceTab('advice')">ðŸ“‹ ã‚¢ãƒ‰ãƒã‚¤ã‚¹</button>
            <button class="advice-tab ${state.orderAdvice.activeTab === 'feedback' ? 'active' : ''}" 
                    onclick="switchAdviceTab('feedback')">ðŸ“ ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯</button>
        </div>
    `;
    
    if (state.orderAdvice.activeTab === 'advice') {
        html += renderCategoryAdvice(staff, weather, targetDate);
    } else {
        html += renderFeedbackForm(staff, targetDateStr);
    }
    
    return html;
}

// ç‰¹åˆ¥æ—¥ãƒãƒƒã‚¸ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderSpecialDayBadges(date) {
    const badges = [];
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    
    if (dayOfWeek === 5) badges.push('<span class="special-badge friday">ðŸŽ‰ é‡‘æ›œæ—¥</span>');
    if (dayOfWeek === 6) badges.push('<span class="special-badge weekend">ðŸŒŸ åœŸæ›œæ—¥</span>');
    if (dayOfWeek === 0) badges.push('<span class="special-badge weekend">ðŸŒŸ æ—¥æ›œæ—¥</span>');
    if (dayOfMonth >= 23 && dayOfMonth <= 27) badges.push('<span class="special-badge payday">ðŸ’° çµ¦æ–™æ—¥å‰å¾Œ</span>');
    if (dayOfMonth >= 26) badges.push('<span class="special-badge monthend">ðŸ“… æœˆæœ«</span>');
    
    return badges.length > 0 ? badges.join('') : '<span class="no-special">ç‰¹åˆ¥ãªæ—¥ã§ã¯ã‚ã‚Šã¾ã›ã‚“</span>';
}

// ã‚«ãƒ†ã‚´ãƒªåˆ¥ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderCategoryAdvice(staff, weather, targetDate) {
    let html = '<div class="category-advice-list">';
    
    staff.categories.forEach(catId => {
        const category = ORDER_ADVICE_CATEGORIES.find(c => c.id === catId);
        if (!category) return;
        
        const advice = generateOrderAdvice(catId, weather, targetDate);
        
        html += `
            <div class="category-advice-card" style="border-left-color: ${category.color}">
                <div class="card-header">
                    <span class="category-icon" style="background: ${category.color}">${category.icon}</span>
                    <span class="category-name">${category.name}</span>
                    <span class="confidence">ä¿¡é ¼åº¦: ${advice.confidence}%</span>
                </div>
        `;
        
        if (advice.recommendations.length > 0) {
            html += '<div class="recommendations">';
            advice.recommendations.forEach(rec => {
                html += `
                    <div class="recommendation-item">
                        <div class="rec-text">ðŸ“ˆ ${rec.text}</div>
                        ${rec.psychology ? `<div class="rec-psychology">ðŸ§  ${rec.psychology}</div>` : ''}
                        ${rec.items.length > 0 ? `
                            <div class="rec-items">
                                æŽ¨å¥¨: ${rec.items.map(item => `<span class="item-tag">${item}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        if (advice.warnings.length > 0) {
            html += '<div class="warnings">';
            advice.warnings.forEach(warn => {
                html += `
                    <div class="warning-item">
                        <div class="warn-text">âš ï¸ ${warn.text}</div>
                        ${warn.suggestion ? `<div class="warn-suggestion">ðŸ’¡ ${warn.suggestion}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ãƒ•ã‚©ãƒ¼ãƒ ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderFeedbackForm(staff, targetDateStr) {
    let html = '<div class="feedback-form-container">';
    
    staff.categories.forEach(catId => {
        const category = ORDER_ADVICE_CATEGORIES.find(c => c.id === catId);
        if (!category) return;
        
        const feedbackKey = `${targetDateStr}-${catId}`;
        const existingFeedback = state.orderAdvice.feedbackData[feedbackKey] || {};
        
        html += `
            <div class="feedback-card" style="border-left-color: ${category.color}">
                <div class="card-header">
                    <span class="category-icon" style="background: ${category.color}">${category.icon}</span>
                    <span class="category-name">${category.name}</span>
                </div>
                
                <div class="feedback-fields">
                    <div class="field-group">
                        <label>çš„ä¸­åº¦è©•ä¾¡</label>
                        <div class="rating-buttons">
                            <button type="button" class="rating-btn ${existingFeedback.rating === 'excellent' ? 'selected' : ''}" 
                                    onclick="setFeedbackRating('${feedbackKey}', 'excellent')">â—Ž çš„ä¸­</button>
                            <button type="button" class="rating-btn ${existingFeedback.rating === 'good' ? 'selected' : ''}" 
                                    onclick="setFeedbackRating('${feedbackKey}', 'good')">â—‹ ã¾ã‚ã¾ã‚</button>
                            <button type="button" class="rating-btn ${existingFeedback.rating === 'fair' ? 'selected' : ''}" 
                                    onclick="setFeedbackRating('${feedbackKey}', 'fair')">â–³ æ™®é€š</button>
                            <button type="button" class="rating-btn ${existingFeedback.rating === 'poor' ? 'selected' : ''}" 
                                    onclick="setFeedbackRating('${feedbackKey}', 'poor')">Ã— å¤–ã‚Œ</button>
                        </div>
                    </div>
                    
                    <div class="field-group">
                        <label>äºˆæƒ³ä»¥ä¸Šã«å£²ã‚ŒãŸã‚‚ã®</label>
                        <input type="text" class="feedback-input" 
                               id="oversold-${feedbackKey}" 
                               value="${existingFeedback.oversold || ''}"
                               placeholder="ä¾‹ï¼šãŠã«ãŽã‚Šã€ã‚µãƒ³ãƒ‰ã‚¤ãƒƒãƒ">
                    </div>
                    
                    <div class="field-group">
                        <label>äºˆæƒ³ã‚ˆã‚Šå£²ã‚Œãªã‹ã£ãŸã‚‚ã®</label>
                        <input type="text" class="feedback-input" 
                               id="undersold-${feedbackKey}" 
                               value="${existingFeedback.undersold || ''}"
                               placeholder="ä¾‹ï¼šå¼å½“é¡žã€ãƒ‡ã‚¶ãƒ¼ãƒˆ">
                    </div>
                    
                    <div class="field-group">
                        <label>æ°—ã¥ã„ãŸã“ã¨ãƒ»ç‰¹è¨˜äº‹é …</label>
                        <textarea class="feedback-textarea" 
                                  id="notes-${feedbackKey}" 
                                  rows="2"
                                  placeholder="ä¾‹ï¼šé›¨ãŒäºˆå ±ã‚ˆã‚Šæ—©ãé™ã‚Šå§‹ã‚ãŸ">${existingFeedback.notes || ''}</textarea>
                    </div>
                    
                    <button class="btn btn-primary btn-sm" onclick="submitFeedback('${feedbackKey}', '${catId}', '${targetDateStr}')">
                        ðŸ’¾ ä¿å­˜
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// ã‚¿ãƒ–åˆ‡ã‚Šæ›¿ãˆ
function switchAdviceTab(tab) {
    state.orderAdvice.activeTab = tab;
    showOrderAdviceScreen();
}

// æ‹…å½“è€…åˆ‡æ›¿
function changeOrderStaff() {
    state.orderAdvice.selectedStaffId = null;
    showOrderAdviceScreen();
}

// ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹ç”»é¢ã‚’é–‰ã˜ã‚‹
function closeOrderAdviceScreen() {
    const screen = document.getElementById('orderAdviceScreen');
    if (screen) {
        screen.remove();
    }
    stopDeadlineTimer();
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯è©•ä¾¡ã‚’è¨­å®š
function setFeedbackRating(feedbackKey, rating) {
    if (!state.orderAdvice.feedbackData[feedbackKey]) {
        state.orderAdvice.feedbackData[feedbackKey] = {};
    }
    state.orderAdvice.feedbackData[feedbackKey].rating = rating;
    
    const card = document.querySelector(`[onclick="setFeedbackRating('${feedbackKey}', '${rating}')"]`).closest('.feedback-card');
    card.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`[onclick="setFeedbackRating('${feedbackKey}', '${rating}')"]`).classList.add('selected');
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯é€ä¿¡
function submitFeedback(feedbackKey, categoryId, date) {
    const feedback = {
        id: feedbackKey,
        categoryId,
        date,
        rating: state.orderAdvice.feedbackData[feedbackKey]?.rating || null,
        oversold: document.getElementById(`oversold-${feedbackKey}`)?.value || '',
        undersold: document.getElementById(`undersold-${feedbackKey}`)?.value || '',
        notes: document.getElementById(`notes-${feedbackKey}`)?.value || '',
        submittedAt: new Date().toISOString(),
        submittedBy: ORDER_STAFF.find(s => s.id === state.orderAdvice.selectedStaffId)?.name || 'ä¸æ˜Ž'
    };
    
    database.ref(`orderFeedback/${feedbackKey}`).set(feedback);
    state.orderAdvice.feedbackData[feedbackKey] = feedback;
    
    // å…¥åŠ›æ¬„ã‚’ã‚¯ãƒªã‚¢
    const oversoldInput = document.getElementById(`oversold-${feedbackKey}`);
    const undersoldInput = document.getElementById(`undersold-${feedbackKey}`);
    const notesInput = document.getElementById(`notes-${feedbackKey}`);
    if (oversoldInput) oversoldInput.value = '';
    if (undersoldInput) undersoldInput.value = '';
    if (notesInput) notesInput.value = '';
    
    // è©•ä¾¡ãƒœã‚¿ãƒ³ã®é¸æŠžçŠ¶æ…‹ã‚‚ãƒªã‚»ãƒƒãƒˆ
    const card = document.querySelector(`#oversold-${feedbackKey}`)?.closest('.feedback-card');
    if (card) {
        card.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('selected'));
    }
    
    // çŠ¶æ…‹ã‚‚ãƒªã‚»ãƒƒãƒˆ
    delete state.orderAdvice.feedbackData[feedbackKey].rating;
    
    alert('ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ã‚’ä¿å­˜ã—ã¾ã—ãŸ');
}

// ç· åˆ‡ã‚¿ã‚¤ãƒžãƒ¼
let deadlineTimerInterval = null;

function startDeadlineTimer() {
    stopDeadlineTimer();
    updateDeadlineTimer();
    deadlineTimerInterval = setInterval(updateDeadlineTimer, 60000);
}

function stopDeadlineTimer() {
    if (deadlineTimerInterval) {
        clearInterval(deadlineTimerInterval);
        deadlineTimerInterval = null;
    }
}

function updateDeadlineTimer() {
    const timerEl = document.getElementById('deadlineTimer');
    if (!timerEl) return;
    
    const orderInfo = getOrderTargetInfo();
    timerEl.textContent = `${orderInfo.hoursUntil}æ™‚é–“${orderInfo.minutesUntil}åˆ†`;
    
    const deadlineEl = timerEl.closest('.deadline');
    if (deadlineEl) {
        if (orderInfo.isUrgent) {
            deadlineEl.classList.add('urgent');
        } else {
            deadlineEl.classList.remove('urgent');
        }
    }
}

// ========================================
// å•†å“åˆ†é¡žç®¡ç†æ©Ÿèƒ½
// ========================================

// å•†å“åˆ†é¡žç®¡ç†ãƒ‘ãƒãƒ«ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderProductCategoriesPanel(container) {
    const categories = state.productCategories || [];
    const selectedPmaId = state.selectedPmaId || null;
    const selectedPma = selectedPmaId ? categories.find(p => p.id === selectedPmaId) : null;
    
    container.innerHTML = `
        <div class="product-categories-container">
            <div class="product-categories-header">
                <h3>ðŸ“‚ å•†å“åˆ†é¡žç®¡ç†</h3>
                <p class="header-description">PMAï¼ˆå¤§åˆ†é¡žï¼‰ã¨æƒ…å ±åˆ†é¡žã‚’ç®¡ç†ã—ã¾ã™ã€‚ã“ã“ã§è¨­å®šã—ãŸå†…å®¹ãŒç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹ã«åæ˜ ã•ã‚Œã¾ã™ã€‚</p>
            </div>
            
            <div class="product-categories-layout">
                <!-- å·¦å´: PMAä¸€è¦§ -->
                <div class="pma-sidebar">
                    <div class="pma-sidebar-header">
                        <span class="sidebar-title">PMAä¸€è¦§</span>
                        <button class="btn btn-sm btn-primary" onclick="openAddPMAModal()">+ è¿½åŠ </button>
                    </div>
                    <div class="pma-sidebar-list">
                        ${categories.length === 0 ? 
                            '<p class="no-data-message-small">PMAãŒã‚ã‚Šã¾ã›ã‚“</p>' : 
                            categories.map(pma => `
                                <div class="pma-sidebar-item ${selectedPmaId === pma.id ? 'active' : ''}" 
                                     onclick="selectPMA('${pma.id}')">
                                    <span class="pma-item-icon">${pma.icon || 'ðŸ“¦'}</span>
                                    <span class="pma-item-name">${pma.name}</span>
                                    <span class="pma-item-count">${(pma.infoCategories || []).length}</span>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
                
                <!-- å³å´: é¸æŠžã•ã‚ŒãŸPMAã®è©³ç´° -->
                <div class="pma-detail">
                    ${selectedPma ? renderPMADetail(selectedPma) : `
                        <div class="pma-detail-empty">
                            <p>ðŸ‘ˆ å·¦ã®PMAä¸€è¦§ã‹ã‚‰é¸æŠžã—ã¦ãã ã•ã„</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

// PMAé¸æŠž
function selectPMA(pmaId) {
    state.selectedPmaId = pmaId;
    renderAdminPanel();
}

// PMAè©³ç´°ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderPMADetail(pma) {
    const infoCategories = pma.infoCategories || [];
    
    return `
        <div class="pma-detail-header">
            <div class="pma-detail-title">
                <button class="btn btn-sm btn-secondary" onclick="deselectPMA()" style="margin-right: 12px;">â† æˆ»ã‚‹</button>
                <span class="pma-detail-icon">${pma.icon || 'ðŸ“¦'}</span>
                <span class="pma-detail-name">${pma.name}</span>
            </div>
            <div class="pma-detail-actions">
                <button class="btn btn-sm btn-secondary" onclick="openEditPMAModal('${pma.id}')">âœï¸ ç·¨é›†</button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeletePMA('${pma.id}')">ðŸ—‘ï¸ å‰Šé™¤</button>
            </div>
        </div>
        
        <div class="info-categories-section">
            <div class="info-categories-header">
                <span class="section-label">æƒ…å ±åˆ†é¡ž</span>
                <button class="btn btn-sm btn-primary" onclick="openAddInfoCategoryModal('${pma.id}')">+ æƒ…å ±åˆ†é¡žè¿½åŠ </button>
            </div>
            
            <div class="info-categories-list">
                ${infoCategories.length === 0 ? 
                    '<p class="no-items-message">æƒ…å ±åˆ†é¡žãŒã‚ã‚Šã¾ã›ã‚“ã€‚ã€Œ+ æƒ…å ±åˆ†é¡žè¿½åŠ ã€ãƒœã‚¿ãƒ³ã‹ã‚‰è¿½åŠ ã—ã¦ãã ã•ã„ã€‚</p>' :
                    infoCategories.map(info => renderInfoCategoryItem(pma.id, info)).join('')
                }
            </div>
        </div>
    `;
}

// æƒ…å ±åˆ†é¡žã‚¢ã‚¤ãƒ†ãƒ ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderInfoCategoryItem(pmaId, info) {
    return `
        <div class="info-category-item" data-info-id="${info.id}">
            <div class="info-category-header">
                <span class="info-category-name">${info.name}</span>
                <div class="info-category-actions">
                    <button class="btn btn-xs btn-secondary" onclick="openEditInfoCategoryModal('${pmaId}', '${info.id}')">âœï¸</button>
                    <button class="btn btn-xs btn-danger" onclick="confirmDeleteInfoCategory('${pmaId}', '${info.id}')">ðŸ—‘ï¸</button>
                </div>
            </div>
        </div>
    `;
}

// PMAé¸æŠžè§£é™¤
function deselectPMA() {
    state.selectedPmaId = null;
    renderAdminPanel();
}

// PMAè¿½åŠ ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openAddPMAModal() {
    const modal = createCategoryModal({
        title: 'ðŸ“¦ PMAï¼ˆå¤§åˆ†é¡žï¼‰è¿½åŠ ',
        fields: [
            { name: 'name', label: 'PMAå', type: 'text', placeholder: 'ä¾‹: ç±³é£¯', required: true },
            { name: 'icon', label: 'ã‚¢ã‚¤ã‚³ãƒ³', type: 'text', placeholder: 'ä¾‹: ðŸ™', maxLength: 2 }
        ],
        onSubmit: (data) => {
            addPMA(data);
        }
    });
    document.body.appendChild(modal);
}

// PMAç·¨é›†ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openEditPMAModal(pmaId) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    if (!pma) return;
    
    const modal = createCategoryModal({
        title: 'ðŸ“¦ PMAï¼ˆå¤§åˆ†é¡žï¼‰ç·¨é›†',
        fields: [
            { name: 'name', label: 'PMAå', type: 'text', value: pma.name, required: true },
            { name: 'icon', label: 'ã‚¢ã‚¤ã‚³ãƒ³', type: 'text', value: pma.icon || '', maxLength: 2 }
        ],
        onSubmit: (data) => {
            updatePMA(pmaId, data);
        }
    });
    document.body.appendChild(modal);
}

// æƒ…å ±åˆ†é¡žè¿½åŠ ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openAddInfoCategoryModal(pmaId) {
    const modal = createCategoryModal({
        title: 'ðŸ“ æƒ…å ±åˆ†é¡žè¿½åŠ ',
        fields: [
            { name: 'name', label: 'æƒ…å ±åˆ†é¡žå', type: 'text', placeholder: 'ä¾‹: ãŠã«ãŽã‚Š', required: true }
        ],
        onSubmit: (data) => {
            addInfoCategory(pmaId, data);
        }
    });
    document.body.appendChild(modal);
}

// æƒ…å ±åˆ†é¡žç·¨é›†ãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‹ã
function openEditInfoCategoryModal(pmaId, infoId) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    const info = pma?.infoCategories?.find(i => i.id === infoId);
    if (!info) return;
    
    const modal = createCategoryModal({
        title: 'ðŸ“ æƒ…å ±åˆ†é¡žç·¨é›†',
        fields: [
            { name: 'name', label: 'æƒ…å ±åˆ†é¡žå', type: 'text', value: info.name, required: true }
        ],
        onSubmit: (data) => {
            updateInfoCategory(pmaId, infoId, data);
        }
    });
    document.body.appendChild(modal);
}

// ã‚«ãƒ†ã‚´ãƒªãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’ä½œæˆï¼ˆæ±Žç”¨ï¼‰
function createCategoryModal({ title, fields, onSubmit }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay category-modal-overlay active';
    
    const fieldsHtml = fields.map(f => `
        <div class="form-group">
            <label for="category-${f.name}">${f.label}${f.required ? ' <span class="required">*</span>' : ''}</label>
            <input type="${f.type}" 
                   id="category-${f.name}" 
                   name="${f.name}"
                   value="${f.value || ''}" 
                   placeholder="${f.placeholder || ''}"
                   ${f.maxLength ? `maxlength="${f.maxLength}"` : ''}
                   ${f.required ? 'required' : ''}>
        </div>
    `).join('');
    
    overlay.innerHTML = `
        <div class="modal category-modal">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeCategoryModal(this)">Ã—</button>
            </div>
            <form class="modal-body" onsubmit="handleCategoryFormSubmit(event, this)">
                ${fieldsHtml}
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeCategoryModal(this)">ã‚­ãƒ£ãƒ³ã‚»ãƒ«</button>
                    <button type="submit" class="btn btn-primary">ä¿å­˜</button>
                </div>
            </form>
        </div>
    `;
    
    // onSubmitã‚³ãƒ¼ãƒ«ãƒãƒƒã‚¯ã‚’ä¿å­˜
    overlay._onSubmit = onSubmit;
    
    // ã‚ªãƒ¼ãƒãƒ¼ãƒ¬ã‚¤ã‚¯ãƒªãƒƒã‚¯ã§é–‰ã˜ã‚‹
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    };
    
    return overlay;
}

// ã‚«ãƒ†ã‚´ãƒªãƒ¢ãƒ¼ãƒ€ãƒ«ã‚’é–‰ã˜ã‚‹
function closeCategoryModal(element) {
    const overlay = element.closest('.category-modal-overlay');
    if (overlay) overlay.remove();
}

// ã‚«ãƒ†ã‚´ãƒªãƒ•ã‚©ãƒ¼ãƒ é€ä¿¡å‡¦ç†
function handleCategoryFormSubmit(event, form) {
    event.preventDefault();
    const overlay = form.closest('.category-modal-overlay');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    if (overlay._onSubmit) {
        overlay._onSubmit(data);
    }
    overlay.remove();
}

// PMAè¿½åŠ 
function addPMA(data) {
    const newPMA = {
        id: 'pma-' + Date.now(),
        name: data.name,
        icon: data.icon || 'ðŸ“¦',
        infoCategories: [],
        createdAt: new Date().toISOString()
    };
    
    state.productCategories.push(newPMA);
    saveToFirebase('productCategories', state.productCategories);
    renderAdminPanel();
}

// PMAæ›´æ–°
function updatePMA(pmaId, data) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    if (!pma) return;
    
    pma.name = data.name;
    pma.icon = data.icon || 'ðŸ“¦';
    pma.updatedAt = new Date().toISOString();
    
    saveToFirebase('productCategories', state.productCategories);
    renderAdminPanel();
}

// PMAå‰Šé™¤ç¢ºèª
function confirmDeletePMA(pmaId) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    if (!pma) return;
    
    if (confirm(`ã€Œ${pma.name}ã€ã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ\nå«ã¾ã‚Œã‚‹æƒ…å ±åˆ†é¡žãƒ»å°åˆ†é¡žã‚‚ã™ã¹ã¦å‰Šé™¤ã•ã‚Œã¾ã™ã€‚`)) {
        deletePMA(pmaId);
    }
}

// PMAå‰Šé™¤
function deletePMA(pmaId) {
    state.productCategories = state.productCategories.filter(p => p.id !== pmaId);
    saveToFirebase('productCategories', state.productCategories);
    renderAdminPanel();
}

// æƒ…å ±åˆ†é¡žè¿½åŠ 
function addInfoCategory(pmaId, data) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    if (!pma) return;
    
    if (!pma.infoCategories) pma.infoCategories = [];
    
    pma.infoCategories.push({
        id: 'info-' + Date.now(),
        name: data.name,
        subCategories: [],
        createdAt: new Date().toISOString()
    });
    
    saveToFirebase('productCategories', state.productCategories);
    renderAdminPanel();
}

// æƒ…å ±åˆ†é¡žæ›´æ–°
function updateInfoCategory(pmaId, infoId, data) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    const info = pma?.infoCategories?.find(i => i.id === infoId);
    if (!info) return;
    
    info.name = data.name;
    info.updatedAt = new Date().toISOString();
    
    saveToFirebase('productCategories', state.productCategories);
    renderAdminPanel();
}

// æƒ…å ±åˆ†é¡žå‰Šé™¤ç¢ºèª
function confirmDeleteInfoCategory(pmaId, infoId) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    const info = pma?.infoCategories?.find(i => i.id === infoId);
    if (!info) return;
    
    if (confirm(`ã€Œ${info.name}ã€ã‚’å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿ\nå«ã¾ã‚Œã‚‹å°åˆ†é¡žã‚‚ã™ã¹ã¦å‰Šé™¤ã•ã‚Œã¾ã™ã€‚`)) {
        deleteInfoCategory(pmaId, infoId);
    }
}

// æƒ…å ±åˆ†é¡žå‰Šé™¤
function deleteInfoCategory(pmaId, infoId) {
    const pma = state.productCategories.find(p => p.id === pmaId);
    if (!pma) return;
    
    pma.infoCategories = pma.infoCategories.filter(i => i.id !== infoId);
    saveToFirebase('productCategories', state.productCategories);
    renderAdminPanel();
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯é›†è¨ˆã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°ï¼ˆç®¡ç†è€…å°‚ç”¨ï¼‰
function renderFeedbackStats(container) {
    const feedbackData = state.orderAdvice?.feedbackData || {};
    const feedbackList = Object.values(feedbackData);
    
    console.log('renderFeedbackStats called', { feedbackData, feedbackList });
    
    // ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼çŠ¶æ…‹ã®åˆæœŸåŒ–
    if (!state.feedbackFilter) {
        state.feedbackFilter = {
            period: 'all',
            staffName: 'all',
            startDate: '',
            endDate: ''
        };
    }
    
    // æ‹…å½“è€…ãƒªã‚¹ãƒˆã‚’ä½œæˆ
    const staffNames = [...new Set(feedbackList.map(f => f.submittedBy).filter(Boolean))].sort();
    
    // ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼UI
    container.innerHTML = `
        <div class="feedback-stats-container">
            <div class="feedback-stats-header">
                <h3>ðŸ“Š ç™ºæ³¨ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯é›†è¨ˆ</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">
                    ç™»éŒ²ä»¶æ•°: ${feedbackList.length}ä»¶
                </p>
            </div>
            
            <div class="feedback-filters">
                <div class="filter-group">
                    <label>æœŸé–“:</label>
                    <select id="feedbackPeriodFilter" onchange="updateFeedbackFilter('period', this.value)">
                        <option value="all" ${state.feedbackFilter.period === 'all' ? 'selected' : ''}>ã™ã¹ã¦</option>
                        <option value="week" ${state.feedbackFilter.period === 'week' ? 'selected' : ''}>ç›´è¿‘1é€±é–“</option>
                        <option value="month" ${state.feedbackFilter.period === 'month' ? 'selected' : ''}>ç›´è¿‘1ãƒ¶æœˆ</option>
                        <option value="custom" ${state.feedbackFilter.period === 'custom' ? 'selected' : ''}>æœŸé–“æŒ‡å®š</option>
                    </select>
                </div>
                
                <div class="filter-group custom-date-range" id="customDateRange" style="display: ${state.feedbackFilter.period === 'custom' ? 'flex' : 'none'}">
                    <input type="date" id="feedbackStartDate" value="${state.feedbackFilter.startDate}" onchange="updateFeedbackFilter('startDate', this.value)">
                    <span>ã€œ</span>
                    <input type="date" id="feedbackEndDate" value="${state.feedbackFilter.endDate}" onchange="updateFeedbackFilter('endDate', this.value)">
                </div>
                
                <div class="filter-group">
                    <label>æ‹…å½“è€…:</label>
                    <select id="feedbackStaffFilter" onchange="updateFeedbackFilter('staffName', this.value)">
                        <option value="all" ${state.feedbackFilter.staffName === 'all' ? 'selected' : ''}>å…¨å“¡</option>
                        ${staffNames.map(name => `<option value="${name}" ${state.feedbackFilter.staffName === name ? 'selected' : ''}>${name}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <div class="feedback-stats-summary" id="feedbackSummary"></div>
            
            <div class="feedback-stats-tabs">
                <button class="stats-tab active" data-view="byStaff" onclick="switchFeedbackView('byStaff')">ðŸ‘¤ æ‹…å½“è€…åˆ¥</button>
                <button class="stats-tab" data-view="byDate" onclick="switchFeedbackView('byDate')">ðŸ“… æ—¥ä»˜åˆ¥</button>
                <button class="stats-tab" data-view="list" onclick="switchFeedbackView('list')">ðŸ“‹ ä¸€è¦§</button>
            </div>
            
            <div class="feedback-stats-content" id="feedbackStatsContent"></div>
        </div>
    `;
    
    // åˆæœŸè¡¨ç¤º
    if (!state.feedbackView) state.feedbackView = 'byStaff';
    renderFeedbackContent(feedbackList);
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼æ›´æ–°
function updateFeedbackFilter(key, value) {
    state.feedbackFilter[key] = value;
    
    // æœŸé–“æŒ‡å®šã®è¡¨ç¤ºåˆ‡ã‚Šæ›¿ãˆ
    const customRange = document.getElementById('customDateRange');
    if (customRange) {
        customRange.style.display = state.feedbackFilter.period === 'custom' ? 'flex' : 'none';
    }
    
    renderFeedbackContent(Object.values(state.orderAdvice.feedbackData || {}));
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯è¡¨ç¤ºåˆ‡ã‚Šæ›¿ãˆ
function switchFeedbackView(view) {
    state.feedbackView = view;
    
    // ã‚¿ãƒ–ã®ã‚¢ã‚¯ãƒ†ã‚£ãƒ–çŠ¶æ…‹ã‚’æ›´æ–°
    document.querySelectorAll('.stats-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });
    
    renderFeedbackContent(Object.values(state.orderAdvice.feedbackData || {}));
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯å†…å®¹ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderFeedbackContent(feedbackList) {
    // ãƒ•ã‚£ãƒ«ã‚¿ãƒªãƒ³ã‚°
    let filtered = [...feedbackList];
    
    // æœŸé–“ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼
    if (state.feedbackFilter.period !== 'all') {
        const now = new Date();
        let startDate;
        
        if (state.feedbackFilter.period === 'week') {
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
        } else if (state.feedbackFilter.period === 'month') {
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (state.feedbackFilter.period === 'custom') {
            if (state.feedbackFilter.startDate) {
                startDate = new Date(state.feedbackFilter.startDate);
            }
            if (state.feedbackFilter.endDate) {
                const endDate = new Date(state.feedbackFilter.endDate);
                endDate.setHours(23, 59, 59);
                filtered = filtered.filter(f => new Date(f.submittedAt) <= endDate);
            }
        }
        
        if (startDate) {
            filtered = filtered.filter(f => new Date(f.submittedAt) >= startDate);
        }
    }
    
    // æ‹…å½“è€…ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼
    if (state.feedbackFilter.staffName !== 'all') {
        filtered = filtered.filter(f => f.submittedBy === state.feedbackFilter.staffName);
    }
    
    // ã‚µãƒžãƒªãƒ¼æ›´æ–°
    const summaryEl = document.getElementById('feedbackSummary');
    if (summaryEl) {
        const totalCount = filtered.length;
        const staffCount = new Set(filtered.map(f => f.submittedBy)).size;
        const ratingCounts = {
            excellent: filtered.filter(f => f.rating === 'excellent').length,
            good: filtered.filter(f => f.rating === 'good').length,
            fair: filtered.filter(f => f.rating === 'fair').length,
            poor: filtered.filter(f => f.rating === 'poor').length
        };
        
        summaryEl.innerHTML = `
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="summary-value">${totalCount}</div>
                    <div class="summary-label">ç·ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯æ•°</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${staffCount}</div>
                    <div class="summary-label">æ‹…å½“è€…æ•°</div>
                </div>
                <div class="summary-card rating-card">
                    <div class="rating-breakdown">
                        <span class="rating-item excellent">â—Ž ${ratingCounts.excellent}</span>
                        <span class="rating-item good">â—‹ ${ratingCounts.good}</span>
                        <span class="rating-item fair">â–³ ${ratingCounts.fair}</span>
                        <span class="rating-item poor">Ã— ${ratingCounts.poor}</span>
                    </div>
                    <div class="summary-label">è©•ä¾¡å†…è¨³</div>
                </div>
            </div>
        `;
    }
    
    // ã‚³ãƒ³ãƒ†ãƒ³ãƒ„æ›´æ–°
    const contentEl = document.getElementById('feedbackStatsContent');
    if (!contentEl) return;
    
    if (filtered.length === 0) {
        contentEl.innerHTML = '<p class="no-data-message">ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ãƒ‡ãƒ¼ã‚¿ãŒã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }
    
    if (state.feedbackView === 'byStaff') {
        renderFeedbackByStaff(contentEl, filtered);
    } else if (state.feedbackView === 'byDate') {
        renderFeedbackByDate(contentEl, filtered);
    } else {
        renderFeedbackList(contentEl, filtered);
    }
}

// æ‹…å½“è€…åˆ¥è¡¨ç¤º
function renderFeedbackByStaff(container, feedbackList) {
    // æ‹…å½“è€…ã”ã¨ã«ã‚°ãƒ«ãƒ¼ãƒ—åŒ–
    const byStaff = {};
    feedbackList.forEach(f => {
        const name = f.submittedBy || 'ä¸æ˜Ž';
        if (!byStaff[name]) {
            byStaff[name] = [];
        }
        byStaff[name].push(f);
    });
    
    // ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯æ•°ã§é™é †ã‚½ãƒ¼ãƒˆ
    const sortedStaff = Object.entries(byStaff).sort((a, b) => b[1].length - a[1].length);
    
    let html = '<div class="staff-stats-list">';
    
    sortedStaff.forEach(([staffName, feedbacks]) => {
        const ratingCounts = {
            excellent: feedbacks.filter(f => f.rating === 'excellent').length,
            good: feedbacks.filter(f => f.rating === 'good').length,
            fair: feedbacks.filter(f => f.rating === 'fair').length,
            poor: feedbacks.filter(f => f.rating === 'poor').length
        };
        
        // æœ€æ–°ã®ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯æ—¥æ™‚
        const latestFeedback = feedbacks.sort((a, b) => 
            new Date(b.submittedAt) - new Date(a.submittedAt)
        )[0];
        const latestDate = latestFeedback ? formatDateTime(latestFeedback.submittedAt) : '-';
        
        html += `
            <div class="staff-stat-card">
                <div class="staff-stat-header">
                    <div class="staff-avatar">${staffName.charAt(0)}</div>
                    <div class="staff-info">
                        <div class="staff-name">${staffName}</div>
                        <div class="staff-meta">æœ€çµ‚ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯: ${latestDate}</div>
                    </div>
                    <div class="staff-count">${feedbacks.length}ä»¶</div>
                </div>
                <div class="staff-rating-bars">
                    <div class="rating-bar-row">
                        <span class="rating-label">â—Ž çš„ä¸­</span>
                        <div class="rating-bar">
                            <div class="rating-bar-fill excellent" style="width: ${feedbacks.length > 0 ? (ratingCounts.excellent / feedbacks.length * 100) : 0}%"></div>
                        </div>
                        <span class="rating-count">${ratingCounts.excellent}</span>
                    </div>
                    <div class="rating-bar-row">
                        <span class="rating-label">â—‹ ã¾ã‚ã¾ã‚</span>
                        <div class="rating-bar">
                            <div class="rating-bar-fill good" style="width: ${feedbacks.length > 0 ? (ratingCounts.good / feedbacks.length * 100) : 0}%"></div>
                        </div>
                        <span class="rating-count">${ratingCounts.good}</span>
                    </div>
                    <div class="rating-bar-row">
                        <span class="rating-label">â–³ æ™®é€š</span>
                        <div class="rating-bar">
                            <div class="rating-bar-fill fair" style="width: ${feedbacks.length > 0 ? (ratingCounts.fair / feedbacks.length * 100) : 0}%"></div>
                        </div>
                        <span class="rating-count">${ratingCounts.fair}</span>
                    </div>
                    <div class="rating-bar-row">
                        <span class="rating-label">Ã— å¤–ã‚Œ</span>
                        <div class="rating-bar">
                            <div class="rating-bar-fill poor" style="width: ${feedbacks.length > 0 ? (ratingCounts.poor / feedbacks.length * 100) : 0}%"></div>
                        </div>
                        <span class="rating-count">${ratingCounts.poor}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// æ—¥ä»˜åˆ¥è¡¨ç¤º
function renderFeedbackByDate(container, feedbackList) {
    // æ—¥ä»˜ã”ã¨ã«ã‚°ãƒ«ãƒ¼ãƒ—åŒ–ï¼ˆãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯é€ä¿¡æ—¥ï¼‰
    const byDate = {};
    feedbackList.forEach(f => {
        const dateStr = f.submittedAt ? f.submittedAt.split('T')[0] : 'unknown';
        if (!byDate[dateStr]) {
            byDate[dateStr] = [];
        }
        byDate[dateStr].push(f);
    });
    
    // æ—¥ä»˜ã§é™é †ã‚½ãƒ¼ãƒˆ
    const sortedDates = Object.entries(byDate).sort((a, b) => b[0].localeCompare(a[0]));
    
    let html = '<div class="date-stats-list">';
    
    sortedDates.forEach(([dateStr, feedbacks]) => {
        const date = new Date(dateStr);
        const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
        const displayDate = `${date.getMonth() + 1}/${date.getDate()}ï¼ˆ${dayNames[date.getDay()]}ï¼‰`;
        
        // æ‹…å½“è€…ã”ã¨ã«é›†è¨ˆ
        const staffCounts = {};
        feedbacks.forEach(f => {
            const name = f.submittedBy || 'ä¸æ˜Ž';
            staffCounts[name] = (staffCounts[name] || 0) + 1;
        });
        
        html += `
            <div class="date-stat-card">
                <div class="date-stat-header">
                    <span class="date-display">${displayDate}</span>
                    <span class="date-count">${feedbacks.length}ä»¶ã®ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯</span>
                </div>
                <div class="date-staff-list">
                    ${Object.entries(staffCounts).map(([name, count]) => `
                        <span class="staff-chip">${name}: ${count}ä»¶</span>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ä¸€è¦§è¡¨ç¤º
function renderFeedbackList(container, feedbackList) {
    // é€ä¿¡æ—¥æ™‚ã§é™é †ã‚½ãƒ¼ãƒˆ
    const sorted = [...feedbackList].sort((a, b) => 
        new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    
    // ã‚«ãƒ†ã‚´ãƒªãƒžãƒƒãƒ—ã‚’ä½œæˆ
    const categoryMap = {};
    ORDER_ADVICE_CATEGORIES.forEach(cat => {
        categoryMap[cat.id] = cat;
    });
    
    const ratingLabels = {
        excellent: 'â—Ž çš„ä¸­',
        good: 'â—‹ ã¾ã‚ã¾ã‚',
        fair: 'â–³ æ™®é€š',
        poor: 'Ã— å¤–ã‚Œ'
    };
    
    let html = '<div class="feedback-list-table"><table><thead><tr><th>é€ä¿¡æ—¥æ™‚</th><th>æ‹…å½“è€…</th><th>å¯¾è±¡æ—¥</th><th>ã‚«ãƒ†ã‚´ãƒª</th><th>è©•ä¾¡</th><th>è©³ç´°</th></tr></thead><tbody>';
    
    sorted.forEach(f => {
        const category = categoryMap[f.categoryId];
        const categoryName = category ? `${category.icon} ${category.name}` : f.categoryId;
        const ratingLabel = ratingLabels[f.rating] || '-';
        const ratingClass = f.rating || '';
        
        const details = [];
        if (f.oversold) details.push(`å£²ã‚Œæ®‹ã‚Š: ${f.oversold}`);
        if (f.undersold) details.push(`æ¬ å“: ${f.undersold}`);
        if (f.notes) details.push(`ãƒ¡ãƒ¢: ${f.notes}`);
        
        html += `
            <tr>
                <td>${formatDateTime(f.submittedAt)}</td>
                <td>${f.submittedBy || 'ä¸æ˜Ž'}</td>
                <td>${f.date || '-'}</td>
                <td class="category-cell">${categoryName}</td>
                <td class="rating-cell ${ratingClass}">${ratingLabel}</td>
                <td class="details-cell">${details.length > 0 ? details.join('<br>') : '-'}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ãƒ‡ãƒ¼ã‚¿ã‚’Firebaseã‹ã‚‰èª­ã¿è¾¼ã¿
function loadOrderFeedback() {
    database.ref('orderFeedback').on('value', snap => {
        const data = snap.val();
        if (data) {
            state.orderAdvice.feedbackData = data;
        }
    });
}

// ========================================
// åˆ©ç”¨çµ±è¨ˆæ©Ÿèƒ½
// ========================================

// åˆ©ç”¨çµ±è¨ˆã®è¡¨ç¤ºé–¢æ•°
function renderUsageStats(container) {
    const stats = state.usageStats || [];
    
    // æœŸé–“ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼ç”¨ã®æ—¥ä»˜ã‚’è¨ˆç®—
    const today = new Date();
    const todayStr = formatDate(today);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = formatDate(weekAgo);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoStr = formatDate(monthAgo);
    
    // ç¾åœ¨ã®ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼è¨­å®šã‚’å–å¾—
    const currentPeriod = state.usageStatsPeriod || 'week';
    const currentView = state.usageStatsView || 'byFeature';
    
    // æœŸé–“ã§ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼
    let filtered = stats;
    if (currentPeriod === 'today') {
        filtered = stats.filter(s => s.date === todayStr);
    } else if (currentPeriod === 'week') {
        filtered = stats.filter(s => s.date >= weekAgoStr);
    } else if (currentPeriod === 'month') {
        filtered = stats.filter(s => s.date >= monthAgoStr);
    }
    
    // ã‚µãƒžãƒªãƒ¼çµ±è¨ˆã‚’è¨ˆç®—
    const totalActions = filtered.length;
    const uniqueUsers = [...new Set(filtered.map(s => s.userName))].length;
    const uniqueFeatures = [...new Set(filtered.map(s => s.featureId))].length;
    
    // æ©Ÿèƒ½åˆ¥é›†è¨ˆ
    const byFeature = {};
    filtered.forEach(s => {
        if (!byFeature[s.featureId]) {
            byFeature[s.featureId] = {
                featureId: s.featureId,
                featureName: s.featureName,
                category: s.category,
                count: 0,
                users: new Set()
            };
        }
        byFeature[s.featureId].count++;
        byFeature[s.featureId].users.add(s.userName);
    });
    
    // ãƒ¦ãƒ¼ã‚¶ãƒ¼åˆ¥é›†è¨ˆï¼ˆæ©Ÿèƒ½ã”ã¨ã®è©³ç´°ã‚‚å«ã‚€ï¼‰
    const byUser = {};
    filtered.forEach(s => {
        if (!byUser[s.userName]) {
            byUser[s.userName] = {
                userName: s.userName,
                count: 0,
                features: new Set(),
                featureDetails: {}, // æ©Ÿèƒ½ã”ã¨ã®è©³ç´°
                categoryDetails: {}, // ã‚«ãƒ†ã‚´ãƒªã”ã¨ã®è©³ç´°
                recentActions: [] // æœ€è¿‘ã®ã‚¢ã‚¯ã‚·ãƒ§ãƒ³
            };
        }
        byUser[s.userName].count++;
        byUser[s.userName].features.add(s.featureId);
        
        // æ©Ÿèƒ½ã”ã¨ã®ä½¿ç”¨å›žæ•°ã‚’è¨˜éŒ²
        if (!byUser[s.userName].featureDetails[s.featureId]) {
            byUser[s.userName].featureDetails[s.featureId] = {
                featureId: s.featureId,
                featureName: s.featureName,
                category: s.category,
                count: 0,
                lastUsed: null
            };
        }
        byUser[s.userName].featureDetails[s.featureId].count++;
        byUser[s.userName].featureDetails[s.featureId].lastUsed = s.timestamp;
        
        // ã‚«ãƒ†ã‚´ãƒªã”ã¨ã®ä½¿ç”¨å›žæ•°ã‚’è¨˜éŒ²
        if (!byUser[s.userName].categoryDetails[s.category]) {
            byUser[s.userName].categoryDetails[s.category] = {
                category: s.category,
                count: 0,
                features: new Set()
            };
        }
        byUser[s.userName].categoryDetails[s.category].count++;
        byUser[s.userName].categoryDetails[s.category].features.add(s.featureId);
        
        // æœ€è¿‘ã®ã‚¢ã‚¯ã‚·ãƒ§ãƒ³ï¼ˆæœ€æ–°20ä»¶ã¾ã§ï¼‰
        if (byUser[s.userName].recentActions.length < 20) {
            byUser[s.userName].recentActions.push({
                featureId: s.featureId,
                featureName: s.featureName,
                category: s.category,
                timestamp: s.timestamp
            });
        }
    });
    
    // å„ãƒ¦ãƒ¼ã‚¶ãƒ¼ã®æœ€è¿‘ã®ã‚¢ã‚¯ã‚·ãƒ§ãƒ³ã‚’æ™‚ç³»åˆ—ã§ã‚½ãƒ¼ãƒˆï¼ˆæ–°ã—ã„é †ï¼‰
    Object.values(byUser).forEach(u => {
        u.recentActions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
    
    // ã‚«ãƒ†ã‚´ãƒªåˆ¥é›†è¨ˆ
    const byCategory = {};
    filtered.forEach(s => {
        if (!byCategory[s.category]) {
            byCategory[s.category] = { count: 0, features: new Set() };
        }
        byCategory[s.category].count++;
        byCategory[s.category].features.add(s.featureId);
    });
    
    // æœªä½¿ç”¨æ©Ÿèƒ½ã‚’ç‰¹å®š
    const usedFeatures = new Set(filtered.map(s => s.featureId));
    const unusedFeatures = Object.keys(USAGE_FEATURES).filter(f => !usedFeatures.has(f));
    
    container.innerHTML = `
        <div class="usage-stats-container">
            <div class="usage-stats-header">
                <h3>ðŸ“Š åˆ©ç”¨çµ±è¨ˆ</h3>
                <div class="usage-stats-controls">
                    <div class="filter-group">
                        <label>æœŸé–“:</label>
                        <select id="usagePeriodFilter" onchange="changeUsageStatsPeriod(this.value)">
                            <option value="today" ${currentPeriod === 'today' ? 'selected' : ''}>ä»Šæ—¥</option>
                            <option value="week" ${currentPeriod === 'week' ? 'selected' : ''}>éŽåŽ»7æ—¥é–“</option>
                            <option value="month" ${currentPeriod === 'month' ? 'selected' : ''}>éŽåŽ»30æ—¥é–“</option>
                            <option value="all" ${currentPeriod === 'all' ? 'selected' : ''}>å…¨æœŸé–“</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>è¡¨ç¤º:</label>
                        <select id="usageViewFilter" onchange="changeUsageStatsView(this.value)">
                            <option value="byFeature" ${currentView === 'byFeature' ? 'selected' : ''}>æ©Ÿèƒ½åˆ¥</option>
                            <option value="byUser" ${currentView === 'byUser' ? 'selected' : ''}>ãƒ¦ãƒ¼ã‚¶ãƒ¼åˆ¥</option>
                            <option value="byCategory" ${currentView === 'byCategory' ? 'selected' : ''}>ã‚«ãƒ†ã‚´ãƒªåˆ¥</option>
                            <option value="unused" ${currentView === 'unused' ? 'selected' : ''}>æœªä½¿ç”¨æ©Ÿèƒ½</option>
                            <option value="timeline" ${currentView === 'timeline' ? 'selected' : ''}>ã‚¿ã‚¤ãƒ ãƒ©ã‚¤ãƒ³</option>
                        </select>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="clearUsageStats()">ðŸ—‘ï¸ ãƒ‡ãƒ¼ã‚¿ã‚¯ãƒªã‚¢</button>
                </div>
            </div>
            
            <div class="usage-stats-summary">
                <div class="summary-card">
                    <div class="summary-value">${totalActions}</div>
                    <div class="summary-label">ç·ã‚¢ã‚¯ã‚·ãƒ§ãƒ³æ•°</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${uniqueUsers}</div>
                    <div class="summary-label">ã‚¢ã‚¯ãƒ†ã‚£ãƒ–ãƒ¦ãƒ¼ã‚¶ãƒ¼</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${uniqueFeatures}</div>
                    <div class="summary-label">ä½¿ç”¨æ©Ÿèƒ½æ•°</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${unusedFeatures.length}</div>
                    <div class="summary-label">æœªä½¿ç”¨æ©Ÿèƒ½</div>
                </div>
            </div>
            
            <div class="usage-stats-content" id="usageStatsContent"></div>
        </div>
    `;
    
    const contentEl = document.getElementById('usageStatsContent');
    
    if (currentView === 'byFeature') {
        renderUsageByFeature(contentEl, byFeature);
    } else if (currentView === 'byUser') {
        renderUsageByUser(contentEl, byUser);
    } else if (currentView === 'byCategory') {
        renderUsageByCategory(contentEl, byCategory);
    } else if (currentView === 'unused') {
        renderUnusedFeatures(contentEl, unusedFeatures);
    } else if (currentView === 'timeline') {
        renderUsageTimeline(contentEl, filtered);
    }
}

// æ©Ÿèƒ½åˆ¥è¡¨ç¤º
function renderUsageByFeature(container, byFeature) {
    const sorted = Object.values(byFeature).sort((a, b) => b.count - a.count);
    
    if (sorted.length === 0) {
        container.innerHTML = '<p class="no-data-message">ã“ã®æœŸé–“ã®åˆ©ç”¨ãƒ‡ãƒ¼ã‚¿ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }
    
    const maxCount = sorted[0]?.count || 1;
    
    let html = '<div class="usage-feature-list">';
    sorted.forEach(f => {
        const feature = USAGE_FEATURES[f.featureId];
        const icon = feature?.icon || 'ðŸ“Œ';
        const percentage = (f.count / maxCount * 100).toFixed(0);
        
        html += `
            <div class="usage-feature-item">
                <div class="feature-info">
                    <span class="feature-icon">${icon}</span>
                    <div class="feature-details">
                        <span class="feature-name">${f.featureName}</span>
                        <span class="feature-category">${f.category}</span>
                    </div>
                </div>
                <div class="feature-stats">
                    <div class="usage-bar-container">
                        <div class="usage-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="usage-count">${f.count}å›ž</span>
                    <span class="usage-users">${f.users.size}äºº</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ãƒ¦ãƒ¼ã‚¶ãƒ¼åˆ¥è¡¨ç¤º
function renderUsageByUser(container, byUser) {
    const sorted = Object.values(byUser).sort((a, b) => b.count - a.count);
    
    if (sorted.length === 0) {
        container.innerHTML = '<p class="no-data-message">ã“ã®æœŸé–“ã®åˆ©ç”¨ãƒ‡ãƒ¼ã‚¿ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }
    
    const maxCount = sorted[0]?.count || 1;
    
    let html = '<div class="usage-user-list">';
    sorted.forEach((u, index) => {
        const percentage = (u.count / maxCount * 100).toFixed(0);
        const userId = `user-detail-${index}`;
        
        // ã‚«ãƒ†ã‚´ãƒªåˆ¥ã®ä½¿ç”¨çŠ¶æ³ã‚’ã‚½ãƒ¼ãƒˆ
        const sortedCategories = Object.values(u.categoryDetails || {}).sort((a, b) => b.count - a.count);
        
        // æ©Ÿèƒ½åˆ¥ã®ä½¿ç”¨çŠ¶æ³ã‚’ã‚½ãƒ¼ãƒˆ
        const sortedFeatures = Object.values(u.featureDetails || {}).sort((a, b) => b.count - a.count);
        
        html += `
            <div class="usage-user-card">
                <div class="usage-user-item" onclick="toggleUserDetail('${userId}')">
                    <div class="user-info">
                        <div class="user-avatar">${u.userName.charAt(0)}</div>
                        <div class="user-name-section">
                            <span class="user-name">${u.userName}</span>
                            <span class="user-summary">${sortedCategories.slice(0, 2).map(c => c.category).join('ãƒ»') || '-'}</span>
                        </div>
                    </div>
                    <div class="user-stats">
                        <div class="usage-bar-container">
                            <div class="usage-bar" style="width: ${percentage}%"></div>
                        </div>
                        <span class="usage-count">${u.count}å›ž</span>
                        <span class="usage-features">${u.features.size}æ©Ÿèƒ½</span>
                        <span class="user-expand-icon" id="${userId}-icon">â–¼</span>
                    </div>
                </div>
                
                <div class="user-detail-panel" id="${userId}" style="display: none;">
                    <div class="user-detail-tabs">
                        <button class="user-detail-tab active" onclick="switchUserDetailTab('${userId}', 'category', event)">ã‚«ãƒ†ã‚´ãƒªåˆ¥</button>
                        <button class="user-detail-tab" onclick="switchUserDetailTab('${userId}', 'feature', event)">æ©Ÿèƒ½åˆ¥</button>
                        <button class="user-detail-tab" onclick="switchUserDetailTab('${userId}', 'recent', event)">æœ€è¿‘ã®æ“ä½œ</button>
                    </div>
                    
                    <div class="user-detail-content" id="${userId}-category">
                        ${renderUserCategoryDetail(sortedCategories)}
                    </div>
                    
                    <div class="user-detail-content" id="${userId}-feature" style="display: none;">
                        ${renderUserFeatureDetail(sortedFeatures)}
                    </div>
                    
                    <div class="user-detail-content" id="${userId}-recent" style="display: none;">
                        ${renderUserRecentActions(u.recentActions || [])}
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ãƒ¦ãƒ¼ã‚¶ãƒ¼è©³ç´°ã®å±•é–‹/æŠ˜ã‚ŠãŸãŸã¿
function toggleUserDetail(userId) {
    const panel = document.getElementById(userId);
    const icon = document.getElementById(`${userId}-icon`);
    if (panel) {
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            if (icon) icon.textContent = 'â–²';
        } else {
            panel.style.display = 'none';
            if (icon) icon.textContent = 'â–¼';
        }
    }
}

// ãƒ¦ãƒ¼ã‚¶ãƒ¼è©³ç´°ã‚¿ãƒ–ã®åˆ‡ã‚Šæ›¿ãˆ
function switchUserDetailTab(userId, tab, event) {
    // ã‚¿ãƒ–ãƒœã‚¿ãƒ³ã®ã‚¢ã‚¯ãƒ†ã‚£ãƒ–çŠ¶æ…‹ã‚’åˆ‡ã‚Šæ›¿ãˆ
    const tabContainer = event.target.parentElement;
    tabContainer.querySelectorAll('.user-detail-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // ã‚³ãƒ³ãƒ†ãƒ³ãƒ„ã®è¡¨ç¤º/éžè¡¨ç¤ºã‚’åˆ‡ã‚Šæ›¿ãˆ
    ['category', 'feature', 'recent'].forEach(t => {
        const content = document.getElementById(`${userId}-${t}`);
        if (content) {
            content.style.display = t === tab ? 'block' : 'none';
        }
    });
}

// ã‚«ãƒ†ã‚´ãƒªåˆ¥è©³ç´°ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderUserCategoryDetail(categories) {
    if (!categories || categories.length === 0) {
        return '<p class="no-data-message">ãƒ‡ãƒ¼ã‚¿ãŒã‚ã‚Šã¾ã›ã‚“</p>';
    }
    
    const maxCount = categories[0]?.count || 1;
    
    let html = '<div class="user-category-detail-list">';
    categories.forEach(c => {
        const percentage = (c.count / maxCount * 100).toFixed(0);
        html += `
            <div class="user-category-detail-item">
                <div class="category-detail-name">${c.category}</div>
                <div class="category-detail-stats">
                    <div class="mini-bar-container">
                        <div class="mini-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="category-detail-count">${c.count}å›ž</span>
                    <span class="category-detail-features">${c.features.size}æ©Ÿèƒ½</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// æ©Ÿèƒ½åˆ¥è©³ç´°ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderUserFeatureDetail(features) {
    if (!features || features.length === 0) {
        return '<p class="no-data-message">ãƒ‡ãƒ¼ã‚¿ãŒã‚ã‚Šã¾ã›ã‚“</p>';
    }
    
    const maxCount = features[0]?.count || 1;
    
    let html = '<div class="user-feature-detail-list">';
    features.forEach(f => {
        const feature = USAGE_FEATURES[f.featureId];
        const icon = feature?.icon || 'ðŸ“Œ';
        const percentage = (f.count / maxCount * 100).toFixed(0);
        const lastUsed = f.lastUsed ? formatLastUsed(f.lastUsed) : '-';
        
        html += `
            <div class="user-feature-detail-item">
                <div class="feature-detail-info">
                    <span class="feature-detail-icon">${icon}</span>
                    <div class="feature-detail-text">
                        <span class="feature-detail-name">${f.featureName}</span>
                        <span class="feature-detail-category">${f.category}</span>
                    </div>
                </div>
                <div class="feature-detail-stats">
                    <div class="mini-bar-container">
                        <div class="mini-bar feature-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="feature-detail-count">${f.count}å›ž</span>
                    <span class="feature-detail-last">æœ€çµ‚: ${lastUsed}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// æœ€è¿‘ã®ã‚¢ã‚¯ã‚·ãƒ§ãƒ³ã‚’ãƒ¬ãƒ³ãƒ€ãƒªãƒ³ã‚°
function renderUserRecentActions(actions) {
    if (!actions || actions.length === 0) {
        return '<p class="no-data-message">ãƒ‡ãƒ¼ã‚¿ãŒã‚ã‚Šã¾ã›ã‚“</p>';
    }
    
    let html = '<div class="user-recent-actions">';
    actions.forEach(a => {
        const feature = USAGE_FEATURES[a.featureId];
        const icon = feature?.icon || 'ðŸ“Œ';
        const time = new Date(a.timestamp);
        const timeStr = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
        
        html += `
            <div class="user-recent-action-item">
                <span class="recent-action-time">${timeStr}</span>
                <span class="recent-action-icon">${icon}</span>
                <span class="recent-action-name">${a.featureName}</span>
                <span class="recent-action-category">${a.category}</span>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

// æœ€çµ‚ä½¿ç”¨æ—¥æ™‚ã‚’ãƒ•ã‚©ãƒ¼ãƒžãƒƒãƒˆ
function formatLastUsed(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 1æ™‚é–“ä»¥å†…
    if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `${mins}åˆ†å‰`;
    }
    // 24æ™‚é–“ä»¥å†…
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}æ™‚é–“å‰`;
    }
    // ãã‚Œä»¥å¤–
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

// ã‚«ãƒ†ã‚´ãƒªåˆ¥è¡¨ç¤º
function renderUsageByCategory(container, byCategory) {
    const sorted = Object.entries(byCategory).sort((a, b) => b[1].count - a[1].count);
    
    if (sorted.length === 0) {
        container.innerHTML = '<p class="no-data-message">ã“ã®æœŸé–“ã®åˆ©ç”¨ãƒ‡ãƒ¼ã‚¿ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }
    
    const maxCount = sorted[0]?.[1].count || 1;
    
    let html = '<div class="usage-category-list">';
    sorted.forEach(([category, data]) => {
        const percentage = (data.count / maxCount * 100).toFixed(0);
        
        html += `
            <div class="usage-category-item">
                <div class="category-info">
                    <span class="category-name">${category}</span>
                </div>
                <div class="category-stats">
                    <div class="usage-bar-container">
                        <div class="usage-bar category-bar" style="width: ${percentage}%"></div>
                    </div>
                    <span class="usage-count">${data.count}å›ž</span>
                    <span class="usage-features">${data.features.size}æ©Ÿèƒ½</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// æœªä½¿ç”¨æ©Ÿèƒ½è¡¨ç¤º
function renderUnusedFeatures(container, unusedFeatures) {
    if (unusedFeatures.length === 0) {
        container.innerHTML = '<p class="success-message">ðŸŽ‰ ã™ã¹ã¦ã®æ©Ÿèƒ½ãŒä½¿ç”¨ã•ã‚Œã¦ã„ã¾ã™ï¼</p>';
        return;
    }
    
    // ã‚«ãƒ†ã‚´ãƒªã”ã¨ã«ã‚°ãƒ«ãƒ¼ãƒ—åŒ–
    const byCategory = {};
    unusedFeatures.forEach(fId => {
        const feature = USAGE_FEATURES[fId];
        if (!feature) return;
        if (!byCategory[feature.category]) {
            byCategory[feature.category] = [];
        }
        byCategory[feature.category].push({ id: fId, ...feature });
    });
    
    let html = '<div class="unused-features-list">';
    html += '<p class="unused-description">ä»¥ä¸‹ã®æ©Ÿèƒ½ã¯é¸æŠžæœŸé–“ä¸­ã«ä½¿ç”¨ã•ã‚Œã¦ã„ã¾ã›ã‚“ã€‚å‰Šé™¤ã¾ãŸã¯æ”¹å–„ã‚’æ¤œè¨Žã—ã¦ãã ã•ã„ã€‚</p>';
    
    Object.entries(byCategory).forEach(([category, features]) => {
        html += `
            <div class="unused-category">
                <h4 class="unused-category-title">${category}</h4>
                <div class="unused-features-grid">
                    ${features.map(f => `
                        <div class="unused-feature-card">
                            <span class="feature-icon">${f.icon}</span>
                            <span class="feature-name">${f.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ã‚¿ã‚¤ãƒ ãƒ©ã‚¤ãƒ³è¡¨ç¤º
function renderUsageTimeline(container, filtered) {
    const sorted = [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (sorted.length === 0) {
        container.innerHTML = '<p class="no-data-message">ã“ã®æœŸé–“ã®åˆ©ç”¨ãƒ‡ãƒ¼ã‚¿ã¯ã‚ã‚Šã¾ã›ã‚“</p>';
        return;
    }
    
    // æœ€æ–°100ä»¶ã®ã¿è¡¨ç¤º
    const limited = sorted.slice(0, 100);
    
    let html = '<div class="usage-timeline">';
    html += `<p class="timeline-info">æœ€æ–°${Math.min(sorted.length, 100)}ä»¶ã‚’è¡¨ç¤º ${sorted.length > 100 ? `(å…¨${sorted.length}ä»¶)` : ''}</p>`;
    
    let currentDate = '';
    limited.forEach(s => {
        const date = s.date;
        if (date !== currentDate) {
            if (currentDate) html += '</div>';
            const d = new Date(date);
            const dayNames = ['æ—¥', 'æœˆ', 'ç«', 'æ°´', 'æœ¨', 'é‡‘', 'åœŸ'];
            html += `<div class="timeline-date-header">${d.getMonth() + 1}/${d.getDate()}ï¼ˆ${dayNames[d.getDay()]}ï¼‰</div>`;
            html += '<div class="timeline-entries">';
            currentDate = date;
        }
        
        const feature = USAGE_FEATURES[s.featureId];
        const icon = feature?.icon || 'ðŸ“Œ';
        const time = new Date(s.timestamp);
        const timeStr = `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
        
        html += `
            <div class="timeline-entry">
                <span class="timeline-time">${timeStr}</span>
                <span class="timeline-icon">${icon}</span>
                <span class="timeline-feature">${s.featureName}</span>
                <span class="timeline-user">${s.userName}</span>
            </div>
        `;
    });
    if (currentDate) html += '</div>';
    html += '</div>';
    container.innerHTML = html;
}

// æœŸé–“ãƒ•ã‚£ãƒ«ã‚¿ãƒ¼å¤‰æ›´
function changeUsageStatsPeriod(period) {
    state.usageStatsPeriod = period;
    renderAdminPanel();
}

// è¡¨ç¤ºåˆ‡ã‚Šæ›¿ãˆ
function changeUsageStatsView(view) {
    state.usageStatsView = view;
    renderAdminPanel();
}

// åˆ©ç”¨çµ±è¨ˆãƒ‡ãƒ¼ã‚¿ã‚¯ãƒªã‚¢
function clearUsageStats() {
    if (!confirm('åˆ©ç”¨çµ±è¨ˆãƒ‡ãƒ¼ã‚¿ã‚’ã™ã¹ã¦å‰Šé™¤ã—ã¾ã™ã‹ï¼Ÿã“ã®æ“ä½œã¯å–ã‚Šæ¶ˆã›ã¾ã›ã‚“ã€‚')) return;
    database.ref('usageStats').remove();
    state.usageStats = [];
    renderAdminPanel();
    alert('åˆ©ç”¨çµ±è¨ˆãƒ‡ãƒ¼ã‚¿ã‚’å‰Šé™¤ã—ã¾ã—ãŸ');
}

// ç™ºæ³¨ã‚¢ãƒ‰ãƒã‚¤ã‚¹ãƒœã‚¿ãƒ³ã®ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠãƒ¼
document.getElementById('orderAdviceBtn').addEventListener('click', showOrderAdviceScreen);

// ãƒ¢ãƒã‚¤ãƒ«ç”¨ãƒ•ãƒ­ãƒ¼ãƒ†ã‚£ãƒ³ã‚°ãƒœã‚¿ãƒ³ã®ã‚¤ãƒ™ãƒ³ãƒˆãƒªã‚¹ãƒŠãƒ¼
const orderAdviceBtnMobile = document.getElementById('orderAdviceBtnMobile');
if (orderAdviceBtnMobile) {
    orderAdviceBtnMobile.addEventListener('click', showOrderAdviceScreen);
}

// åˆæœŸåŒ–æ™‚ã«ãƒ•ã‚£ãƒ¼ãƒ‰ãƒãƒƒã‚¯ãƒ‡ãƒ¼ã‚¿ã‚’èª­ã¿è¾¼ã¿
loadOrderFeedback();
