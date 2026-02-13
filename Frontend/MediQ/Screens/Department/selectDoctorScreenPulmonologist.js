import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const doctors = [
  {
    id: "1",
    name: "Dr. Dinesh Shah",
    specialty: "Pulmonologist",
    rating: 4.5,
    reviews: 134,
    experience: "12 years",
    available: "Today, 3:00 PM",
    initials: "DS",
  },
  {
    id: "2",
    name: "Dr. Ram Prasad",
    specialty: "Pulmonologist",
    rating: 4.7,
    reviews: 201,
    experience: "18 years",
    available: "Today, 4:30 PM",
    initials: "RP",
  },
  {
    id: "3",
    name: "Dr. Emily Williams",
    specialty: "Pulmonologist",
    rating: 4.7,
    reviews: 142,
    experience: "12 years",
    available: "Tomorrow, 10:00 AM",
    initials: "EW",
  },
  {
    id: "4",
    name: "Dr. James Anderson",
    specialty: "Pulmonologist",
    rating: 4.6,
    reviews: 98,
    experience: "10 years",
    available: "Tomorrow, 3:00 PM",
    initials: "JA",
  },
];

export default function SelectDoctorScreen({ navigation }) {
  const renderDoctor = ({ item }) => (
    <View style={styles.card}>

      {/* Doctor Info */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.initials}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={styles.rating}>
              {item.rating} ({item.reviews})
            </Text>
            <Text style={styles.experience}>{item.experience}</Text>
          </View>
        </View>
      </View>

      {/* Availability */}
      <View style={styles.availability}>
        <Ionicons name="time-outline" size={16} color="#0f766e" />
        <Text style={styles.availableText}>Next Available</Text>
        <Text style={styles.time}>{item.available}</Text>
      </View>

      {/* FULL WIDTH BUTTON */}
      <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate("conformPatient", { doctor: item })}>
        <Text style={styles.bookText}>Book Appointment</Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text style={styles.headerTitle}>Select Doctor</Text>
          <Text style={styles.headerSub}>Cardiology Department</Text>
        </View>
      </View>

      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    paddingHorizontal: 16,
    marginTop: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  headerSub: {
    color: "gray",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fbfdff",
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#0f766e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  specialty: {
    color: "gray",
    marginVertical: 2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  rating: {
    marginLeft: 4,
  },

  experience: {
    marginLeft: 10,
    color: "gray",
  },

  availability: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f4f1",
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
  },

  availableText: {
    marginLeft: 6,
    color: "#0f766e",
    flex: 1,
  },

  time: {
    color: "#0f766e",
    fontWeight: "600",
  },

  bookBtn: {
    width: "100%",
    backgroundColor: "#0f766e",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 14,
  },

  bookText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
