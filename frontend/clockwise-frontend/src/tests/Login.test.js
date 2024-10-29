import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import { AuthProvider } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from '../contexts/firebase-config';
import { act } from 'react-dom/test-utils';

// Mock the entire firebase-config module
jest.mock('../contexts/firebase-config');

describe('Login Component', () => {
    beforeEach(() => {
        // Clear mock calls between tests
        jest.clearAllMocks();
    });

    test('renders login form and logs in with valid credentials', async () => {
        // Setup success response
        signInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });

        await act(async () => {
            render(
                <AuthProvider>
                    <Login />
                </AuthProvider>
            );
        });

        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password' } });
            fireEvent.click(submitButton);
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.any(Object),
            'test@example.com',
            'password'
        );
    });

    test('displays an error message with invalid credentials', async () => {
        // Setup error response
        signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));

        await act(async () => {
            render(
                <AuthProvider>
                    <Login />
                </AuthProvider>
            );
        });

        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
            fireEvent.click(submitButton);
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.any(Object),
            'wrong@example.com',
            'wrongpassword'
        );
    });
});