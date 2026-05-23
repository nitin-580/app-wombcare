import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useFonts } from "expo-font";

type Props = {

  activeTab: string;

  setActiveTab: (
    tab: string
  ) => void;
};

export default function ClassesTabs({

  activeTab,

  setActiveTab,

}: Props) {

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  return (

    <View style={styles.container}>

      {/* UPCOMING */}

      <TouchableOpacity

        style={[

          styles.tab,

          activeTab === "Upcoming" &&
            styles.activeTab,
        ]}

        onPress={() =>
          setActiveTab("Upcoming")
        }
      >

        <Text
          style={[

            styles.tabText,

            activeTab === "Upcoming" &&
              styles.activeTabText,
          ]}
        >

          Upcoming

        </Text>

      </TouchableOpacity>

      {/* COMPLETED */}

      <TouchableOpacity

        style={[

          styles.tab,

          activeTab === "Completed" &&
            styles.activeTab,
        ]}

        onPress={() =>
          setActiveTab("Completed")
        }
      >

        <Text
          style={[

            styles.tabText,

            activeTab === "Completed" &&
              styles.activeTabText,
          ]}
        >

          Completed

        </Text>

      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {

    backgroundColor: "#ECE8FA",

    borderRadius: 22,

    padding: 6,

    flexDirection: "row",

    marginBottom: 34,
  },

  tab: {

    flex: 1,

    height: 54,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "white",
  },

  tabText: {

    fontSize: 16,

    color: "#666",

    fontFamily: "PoppinsMedium",
  },

  activeTabText: {

    color: "#5B4CF0",

    fontFamily: "PoppinsSemiBold",
  },

});