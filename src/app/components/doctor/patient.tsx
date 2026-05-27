// src/app/doctor/patients.tsx

import {
    ScrollView,
    View,
    Text,
    TextInput,
  } from "react-native";
  
  import DoctorTabs from "./DoctorTabs";
  import PatientCard from "./PatientCard";
  
  export default function PatientsScreen() {
    return (
      <ScrollView className="flex-1 bg-[#FFF7FA] px-5 pt-16">
        <Text className="text-3xl font-bold text-[#1F2937]">
          Patients
        </Text>
  
        <View className="mt-6">
          <DoctorTabs />
        </View>
  
        <TextInput
          placeholder="Search patient..."
          className="bg-white mt-6 p-4 rounded-2xl"
        />
  
        <View className="mt-6">
          <PatientCard
            name="Priya Sharma"
            cycle="Cycle Day 14"
            risk="PCOS Risk"
          />
  
          <PatientCard
            name="Aisha Khan"
            cycle="Cycle Day 6"
            risk="Healthy"
          />
        </View>
      </ScrollView>
    );
  }