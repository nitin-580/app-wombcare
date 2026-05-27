// src/app/doctor/patient-details.tsx

import {
    ScrollView,
    View,
    Text,
  } from "react-native";
  
  export default function PatientDetails() {
    return (
      <ScrollView className="flex-1 bg-[#FFF7FA] px-5 pt-16">
        <Text className="text-3xl font-bold text-[#1F2937]">
          Priya Sharma
        </Text>
  
        <Text className="text-pink-500 mt-2 text-lg">
          Cycle Day 14
        </Text>
  
        <View className="bg-white rounded-3xl p-5 mt-6">
          <Text className="text-lg font-semibold">
            AI Insights
          </Text>
  
          <Text className="text-gray-600 mt-3">
            • Possible PCOS risk
          </Text>
  
          <Text className="text-gray-600 mt-2">
            • High stress indicators
          </Text>
        </View>
  
        <View className="bg-white rounded-3xl p-5 mt-5">
          <Text className="text-lg font-semibold">
            Symptoms History
          </Text>
  
          <Text className="text-gray-600 mt-3">
            • Acne
          </Text>
  
          <Text className="text-gray-600 mt-2">
            • Bloating
          </Text>
  
          <Text className="text-gray-600 mt-2">
            • Irregular cycle
          </Text>
        </View>
  
        <View className="bg-white rounded-3xl p-5 mt-5 mb-10">
          <Text className="text-lg font-semibold">
            Reports
          </Text>
  
          <Text className="text-gray-600 mt-3">
            • CBC Report
          </Text>
  
          <Text className="text-gray-600 mt-2">
            • Hormonal Panel
          </Text>
        </View>
      </ScrollView>
    );
  }