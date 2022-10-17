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
/*let process: any;
const p = process?.env ? process.env : import.meta.env;*/

const firebase_config = {
    apiKey: "AIzaSyC7Tu56_1ry-u9AnZfg_AjiMWvvNmFIPGU",
    authDomain: "test-projects-19046.firebaseapp.com",
    projectId: "test-projects-19046",
    storageBucket: "test-projects-19046.appspot.com",
    messagingSenderId: "736849418469",
    appId: "1:736849418469:web:7546f16c5e355b1c6a9c0c",
    measurementId: "G-FKRCW93P0X"
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
                set(q.empty
                    ? []
                    : q.docs.map((doc) => ({ ...doc.data() as any, id: doc.id }))
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