import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useResponsive } from "../../../utils/responsive";

interface MedicalDisclaimerModalProps {
  visible?: boolean;
  onAccept?: () => void;
  forceShow?: boolean; // If true, ignore AsyncStorage and show it anyway (e.g. for viewing from settings)
  onClose?: () => void; // Used when viewing from settings to close the modal
}

export default function MedicalDisclaimerModal({
  visible = false,
  onAccept,
  forceShow = false,
  onClose,
}: MedicalDisclaimerModalProps) {
  const { isTablet, responsiveContainerStyle } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsMedium: require("../../../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../../../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (forceShow) {
      setIsOpen(visible);
      setIsChecked(true); // Pre-check if viewing from settings
      return;
    }

    const checkDisclaimer = async () => {
      try {
        const accepted = await AsyncStorage.getItem("disclaimerAccepted");
        if (accepted !== "true") {
          setIsOpen(true);
        } else {
          setIsOpen(visible); // Fall back to prop
        }
      } catch (err) {
        console.error("Error checking disclaimer acceptance:", err);
        setIsOpen(true); // Safety fallback
      }
    };

    checkDisclaimer();
  }, [visible, forceShow]);

  const handleAccept = async () => {
    if (!isChecked && !forceShow) return;

    try {
      if (!forceShow) {
        await AsyncStorage.setItem("disclaimerAccepted", "true");
      }
      setIsOpen(false);
      if (onAccept) onAccept();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error saving disclaimer acceptance:", err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={forceShow ? handleClose : undefined}
    >
      <View style={styles.modalOverlay}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.safeContainer, isTablet && responsiveContainerStyle]}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-half" size={32} color="#FF5CA8" />
              </View>
              <Text style={styles.title}>Medical Disclaimer & Safety Policy</Text>
              <Text style={styles.subtitle}>Please review carefully before using WombCare</Text>
            </View>

            {/* Content Scroll */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
              <View style={styles.textBlock}>
                <Text style={styles.sectionTitle}>1. Not a Medical Device or Diagnosis Tool</Text>
                <Text style={styles.paragraph}>
                  WombCare is a digital wellness support platform designed to provide lifestyle coaching,
                  nutritional suggestions, and menstrual cycle tracking for women with PCOS/PCOD and general
                  hormonal health goals.
                </Text>
                <Text style={styles.highlightText}>
                  ⚠️ WombCare is NOT a medical device, diagnosis system, or replacement for clinical care. The app
                  does not diagnose conditions, write prescriptions, or determine treatment paths.
                </Text>
              </View>

              <View style={styles.textBlock}>
                <Text style={styles.sectionTitle}>2. Wellness Suggestions Only</Text>
                <Text style={styles.paragraph}>
                  Any insights, daily targets (such as sleep, hydration, or exercise), and guidance from the AI
                  wellness coach are intended solely for general health and educational purposes. They are not
                  clinical recommendations.
                </Text>
              </View>

              <View style={styles.textBlock}>
                <Text style={styles.sectionTitle}>3. Professional Medical Advice</Text>
                <Text style={styles.paragraph}>
                  Never disregard professional medical advice or delay seeking treatment because of information
                  encountered within WombCare. If you experience severe symptoms, severe pain, or irregularities,
                  please consult a qualified healthcare professional immediately.
                </Text>
              </View>

              <View style={styles.textBlock}>
                <Text style={styles.sectionTitle}>4. Consent & Data Management</Text>
                <Text style={styles.paragraph}>
                  We collect your health telemetry (sleep logs, cycle dates, water intake, symptoms) locally and
                  sync it securely to store your cycle charts. You can view, export, or permanently delete this
                  data at any time in your profile settings.
                </Text>
              </View>
            </ScrollView>

            {/* Checkbox Agreement (only if not viewing from settings) */}
            {!forceShow ? (
              <TouchableOpacity
                style={styles.checkboxContainer}
                activeOpacity={0.8}
                onPress={() => setIsChecked(!isChecked)}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I understand and accept that WombCare does not replace medical advice or clinical care.
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              {forceShow ? (
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Text style={styles.closeButtonText}>Close Disclaimer</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.acceptButton, !isChecked && styles.acceptButtonDisabled]}
                  onPress={handleAccept}
                  disabled={!isChecked}
                >
                  <Text style={styles.acceptButtonText}>I Accept & Continue</Text>
                  <Ionicons name="arrow-forward" size={16} color="white" style={styles.arrow} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  safeContainer: {
    width: "90%",
    height: "82%",
    backgroundColor: "white",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#FFF0F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: "#2D3748",
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#718096",
    fontFamily: "PoppinsMedium",
    marginTop: 4,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FFFBFD",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFEBF2",
  },
  textBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#2D3748",
    fontFamily: "PoppinsSemiBold",
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 12,
    color: "#4A5568",
    fontFamily: "PoppinsRegular",
    lineHeight: 18,
  },
  highlightText: {
    fontSize: 11,
    color: "#D53F8C",
    backgroundColor: "#FFF0F6",
    padding: 10,
    borderRadius: 10,
    fontFamily: "PoppinsMedium",
    lineHeight: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FBB6CE",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: "#FF5CA8",
    backgroundColor: "#FF5CA8",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: "#4A5568",
    fontFamily: "PoppinsMedium",
    lineHeight: 16,
  },
  buttonRow: {
    width: "100%",
  },
  acceptButton: {
    height: 54,
    backgroundColor: "#FF5CA8",
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF5CA8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  acceptButtonDisabled: {
    backgroundColor: "#E2E8F0",
    shadowOpacity: 0,
    elevation: 0,
  },
  acceptButtonText: {
    color: "white",
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
  },
  closeButton: {
    height: 50,
    backgroundColor: "#E2E8F0",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#4A5568",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
  },
  arrow: {
    marginLeft: 6,
  },
});
