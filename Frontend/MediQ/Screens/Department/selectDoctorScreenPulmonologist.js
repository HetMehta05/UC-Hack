import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const BASE_URL = "http://10.241.63.8:8000";

// Generate initials from doctor name
const getInitials = (name = "") => {
  const parts = name.replace(/^Dr\.?\s*/i, "").split(" ");
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
};

export default function PulmonologyDoctorsScreen({ navigation }) {

  const department = "Pulmonology";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${BASE_URL}/api/queues/doctors/?department=${encodeURIComponent(department)}`
      );

      setDoctors(res.data);

    } catch (err) {
      console.log("Fetch doctors error:", err.response?.data || err.message);
      setError("Could not load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const renderDoctor = ({ item }) => (
    <View style={styles.card}>

      {/* Doctor Info */}
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(item.name)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialty}>{department}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.rating}>4.8</Text>
            <Text style={styles.reviews}>(120 reviews)</Text>
            <View style={styles.dot} />
            <Text style={styles.experience}>10+ years</Text>
          </View>
        </View>
      </View>

      {/* Availability */}
      <View style={styles.availability}>
        <Ionicons name="time-outline" size={15} color="#0f766e" />
        <Text style={styles.availableText}>Next Available</Text>
        <Text style={styles.time}>Today</Text>
      </View>

      {/* Book Button */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() =>
          navigation.navigate("conformPatient", {
            doctorId: item.id,
            doctorName: item.name,
            department: department,
          })
        }
      >
        <Ionicons name="calendar-outline" size={16} color="white" />
        <Text style={styles.bookText}>Book Appointment</Text>
      </TouchableOpacity>

    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0f766e" />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#0f766e" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Select Doctor</Text>
          <Text style={styles.headerSub}>
            {department} Department
          </Text>
        </View>
      </View>

      <FlatList
        data={doctors}
        renderItem={renderDoctor}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    marginVertical: 16,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0f766e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
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
    color: "#0f766e",
    fontSize: 13,
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  rating: {
    fontSize: 13,
    fontWeight: "600",
  },

  reviews: {
    fontSize: 12,
    color: "gray",
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 2,
  },

  experience: {
    fontSize: 12,
    color: "gray",
  },

  availability: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f4f1",
    padding: 10,
    borderRadius: 12,
    marginTop: 14,
    gap: 6,
  },

  availableText: {
    color: "#0f766e",
    flex: 1,
  },

  time: {
    color: "#0f766e",
    fontWeight: "700",
  },

  bookBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f766e",
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 14,
    gap: 8,
  },

  bookText: {
    color: "white",
    fontWeight: "600",
  },

});
