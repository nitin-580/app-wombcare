import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DietCard from '../../components/diet/DietCard';
import MealCard from '../../components/diet/MealCard';
import AvoidFoodCard from '../../components/diet/AvoidFoodCard';
import FullDietModal from '../../components/diet/FullDietModal';

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

interface DailyTarget {
  name: string;
  value: string;
}

interface DietPlan {
  id?: string;
  name: string;
  description: string;
  patientAge: string;
  patientHeight: string;
  patientWeight: string;
  patientGoal: string;
  patientDiet: string;
  dietData: DayDietPlan[];
  foodsToAvoid: string[];
  dailyTargets: DailyTarget[];
}

interface DietScreenProps {
  dietPlan: DietPlan;
  onBack?: () => void;
}

export const DietScreen: React.FC<DietScreenProps> = ({ dietPlan, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default to Day 1
  const todayPlan = dietPlan.dietData.find((d) => d.day === 1) || dietPlan.dietData[0];

  return (
    <View style={styles.container}>
      {/* Header section with back button if applicable */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2D3748" />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>My Diet Plan</Text>
          <Text style={styles.subtitle}>{dietPlan.name || 'PCOD + Ulcerative Colitis (UC)'}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.descriptionText}>
          {dietPlan.description || 'Hormonal Balance • Gut Healing • Healthy Weight Gain'}
        </Text>

        {/* Top Patient profile Card */}
        <DietCard
          age={dietPlan.patientAge}
          height={dietPlan.patientHeight}
          weight={dietPlan.patientWeight}
          goal={dietPlan.patientGoal}
          diet={dietPlan.patientDiet}
        />

        {/* Today's Diet Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.liveIndicator} />
              <Text style={styles.sectionTitle}>Today's Diet Plan</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>Day {todayPlan?.day || 1}</Text>
            </View>
          </View>

          <View style={styles.mealsList}>
            {todayPlan?.meals.map((meal, idx) => (
              <MealCard
                key={idx}
                time={meal.time}
                food={meal.food}
                calories={meal.calories}
              />
            ))}
          </View>

          {/* Today's Total Calories */}
          <View style={styles.caloriesSummary}>
            <View>
              <Text style={styles.summaryLabel}>Summary</Text>
              <Text style={styles.summaryValue}>Total Calories Today</Text>
            </View>
            <View style={styles.caloriesValueBadge}>
              <Ionicons name="flame" size={16} color="#FF5CA8" style={styles.flameIcon} />
              <Text style={styles.caloriesText}>{todayPlan?.totalCalories || 1775}</Text>
              <Text style={styles.caloriesUnit}>kcal</Text>
            </View>
          </View>
        </View>

        {/* 7-Day Plan Trigger Button */}
        <TouchableOpacity
          onPress={() => setIsModalOpen(true)}
          style={styles.actionButton}
        >
          <Text style={styles.actionButtonText}>View Complete 7-Day Diet Plan</Text>
        </TouchableOpacity>

        {/* Daily Targets */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>Daily Targets</Text>
          </View>

          <View style={styles.targetsGrid}>
            {dietPlan.dailyTargets?.map((target, idx) => {
              const icon = getTargetIcon(target.name);
              const color = getTargetColor(target.name);
              return (
                <View key={idx} style={styles.targetCard}>
                  <View style={[styles.targetIconWrapper, { backgroundColor: color.bg }]}>
                    <Ionicons name={icon as any} size={18} color={color.text} />
                  </View>
                  <View style={styles.targetInfo}>
                    <Text style={styles.targetName}>{target.name}</Text>
                    <Text style={styles.targetValue}>{target.value}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Foods to Avoid */}
        <AvoidFoodCard foods={dietPlan.foodsToAvoid} />

      </ScrollView>

      {/* 7-Day Plan Modal overlay */}
      <FullDietModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dietData={dietPlan.dietData}
      />
    </View>
  );
};

function getTargetIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'water':
      return 'water';
    case 'walking':
      return 'compass';
    case 'yoga':
      return 'fitness';
    case 'sleep':
      return 'moon';
    default:
      return 'pulse';
  }
}

function getTargetColor(name: string) {
  switch (name.toLowerCase()) {
    case 'water':
      return { bg: '#EBF8FF', text: '#3182CE' };
    case 'walking':
      return { bg: '#FEFCBF', text: '#B7791F' };
    case 'yoga':
      return { bg: '#EBF4FF', text: '#5A67D8' };
    case 'sleep':
      return { bg: '#E2E8F0', text: '#4A5568' };
    default:
      return { bg: '#EDF2F7', text: '#4A5568' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8F55FF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  descriptionText: {
    fontSize: 12,
    color: '#718096',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE5FC',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    textAlign: 'center',
    overflow: 'hidden',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3EEFD',
    paddingBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5CA8',
  },
  sectionBar: {
    width: 4,
    height: 16,
    backgroundColor: '#8F55FF',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  dayBadge: {
    backgroundColor: '#F3EEFD',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8F55FF',
    textTransform: 'uppercase',
  },
  mealsList: {
    gap: 10,
  },
  caloriesSummary: {
    backgroundColor: '#FAF7FF',
    borderWidth: 1,
    borderColor: '#EFE5FC',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A5568',
    marginTop: 2,
  },
  caloriesValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE5EC',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  flameIcon: {
    marginRight: 4,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5CA8',
  },
  caloriesUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0AEC0',
    marginLeft: 2,
  },
  actionButton: {
    backgroundColor: '#8F55FF',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8F55FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  targetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  targetCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EAF8',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  targetIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    fontSize: 8,
    fontWeight: '700',
    color: '#A0AEC0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  targetValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    marginTop: 1,
  },
});

export default DietScreen;
