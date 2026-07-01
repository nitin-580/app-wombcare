import React, { useState } from "react";

import { useFonts } from "expo-font";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useResponsive } from "../../../utils/responsive";

export default function LoginScreen() {
  const { responsiveContainerStyle } = useResponsive();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hidePassword,
    setHidePassword] =
    useState(true);

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async () => {

    try {

      setIsLoading(true);

      setError("");

      const response = await fetch(

        "https://womb-care-backend-76858014616.europe-west1.run.app/api/doctors/login",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            email,

            password,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      if (!data.success) {

        setError(

          data.message ||

          "Invalid email or password"
        );

        return;
      }

      /* SAVE TOKEN */

      await AsyncStorage.setItem(

        "userToken",

        data.token
      );

      /* SAVE USER */

      await AsyncStorage.setItem(

        "userData",

        JSON.stringify(data.doctor)
      );

      /* SAVE ROLE */

      await AsyncStorage.setItem(

        "userRole",

        data.role || "user"
      );

      /* NAVIGATE */

      if (data.role === "doctor") {
        router.replace("/doctor");
      } else {
        const userId = data.doctor?.id || data.doctor?._id;
        if (!userId) {
          router.replace("/(tabs)");
          return;
        }

        try {
          // Check profile complete state from the live backend database
          const profileResp = await fetch(
            `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            }
          );
          const profileData = await profileResp.json();
          console.log("PROFILE CHECK RESPONSE:", profileData);

          if (profileData.success && profileData.data && profileData.data.profileCompleted === true) {
            router.replace("/(tabs)");
          } else {
            router.replace("/personalForm");
          }
        } catch (profileErr) {
          console.log("PROFILE COMPLETION CHECK ERROR:", profileErr);
          // Fall back to local check if api fails
          if (data.doctor && data.doctor.profileCompleted === true) {
            router.replace("/(tabs)");
          } else {
            router.replace("/personalForm");
          }
        }
      }

    } catch (err) {

      console.log(err);

      setError(
        "Backend connection failed"
      );

    } finally {

      setIsLoading(false);
    }
  };

  return (

    <SafeAreaView style={styles.container}>

      {/* Glowing Brand Aesthetic Circles */}
      <View style={styles.glowingBlobPink} />
      <View style={styles.glowingBlobPurple} />

      <KeyboardAvoidingView

        style={{ flex: 1 }}

        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView

          showsVerticalScrollIndicator={false}

          contentContainerStyle={{
            flexGrow: 1,
          }}
        >

          {/* TOP */}

          {/* CARD */}

          <View style={[styles.card, responsiveContainerStyle]}>

            {/* TABS */}

            <View style={styles.tabsContainer}>

              <TouchableOpacity
                style={styles.activeTab}
              >
                <Text style={styles.activeTabText}>
                  Log in
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(auth)/signup")
                }
              >
                <Text style={styles.inactiveTabText}>
                  Sign up
                </Text>
              </TouchableOpacity>

            </View>

            <View style={styles.topSection}>

            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.logo}>
              WombCare
            </Text>

          </View>


            {/* EMAIL */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Your Email
              </Text>

              <TextInput

                placeholder="example@gmail.com"

                placeholderTextColor="#999"

                style={styles.input}

                value={email}

                onChangeText={setEmail}

                autoCapitalize="none"

                keyboardType="email-address"
              />

            </View>

            {/* PASSWORD */}

            <View style={styles.inputContainer}>

              <Text style={styles.label}>
                Password
              </Text>

              <View style={styles.passwordContainer}>

                <TextInput

                  placeholder="••••••••"

                  placeholderTextColor="#999"

                  secureTextEntry={
                    hidePassword
                  }

                  style={styles.passwordInput}

                  value={password}

                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  onPress={() =>
                    setHidePassword(
                      !hidePassword
                    )
                  }
                >

                  <Ionicons
                    name={
                      hidePassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={22}
                    color="#999"
                  />

                </TouchableOpacity>

              </View>

            </View>

            {/* ERROR */}

            {error ? (

              <Text style={styles.error}>
                {error}
              </Text>

            ) : null}

            {/* FORGOT */}

            <TouchableOpacity

              onPress={() =>
                router.push(
                  "/(auth)/forgot-password"
                )
              }
            >

              <Text style={styles.forgotPassword}>
                Forgot password?
              </Text>

            </TouchableOpacity>

            {/* BUTTON */}

            <TouchableOpacity

              style={styles.button}

              onPress={handleLogin}

              disabled={isLoading}
            >

              {isLoading ? (

                <ActivityIndicator
                  color="white"
                />

              ) : (

                <Text style={styles.buttonText}>
                  Continue
                </Text>

              )}

            </TouchableOpacity>

            {/* FOOTER */}

            <TouchableOpacity

              onPress={() =>
                router.push("/(auth)/signup")
              }
            >

              <Text style={styles.footerText}>

                Don’t have an account?

                <Text style={styles.signupText}>
                  {" "}Sign up
                </Text>

              </Text>

            </TouchableOpacity>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F4FF",
    overflow: "hidden",
  },
  glowingBlobPink: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#FFE5EF",
    opacity: 0.6,
  },
  glowingBlobPurple: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#EEE9FF",
    opacity: 0.6,
  },

  topSection: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },

  logoImage: {
    width: 70,
    height: 70,
    marginBottom: 4,
  },

  logo: {
    fontSize: 14,
    color: "#7C5CFF",
    fontFamily: "PoppinsRegular",
  },

  tagline: {
    marginTop: 2,
    color: "#A0A0A0",
    fontSize: 11,
    fontFamily: "PoppinsRegular",
  },

  card: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 30,
    marginTop: 8,
  },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 45,
    marginBottom: 38,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#7C5CFF",
    paddingBottom: 8,
    minWidth: 90,
    alignItems: "center",
  },

  activeTabText: {
    fontSize: 17,
    color: "#7C5CFF",
    fontFamily: "PoppinsBold",
  },

  inactiveTabText: {
    fontSize: 17,
    color: "#D2D2D2",
    fontFamily: "PoppinsBold",
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    marginBottom: 10,
    color: "#222",
    fontFamily: "PoppinsSemiBold",
  },

  input: {
    height: 58,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 15,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsRegular",
    color: "#333",
  },

  passwordContainer: {
    height: 58,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontFamily: "PoppinsRegular",
  },

  forgotPassword: {
    textAlign: "right",
    color: "#7C5CFF",
    marginTop: 2,
    marginBottom: 24,
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },

  error: {
    color: "#FF6B6B",
    marginBottom: 10,
    fontSize: 13,
    textAlign: "center",
    fontFamily: "PoppinsMedium",
  },

  button: {
    height: 58,
    backgroundColor: "#7C5CFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
  },

  footerText: {
    marginTop: 36,
    textAlign: "center",
    color: "#9A9A9A",
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },

  signupText: {
    color: "#7C5CFF",
    fontFamily: "PoppinsSemiBold",
  },

});