import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, Avatar, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HomeHeaderProps {
  userName?: string;
  location?: string;
  unreadCount?: number;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onLocationPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = 'Customer',
  location = 'Shivaji Nagar, Pune',
  unreadCount = 0,
  onNotificationPress,
  onProfilePress,
  onLocationPress,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.userSection} activeOpacity={0.8} onPress={onProfilePress}>
          <Avatar.Text
            size={42}
            label={userName.charAt(0).toUpperCase()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.greetingContainer}>
            <Text variant="titleMedium" style={styles.greetingText}>
              Good Morning, {userName} 👋
            </Text>
            <Text variant="bodySmall" style={styles.subGreeting}>
              Stay hydrated, stay healthy.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bellButton} onPress={onNotificationPress} activeOpacity={0.7}>
          <Icon name="bell-outline" size={24} color="#ffffff" />
          {unreadCount > 0 && (
            <Badge style={styles.badge} size={16}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.locationBar}
        activeOpacity={0.8}
        onPress={onLocationPress || onProfilePress}
      >
        <Icon name="map-marker" size={18} color="#e0f2fe" style={{ marginRight: 6 }} />
        <Text variant="bodySmall" style={styles.locationLabel} numberOfLines={1}>
          Delivering to: <Text style={styles.locationValue}>{location}</Text>
        </Text>
        <Icon name="chevron-down" size={18} color="#e0f2fe" style={{ marginLeft: 4 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 4,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#ffffff',
    marginRight: 12,
  },
  avatarLabel: {
    color: '#0284c7',
    fontWeight: 'bold',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  subGreeting: {
    color: '#e0f2fe',
    marginTop: 1,
    opacity: 0.9,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  locationLabel: {
    color: '#e0f2fe',
  },
  locationValue: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
