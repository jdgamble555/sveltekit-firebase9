import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { readable, writable, type Subscriber } from 'svelte/store';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';

const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);

// initialize and login

const firebaseApp = initializeApp(firebase_config);

const auth = getAuth();

export async function loginWithGoogle() {
    return await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function logout() {
    return await signOut(auth);
}

export const user = readable<UserType | null>(
    null,
    (set: Subscriber<UserType | null>) =>
        onIdTokenChanged(auth, (_user: User | null) => {
            if (!_user) {
                set(null);
                return;
            }
            const { displayName, photoURL, uid, email } = _user;
            set({ displayName, photoURL, uid, email });
        })
);

// firestore

const db = getFirestore(firebaseApp);

// Todos

export const getTodos = (uid: string) => writable<Todo[] | null>(
    null,
    (set: Subscriber<Todo[] | null>) =>
        onSnapshot(
            query(
                collection(db, 'todos'),
                where('uid', '==', uid),
                orderBy('created')
            ), (q) => {
                set(q.empty
                    ? []
                    : q.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Todo[]
                );
            })
);

export const addTodo = (uid: string, text: string) => {
    addDoc(collection(db, 'todos'), {
        uid,
        text,
        complete: false,
        created: serverTimestamp()
    });
}

export const updateTodo = (id: string, newStatus: boolean) => {
    updateDoc(doc(db, 'todos', id), { complete: newStatus });
}

export const deleteTodo = (id: string) => {
    deleteDoc(doc(db, 'todos', id));
}