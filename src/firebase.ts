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
    CollectionReference,
    deleteDoc,
    doc,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';

// env variables
let process: any;
const p = process?.env ? process.env : import.meta.env;

const firebase_config = {
    "apiKey": p.VITE_FIREBASE_APIKEY,
    "authDomain": p.VITE_FIREBASE_AUTH_DOMAIN,
    "projectId": p.VITE_FIREBASE_PROJECT_ID,
    "storageBucket": p.VITE_FIREBASE_STORAGE_BUCKET,
    "messagingSenderId": p.VITE_FIREBASE_MESSAGING_SENDER_ID,
    "appId": p.VITE_FIREBASE_MEASUREMENT_ID,
    "measurementId": p.VITE_DGRAPH_ENDPOINT
};

// initialize and login

interface UserRec {
    displayName: string;
    photoURL: string;
    uid: string;
    email: string;
};

const firebaseApp = initializeApp(firebase_config);

const auth = getAuth();

export async function loginWithGoogle() {
    return await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function logout() {
    return await signOut(auth);
}

export const user = readable<UserRec>(
    null,
    (set: Subscriber<UserRec>) =>
        onIdTokenChanged(auth, (u: User) => set(u))
);

// firestore

const db = getFirestore(firebaseApp);

interface Todo {
    id: string;
    text: string;
    complete: boolean;
    createdAt: Date;
}

// Todos

export const getTodos = (uid: string) => writable<Todo[]>(
    null,
    (set: Subscriber<Todo[]>) =>
        onSnapshot<Todo[]>(
            query<Todo[]>(
                collection(db, 'todos') as CollectionReference<Todo[]>,
                where('uid', '==', uid),
                orderBy('created')
            ), (q) => {
                const todos = [];
                q.forEach((doc) => todos.push({ ...doc.data(), id: doc.id }));
                set(todos);
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