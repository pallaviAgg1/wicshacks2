import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default function App() {
  const [error, setError] = useState(null);
  
  // Use your computer's local network IP instead of localhost
  // The phone needs to access your PC over the network
  const WEB_APP_URL = 'http://11.21.61.195:5173';

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    setError({
      description: nativeEvent.description || 'Failed to load',
      code: nativeEvent.code || 'Unknown error',
    });
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Cannot connect to web app
        </Text>
        <Text style={styles.errorDetail}>
          Make sure the Vite dev server is running at:
        </Text>
        <Text style={styles.errorDetail}>
          {WEB_APP_URL}
        </Text>
        <Text style={styles.errorDetail}>
          {'\n'}Error: {error.description}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <WebView
        source={{ uri: WEB_APP_URL }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        onError={handleError}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('HTTP error: ', nativeEvent.statusCode);
          setError({
            description: `HTTP ${nativeEvent.statusCode}`,
            code: nativeEvent.statusCode,
          });
        }}
        // Allow JavaScript execution
        javaScriptEnabled={true}
        // Allow DOM storage for better compatibility
        domStorageEnabled={true}
        // Allow mixed content for development
        mixedContentMode="always"
        // Improve scrolling experience
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
    </View>
  );
}

