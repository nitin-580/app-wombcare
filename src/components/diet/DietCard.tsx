import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DietCardProps {
  age?: string;
  height?: string;
  weight?: string;
  goal?: string;
  diet?: string;
}

export const DietCard: React.FC<DietCardProps> = ({
  age = '31 Years',
  height = '162 cm',
  weight = '50 kg',
  goal = 'Healthy Weight Gain (+3-5 kg)',
  diet = 'Vegetarian',
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.indicatorBar} />
        <Text style={styles.headerTitle}>Patient Profile</Text>
      </View>

      <View style={styles.gridContainer}>
        {/* Row 1 */}
        <View style={styles.gridRow}>
          {/* Age */}
          <View style={[styles.gridCell, styles.cellPurple]}>
            <Ionicons name="person-outline" size={18} color="#8F55FF" style={styles.cellIcon} />
            <Text style={styles.cellLabel}>Age</Text>
            <Text style={styles.cellValue}>{age}</Text>
          </View>

          {/* Height */}
          <View style={[styles.gridCell, styles.cellPink]}>
            <Ionicons name="resize-outline" size={18} color="#FF5CA8" style={styles.cellIcon} />
            <Text style={styles.cellLabel}>Height</Text>
            <Text style={styles.cellValue}>{height}</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.gridRow}>
          {/* Weight */}
          <View style={[styles.gridCell, styles.cellPurple]}>
            <Ionicons name="scale-outline" size={18} color="#8F55FF" style={styles.cellIcon} />
            <Text style={styles.cellLabel}>Weight</Text>
            <Text style={styles.cellValue}>{weight}</Text>
          </View>

          {/* Diet Type */}
          <View style={[styles.gridCell, styles.cellPurple]}>
            <Ionicons name="restaurant-outline" size={18} color="#8F55FF" style={styles.cellIcon} />
            <Text style={styles.cellLabel}>Diet Type</Text>
            <Text style={styles.cellValue}>{diet}</Text>
          </View>
        </View>

        {/* Goal (Full Width) */}
        <View style={[styles.fullGridCell, styles.cellPink]}>
          <Ionicons name="flag-outline" size={18} color="#FF5CA8" style={styles.cellIcon} />
          <Text style={styles.cellLabel}>Goal</Text>
          <Text style={styles.cellValue}>{goal}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EFE5FC',
    padding: 16,
    shadowColor: '#8F55FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  indicatorBar: {
    width: 4,
    height: 16,
    backgroundColor: '#8F55FF',
    borderRadius: 2,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
  },
  gridContainer: {
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCell: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  fullGridCell: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cellPurple: {
    backgroundColor: '#FAF7FF',
    borderColor: '#EFE5FC',
  },
  cellPink: {
    backgroundColor: '#FFF5F8',
    borderColor: '#FFE5EC',
  },
  cellIcon: {
    marginBottom: 4,
  },
  cellLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cellValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A5568',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default DietCard;
