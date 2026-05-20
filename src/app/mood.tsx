import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
  } from "react-native";
  
  import MoodHeader
  from "./components/moodTracker/MoodHeader";
  
  import MoodSelector
  from "./components/moodTracker/MoodSelector";
  
  import MoodNoteInput
  from "./components/moodTracker/MoodNoteInput";
  
  import StressLevelCard
  from "./components/moodTracker/StressLevelCard";
  
  import SaveMoodButton
  from "./components/moodTracker/SaveMoodButton";
  
  export default function MoodScreen() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
  
          <MoodHeader />
  
          <MoodSelector />
  
          <StressLevelCard />
  
          <MoodNoteInput />
  
          <SaveMoodButton />
  
        </ScrollView>
  
      </SafeAreaView>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#F9FCFF",
    },
  
    content: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
  
  });