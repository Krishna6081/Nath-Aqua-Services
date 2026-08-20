import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      await dispatch(
        registerUser({
          name,
          email,
          phone,
          password,
          role: 'CUSTOMER',
        })
      ).unwrap();
      navigation.replace('CustomerApp');
    } catch (err: any) {
      Alert.alert('Registration Failed', err || 'Error registering user.');
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
          Create Account
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign up for Krishna Water Service delivery
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          style={styles.input}
        />

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
          label="Mobile Number (10 digits)"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          maxLength={10}
          left={<TextInput.Icon icon="phone" />}
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

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock-check" />}
          style={styles.input}
        />

        <Button
          mode="contained"
          buttonColor="#0284c7"
          textColor="#ffffff"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.registerBtn}
          contentStyle={{ paddingVertical: 6 }}
        >
          Register
        </Button>

        <View style={styles.loginRow}>
          <Text variant="bodyMedium">Already have an account? </Text>
          <Button mode="text" compact onPress={() => navigation.navigate('Login')}>
            Login
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
    marginBottom: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
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
    marginBottom: 14,
  },
  registerBtn: {
    borderRadius: 25,
    marginTop: 8,
    marginBottom: 20,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
