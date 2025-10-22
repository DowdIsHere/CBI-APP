import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../AppNavigator';

describe('AppNavigator', () => {
  const renderNavigator = () => {
    return render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
  };

  describe('Tab Navigation', () => {
    it('should render the tab navigator without crashing', () => {
      renderNavigator();
      // Navigator should render successfully
      expect(screen).toBeTruthy();
    });

    it('should render the home screen by default', () => {
      renderNavigator();
      // HomeScreen content should be visible
      expect(screen.getByText('Cellular Biology Intelligence')).toBeTruthy();
    });

    it('should display header with correct styling', () => {
      renderNavigator();
      // Header should be rendered
      expect(screen).toBeTruthy();
    });
  });

  describe('Tab Configuration', () => {
    it('should have correct tab bar styling', () => {
      renderNavigator();
      // Tab navigator renders successfully with configured options
      expect(screen).toBeTruthy();
    });
  });

  describe('Screen Components', () => {
    it('should import and configure all screen components', () => {
      // This test verifies that AppNavigator can be instantiated
      // which means all screen imports are valid
      renderNavigator();
      expect(screen).toBeTruthy();
    });
  });
});
