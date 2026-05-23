import {
    ScrollView,
    StyleSheet,
    View,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  import CycleTopHeader
  from "./components/cycleTracker/CycleTopHeader";
  
  import DateSelector
  from "./components/cycleTracker/DateSelector";
  
  import CycleRingCard
  from "./components/cycleTracker/CycleRingCard";
  
  import LegendRow
  from "./components/cycleTracker/LegendRow";
  
  import LogPeriodButton
  from "./components/cycleTracker/LogPeriodButton";
  
  import InsightInfoCard
  from "./components/cycleTracker/InsightsInfoCard";

  import CycleLengthCard from "./components/cycleTracker/UpcomingPeriod";

  import PeriodTrackerCalendarCard from "./components/cycleTracker/CalenderCard";

  
  export default function CycleScreen() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        {/* TOP BACKGROUND */}
  
        <View style={styles.topBackground} />
  
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <PeriodTrackerCalendarCard />

          <CycleLengthCard />
          
  
          {/* DATE SELECTOR */}
  
          {/* LEGEND */}
  
          <LegendRow />
  
          {/* BUTTON */}
  
          <LogPeriodButton />
  
          {/* INSIGHT CARDS */}
  
        </ScrollView>
  
      </SafeAreaView>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#F8FEFF",
    },
  
    topBackground: {
      position: "absolute",
      top: 0,
  
      width: "100%",
      height: 430,
  
      backgroundColor: "#E9F8FF",
  
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
  
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 50,
    },
  
    cardsContainer: {
      marginTop: 10,
    },
  
  });