import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useFonts } from "expo-font";

type Props = {
  hashtag?: string;
  title1?: string;
  title3?:string;
  title2?: string;
};

export default function FooterBrandCard({

  hashtag = "#goWombCare",

  title1 = "🌸 Built for Women",

  title3 = "Made with love in 🇮🇳",

  title2 = "💜 Powered by Wellness AI",

}: Props) {

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

    PoppinsExtraBold: require("../../../assets/fonts/Poppins-ExtraBold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  return (

    <View style={styles.card}>

      {/* BACKGROUND ELEMENTS */}

      <View style={styles.bgCircle1} />

      <View style={styles.bgCircle2} />

      <View style={styles.bgLine1} />

      <View style={styles.bgLine2} />

      <View style={styles.bgSmallCircle} />

      {/* CONTENT */}

      <View style={styles.content}>

        <Text style={styles.hashtag}>
          {hashtag}
        </Text>

        <View style={styles.textSection}>

          <Text style={styles.footerText}>
            {title1}
          </Text>

          <Text style={styles.footerText}>
            {title3}
          </Text>

          <Text style={styles.footerText}>
            {title2}
          </Text>

        </View>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  card: {

    height: 320,

    borderRadius: 34,

    overflow: "hidden",

    justifyContent: "flex-end",

    marginBottom: 40,

    backgroundColor: "#F8F7FC",

    position: "relative",
  },

  /* BACKGROUND DESIGN */

  bgCircle1: {

    position: "absolute",

    width: 260,
    height: 260,

    borderRadius: 130,

    borderWidth: 1.5,
    borderColor: "#E3E0EE",

    top: -80,
    right: -40,
  },

  bgCircle2: {

    position: "absolute",

    width: 180,
    height: 180,

    borderRadius: 90,

    borderWidth: 1,
    borderColor: "#E8E5F2",

    bottom: -40,
    left: -30,
  },

  bgLine1: {

    position: "absolute",

    width: 300,
    height: 300,

    borderRadius: 160,

    borderWidth: 1,
    borderColor: "#ECEAF4",

    top: 70,
    left: 110,

    transform: [
      {
        rotate: "35deg",
      },
    ],
  },

  bgLine2: {

    position: "absolute",

    width: 220,
    height: 220,

    borderRadius: 120,

    borderWidth: 1,
    borderColor: "#EFEAF8",

    bottom: 30,
    right: -60,
  },

  bgSmallCircle: {

    position: "absolute",

    width: 90,
    height: 90,

    borderRadius: 45,

    borderWidth: 1,
    borderColor: "#ECEAF4",

    top: 50,
    left: 30,
  },

  /* CONTENT */

  content: {
    padding: 30,
  },

  hashtag: {

    fontSize: 44,
    lineHeight: 52,

    color: "#B7BDD3",

    marginBottom: 24,

    fontFamily: "PoppinsExtraBold",
  },

  textSection: {
    gap: 10,
  },

  footerText: {

    fontSize: 18,

    color: "#7F879D",

    lineHeight: 28,

    fontFamily: "PoppinsSemiBold",
  },

});