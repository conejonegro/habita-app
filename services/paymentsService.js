import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export async function createPayment({
  amount,
  dueDate,
  edificioRef,
  email,
  isPaid,
  lastPaymentDate,
  notes,
  paymentMethod,
  unidadId,
  userId,
  id,
}) {
  if (id) {
    const ref = doc(db, 'payments', id);
    await setDoc(ref, {
      amount,
      dueDate,
      edificioRef,
      email,
      isPaid,
      lastPaymentDate,
      notes,
      paymentMethod,
      unidadId,
      userId,
    }, { merge: true });
    return ref;
  } else {
    const col = collection(db, 'payments');
    const docRef = await addDoc(col, {
      amount,
      dueDate,
      edificioRef,
      email,
      isPaid,
      lastPaymentDate,
      notes,
      paymentMethod,
      unidadId,
      userId,
    });
    return docRef;
  }
}

export default { createPayment };
