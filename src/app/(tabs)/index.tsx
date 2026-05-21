import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
  } from "react-native";
  
  import Dashboard from "../dashboard";
  
  import FooterBrandCard
  from "../components/common/FooterBrandCard";
  
  export default function Page() {
  
    return (
  
      <SafeAreaView style={styles.container}>
  
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
  
          {/* DASHBOARD */}
  
          <Dashboard />
  
          {/* FOOTER */}
  
          <FooterBrandCard
            hashtag="#goWombCare"
            title1="🌸 Built for Women"
            title2="💜 Powered by Wellness AI"
          />
  
        </ScrollView>
  
      </SafeAreaView>
  
    );
  }
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: "#F8F8FC",
    },
  
  });