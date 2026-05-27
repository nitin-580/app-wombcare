// src/app/doctor/components/PatientCard.tsx

import {
    View,
    Text,
    Pressable,
  } from "react-native";
  
  import { router } from "expo-router";
  
  interface Props {
    name: string;
    cycle: string;
    risk: string;
  }
  
  export default function PatientCard({
    name,
    cycle,
    risk,
  }: Props) {
    return (
      <Pressable
        onPress={() =>
          router.push("./doctor/patient-details")
        }
        className="bg-white rounded-3xl p-5 mb-4"
      >
        <Text className="text-lg font-semibold">
          {name}
        </Text>
  
        <Text className="text-pink-500 mt-2">
          {cycle}
        </Text>
  
        <Text className="text-gray-600 mt-2">
          {risk}
        </Text>
      </Pressable>
    );
  }