// src/app/doctor/components/ReferralForm.tsx

import {
    View,
    Text,
    TextInput,
    Pressable,
  } from "react-native";
  
  export default function ReferralForm() {
    return (
      <View className="bg-white rounded-3xl p-5">
        <Text className="text-xl font-semibold">
          Quick Referral
        </Text>
  
        <TextInput
          placeholder="Patient Name"
          className="bg-gray-100 p-4 rounded-2xl mt-5"
        />
  
        <TextInput
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          className="bg-gray-100 p-4 rounded-2xl mt-4"
        />
  
        <TextInput
          placeholder="Problem"
          multiline
          className="bg-gray-100 p-4 rounded-2xl mt-4 h-28"
        />
  
        <Pressable className="bg-pink-500 py-4 rounded-2xl mt-5">
          <Text className="text-center text-white font-semibold text-lg">
            Refer Patient
          </Text>
        </Pressable>
      </View>
    );
  }