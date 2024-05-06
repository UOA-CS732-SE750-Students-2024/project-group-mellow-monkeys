import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../../Pages/Register/Register';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

describe('Register Component', () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => ({
      auth: { isLoading: false, error: null },
      submitRegister: jest.fn()
    }));
  });

  it('renders input fields for name, email, and passwords correctly', () => {
    render(<Router><Register /></Router>);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('allows input to be entered into form fields', () => {
    render(<Router><Register /></Router>);
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText('Name').value).toBe('Alice');
    expect(screen.getByPlaceholderText('Email').value).toBe('alice@example.com');
    expect(screen.getByPlaceholderText('Enter Password').value).toBe('password123');
    expect(screen.getByPlaceholderText('Confirm Password').value).toBe('password123');
  });

  it('submits the registration form', async () => {
    const submitSpy = jest.fn();
    useAuth.mockImplementation(() => ({
      auth: { isLoading: false, error: null },
      submitRegister: submitSpy
    }));
  
    render(<Router><Register /></Router>);
    fireEvent.submit(screen.getByRole('button', { name: /register/i }));
  
    expect(submitSpy).toHaveBeenCalled();
  });


  it('displays an error message when there is an error', () => {
    useAuth.mockImplementation(() => ({
      auth: { isLoading: false, error: 'Registration failed' },
      submitRegister: jest.fn()
    }));
    render(<Router><Register /></Router>);
    expect(screen.getByText('Registration failed')).toBeInTheDocument();
  });
});
