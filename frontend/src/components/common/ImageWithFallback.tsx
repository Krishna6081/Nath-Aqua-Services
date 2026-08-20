import React, { useState } from 'react';
import { View, Image, StyleSheet, ImageProps } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  source?: any;
  fallbackText?: string;
  fallbackIcon?: string;
  containerStyle?: any;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  source,
  style,
  resizeMode = 'cover',
  fallbackText = '💧',
  fallbackIcon = 'water',
  containerStyle,
  ...props
}) => {
  const [error, setError] = useState(false);
  const theme = useTheme();

  const isUriObject = typeof source === 'object' && source !== null && 'uri' in source;
  const isValidSource = source && (!isUriObject || Boolean(source.uri));

  if (error || !isValidSource) {
    return (
      <View style={[styles.fallbackContainer, { backgroundColor: theme.colors.primaryContainer }, style, containerStyle]}>
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      onError={() => setError(true)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  fallbackText: {
    fontSize: 28,
  },
});
