import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Avatar from '../Avatar';
import { User } from '../../../types/user.types';

describe('Avatar Component', () => {
  const mockUser: User = {
    personalInfo: {
      email: 'test@example.com',
      image: 'https://example.com/user-avatar.png',
      profile: 'https://example.com/user-profile',
      name: 'Test User',
      sub: '12345',
    },
    roles: ['user'],
  };

  const mockLogOut = jest.fn();

  it('renders correctly with user data', () => {
    render(<Avatar user={mockUser} onLogOut={mockLogOut} />);
    // Check for the image URL as text, since that's what is rendered
    expect(
      screen.getByText(mockUser.personalInfo?.image ?? 'Default Image')
    ).toBeInTheDocument();
  });

  it('renders default icon when user image is not provided', () => {
    const userWithoutImage: User = {
      personalInfo: {
        email: 'test@example.com',
        image: undefined,
        profile: 'https://example.com/user-profile',
        name: 'Test User',
        sub: '12345',
      },
      roles: ['user'],
    };
    render(<Avatar user={userWithoutImage} onLogOut={mockLogOut} />);
    // Check for the SVG element (default icon) by tag name
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('toggles the menu when avatar is clicked', () => {
    render(<Avatar user={mockUser} onLogOut={mockLogOut} />);
    // Find the avatar by the image URL text
    const avatarElement = screen.getByText(mockUser.personalInfo?.image ?? '');
    fireEvent.click(avatarElement);
    expect(
      screen.getByText(mockUser.personalInfo?.email ?? '')
    ).toBeInTheDocument();

    fireEvent.click(avatarElement);
    expect(
      screen.queryByText(mockUser.personalInfo?.email ?? '')
    ).not.toBeInTheDocument();
  });

  it('calls onLogOut when logout is clicked', () => {
    render(<Avatar user={mockUser} onLogOut={mockLogOut} />);
    const avatarElement = screen.getByText(mockUser.personalInfo?.image ?? '');
    fireEvent.click(avatarElement); // Open menu

    const logoutElement = screen.getByText('Log out');
    fireEvent.click(logoutElement);
    expect(mockLogOut).toHaveBeenCalledTimes(1);
  });

  it('closes the menu when clicking outside', () => {
    render(<Avatar user={mockUser} onLogOut={mockLogOut} />);
    const avatarElement = screen.getByText(
      mockUser.personalInfo?.image ?? 'Default Image'
    );
    fireEvent.click(avatarElement); // Open menu

    fireEvent.click(document.body); // Simulate clicking outside
    expect(
      screen.queryByText(mockUser.personalInfo?.email ?? '')
    ).not.toBeInTheDocument();
  });
});
