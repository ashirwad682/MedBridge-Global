import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND_COLORS, SPECIALTIES_LIST } from "@medbridge/constants";
import { doctorApi } from "@medbridge/api";
import { Doctor } from "@medbridge/types";

export default function DoctorsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ specialty?: string }>();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(params.specialty || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.specialty) {
      setSelectedSpecialty(params.specialty);
    }
  }, [params.specialty]);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      try {
        const res = await doctorApi.getAllDoctors({
          specialty: selectedSpecialty === "all" ? undefined : selectedSpecialty,
          search: searchQuery.trim() || undefined,
        });
        setDoctors(res.doctors || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [selectedSpecialty, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Physician</Text>
        <Text style={styles.headerSub}>Board-certified specialists across 8 medical fields</Text>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, specialty, condition..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Specialty Filter Horizontal Scroll */}
      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, selectedSpecialty === "all" && styles.filterChipActive]}
            onPress={() => setSelectedSpecialty("all")}
          >
            <Text style={[styles.filterChipText, selectedSpecialty === "all" && styles.filterChipTextActive]}>
              All Specialties
            </Text>
          </TouchableOpacity>

          {SPECIALTIES_LIST.map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={[styles.filterChip, selectedSpecialty === spec.id && styles.filterChipActive]}
              onPress={() => setSelectedSpecialty(spec.id)}
            >
              <Text style={[styles.filterChipText, selectedSpecialty === spec.id && styles.filterChipTextActive]}>
                {spec.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Doctor Cards List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={BRAND_COLORS.violet} />
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>⚕</Text>
          <Text style={styles.emptyTitle}>No Physicians Found</Text>
          <Text style={styles.emptySub}>Try searching for another specialty or clear your search terms.</Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => router.push(`/doctor-detail/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(4) || "Dr"}</Text>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.docName}>{item.name}</Text>
                  <Text style={styles.docSpecialty}>{item.specialtyName}</Text>
                  <Text style={styles.docHospital} numberOfLines={1}>🏢 {item.hospitalAffiliation}</Text>
                </View>
              </View>

              <Text style={styles.docBio} numberOfLines={2}>{item.bio}</Text>

              {/* Badges */}
              <View style={styles.badgesRow}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>★ {item.rating.toFixed(1)} ({item.reviewsCount})</Text>
                </View>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>⌛ {item.experienceYears}y exp</Text>
                </View>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>📅 {item.availability.split("•")[0]}</Text>
                </View>
              </View>

              {/* Bottom Actions */}
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.feeLabel}>CONSULTATION FEE</Text>
                  <Text style={styles.feeVal}>{item.consultationFee}</Text>
                </View>

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => router.push(`/doctor-detail/${item.id}`)}
                >
                  <Text style={styles.bookBtnText}>Book Visit →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  headerSub: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: BRAND_COLORS.graphite,
  },
  clearText: {
    fontSize: 14,
    color: "#8E8E93",
    padding: 4,
  },
  filterWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7",
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#F4F4F5",
  },
  filterChipActive: {
    backgroundColor: BRAND_COLORS.violet,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: BRAND_COLORS.ice,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_COLORS.violet,
  },
  cardMeta: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  docSpecialty: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLORS.violet,
    marginTop: 2,
  },
  docHospital: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  docBio: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  badgePill: {
    backgroundColor: "#F4F4F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#52525B",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F4F4F5",
  },
  feeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#8E8E93",
    letterSpacing: 0.5,
  },
  feeVal: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  bookBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 40,
    color: BRAND_COLORS.violet,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
  },
});

