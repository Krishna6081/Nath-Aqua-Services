import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CustomerReviewsSection: React.FC = () => {
  const theme = useTheme();

  const reviews = [
    {
      id: 'rev-1',
      name: 'Rahul Deshmukh',
      location: 'Kothrud, Pune',
      comment: 'Super fast delivery and crystal clear water quality! The order tracking is very helpful.',
      rating: 5,
    },
    {
      id: 'rev-2',
      name: 'Priya Sharma',
      location: 'Viman Nagar, Pune',
      comment: 'Daily water subscription has made my life so easy. Never run out of drinking water now!',
      rating: 5,
    },
    {
      id: 'rev-3',
      name: 'Amit Patil',
      location: 'Baner, Pune',
      comment: 'Extremely polite delivery team and honest pricing for 20L water cans.',
      rating: 5,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
          Customers Love Us ❤️
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
          Real feedback from homes
        </Text>
      </View>

      <FlatList
        data={reviews}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.starsRow}>
              {[...Array(item.rating)].map((_, i) => (
                <Icon key={i} name="star" size={16} color="#f59e0b" />
              ))}
            </View>

            <Text variant="bodyMedium" style={[styles.comment, { color: theme.colors.onSurface }]} numberOfLines={3}>
              "{item.comment}"
            </Text>

            <View style={styles.userRow}>
              <Avatar.Text
                size={34}
                label={item.name.charAt(0)}
                style={{ backgroundColor: '#e0f2fe' }}
                labelStyle={{ color: '#0284c7', fontWeight: 'bold' }}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.outline, fontSize: 11 }}>
                  📍 {item.location}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 240,
    borderRadius: 18,
    padding: 16,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  comment: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
