import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import { useFonts }
from "expo-font";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

type UserType = {

  name?: string;

  email?: string;

  profileImage?: string;

  isPremium?: boolean;
};

export default function DashboardHeader() {

  /* ---------------- STATE ---------------- */

  const [user, setUser] =
    useState<UserType | null>(null);

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* ---------------- FONTS ---------------- */

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  /* ---------------- LOAD USER ---------------- */

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const uid = parsedUser.id || parsedUser._id;
        if (uid) {
          const storedAvatar = await AsyncStorage.getItem(`profile_avatar_${uid}`);
          if (storedAvatar) {
            setProfileImage(storedAvatar);
          } else if (parsedUser.profileImage) {
            setProfileImage(parsedUser.profileImage);
          }
        }
      }
    } catch (err) {
      console.log("USER LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {

    return (

      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="small"
          color="#FF4D8D"
        />

      </View>
    );
  }

  return (

    <View style={styles.header}>

      {/* LEFT */}

      <View style={styles.leftSection}>

        <View style={styles.row}>

          <Text style={styles.welcome}>

            Hi{" "}

            {user?.name
              ? user.name.split(" ")[0]
              : "User"}

          </Text>

          {user?.isPremium && (

            <View style={styles.premiumBadge}>

              <Text style={styles.premiumText}>
                ✨ Premium
              </Text>

            </View>

          )}

        </View>

        <Text style={styles.name}>
          Here's your health Summary
        </Text>

      </View>

      {/* PROFILE */}

      <TouchableOpacity

        style={styles.profileButton}

        activeOpacity={0.8}

        onPress={() =>
          router.push("/profile")
        }
      >

        {profileImage ? (
          <Image
            source={{
              uri: profileImage,
            }}
            style={styles.profileImage}
          />
        ) : (
          <Ionicons
            name="person"
            size={22}
            color="#111"
          />
        )}

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  loadingContainer: {

    height: 90,

    justifyContent: "center",

    alignItems: "center",
  },

  header: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 10,

    marginBottom: 10,
  },

  leftSection: {
    flex: 1,
  },

  row: {

    flexDirection: "row",

    alignItems: "center",

    flexWrap: "wrap",
  },

  welcome: {

    fontSize: 32,

    color: "#111",

    fontFamily: "PoppinsSemiBold",
  },

  name: {

    fontSize: 16,

    color: "#777",

    marginTop: 2,

    marginBottom: 8,

    fontFamily: "PoppinsRegular",
  },

  premiumBadge: {

    marginLeft: 10,

    backgroundColor: "#FFF3D6",

    paddingHorizontal: 10,

    paddingVertical: 4,

    borderRadius: 999,
  },

  premiumText: {

    fontSize: 11,

    color: "#D89B00",

    fontFamily: "PoppinsBold",
  },

  profileButton: {

    width: 54,

    height: 54,

    borderRadius: 27,

    backgroundColor: "white",

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 10,

    elevation: 4,
  },

  profileImage: {

    width: "100%",

    height: "100%",
  },

});