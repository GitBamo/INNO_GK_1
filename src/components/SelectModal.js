import React from 'react';
import { Modal, View, Text, Pressable, FlatList } from 'react-native';
import colors from '../styles/colors';

/*
SelectModal er en genanvendelig React Native komponent, der viser en modal med en liste af valgmuligheder.

Props:
  - visible: boolean, styrer om modal-vinduet er synligt
  - options: array af { label, value } objekter, som vises som valg
  - selected: value for det aktuelt valgte element
  - onSelect: funktion der kaldes med value, når brugeren vælger et element
  - onClose: funktion der kaldes når modal lukkes (fx tryk udenfor eller på "Annullér")
  - title: (valgfri) overskrift for modal

UI:
  - Viser en modal med en liste af trykbare muligheder
  - Marker det valgte element tydeligt (fx med farve eller ikon)
  - Lukker når brugeren vælger et element eller trykker udenfor/modalens "Annullér"-knap
  - Bruges typisk til at vælge mellem flere muligheder i en formular

Eksempel på brug:
  <SelectModal
    visible={modalOpen}
    options={[{ label: 'A', value: 'a' }, ...]}
    selected={value}
    onSelect={setValue}
    onClose={() => setModalOpen(false)}
    title="Vælg studie"
  />
Se fx src/screens/CreateBookingScreen.js for brug i praksis.
*/

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
