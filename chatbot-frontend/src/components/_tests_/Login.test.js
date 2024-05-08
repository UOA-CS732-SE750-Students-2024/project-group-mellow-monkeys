import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../Pages/Login/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('Login Component', () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => ({
      auth: { isLoading: false, error: null },
      submitLogin: jest.fn(),
    }));
  });

  it('renders input fields for email and password correctly', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('allows input to be entered into form fields', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    expect(screen.getByPlaceholderText('Email').value).toBe('test@example.com');
    expect(screen.getByPlaceholderText('Password').value).toBe('password123');
  });

  it('displays an error message when email is correct but password is incorrect', async () => {
    const submitLoginSpy = jest.fn();
    useAuth.mockImplementation(() => ({
      auth: { isLoading: false, error: 'Incorrect password' },
      submitLogin: submitLoginSpy,
    }));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@123.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    expect(submitLoginSpy).toHaveBeenCalled();
    expect(screen.getByText('Incorrect password')).toBeInTheDocument();
  });

  it('displays an error message when email does not exist', async () => {
    const submitLoginSpy = jest.fn();
    useAuth.mockImplementation(() => ({
      auth: { isLoading: false, error: 'User not found' },
      submitLogin: submitLoginSpy,
    }));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'nonexistent@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    expect(submitLoginSpy).toHaveBeenCalled();
    expect(screen.getByText('User not found')).toBeInTheDocument();
  });
});