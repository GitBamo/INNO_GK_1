import React from 'react';
import { Modal, View, Text, Pressable, FlatList } from 'react-native';
import colors from '../styles/colors';

export default function SelectModal({ visible, title, options, value, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 16 }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: '#121829',
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 12,
            maxHeight: '60%',
          }}
        >
          {!!title && (
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16, marginBottom: 8 }}>
              {title}
            </Text>
          )}

          <FlatList
            data={options}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => {
              const selected = item === value;
              return (
                <Pressable
                  onPress={() => onSelect?.(item)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    backgroundColor: selected ? '#1b2340' : 'transparent',
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: selected ? '700' : '500' }}>
                    {String(item)}
                  </Text>
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
