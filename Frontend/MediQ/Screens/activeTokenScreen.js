import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ActiveTokenScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={22}
          color="white"
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.headerTitle}>Active Token</Text>
        <Text style={styles.subHeader}>
          Cardiology - Dr. Sarah Johnson
        </Text>

        <View style={styles.liveBadge}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>Live Updates</Text>
        </View>

        <Text style={styles.tokenLabel}>Your Token Number</Text>

        <View style={styles.tokenBox}>
          <Text style={styles.tokenText}>A23</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        
        {/* Currently Serving */}
        <View style={styles.card}>
          <Text style={styles.smallTitle}>Currently Serving</Text>
          <Text style={styles.currentNumber}>A22</Text>

          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarFill} />
          </View>

          <View style={styles.row}>
            <View style={styles.statBox}>
              <Ionicons name="people-outline" size={20} color="#0f766e" />
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>People Ahead</Text>
            </View>

            <View style={styles.statBoxOrange}>
              <Ionicons name="time-outline" size={20} color="#d97706" />
              <Text style={styles.statNumber}>~5</Text>
              <Text style={styles.statLabel}>Minutes Wait</Text>
            </View>
          </View>
        </View>

        {/* Estimated Call Time */}
        <View style={styles.estimateCard}>
          <Text style={styles.estimateTitle}>Estimated Call Time</Text>
          <Text style={styles.estimateTime}>2:15 PM</Text>
        </View>

        {/* Queue Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Queue Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department:</Text>
            <Text>Cardiology</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Doctor:</Text>
            <Text>Dr. Sarah Johnson</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined at:</Text>
            <Text>1:30 PM</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total in Queue:</Text>
            <Text>45 patients</Text>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <TouchableOpacity style={styles.swapButton}>
          <Text style={styles.swapText}>Request Token Swap</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel Token</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },

  header: {
    backgroundColor: "#0f766e",
    padding: 20,
    paddingTop: 10,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  subHeader: {
    color: "#c7f9f5",
    fontSize: 12,
    marginTop: 4,
  },

  liveBadge: {
    flexDirection: "row",
    backgroundColor: "#14b8a6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: "white",
    borderRadius: 5,
    marginRight: 6,
  },

  liveText: {
    color: "white",
    fontSize: 12,
  },

  tokenLabel: {
    color: "#c7f9f5",
    marginTop: 15,
  },

  tokenBox: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 8,
  },

  tokenText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f766e",
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },

  smallTitle: {
    textAlign: "center",
    color: "gray",
  },

  currentNumber: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d97706",
    textAlign: "center",
    marginVertical: 8,
  },

  progressBarBackground: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },

  progressBarFill: {
    width: "96%",
    height: "100%",
    backgroundColor: "#0f766e",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    flex: 1,
    backgroundColor: "#e6f4f1",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },

  statBoxOrange: {
    flex: 1,
    backgroundColor: "#fff4e5",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  statLabel: {
    fontSize: 12,
    color: "gray",
  },

  estimateCard: {
    backgroundColor: "#0f766e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  estimateTitle: {
    color: "#c7f9f5",
  },

  estimateTime: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  infoTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  infoLabel: {
    color: "gray",
  },

  swapButton: {
    borderWidth: 1,
    borderColor: "#0f766e",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
  },

  swapText: {
    color: "#0f766e",
    fontWeight: "600",
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#dc2626",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },

  cancelText: {
    color: "#dc2626",
    fontWeight: "600",
  },
});
