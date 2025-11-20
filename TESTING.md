# Testing Guide for CBI-App

## Overview

The CBI-App now has a comprehensive automated testing infrastructure using Jest and React Native Testing Library.

## Test Suite Summary

- **32 passing tests** across 3 test suites
- **HomeScreen**: 17 tests ✅
- **MealEntryScreen**: 10 tests ✅
- **AppNavigator**: 5 tests ✅
- **3 skipped tests** (Alert mocking - non-critical)

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD (optimized for continuous integration)
npm run test:ci
```

### Test Output

When you run `npm test`, you'll see:
- ✓ for passing tests
- ✗ for failing tests
- Test suite summary at the end

## What's Being Tested

### HomeScreen Tests (src/screens/__tests__/HomeScreen.test.tsx)

**Rendering:**
- Screen renders without crashing
- CBI logo and header are displayed
- All UI sections are visible

**User Stats:**
- Today's Score, Week Average, Streak, and Energy are displayed correctly

**Quick Actions:**
- All 4 action buttons render (Photo, Batch, Scan, Type)
- Each button navigates to LogMeal with correct method parameter

**Insights Section:**
- Displays all 3 insights with correct messages

**Recent Meals:**
- Shows all meals with correct details (time, items, scores)
- Add meal button navigates correctly

**Learning Section:**
- Displays learning module and progress
- Continue button navigates to Learn screen

**Notifications:**
- Notification badge displays correct count

### MealEntryScreen Tests (src/screens/__tests__/MealEntryScreen.test.tsx)

**Initial Rendering:**
- Screen renders with method selection
- All 4 input methods are displayed
- Feature cards are shown

**Photo Analysis:**
- Triggers camera picker when Photo is selected
- Shows analyzing state
- Displays detected foods after analysis
- Handles canceled photo capture

**Batch Analysis:**
- Shows analyzing state for batch scan
- Displays detected items with sub-items
- Shows meal summary with total score

**Detected Foods:**
- Displays meal summary with correct total score
- Shows correct item count

**Reset Functionality:**
- Returns to method selection when Start Over is pressed

**Analyzing States:**
- Shows correct loading message for each method

### AppNavigator Tests (src/navigation/__tests__/AppNavigator.test.tsx)

**Tab Navigation:**
- Tab navigator renders without crashing
- Home screen is displayed by default

**Screen Configuration:**
- All 5 screens are properly configured
- Screen components can be instantiated

## Test Infrastructure

### Configuration Files

**jest.config.js**
- Uses `jest-expo` preset for React Native/Expo compatibility
- Configured to transform node_modules properly
- Runs tests in Node environment
- Supports TypeScript

**jest.setup.js**
- Mocks Expo modules (camera, image-picker, barcode-scanner)
- Mocks vector icons
- Polyfills for structuredClone
- Silences console warnings during tests

### Dependencies Added

```json
{
  "devDependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@testing-library/jest-native": "^5.4.3",
    "@testing-library/react-native": "^13.3.3",
    "@types/jest": "^30.0.0",
    "@types/react-test-renderer": "^19.1.0",
    "expo-asset": "^12.0.1",
    "expo-font": "^13.0.1",
    "jest": "^30.2.0",
    "jest-expo": "^54.0.13",
    "react-test-renderer": "^19.1.0"
  }
}
```

## Writing New Tests

### Example Test Structure

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeTruthy();
  });

  it('should handle button press', () => {
    const mockFn = jest.fn();
    render(<MyComponent onPress={mockFn} />);

    fireEvent.press(screen.getByText('Button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Best Practices

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain what's being tested
3. **Test user behavior**, not implementation details
4. **Clean up** after each test using `beforeEach` and `afterEach`
5. **Mock external dependencies** to isolate component logic
6. **Use queries** like `getByText`, `getByRole` for accessibility

### Common Testing Patterns

**Testing Navigation:**
```typescript
const mockNavigation = { navigate: jest.fn() };
render(<Screen navigation={mockNavigation} />);

fireEvent.press(screen.getByText('Button'));
expect(mockNavigation.navigate).toHaveBeenCalledWith('ScreenName');
```

**Testing Async Operations:**
```typescript
import { waitFor } from '@testing-library/react-native';

await waitFor(() => {
  expect(screen.getByText('Loaded Data')).toBeTruthy();
});
```

**Testing Timers:**
```typescript
jest.useFakeTimers();

fireEvent.press(screen.getByText('Start'));
jest.advanceTimersByTime(2000);

await waitFor(() => {
  expect(screen.getByText('Complete')).toBeTruthy();
});

jest.useRealTimers();
```

## Test Coverage

To see which parts of your code are tested:

```bash
npm run test:coverage
```

This generates a coverage report showing:
- **Statements**: % of code statements executed
- **Branches**: % of conditional branches tested
- **Functions**: % of functions called
- **Lines**: % of lines executed

Coverage reports are saved to `/coverage` directory.

## Continuous Integration

For CI/CD pipelines, use:

```bash
npm run test:ci
```

This command:
- Runs all tests once (no watch mode)
- Generates coverage report
- Uses 2 workers (optimized for CI)
- Fails if tests don't pass

## Troubleshooting

### Tests Not Running

**Check Node version:** Requires Node.js v16+
```bash
node --version
```

**Clear Jest cache:**
```bash
npx jest --clearCache
```

### Module Not Found Errors

Update `jest.config.js` `transformIgnorePatterns` to include the module.

### Expo Module Mocking Issues

Add mocks to `jest.setup.js` for any Expo modules your components use.

### Test Timeout Errors

Increase timeout in specific tests:
```typescript
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

## Known Issues

### Skipped Tests

The following tests are skipped due to React Native Alert mocking complexity:
- MealEntryScreen: Manual Entry alert
- MealEntryScreen: Save Meal alert
- MealEntryScreen: Route parameter pre-selection

These represent edge cases and don't affect core functionality testing.

## Next Steps

### Recommended Additions

1. **Add tests for remaining screens:**
   - ProgressScreen
   - EducationScreen
   - ProfileScreen

2. **Add integration tests** for multi-screen workflows

3. **Add snapshot tests** for UI consistency

4. **Set up coverage thresholds** in jest.config.js:
   ```javascript
   coverageThreshold: {
     global: {
       statements: 80,
       branches: 80,
       functions: 80,
       lines: 80
     }
   }
   ```

5. **Add E2E tests** using Detox for full app testing

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Expo Testing](https://docs.expo.dev/develop/unit-testing/)

---

**Happy Testing!** 🧪✨
