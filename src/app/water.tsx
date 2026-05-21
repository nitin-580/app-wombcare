import {
    ScrollView,
    StyleSheet,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  import WaterHeader
  from "./components/waterTracker/WaterHeader";
  
  import WaterProgressCard
  from "./components/waterTracker/WaterProgressCard";
  
  import QuickAddWater
  from "./components/waterTracker/QuickAddWater";
  
  import HydrationInsight
  from "./components/waterTracker/HydrationInsight";
  
  import ReminderCard
  from "./components/waterTracker/ReminderCard";
  
  export default function WaterScreen() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
  
          <WaterHeader />
  
          <WaterProgressCard />
  
          <QuickAddWater />
  
          <HydrationInsight />
  
          <ReminderCard />
  
        </ScrollView>
  
      </SafeAreaView>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#F8FDFF",
    },
  
    content: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
  
  });