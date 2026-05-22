import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
  } from "react-native";
  
  import ProfileHeader
  from "./components/profile/ProfileHeader";
  
  import ProfileAvatarCard
  from "./components/profile/ProfileAvatarCard";
  
  import ProfileStatsRow
  from "./components/profile/ProfileStatsRow";
  
  import ExpertsSection
  from "./components/profile/ExpertsSection";
  
  import ProfileMenuList
  from "./components/profile/ProfileMenuList";
  
  import LogoutButton
  from "./components/profile/LogoutButton";
  
  export default function ProfileScreen() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 140,
          }}
        >
  
          <ProfileHeader />
  
          <ProfileAvatarCard />
  
          <ProfileStatsRow />
  
          <ExpertsSection />
  
          <ProfileMenuList />
  
          <LogoutButton />
  
        </ScrollView>
  
      </SafeAreaView>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#F7F7FB",
      paddingHorizontal: 20,
    },
  
  });