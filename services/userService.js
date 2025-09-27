import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export async function fetchUserProfile(uid) {
  const ref = doc(db, 'usuarios', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export default { fetchUserProfile };

