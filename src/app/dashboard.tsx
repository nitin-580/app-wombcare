import {
    ScrollView,
    View,
    StyleSheet,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  import DashboardHeader
  from "./components/dashboard/DashboardHeader";
  
  import HealthScoreCard
  from "./components/dashboard/HealthScoreCard";
  
  import QuickActionCard
  from "./components/dashboard/QuickActionCard";
  
  import InsightCard
  from "./components/dashboard/InsightsCard";
  
  import SectionTitle
  from "./components/dashboard/SectionTitle";

  import WellnessStatsCards from "./components/dashboard/ToggleButton";

  import EnergyLevelsCard from "./components/dashboard/EnergyGraphs";

  import UpcomingClassCard from "./components/dashboard/UpcomingClasses";

  import AIHealthAssistantCard from "./components/dashboard/ChatSection";

  import TutorialVideosSection from "./components/dashboard/VideoTutorial";
  
  export default function Dashboard() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
  
          <DashboardHeader />
  
          <HealthScoreCard />

          <WellnessStatsCards />

          <EnergyLevelsCard />

          <UpcomingClassCard />

          <TutorialVideosSection />

          <AIHealthAssistantCard />
  
          <SectionTitle title="Today's Insights" />
  
          <InsightCard
            title="Hydration Reminder 💧"
            text="Drink at least 2L water today for better hormonal balance."
          />
  
          <InsightCard
            title="AI Recommendation ✨"
            text="A 20 minute walk today may help reduce stress levels."
          />
  
        </ScrollView>
  
      </SafeAreaView>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#FAFAFA",
      paddingHorizontal: 20,
    },
  
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 18,
    },
  
  });