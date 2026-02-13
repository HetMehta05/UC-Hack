import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function DepartmentScreen({ navigation }) {

  const departments = [
    { name: "Cardiology", icon: "heart", screen: "cardio" },
    { name: "Neurology", icon: "brain", screen: "neuro" },
    { name: "Orthopedics", icon: "bone", screen: "ortho" },
    { name: "Dental", icon: "tooth", screen: "dentist" },
    { name: "Pulmonology", icon: "lungs", screen: "pulmono" },
    { name: "ENT", icon: "ears", screen: "ent" },
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.logo}>MediQ</Text>
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcome}>WELCOME BACK!</Text>
      <Text style={styles.subtitle}>
        Choose a department to continue
      </Text>

      {/* Department Buttons */}
      <View style={{ marginTop: 20 }}>
        {departments.map((dept, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(dept.screen)} // navigate to the screen
          >

            <MaterialCommunityIcons
              name={dept.icon}
              size={26}
              color="#ff7a00"
            />

            <Text style={styles.cardText}>{dept.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomItem}>
          <Ionicons name="analytics" size={24} color="white" />
          <Text style={styles.bottomText}>Spend Analytics</Text>
        </View>

        <View style={styles.qrButton}>
          <Ionicons name="qr-code" size={30} color="#1e3a8a" />
        </View>

        <View style={styles.bottomItem}>
          <Ionicons name="person" size={24} color="white" />
          <Text style={styles.bottomText}>Account</Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7fb",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
  },

  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e3a8a",
    marginTop: 20,
  },

  subtitle: {
    color: "gray",
    marginTop: 5,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a7d3e8",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    gap: 15,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#1e3a8a",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  bottomItem: {
    alignItems: "center",
  },

  bottomText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },

  qrButton: {
    backgroundColor: "white",
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    elevation: 5,
  },
});
