import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

/**
 * Log an administrative action to the auditLogs collection in Firestore.
 * If logging fails (e.g. network or permission error), it logs a warning
 * to console and silently catches to NEVER block the main action.
 *
 * @param {string} action - Action identifier (e.g. 'CREATE_PRODUCT', 'DELETE_CATEGORY')
 * @param {string} target - Target item name or identifier (e.g. 'prod-123' or 'Attar')
 * @param {object|string} [details={}] - Additional metadata or details
 */
export async function logAction(action, target, details = {}) {
  try {
    if (!db) return;
    const currentUser = auth?.currentUser;
    const adminUid = currentUser?.uid || 'system';
    const email = currentUser?.email || 'unknown@extrovat.com';

    await addDoc(collection(db, 'auditLogs'), {
      adminUid,
      email,
      action: action || 'UNKNOWN_ACTION',
      target: target ? String(target) : 'system',
      details: typeof details === 'object' ? details : { info: String(details) },
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Audit log write failed (non-blocking):', err);
  }
}
