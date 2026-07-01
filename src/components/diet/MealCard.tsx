import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MealCardProps {
  time: string;
  food: string | string[];
  calories: number;
}

export const MealCard: React.FC<MealCardProps> = ({ time, food, calories }) => {
  const foodItems = Array.isArray(food)
    ? food
    : typeof food === 'string'
      ? food.split('+').map(item => item.trim()).filter(Boolean)
      : [];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
        {/* Time Icon Badge */}
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={18} color="#8F55FF" />
        </View>

        <View style={styles.mealContent}>
          {/* Meal Time Title */}
          <Text style={styles.timeText}>{time}</Text>

          {/* Food Items List */}
          <View style={styles.foodList}>
            {foodItems.map((item, idx) => (
              <View key={idx} style={styles.foodItemRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.foodItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Calories Badge */}
      <View style={styles.caloriesBadge}>
        <View style={styles.caloriesRow}>
          <Ionicons name="flame" size={14} color="#FF5CA8" style={styles.flameIcon} />
          <Text style={styles.caloriesValue}>{calories}</Text>
        </View>
        <Text style={styles.caloriesLabel}>kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0EAF8',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  timeBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3EEFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealContent: {
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  foodList: {
    gap: 4,
  },
  foodItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF85B8',
    marginRight: 8,
  },
  foodItemText: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '500',
    flex: 1,
  },
  caloriesBadge: {
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#FFE5EC',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameIcon: {
    marginRight: 2,
  },
  caloriesValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5CA8',
  },
  caloriesLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 1,
  },
});

export default MealCard;
