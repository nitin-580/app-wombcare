// app/dashboard.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DashboardHeader from "./components/dashboard/DashboardHeader";
import HealthScoreCard from "./components/dashboard/HealthScoreCard";
import WellnessStatsCards from "./components/dashboard/ToggleButton";
import EnergyLevelsCard from "./components/dashboard/EnergyGraphs";
import UpcomingClassCard from "./components/dashboard/UpcomingClasses";
import AIHealthAssistantCard from "./components/dashboard/ChatSection";
import TutorialVideosSection from "./components/dashboard/VideoTutorial";
import SectionTitle from "./components/dashboard/SectionTitle";
import InsightCard from "./components/dashboard/InsightsCard";

export default function Dashboard() {
  const navigation = useNavigation();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [dynamicInsights, setDynamicInsights] = useState<any[]>([
    {
      title: "Hydration Reminder 💧",
      text: "Drink at least 2L water today for better hormonal balance.",
    },
    {
      title: "AI Recommendation ✨",
      text: "A 20 minute walk today may help reduce stress levels.",
    }
  ]);
  
  // Animation Refs
  const bannerAnim = useRef(new Animated.Value(-150)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Fetch live profile to compile dynamic insights
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;

      const parsed = JSON.parse(userData);
      const userId = parsed.id || parsed._id;

      const response = await fetch(
        `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setProfile(data.data);

        // Fetch dynamic AI insights using Llama 3.3
        try {
          const insightsResp = await fetch(
            "https://womb-care-backend-76858014616.europe-west1.run.app/api/ai/insights",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userProfile: data.data,
              }),
            }
          );
          const insightsData = await insightsResp.json();
          if (insightsData.success && Array.isArray(insightsData.insights)) {
            setDynamicInsights(insightsData.insights);
          }
        } catch (aiErr) {
          console.log("AI INSIGHTS API ERROR:", aiErr);
        }
      }
    } catch (err) {
      console.log("DASHBOARD PROFILE FETCH ERROR:", err);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Simulate data fetching on Pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    triggerToast("Updating dashboard metrics... 🌸");
    
    // Fetch profile and classes in parallel
    Promise.all([fetchProfile()])
      .then(() => {
        setRefreshing(false);
        triggerToast("Dashboard up-to-date!");
      })
      .catch(() => {
        setRefreshing(false);
        triggerToast("Dashboard up-to-date!");
      });
  }, []);

  // Automatic refresh when bottom tab is pressed while already on the Dashboard
  useEffect(() => {
    const parentNav = navigation.getParent();
    if (parentNav) {
      const unsubscribe = parentNav.addListener("tabPress", (e: any) => {
        if (navigation.isFocused()) {
          // Trigger automatic refresh!
          setRefreshing(true);
          triggerToast("Auto-refreshing dashboard... 🌸");
          
          fetchProfile().finally(() => {
            setRefreshing(false);
            triggerToast("Dashboard auto-refreshed!");
          });
        }
      });
      return unsubscribe;
    }
  }, [navigation]);

  // Simulate an OTA backend update / schema update check after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUpdateBanner(true);
      Animated.spring(bannerAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 10,
        friction: 5,
      }).start();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);


  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastVisible(false);
    });
  };

  const handleManualRefresh = () => {
    // Dismiss Banner
    Animated.timing(bannerAnim, {
      toValue: -150,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setShowUpdateBanner(false));

    // Perform Pull to refresh style spinner reload
    setRefreshing(true);
    triggerToast("Refreshing app source & metrics... 🌸");
    
    fetchProfile().finally(() => {
      setRefreshing(false);
      triggerToast("App successfully reloaded!");
    });
  };

  return (
    <View style={styles.container}>
      {/* Solid shield for system status bar zone to block scrolling overlap */}
      <SafeAreaView style={{ backgroundColor: "#FAFAFA" }} edges={["top"]} />

      {/* Dynamic Slide-Down Update Banner */}
      {showUpdateBanner && (
        <Animated.View style={[styles.bannerContainer, { transform: [{ translateY: bannerAnim }] }]}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconWrapper}>
              <Ionicons name="sparkles" size={20} color="#FF5CA8" />
            </View>
            <View style={styles.bannerTextWrapper}>
              <Text style={styles.bannerHeading}>✨ Dynamic Updates Live!</Text>
              <Text style={styles.bannerDescription}>
                Realtime classes, referrals, and live chat rooms are ready.
              </Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={handleManualRefresh}>
              <Text style={styles.refreshButtonText}>Refresh App 🌸</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Floating Refresh Status Toast */}
      {toastVisible && (
        <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF5CA8"]}
            tintColor="#FF5CA8"
          />
        }
      >
        <DashboardHeader />

        <HealthScoreCard />

        <WellnessStatsCards />

        <EnergyLevelsCard />

        <UpcomingClassCard refreshing={refreshing} />

        <TutorialVideosSection />

        <AIHealthAssistantCard />

        <SectionTitle title="Today's Insights" />

        {dynamicInsights.map((insight, idx) => (
          <InsightCard
            key={idx}
            title={insight.title}
            text={insight.text}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  bannerContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    elevation: 8,
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#FFE5F1",
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF0F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bannerTextWrapper: {
    flex: 1,
    marginRight: 10,
  },
  bannerHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3748",
  },
  bannerDescription: {
    fontSize: 11,
    color: "#718096",
    marginTop: 2,
  },
  refreshButton: {
    backgroundColor: "#FF5CA8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  refreshButtonText: {
    fontSize: 11,
    color: "white",
    fontWeight: "700",
  },
  toast: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    zIndex: 9999,
    backgroundColor: "rgba(45, 55, 72, 0.95)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  toastText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});