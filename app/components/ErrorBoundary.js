import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service in production
    // console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#f5f5f5'
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            color: '#333'
          }}>
            Kanga! Harimo ikosa
          </Text>
          <Text style={{
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 20,
            color: '#666'
          }}>
            Habayeho ikosa ritunze. Kanda hano ugaruke.
          </Text>
          <TouchableOpacity
            onPress={this.handleReset}
            style={{
              backgroundColor: '#478CCA',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
              Garuka
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;