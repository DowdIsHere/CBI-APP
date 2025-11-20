import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the screen without crashing', () => {
      render(<HomeScreen navigation={mockNavigation} />);
      expect(screen.getByText('Cellular Biology Intelligence')).toBeTruthy();
    });

    it('should display the CBI logo and header', () => {
      render(<HomeScreen navigation={mockNavigation} />);
      expect(screen.getByText('CBI')).toBeTruthy();
      expect(screen.getByText('Cellular Biology Intelligence')).toBeTruthy();
      expect(screen.getByText('Enteric Nervous System Support')).toBeTruthy();
    });
  });

  describe('User Stats', () => {
    it('should display all stat cards with correct values', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      expect(screen.getByText("Today's Score")).toBeTruthy();
      expect(screen.getByText('+14')).toBeTruthy();

      expect(screen.getByText('Week Average')).toBeTruthy();
      expect(screen.getByText('+11')).toBeTruthy();

      expect(screen.getByText('Streak')).toBeTruthy();
      expect(screen.getByText('7 🔥')).toBeTruthy();

      expect(screen.getByText('Energy')).toBeTruthy();
      expect(screen.getByText('8/10')).toBeTruthy();
    });
  });

  describe('Quick Actions', () => {
    it('should display all four quick action buttons', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      expect(screen.getByText('Photo')).toBeTruthy();
      expect(screen.getByText('Snap & analyze')).toBeTruthy();

      expect(screen.getByText('Batch')).toBeTruthy();
      expect(screen.getByText('Multiple meals')).toBeTruthy();

      expect(screen.getByText('Scan')).toBeTruthy();
      expect(screen.getByText('Packaged foods')).toBeTruthy();

      expect(screen.getByText('Type')).toBeTruthy();
      expect(screen.getByText('Text entry')).toBeTruthy();
    });

    it('should navigate to LogMeal with photo method when Photo is pressed', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      const photoButton = screen.getByText('Photo');
      fireEvent.press(photoButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('LogMeal', {
        method: 'photo',
      });
    });

    it('should navigate to LogMeal with batch method when Batch is pressed', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      const batchButton = screen.getByText('Batch');
      fireEvent.press(batchButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('LogMeal', {
        method: 'batch',
      });
    });

    it('should navigate to LogMeal with barcode method when Scan is pressed', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      const scanButton = screen.getByText('Scan');
      fireEvent.press(scanButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('LogMeal', {
        method: 'barcode',
      });
    });

    it('should navigate to LogMeal with manual method when Type is pressed', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      const typeButton = screen.getByText('Type');
      fireEvent.press(typeButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('LogMeal', {
        method: 'manual',
      });
    });
  });

  describe('Insights Section', () => {
    it('should display the insights section title', () => {
      render(<HomeScreen navigation={mockNavigation} />);
      expect(screen.getByText("Today's Insights")).toBeTruthy();
    });

    it('should display all three insights', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      expect(
        screen.getByText('Your energy levels are up 60% this week!')
      ).toBeTruthy();

      expect(
        screen.getByText(
          'Add more sulforaphane - only 1 cruciferous serving yesterday'
        )
      ).toBeTruthy();

      expect(
        screen.getByText('Detected nightshades in 2 meals - may trigger symptoms')
      ).toBeTruthy();
    });
  });

  describe('Recent Meals Section', () => {
    it('should display the meals section title', () => {
      render(<HomeScreen navigation={mockNavigation} />);
      expect(screen.getByText("Today's Meals")).toBeTruthy();
    });

    it('should display all recent meals with details', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      expect(screen.getByText('Breakfast')).toBeTruthy();
      expect(screen.getByText('8:30 AM • 3 items')).toBeTruthy();
      expect(screen.getByText('+8')).toBeTruthy();

      expect(screen.getByText('Lunch')).toBeTruthy();
      expect(screen.getByText('12:45 PM • 4 items')).toBeTruthy();
      expect(screen.getByText('+12')).toBeTruthy();

      expect(screen.getByText('Snack')).toBeTruthy();
      expect(screen.getByText('3:15 PM • 2 items')).toBeTruthy();
      expect(screen.getByText('+4')).toBeTruthy();
    });

    it('should display add meal button', () => {
      render(<HomeScreen navigation={mockNavigation} />);
      expect(screen.getByText('+ Add Another Meal')).toBeTruthy();
    });

    it('should navigate to LogMeal when add meal button is pressed', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      const addButton = screen.getByText('+ Add Another Meal');
      fireEvent.press(addButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('LogMeal');
    });
  });

  describe('Learning Section', () => {
    it('should display the learning section', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      expect(screen.getByText('Continue Learning')).toBeTruthy();
      expect(screen.getByText('Week 1: Foundation')).toBeTruthy();
      expect(
        screen.getByText('Next lesson: "Meet Your Enteric Nervous System"')
      ).toBeTruthy();
    });

    it('should navigate to Learn screen when continue button is pressed', () => {
      render(<HomeScreen navigation={mockNavigation} />);

      const continueButton = screen.getByText('Continue Lesson →');
      fireEvent.press(continueButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Learn');
    });
  });

  describe('Notification Badge', () => {
    it('should display notification badge with count', () => {
      render(<HomeScreen navigation={mockNavigation} />);
      expect(screen.getByText('3')).toBeTruthy();
    });
  });
});
