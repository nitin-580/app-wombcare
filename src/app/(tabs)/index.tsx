import {
  ScrollView,
  StyleSheet,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

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