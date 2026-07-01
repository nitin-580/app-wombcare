import React, { useState } from "react";

import { useFonts } from "expo-font";

import { router } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useResponsive } from "../../../utils/responsive";

export default function ForgotPasswordScreen() {
  const { responsiveContainerStyle } = useResponsive();

  const [step, setStep] =
    useState<
      "email" |
      "otp" |
      "reset"
    >("email");

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isLoading,
    setIsLoading] =
    useState(false);

  const [fontsLoaded] = useFonts({

    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),

    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),

    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),

    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),

  });

  if (!fontsLoaded) {
    return null;
  }

  /* ---------------- SEND OTP ---------------- */

  const handleSendOtp = async () => {

    try {

      setError("");

      setIsLoading(true);

      const response = await fetch(

        "https://womb-care-backend-76858014616.europe-west1.run.app/api/auth/forgot-password",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Failed to send OTP"
        );

        return;
      }

      setStep("otp");

    } catch (err: any) {

      setError(
        err.message ||
        "Something went wrong"
      );

    } finally {

      setIsLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */

  const handleVerifyOtp = async () => {

    try {

      setError("");

      setIsLoading(true);

      const response = await fetch(

        "https://womb-care-backend-76858014616.europe-west1.run.app/api/auth/verify-otp",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            email,

            otp,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Invalid OTP"
        );

        return;
      }

      setStep("reset");

    } catch (err: any) {

      setError(
        err.message ||
        "Verification failed"
      );

    } finally {

      setIsLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */

  const handleResetPassword =
    async () => {

    try {

      setError("");

      setSuccess("");

      setIsLoading(true);

      const response = await fetch(

        "https://womb-care-backend-76858014616.europe-west1.run.app/api/auth/reset-password",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            email,

            otp,

            newPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Reset failed"
        );

        return;
      }

      setSuccess(
        "Password updated successfully!"
      );

      setTimeout(() => {

        router.replace("/(auth)");

      }, 1800);

    } catch (err: any) {

      setError(
        err.message ||
        "Password reset failed"
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

          <View style={styles.topSection}>

            <TouchableOpacity

              style={styles.backButton}

              onPress={() =>
                router.back()
              }
            >

              <Ionicons
                name="arrow-back"
                size={22}
                color="#111"
              />

            </TouchableOpacity>

          </View>

          {/* CARD */}

          <View style={[styles.card, responsiveContainerStyle]}>

            <Text style={styles.title}>

              {step === "email"
                ? "Forgot Password?"
                : step === "otp"
                ? "Verify OTP"
                : "Create New Password"}

            </Text>

            <Text style={styles.subtitle}>

              {step === "email"
                ? "Enter your email to receive a secure verification code."
                : step === "otp"
                ? "We’ve sent a 6-digit code to your email."
                : "Create a strong new password for your account."}

            </Text>

            {/* ERROR */}

            {error ? (

              <Text style={styles.error}>
                {error}
              </Text>

            ) : null}

            {/* SUCCESS */}

            {success ? (

              <Text style={styles.success}>
                {success}
              </Text>

            ) : null}

            {/* EMAIL STEP */}

            {step === "email" && (

              <>

                <View style={styles.inputContainer}>

                  <Text style={styles.label}>
                    Email Address
                  </Text>

                  <TextInput

                    placeholder="example@gmail.com"

                    placeholderTextColor="#999"

                    style={styles.input}

                    value={email}

                    onChangeText={setEmail}

                    autoCapitalize="none"
                  />

                </View>

                <TouchableOpacity

                  style={styles.button}

                  onPress={handleSendOtp}
                >

                  {isLoading ? (

                    <ActivityIndicator
                      color="white"
                    />

                  ) : (

                    <Text style={styles.buttonText}>
                      Send OTP
                    </Text>

                  )}

                </TouchableOpacity>

              </>

            )}

            {/* OTP STEP */}

            {step === "otp" && (

              <>

                <View style={styles.inputContainer}>

                  <Text style={styles.label}>
                    6-Digit OTP
                  </Text>

                  <TextInput

                    placeholder="123456"

                    placeholderTextColor="#999"

                    style={styles.input}

                    keyboardType="number-pad"

                    maxLength={6}

                    value={otp}

                    onChangeText={(text) =>
                      setOtp(
                        text.replace(/\\D/g, "")
                      )
                    }
                  />

                </View>

                <TouchableOpacity

                  style={styles.button}

                  onPress={handleVerifyOtp}
                >

                  {isLoading ? (

                    <ActivityIndicator
                      color="white"
                    />

                  ) : (

                    <Text style={styles.buttonText}>
                      Verify OTP
                    </Text>

                  )}

                </TouchableOpacity>

                <TouchableOpacity

                  onPress={handleSendOtp}
                >

                  <Text style={styles.resendText}>
                    Resend OTP
                  </Text>

                </TouchableOpacity>

              </>

            )}

            {/* RESET STEP */}

            {step === "reset" && (

              <>

                <View style={styles.inputContainer}>

                  <Text style={styles.label}>
                    New Password
                  </Text>

                  <TextInput

                    placeholder="••••••••"

                    placeholderTextColor="#999"

                    secureTextEntry

                    style={styles.input}

                    value={newPassword}

                    onChangeText={
                      setNewPassword
                    }
                  />

                </View>

                <TouchableOpacity

                  style={styles.button}

                  onPress={
                    handleResetPassword
                  }
                >

                  {isLoading ? (

                    <ActivityIndicator
                      color="white"
                    />

                  ) : (

                    <Text style={styles.buttonText}>
                      Update Password
                    </Text>

                  )}

                </TouchableOpacity>

              </>

            )}

            {/* FOOTER */}

            <TouchableOpacity

              onPress={() =>
                router.replace(
                  "/(auth)"
                )
              }
            >

              <Text style={styles.footerText}>

                Remember your password?

                <Text style={styles.loginText}>
                  {" "}Sign in
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
    position: "relative",
  },

  backButton: {
    position: "absolute",
    top: 10,
    left: 22,

    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "white",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  logoImage: {
    width: 70,
    height: 70,
    marginBottom: 4,
  },

  logo: {
    fontSize: 22,
    color: "#7C5CFF",
    fontFamily: "PoppinsBold",
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
    paddingTop: 32,
    paddingBottom: 30,
    marginTop: 12,
  },

  title: {
    fontSize: 22,
    color: "#111",
    fontFamily: "PoppinsBold",
  },

  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 22,
    fontFamily: "PoppinsRegular",
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
    height: 56,
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 15,
    backgroundColor: "#FFF",
    fontFamily: "PoppinsRegular",
    color: "#333",
  },

  button: {
    height: 58,
    backgroundColor: "#7C5CFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "PoppinsSemiBold",
  },

  footerText: {
    marginTop: 34,
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },

  loginText: {
    color: "#7C5CFF",
    fontFamily: "PoppinsSemiBold",
  },

  resendText: {
    marginTop: 20,
    textAlign: "center",
    color: "#7C5CFF",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },

  error: {
    color: "#FF6B6B",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },

  success: {
    color: "#1FA971",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },

});