import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvoidFoodCardProps {
  foods?: string[];
}

export const AvoidFoodCard: React.FC<AvoidFoodCardProps> = ({
  foods = [
    'Milk Products',
    'Sprouts',
    'Bakery Foods',
    'Desi Ghee',
    'Fried Foods',
    'Excess Sugar',
    'Mango',
    'Excess Dry Fruits',
    'Carbonated Drinks',
  ],
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Ionicons name="warning-outline" size={20} color="#E53E3E" />
        <Text style={styles.headerTitle}>Foods to Avoid</Text>
      </View>

      <Text style={styles.subtitleText}>
        To manage PCOD symptoms and prevent Ulcerative Colitis (UC) flare-ups, strictly avoid these foods:
      </Text>

      <View style={styles.chipContainer}>
        {foods.map((food, idx) => (
          <View key={idx} style={styles.chip}>
            <Ionicons name="alert-circle-outline" size={13} color="#E53E3E" style={styles.chipIcon} />
            <Text style={styles.chipText}>{food}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FED7D7',
    padding: 18,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9B2C2C',
  },
  subtitleText: {
    fontSize: 11,
    color: '#C53030',
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7D7',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
  },
});

export default AvoidFoodCard;
