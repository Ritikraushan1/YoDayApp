import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Custom theme
  const MyTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: '#007BFF',
      background: isDarkMode ? '#000' : '#fff',
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      {/* ⚡️ Remove hard black background here */}
      <SafeAreaProvider>
        {/* Make sure status bar text is visible */}
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4267B2' }} edges={['top', 'bottom']}>
          <Provider store={store}>
            <AppNavigator />
          </Provider>
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
