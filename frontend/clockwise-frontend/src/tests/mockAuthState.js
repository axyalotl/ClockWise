// __mocks__/firebase/auth.js
export const signInWithEmailAndPassword = jest.fn((auth, email, password) => {
    if (email === "test@example.com" && password === "password") {
        return Promise.resolve({ user: { email } });
    } else {
        return Promise.reject(new Error("Invalid credentials"));
    }
});

export const createUserWithEmailAndPassword = jest.fn((auth, email, password) => {
    if (email && password) {
        return Promise.resolve({ user: { email } });
    } else {
        return Promise.reject(new Error("Missing credentials"));
    }
});

export const signOut = jest.fn(() => Promise.resolve());
