import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Avatar, Button, Divider, Switch, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logoutUser } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

export const ProfileScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logoutUser());
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Avatar.Text
          size={72}
          label={user?.name ? user.name.slice(0, 2).toUpperCase() : 'NW'}
          style={styles.avatar}
        />
        <Text variant="titleLarge" style={styles.name}>
          {user?.name || 'User'}
        </Text>
        <Text variant="bodyMedium" style={styles.role}>
          {user?.role} • {user?.phone}
        </Text>
        <Text variant="bodySmall" style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <List.Section style={styles.section}>
        <List.Subheader>Account Settings</List.Subheader>
        {user?.role === 'CUSTOMER' && (
          <>
            <List.Item
              title="Saved Addresses"
              description="Manage delivery locations"
              left={(props) => <List.Icon {...props} icon="map-marker" />}
              onPress={() => navigation.navigate('AddressList')}
            />
            <List.Item
              title="Recurring Subscriptions"
              description="Active water schedules"
              left={(props) => <List.Icon {...props} icon="calendar-repeat" />}
              onPress={() => navigation.navigate('Subscriptions')}
            />
            <List.Item
              title="Notifications"
              description="Delivery alerts & offers"
              left={(props) => <List.Icon {...props} icon="bell" />}
              onPress={() => navigation.navigate('Notifications')}
            />
          </>
        )}

        <Divider />
        <List.Subheader>App Preferences</List.Subheader>
        <List.Item
          title="Dark Theme"
          description="Toggle dark/light mode"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={() => {
                dispatch(toggleTheme());
              }}
            />
          )}
        />
        <List.Item
          title="Help & Support"
          description="Contact customer care"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          onPress={() => navigation.navigate('HelpSupport')}
        />
        <List.Item
          title="About Nath Water Service"
          description="Version 1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
          onPress={() => navigation.navigate('About')}
        />
      </List.Section>

      <Button
        mode="outlined"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutBtn}
        textColor={theme.colors.error}
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 45,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  name: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  role: {
    color: '#e0f2fe',
    marginTop: 2,
  },
  email: {
    color: '#bae6fd',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderColor: '#ef4444',
    borderRadius: 25,
  },
});
