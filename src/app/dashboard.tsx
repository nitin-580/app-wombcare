import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
  } from "react-native";
  
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
  
  export default function Dashboard() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
  
          <DashboardHeader />
  
          <HealthScoreCard />
  
          <SectionTitle title="Quick Actions" />
  
          <View style={styles.row}>
  
            <QuickActionCard
              title="Cycle"
              icon="calendar"
              color="#FF4D8D"
            />
  
            <QuickActionCard
              title="Workout"
              icon="fitness"
              color="#7B61FF"
            />
  
          </View>
  
          <View style={styles.row}>
  
            <QuickActionCard
              title="AI Chat"
              icon="chatbubble"
              color="#00B894"
            />
  
            <QuickActionCard
              title="Doctors"
              icon="medkit"
              color="#F39C12"
            />
  
          </View>
  
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