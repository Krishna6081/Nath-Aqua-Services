import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Avatar, Button, Switch, useTheme, Card, IconButton, Divider } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logoutUser } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

export const ProfileScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera roll permissions are required to select a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setProfileImage(selectedUri);
        Alert.alert('Photo Updated 🎉', 'Your profile picture has been updated.');
      }
    } catch (e) {
      console.log('Error picking image:', e);
      Alert.alert('Error', 'Unable to select image. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of your account?', [
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

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return '👑 Administrator';
      case 'DELIVERY_PERSON':
        return '🚚 Delivery Partner';
      default:
        return '💧 Valued Customer';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Profile Hero */}
        <View style={[styles.headerHero, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.avatarWrapper}>
            {profileImage ? (
              <Avatar.Image size={86} source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Avatar.Text
                size={86}
                label={user?.name ? user.name.slice(0, 2).toUpperCase() : 'NW'}
                style={styles.avatarText}
                labelStyle={styles.avatarLabel}
              />
            )}
            <TouchableOpacity
              style={styles.cameraBadge}
              activeOpacity={0.8}
              onPress={handlePickImage}
            >
              <Icon name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text variant="headlineSmall" style={styles.userName}>
            {user?.name || 'Customer'}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{getRoleLabel(user?.role)}</Text>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Icon name="phone" size={14} color="#e0f2fe" />
              <Text variant="bodySmall" style={styles.contactText}>
                {user?.phone || 'Not set'}
              </Text>
            </View>
            <Text style={{ color: '#bae6fd' }}>•</Text>
            <View style={styles.contactItem}>
              <Icon name="email" size={14} color="#e0f2fe" />
              <Text variant="bodySmall" style={styles.contactText}>
                {user?.email || 'Not set'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('OrdersTab')}
          >
            <Icon name="package-variant" size={22} color="#0284c7" />
            <Text variant="labelLarge" style={styles.statLabel}>
              Orders
            </Text>
            <Text variant="bodySmall" style={styles.statSub}>
              View History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('SubscriptionsTab')}
          >
            <Icon name="calendar-sync" size={22} color="#0891b2" />
            <Text variant="labelLarge" style={styles.statLabel}>
              Refills
            </Text>
            <Text variant="bodySmall" style={styles.statSub}>
              Subscriptions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('AddressList')}
          >
            <Icon name="map-marker-outline" size={22} color="#2563eb" />
            <Text variant="labelLarge" style={styles.statLabel}>
              Addresses
            </Text>
            <Text variant="bodySmall" style={styles.statSub}>
              Saved Locations
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings Section */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={[styles.sectionHeader, { color: theme.colors.onBackground }]}>
            Account & Delivery Settings
          </Text>

          <Card style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
            {user?.role === 'CUSTOMER' && (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('AddressList')}
                >
                  <View style={[styles.menuIconCircle, { backgroundColor: '#e0f2fe' }]}>
                    <Icon name="map-marker" size={20} color="#0284c7" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text variant="titleSmall" style={styles.menuTitle}>
                      Delivery Addresses
                    </Text>
                    <Text variant="bodySmall" style={styles.menuSubtitle}>
                      Manage home, office & custom locations
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={theme.colors.outline} />
                </TouchableOpacity>

                <Divider style={styles.divider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('SubscriptionsTab')}
                >
                  <View style={[styles.menuIconCircle, { backgroundColor: '#cffaff' }]}>
                    <Icon name="calendar-sync" size={20} color="#0891b2" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text variant="titleSmall" style={styles.menuTitle}>
                      Water Subscriptions
                    </Text>
                    <Text variant="bodySmall" style={styles.menuSubtitle}>
                      Configure automated recurring deliveries
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={theme.colors.outline} />
                </TouchableOpacity>

                <Divider style={styles.divider} />

                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Notifications')}
                >
                  <View style={[styles.menuIconCircle, { backgroundColor: '#dbeafe' }]}>
                    <Icon name="bell-outline" size={20} color="#2563eb" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text variant="titleSmall" style={styles.menuTitle}>
                      Notifications & Alerts
                    </Text>
                    <Text variant="bodySmall" style={styles.menuSubtitle}>
                      In-app delivery status & special promo updates
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={theme.colors.outline} />
                </TouchableOpacity>
              </>
            )}
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionContainer}>
          <Text variant="titleMedium" style={[styles.sectionHeader, { color: theme.colors.onBackground }]}>
            Preferences & Support
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
                  Toggle dark or light app theme
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
              onPress={() => navigation.navigate('HelpSupport')}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: '#d1fae5' }]}>
                <Icon name="help-circle-outline" size={20} color="#059669" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text variant="titleSmall" style={styles.menuTitle}>
                  Help & Customer Support
                </Text>
                <Text variant="bodySmall" style={styles.menuSubtitle}>
                  FAQs, contact helpline & assistance
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.outline} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('About')}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Icon name="information-outline" size={20} color="#d97706" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text variant="titleSmall" style={styles.menuTitle}>
                  About Nath Water Service
                </Text>
                <Text variant="bodySmall" style={styles.menuSubtitle}>
                  Version 1.0.0 • Pure Water Guarantee
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Logout Action */}
        <Button
          mode="outlined"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutBtn}
          contentStyle={{ height: 48 }}
          textColor={theme.colors.error}
          labelStyle={{ fontWeight: '700' }}
        >
          Logout Account
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
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
    elevation: 3,
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
    marginTop: 6,
    marginBottom: 10,
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    color: '#e0f2fe',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontWeight: '700',
    marginTop: 6,
  },
  statSub: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
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
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
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
    marginTop: 28,
    borderColor: '#ef4444',
    borderRadius: 18,
    borderWidth: 1.5,
  },
});
