import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as WebBrowser from "expo-web-browser";
import MedicalDisclaimerModal from "./components/common/MedicalDisclaimerModal";
import { useResponsive } from "../utils/responsive";

export default function EntryScreen() {
  const { width, height } = useWindowDimensions();
  const { isTablet, responsiveContainerStyle } = useResponsive();
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const checkSessionAndDisclaimer = async () => {
    try {
      const accepted = await AsyncStorage.getItem("disclaimerAccepted");
      if (accepted !== "true") {
        setShowDisclaimer(true);
        setIsCheckingSession(false);
        return;
      }

      const token = await AsyncStorage.getItem("userToken");
      const role = await AsyncStorage.getItem("userRole");
      const userDataStr = await AsyncStorage.getItem("userData");

      if (token && role) {
        if (role === "doctor") {
          router.replace("/doctor");
          return;
        } else {
          let isProfileCompleted = false;
          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr);
              const userId = userData.id || userData._id;
              
              // Fetch fresh profile state to check onboarding gating status
              const profileResp = await fetch(
                `https://womb-care-backend-76858014616.europe-west1.run.app/api/profiles/${userId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const profileData = await profileResp.json();
              if (profileData.success && profileData.data) {
                isProfileCompleted = profileData.data.profileCompleted === true;
              } else {
                isProfileCompleted = userData.profileCompleted === true;
              }
            } catch (e) {
              try {
                const userData = JSON.parse(userDataStr);
                isProfileCompleted = userData.profileCompleted === true;
              } catch (_) {}
            }
          }
          
          if (isProfileCompleted) {
            router.replace("/(tabs)");
          } else {
            router.replace("/personalForm");
          }
          return;
        }
      }
    } catch (err) {
      console.error("Auto-login session retrieval error:", err);
    } finally {
      setIsCheckingSession(false);
    }
  };

  useEffect(() => {
    if (fontsLoaded) {
      checkSessionAndDisclaimer();
    }
  }, [fontsLoaded]);

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    setIsCheckingSession(true);
    checkSessionAndDisclaimer();
  };

  if (!fontsLoaded || isCheckingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C5CFF" />
        <Text style={styles.loadingText}>Initializing WombCare...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: height * (isTablet ? 0.05 : 0.12), paddingBottom: height * (isTablet ? 0.03 : 0.05) }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Glowing Brand Aesthetic Circles */}
      <View style={styles.glowingBlobPink} />
      <View style={styles.glowingBlobPurple} />

      {/* Header Branding */}
      <View style={[styles.brandingSection, responsiveContainerStyle]}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.brandTitle}>wombcare</Text>
        <Text style={styles.brandSubtitle}>{"India's most trusted PCOD care platform"}</Text>
      </View>

      {/* Premium Visual Banner */}
      <View style={[styles.heroSection, responsiveContainerStyle]}>
        <View style={styles.glassCard}>
          <Ionicons name="heart-circle-outline" size={32} color="#7C5CFF" />
          <Text style={styles.heroText}>Hormonal Balance & Period Wellness</Text>
          <Text style={styles.heroSubText}>
            Personalized lifestyle management, nutrition guidance, and AI health coaching designed for your body.
          </Text>
        </View>
      </View>

      {/* Footer & Get Started button */}
      <View style={[styles.footerSection, responsiveContainerStyle]}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          activeOpacity={0.8}
          onPress={() => setIsAgreed(!isAgreed)}
        >
          <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
            {isAgreed && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
          <View style={styles.checkboxLabelContainer}>
            <Text style={styles.checkboxLabel}>
              {"I agree to WombCare's "}
              <Text
                style={styles.hyperlink}
                onPress={() => WebBrowser.openBrowserAsync("https://wombcare.in/terms-and-conditions")}
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.hyperlink}
                onPress={() => WebBrowser.openBrowserAsync("https://wombcare.in/privacy-policy")}
              >
                Privacy Policy
              </Text>.
            </Text>
            <Text style={styles.checkboxSubLabel}>
              I understand that WombCare may process my health information, including menstrual cycle data and wellness information, to provide cycle tracking and personalized wellness features.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.getStartedButton, !isAgreed && styles.getStartedButtonDisabled]}
          onPress={() => {
            if (isAgreed) {
              router.push("/(auth)");
            }
          }}
          disabled={!isAgreed}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="white" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      <MedicalDisclaimerModal visible={showDisclaimer} onAccept={handleDisclaimerAccept} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8F4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 14,
    color: "#7C5CFF",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F4FF",
    justifyContent: "space-between",
    paddingHorizontal: 24,
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
  brandingSection: {
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    width: 86,
    height: 86,
    borderRadius: 30,
    backgroundColor: "#FFE5EF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4D8D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  brandTitle: {
    fontSize: 32,
    color: "#111",
    fontFamily: "PoppinsBold",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: "#666",
    fontFamily: "PoppinsMedium",
    marginTop: 4,
    textAlign: "center",
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  glassCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2D9F3",
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  heroText: {
    fontSize: 16,
    color: "#111",
    fontFamily: "PoppinsSemiBold",
    marginTop: 12,
    textAlign: "center",
  },
  heroSubText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "PoppinsRegular",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 18,
  },
  footerSection: {
    alignItems: "center",
    width: "100%",
  },
  getStartedButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 20,
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  getStartedButtonDisabled: {
    backgroundColor: "#E2E8F0",
    shadowOpacity: 0,
    elevation: 0,
  },
  getStartedText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
  },
  arrowIcon: {
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 4,
    width: "100%",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: "#7C5CFF",
    backgroundColor: "#7C5CFF",
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 12,
    color: "#2D3748",
    fontFamily: "PoppinsSemiBold",
    lineHeight: 18,
  },
  hyperlink: {
    color: "#7C5CFF",
    textDecorationLine: "underline",
  },
  checkboxSubLabel: {
    fontSize: 10,
    color: "#718096",
    fontFamily: "PoppinsRegular",
    lineHeight: 15,
    marginTop: 4,
  },
});