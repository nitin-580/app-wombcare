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
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function ForgotPasswordScreen() {

  /* ---------------- STATES ---------------- */

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

  /* ---------------- FONTS ---------------- */

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

        "https://womb-care-backend-76858014616.us-central1.run.app/api/auth/forgot-password",

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

      console.log(data);

      if (!response.ok) {

        setError(
          data.message ||
          "Failed to send OTP"
        );

        return;
      }

      setStep("otp");

    } catch (err: any) {

      console.log(err);

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

        "https://womb-care-backend-76858014616.us-central1.run.app/api/auth/verify-otp",

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

      console.log(data);

      if (!response.ok) {

        setError(
          data.message ||
          "Invalid OTP"
        );

        return;
      }

      setStep("reset");

    } catch (err: any) {

      console.log(err);

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

        "https://womb-care-backend-76858014616.us-central1.run.app/api/auth/reset-password",

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

      console.log(data);

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

      console.log(err);

      setError(
        err.message ||
        "Password reset failed"
      );

    } finally {

      setIsLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (

    <SafeAreaView style={styles.container}>

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
                size={24}
                color="#111"
              />

            </TouchableOpacity>

            <Text style={styles.logo}>
              WombCare
            </Text>

          </View>

          {/* CARD */}

          <View style={styles.card}>

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
                        text.replace(/\D/g, "")
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

                    placeholder="********"

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
    backgroundColor: "#F7E8EC",
  },

  topSection: {

    height: 220,

    justifyContent: "center",

    alignItems: "center",

    position: "relative",
  },

  backButton: {

    position: "absolute",

    top: 60,

    left: 24,

    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor: "white",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  logo: {

    fontSize: 40,

    color: "#FF4D8D",

    fontFamily: "PoppinsBold",
  },

  card: {

    flex: 1,

    backgroundColor: "white",

    borderTopLeftRadius: 40,

    borderTopRightRadius: 40,

    paddingHorizontal: 24,

    paddingTop: 36,

    paddingBottom: 40,

    minHeight: 650,
  },

  title: {

    fontSize: 32,

    color: "#111",

    fontFamily: "PoppinsBold",
  },

  subtitle: {

    fontSize: 15,

    color: "#777",

    marginTop: 12,

    marginBottom: 30,

    lineHeight: 24,

    fontFamily: "PoppinsRegular",
  },

  inputContainer: {
    marginBottom: 22,
  },

  label: {

    fontSize: 14,

    marginBottom: 8,

    color: "#555",

    fontFamily: "PoppinsRegular",
  },

  input: {

    height: 58,

    borderWidth: 1,

    borderColor: "#EEE",

    borderRadius: 18,

    paddingHorizontal: 18,

    fontSize: 15,

    backgroundColor: "#FAFAFA",

    fontFamily: "PoppinsRegular",
  },

  button: {

    height: 60,

    backgroundColor: "#111",

    borderRadius: 30,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 10,
  },

  buttonText: {

    color: "white",

    fontSize: 18,

    fontFamily: "PoppinsSemiBold",
  },

  footerText: {

    marginTop: 28,

    textAlign: "center",

    color: "#777",

    fontFamily: "PoppinsRegular",
  },

  loginText: {

    color: "#FF4D8D",

    fontFamily: "PoppinsSemiBold",
  },

  resendText: {

    marginTop: 22,

    textAlign: "center",

    color: "#5B4CF0",

    fontFamily: "PoppinsSemiBold",
  },

  error: {

    color: "#FF4D6D",

    marginBottom: 16,

    textAlign: "center",

    fontFamily: "PoppinsMedium",
  },

  success: {

    color: "#1FA971",

    marginBottom: 16,

    textAlign: "center",

    fontFamily: "PoppinsMedium",
  },

});