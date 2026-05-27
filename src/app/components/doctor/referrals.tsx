// src/app/doctor/referrals.tsx

import {
    ScrollView,
    View,
    Text,
  } from "react-native";
  
  import DoctorTabs from "./DoctorTabs";
  import ReferralForm from "./ReferralForm";
  import ReferralCard from "./ReferralCard";
  
  export default function ReferralsScreen() {
    return (
      <ScrollView className="flex-1 bg-[#FFF7FA] px-5 pt-16">
        <Text className="text-3xl font-bold text-[#1F2937]">
          Referrals
        </Text>
  
        <View className="mt-6">
          <DoctorTabs />
        </View>
  
        <View className="mt-6">
          <ReferralForm />
        </View>
  
        <Text className="text-xl font-semibold mt-8 mb-4">
          Recent Referrals
        </Text>
  
        <ReferralCard
          name="Priya Sharma"
          mobile="+91 9876543210"
          problem="Irregular periods"
        />
  
        <ReferralCard
          name="Aisha Khan"
          mobile="+91 9876543211"
          problem="PCOS symptoms"
        />
      </ScrollView>
    );
  }