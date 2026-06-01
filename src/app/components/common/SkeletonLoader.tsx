import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SkeletonBoneProps {
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBone({ style }: SkeletonBoneProps) {
  const shimmerOpacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 0.6,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.25,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bone,
        { opacity: shimmerOpacity },
        style,
      ]}
    />
  );
}

interface SkeletonLoaderProps {
  preset: "dashboard" | "classes" | "cycle" | "water" | "mood";
}

export default function SkeletonLoader({ preset }: SkeletonLoaderProps) {
  if (preset === "dashboard") {
    return (
      <View style={styles.container}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <SkeletonBone style={styles.titleBone} />
            <SkeletonBone style={styles.subtitleBone} />
          </View>
          <SkeletonBone style={styles.avatarBone} />
        </View>

        {/* Health Score Card Skeleton */}
        <SkeletonBone style={styles.healthCardBone} />

        {/* Toggle stats skeleton */}
        <View style={styles.toggleRow}>
          <SkeletonBone style={styles.toggleBone} />
          <SkeletonBone style={styles.toggleBone} />
        </View>

        {/* Energy Levels skeleton */}
        <SkeletonBone style={styles.energyGraphBone} />

        {/* Banners skeleton */}
        <SkeletonBone style={styles.bannerSectionBone} />

        {/* Class placeholder skeleton */}
        <SkeletonBone style={styles.upcomingClassCardBone} />
      </View>
    );
  }

  if (preset === "classes") {
    return (
      <View style={styles.container}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonBone style={[styles.titleBone, { width: 140, height: 36 }]} />
        </View>

        {/* Classes switcher tabs */}
        <SkeletonBone style={styles.tabSwitcherBone} />

        {/* Live Card placeholder */}
        <SkeletonBone style={styles.liveClassCardBone} />

        {/* YouTube Video placeholder */}
        <SkeletonBone style={styles.videoPlayerBone} />
      </View>
    );
  }

  if (preset === "cycle") {
    return (
      <View style={styles.container}>
        {/* Calendar Grid Placeholder */}
        <SkeletonBone style={styles.calendarBone} />

        {/* Symptoms grid list placeholder */}
        <View style={styles.symptomsRow}>
          <SkeletonBone style={styles.symptomItemBone} />
          <SkeletonBone style={styles.symptomItemBone} />
          <SkeletonBone style={styles.symptomItemBone} />
        </View>

        {/* Log button skeleton */}
        <SkeletonBone style={styles.logButtonBone} />
      </View>
    );
  }

  if (preset === "water") {
    return (
      <View style={styles.container}>
        {/* Water Jar Circular Placeholder */}
        <View style={styles.circleContainer}>
          <SkeletonBone style={styles.circleBone} />
        </View>

        {/* Tracker button skeleton */}
        <SkeletonBone style={styles.logButtonBone} />
      </View>
    );
  }

  if (preset === "mood") {
    return (
      <View style={styles.container}>
        {/* Mood select grid skeleton */}
        <View style={styles.moodGrid}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonBone key={idx} style={styles.moodItemBone} />
          ))}
        </View>

        {/* Logger tracker skeleton */}
        <SkeletonBone style={styles.logButtonBone} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  bone: {
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  leftSection: {
    flex: 1,
  },
  titleBone: {
    width: 180,
    height: 30,
    borderRadius: 10,
    marginBottom: 8,
  },
  subtitleBone: {
    width: 140,
    height: 16,
    borderRadius: 6,
  },
  avatarBone: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  healthCardBone: {
    width: "100%",
    height: 130,
    borderRadius: 28,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  toggleBone: {
    flex: 1,
    height: 48,
    borderRadius: 16,
  },
  energyGraphBone: {
    width: "100%",
    height: 180,
    borderRadius: 28,
    marginBottom: 20,
  },
  bannerSectionBone: {
    width: "100%",
    height: 160,
    borderRadius: 24,
    marginBottom: 20,
  },
  upcomingClassCardBone: {
    width: "100%",
    height: 110,
    borderRadius: 24,
    marginBottom: 40,
  },

  // Classes presets
  tabSwitcherBone: {
    width: "100%",
    height: 44,
    borderRadius: 16,
    marginBottom: 28,
  },
  liveClassCardBone: {
    width: "100%",
    height: 220,
    borderRadius: 28,
    marginBottom: 24,
  },
  videoPlayerBone: {
    width: "100%",
    height: 180,
    borderRadius: 24,
  },

  // Cycle presets
  calendarBone: {
    width: "100%",
    height: 280,
    borderRadius: 28,
    marginTop: 20,
    marginBottom: 24,
  },
  symptomsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 10,
  },
  symptomItemBone: {
    flex: 1,
    height: 70,
    borderRadius: 16,
  },
  logButtonBone: {
    width: "100%",
    height: 56,
    borderRadius: 20,
    marginTop: 20,
  },

  // Water presets
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  circleBone: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },

  // Mood presets
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
    marginVertical: 30,
  },
  moodItemBone: {
    width: "47%",
    height: 80,
    borderRadius: 18,
  },
});
