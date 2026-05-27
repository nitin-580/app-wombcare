// src/app/doctor/components/DoctorTabs.tsx

import { View, Text, Pressable } from "react-native";
import { router, usePathname } from "expo-router";

export default function DoctorTabs() {
  const pathname = usePathname();

  return (
    <View className="flex-row bg-pink-100 p-1 rounded-full">
      <Pressable
        onPress={() => router.push("./doctor/referrals")}
        className={`flex-1 py-3 rounded-full ${
          pathname.includes("referrals")
            ? "bg-pink-500"
            : ""
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            pathname.includes("referrals")
              ? "text-white"
              : "text-gray-600"
          }`}
        >
          Referrals
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("./doctor/patient")}
        className={`flex-1 py-3 rounded-full ${
          pathname.includes("patients")
            ? "bg-pink-500"
            : ""
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            pathname.includes("patients")
              ? "text-white"
              : "text-gray-600"
          }`}
        >
          Patients
        </Text>
      </Pressable>
    </View>
  );
}