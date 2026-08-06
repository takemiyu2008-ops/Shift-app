// 有給・休日申請が RTDB に新規作成されたら、店長の端末へ FCM プッシュを送る。
// クライアントの saveToFirebase は全件 set 上書きだが、onValueCreated は
// before が存在しない（=新規の）キーでしか発火しないため、新規申請のみ通知される。
const { onValueCreated } = require('firebase-functions/v2/database');
const admin = require('firebase-admin');
admin.initializeApp();

// app.js の AUTO_ADMIN_STAFF_IDS と揃えること
const MANAGER_STAFF_IDS = ['392'];

// バックアップ復元などでノード全体が再作成された場合の大量通知ガード
const RECENT_MS = 10 * 60 * 1000;

async function notifyNewRequest(kind, snapshot) {
    const req = snapshot.val();
    if (!req || req.status !== 'pending') return;
    if (!req.createdAt || Date.now() - Date.parse(req.createdAt) > RECENT_MS) return;

    const db = admin.database();

    // アイコンバッジ数 = 有給+休日の pending 合計（クライアントの updateAdminBadges と同じ定義）
    const [leaveSnap, holidaySnap] = await Promise.all([
        db.ref('leaveRequests').get(),
        db.ref('holidayRequests').get()
    ]);
    const countPending = s => Object.values(s.val() || {}).filter(r => r && r.status === 'pending').length;
    const badgeCount = countPending(leaveSnap) + countPending(holidaySnap);

    const label = kind === 'leave' ? '有給申請' : '休日申請';
    const title = (kind === 'leave' ? '🏖️ ' : '🏠 ') + label;
    const period = req.startDate === req.endDate ? (req.startDate || '') : `${req.startDate}〜${req.endDate}`;
    const body = `${req.name}さんから${label}が届きました（${period}）`;

    for (const staffId of MANAGER_STAFF_IDS) {
        const tokensSnap = await db.ref('fcmTokens/' + staffId).get();
        const entries = Object.entries(tokensSnap.val() || {});
        if (entries.length === 0) continue;

        // data-only メッセージで送る（表示は sw.js の push ハンドラが担う。二重通知防止）
        const messages = entries.map(([, v]) => ({
            token: v.token,
            data: {
                title,
                body,
                badgeCount: String(badgeCount),
                kind,
                requestId: String(snapshot.key)
            },
            webpush: { headers: { Urgency: 'high', TTL: '86400' } }
        }));

        const res = await admin.messaging().sendEach(messages);
        await Promise.all(res.responses.map((r, i) => {
            if (r.success) return null;
            const code = r.error && r.error.code;
            if (code === 'messaging/registration-token-not-registered'
                || code === 'messaging/invalid-argument') {
                // 失効・無効トークンは掃除する
                return db.ref('fcmTokens/' + staffId + '/' + entries[i][0]).remove();
            }
            console.error('送信失敗:', code, r.error && r.error.message);
            return null;
        }));
    }
}

exports.onLeaveRequestCreated = onValueCreated(
    { ref: '/leaveRequests/{requestId}', region: 'us-central1' },
    (event) => notifyNewRequest('leave', event.data)
);

exports.onHolidayRequestCreated = onValueCreated(
    { ref: '/holidayRequests/{requestId}', region: 'us-central1' },
    (event) => notifyNewRequest('holiday', event.data)
);
