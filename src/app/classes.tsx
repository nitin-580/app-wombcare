import {
    ScrollView,
    StyleSheet,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  import ClassesHeader
  from "./components/classes/ClassesHeader";
  
  import UpcomingClassCard
  from "./components/classes/UpcomingClassCard";
  
  import LiveClassCard
  from "./components/classes/LiveClassCard";
  
  import ChatBubble
  from "./components/classes/ChatBubble";
  
  import ChatInput
  from "./components/classes/ChatInput";
  
  export default function ClassesScreen() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
  
          <ClassesHeader />
  
          <UpcomingClassCard />
  
          <LiveClassCard />
  
          <ChatBubble
            sender="Dr. Sarah"
            message="Welcome everyone 💕"
          />
  
          <ChatBubble
            sender="Ananya"
            message="Excited for today’s yoga class!"
          />
  
          <ChatBubble
            sender="Priya"
            message="Can this help with stress reduction?"
          />
  
          <ChatInput />
  
        </ScrollView>
  
      </SafeAreaView>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#F8FAFC",
    },
  
    content: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
  
  });