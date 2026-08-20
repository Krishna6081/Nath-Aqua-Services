import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter email and password.');
      return;
    }

    try {
      const result = await dispatch(loginUser({ email: email.trim().toLowerCase(), password })).unwrap();
      if (result.user.role === 'ADMIN') {
        navigation.replace('AdminApp');
      } else if (result.user.role === 'DELIVERY_PERSON') {
        navigation.replace('DeliveryApp');
      } else {
        navigation.replace('CustomerApp');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err || 'Invalid login credentials.');
    }
  };

  const handleQuickDemoFill = (role: string) => {
    if (role === 'admin') {
      setEmail('admin@nathwater.com');
      setPassword('Admin@123');
    } else if (role === 'delivery') {
      setEmail('delivery@nathwater.com');
      setPassword('Delivery@123');
    } else {
      setEmail('customer@gmail.com');
      setPassword('Customer@123');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logoImage}
        />
        <Text variant="headlineSmall" style={styles.title}>
          Welcome Back
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign in to Krishna Water Service
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
        />

        <Button
          mode="text"
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotBtn}
        >
          Forgot Password?
        </Button>

        <Button
          mode="contained"
          buttonColor="#0284c7"
          textColor="#ffffff"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.loginBtn}
          contentStyle={{ paddingVertical: 6 }}
        >
          Login
        </Button>

        <View style={styles.demoSection}>
          <Text variant="bodySmall" style={styles.demoTitle}>
            Quick Demo Fill:
          </Text>
          <View style={styles.demoRow}>
            <Button compact mode="outlined" onPress={() => handleQuickDemoFill('customer')}>
              Customer
            </Button>
            <Button compact mode="outlined" onPress={() => handleQuickDemoFill('delivery')}>
              Delivery
            </Button>
            <Button compact mode="outlined" onPress={() => handleQuickDemoFill('admin')}>
              Admin
            </Button>
          </View>
        </View>

        <View style={styles.registerRow}>
          <Text variant="bodyMedium">Don't have an account? </Text>
          <Button mode="text" compact onPress={() => navigation.navigate('Register')}>
            Register
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    color: '#64748b',
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  loginBtn: {
    borderRadius: 25,
    marginBottom: 20,
  },
  demoSection: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  demoTitle: {
    color: '#64748b',
    marginBottom: 8,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
