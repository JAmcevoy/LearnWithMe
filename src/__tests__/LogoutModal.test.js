import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LogoutModal from '../components/LogoutModal'; // Adjust the import based on your file structure

describe('LogoutModal Component', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('should render the modal when isOpen is true', () => {
    render(
      <LogoutModal isOpen={true} onClose={onCloseMock} onConfirm={onConfirmMock} />
    );

    expect(screen.getByText(/Are you sure you want to log out\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm logout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel logout/i })).toBeInTheDocument();
  });

  it('should not render the modal when isOpen is false', () => {
    render(
      <LogoutModal isOpen={false} onClose={onCloseMock} onConfirm={onConfirmMock} />
    );

    expect(screen.queryByText(/Are you sure you want to log out\?/i)).not.toBeInTheDocument();
  });

  it('should call onConfirm when Yes, Log Out button is clicked', () => {
    render(
      <LogoutModal isOpen={true} onClose={onCloseMock} onConfirm={onConfirmMock} />
    );

    fireEvent.click(screen.getByRole('button', { name: /Confirm logout/i }));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <LogoutModal isOpen={true} onClose={onCloseMock} onConfirm={onConfirmMock} />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel logout/i }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
