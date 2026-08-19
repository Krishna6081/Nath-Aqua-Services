import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { authApi } from '../../api/authApi';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your registered email.');
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      Alert.alert('Success', 'Password reset instructions sent to your email.');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to process forgot password request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Forgot Password?
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter your registered email address to receive password reset instructions.
      </Text>

      <TextInput
        label="Registered Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleReset}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Send Reset Instructions
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    borderRadius: 25,
  },
});
