import React from 'react';
import { Pressable, Text } from 'react-native';
import colors from '../styles/colors';

export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: selected ? colors.accent : '#1b2340',
        marginRight: 8,
        marginBottom: 8,
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={{ color: 'white', fontWeight: selected ? '700' : '500' }}>
        {label}
      </Text>
    </Pressable>
  );
}
