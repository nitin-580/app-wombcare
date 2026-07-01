import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MealCard from '../../components/diet/MealCard';

interface Meal {
  time: string;
  food: string | string[];
  calories: number;
}

interface DayDietPlan {
  day: number;
  meals: Meal[];
  totalCalories: number;
}

interface DietPlan {
  dietData: DayDietPlan[];
}

interface FullDietPlanScreenProps {
  dietPlan: DietPlan;
  onBack: () => void;
}

export const FullDietPlanScreen: React.FC<FullDietPlanScreenProps> = ({ dietPlan, onBack }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  if (!dietPlan || !dietPlan.dietData || dietPlan.dietData.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No diet chart details available.</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activeDayData = dietPlan.dietData.find((d) => d.day === selectedDay) || dietPlan.dietData[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>7-Day Diet Plan</Text>
          <Text style={styles.headerSubtitle}>Complete Weekly Schedule</Text>
        </View>
      </View>

      {/* Day Horizontal Picker */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {dietPlan.dietData.map((d) => (
            <TouchableOpacity
              key={d.day}
              onPress={() => setSelectedDay(d.day)}
              style={[
                styles.tabButton,
                selectedDay === d.day && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedDay === d.day && styles.tabButtonTextActive,
                ]}
              >
                Day {d.day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable meals list */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentScrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeDayData?.meals.map((meal, idx) => (
          <MealCard
            key={idx}
            time={meal.time}
            food={meal.food}
            calories={meal.calories}
          />
        ))}
      </ScrollView>

      {/* Summary Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Daily Intake Summary</Text>
          <Text style={styles.footerValue}>Day {selectedDay} Target</Text>
        </View>

        <View style={styles.caloriesContainer}>
          <Ionicons name="flame" size={18} color="#FF5CA8" style={styles.flameIcon} />
          <Text style={styles.caloriesValue}>{activeDayData?.totalCalories}</Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FC',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FAF8FC',
  },
  errorText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#8F55FF',
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3EEFD',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
    marginLeft: 6,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3EEFD',
  },
  tabBarScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  tabButtonActive: {
    backgroundColor: '#8F55FF',
    borderColor: '#8F55FF',
    shadowColor: '#8F55FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#718096',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  contentScroll: {
    flex: 1,
  },
  contentScrollContainer: {
    padding: 20,
    gap: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3EEFD',
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A5568',
    marginTop: 2,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#FFE5EC',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  flameIcon: {
    marginRight: 4,
  },
  caloriesValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF5CA8',
  },
  caloriesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0AEC0',
    marginLeft: 4,
  },
});

export default FullDietPlanScreen;
