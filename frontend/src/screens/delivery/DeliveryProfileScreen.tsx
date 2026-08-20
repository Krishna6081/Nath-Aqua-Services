import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Avatar, Button, Switch, useTheme, Card, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logoutUser } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

export const DeliveryProfileScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [isOnDuty, setIsOnDuty] = useState(true);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll permissions are required to select a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Photo Updated 🎉', 'Delivery partner profile photo updated.');
      }
    } catch (e) {
      console.log('Error picking image:', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of your Delivery Partner account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logoutUser());
          const parentNav = navigation.getParent();
          if (parentNav) {
            parentNav.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Delivery Header */}
        <View style={[styles.headerHero, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.avatarWrapper}>
            {profileImage ? (
              <Avatar.Image size={86} source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Avatar.Text
                size={86}
                label={user?.name ? user.name.slice(0, 2).toUpperCase() : 'DP'}
                style={styles.avatarText}
                labelStyle={styles.avatarLabel}
              />
            )}
            <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8} onPress={handlePickImage}>
              <Icon name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text variant="headlineSmall" style={styles.userName}>
            {user?.name || 'Delivery Partner'}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>🚚 Delivery Partner • {user?.phone}</Text>
          </View>

          <View style={styles.dutyToggleBox}>
            <Text style={styles.dutyText}>Duty Status: {isOnDuty ? '🟢 ON DUTY' : '🔴 OFF DUTY'}</Text>
            <Switch
              value={isOnDuty}
              onValueChange={setIsOnDuty}
              color="#ffffff"
            />
          </View>
        </View>

        {/* Delivery Partner Menu Options */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={[styles.sectionHeader, { color: theme.colors.onBackground }]}>
            Partner Options & Settings
          </Text>

          <Card style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.menuItem}>
              <View style={[styles.menuIconCircle, { backgroundColor: '#f3e8ff' }]}>
                <Icon name="theme-light-dark" size={20} color="#9333ea" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text variant="titleSmall" style={styles.menuTitle}>
                  Dark Theme
                </Text>
                <Text variant="bodySmall" style={styles.menuSubtitle}>
                  Toggle dark or light mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={() => {
                  dispatch(toggleTheme());
                }}
                color={theme.colors.primary}
              />
            </View>

            <Divider style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Admin Support', 'Contact Admin at +91 9876543210 for delivery dispatch queries.')}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: '#e0f2fe' }]}>
                <Icon name="headset" size={20} color="#0284c7" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text variant="titleSmall" style={styles.menuTitle}>
                  Admin Dispatch Support
                </Text>
                <Text variant="bodySmall" style={styles.menuSubtitle}>
                  Helpline for route & delivery issues
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Logout Button */}
        <Button
          mode="contained"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutBtn}
          contentStyle={{ height: 48 }}
          buttonColor="#ef4444"
          textColor="#ffffff"
          labelStyle={{ fontWeight: 'bold' }}
        >
          LOGOUT DELIVERY PARTNER
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerHero: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    backgroundColor: '#ffffff',
  },
  avatarText: {
    backgroundColor: '#ffffff',
  },
  avatarLabel: {
    color: '#0284c7',
    fontWeight: '800',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    color: '#ffffff',
    fontWeight: '800',
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  dutyToggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    width: '100%',
    marginTop: 4,
  },
  dutyText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  sectionHeader: {
    fontWeight: '700',
    marginBottom: 10,
  },
  menuCard: {
    borderRadius: 18,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontWeight: '700',
  },
  menuSubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 1,
  },
  divider: {
    backgroundColor: '#f1f5f9',
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 18,
  },
});
