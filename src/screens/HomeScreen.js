import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";
import ProgressBar from "../components/ProgressBar";
import { Task } from "../models/Task";
import { colors } from "../styles/colors";

export default function HomeScreen({ route, navigation }) {
    const user = route?.params?.user;
    const [stats, setStats] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [sessionStarted, setSessionStarted] = useState(false);

    const loadDashboard = useCallback(() => {
        try {
            setErrorMessage("");
            setStats(Task.getDashboardStatsLocal());
        } catch (error) {
            // Não apresenta dados antigos ou zeros como se a consulta tivesse funcionado.
            setStats(null);
            setErrorMessage(error.message || "Não foi possível carregar seu progresso.");
        }
    }, []);

    useFocusEffect(loadDashboard);

    function handleLogout() {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Text style={styles.greeting}>Olá, {user?.name || "Estudante"}! 👋</Text>
                        <Text style={styles.subtitle}>{user?.email || "Conta local"}</Text>
                    </View>
                    <TouchableOpacity
                        accessibilityRole="button"
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Sair</Text>
                    </TouchableOpacity>
                </View>

                {errorMessage ? (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText} accessibilityRole="alert" accessibilityLiveRegion="polite">
                            {errorMessage}
                        </Text>
                        <PrimaryButton title="Tentar novamente" onPress={loadDashboard} />
                    </View>
                ) : stats ? (
                    <>
                        <View style={styles.dashboardCard}>
                            <Text style={styles.dashBadge}>MEU PROGRESSO</Text>
                            <Text style={styles.dashTitle}>{stats.percentage}% Concluído</Text>
                            <ProgressBar percentage={stats.percentage} />
                            <Text style={styles.dashSubtext}>
                                {stats.completed} de {stats.total} atividades concluídas
                            </Text>
                        </View>

                        <View style={styles.cardsGrid}>
                            <View style={[styles.metricCard, styles.completedCard]}>
                                <Text style={styles.cardEmoji}>✅</Text>
                                <Text style={[styles.metricValue, styles.completedValue]}>{stats.completed}</Text>
                                <Text style={styles.metricLabel}>Concluídas</Text>
                            </View>
                            <View style={[styles.metricCard, styles.pendingCard]}>
                                <Text style={styles.cardEmoji}>⏳</Text>
                                <Text style={[styles.metricValue, styles.pendingValue]}>{stats.pending}</Text>
                                <Text style={styles.metricLabel}>Pendentes</Text>
                            </View>
                            <View style={[styles.metricCard, styles.totalCard]}>
                                <Text style={styles.cardEmoji}>📚</Text>
                                <Text style={[styles.metricValue, styles.totalValue]}>{stats.total}</Text>
                                <Text style={styles.metricLabel}>Total</Text>
                            </View>
                        </View>
                    </>
                ) : null}

                <PrimaryButton
                    title="Abrir Gerenciador de Tarefas"
                    onPress={() => navigation.navigate("TaskList")}
                />

                <View style={[styles.sessionCard, sessionStarted && styles.sessionCardActive]}>
                    <Text style={styles.sessionTitle}>
                        {sessionStarted ? "🔥 Modo Foco Ativo!" : "🎯 Sessão de Estudos"}
                    </Text>
                    <Text style={styles.sessionText}>
                        {sessionStarted
                            ? "Mantenha as distrações longe e continue avançando!"
                            : "Pronto para começar mais uma rodada de aprendizado?"}
                    </Text>
                </View>
                <PrimaryButton
                    title={sessionStarted ? "Encerrar Estudo" : "Iniciar Estudo"}
                    onPress={() => setSessionStarted((started) => !started)}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        padding: 20,
        gap: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    userInfo: { flex: 1 },
    greeting: {
        color: colors.text,
        fontSize: 24,
        fontWeight: "800",
    },
    subtitle: {
        color: colors.textLight,
        fontSize: 13,
        marginTop: 2,
    },
    logoutButton: {
        minHeight: 44,
        justifyContent: "center",
        backgroundColor: "#FFEBEB",
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    logoutText: { color: colors.error, fontWeight: "700", fontSize: 13 },
    dashboardCard: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 20,
        gap: 4,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    dashBadge: { color: colors.secondary, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
    dashTitle: { color: colors.surface, fontSize: 28, fontWeight: "900" },
    dashSubtext: { color: colors.surface, fontSize: 13, marginTop: 4 },
    cardsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    metricCard: {
        flex: 1,
        minWidth: 88,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 16,
        borderWidth: 1.5,
        alignItems: "center",
        gap: 4,
    },
    completedCard: { backgroundColor: colors.cardCompletedBg, borderColor: colors.success },
    pendingCard: { backgroundColor: colors.cardPendingBg, borderColor: colors.warning },
    totalCard: { backgroundColor: colors.cardTotalBg, borderColor: colors.primary },
    cardEmoji: { fontSize: 20 },
    metricValue: { fontSize: 22, fontWeight: "800" },
    completedValue: { color: "#087F69" },
    pendingValue: { color: "#946200" },
    totalValue: { color: colors.primary },
    metricLabel: { fontSize: 12, color: colors.textLight, fontWeight: "700" },
    sessionCard: {
        backgroundColor: colors.surface,
        padding: 18,
        borderRadius: 16,
        borderLeftWidth: 5,
        borderLeftColor: colors.secondary,
        gap: 6,
    },
    sessionCardActive: { borderLeftColor: colors.success, backgroundColor: colors.cardCompletedBg },
    sessionTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
    sessionText: { fontSize: 13, color: colors.textLight, lineHeight: 18 },
    errorCard: {
        backgroundColor: colors.surface,
        borderColor: colors.error,
        borderWidth: 1,
        borderRadius: 16,
        padding: 18,
        gap: 12,
    },
    errorText: { color: colors.error, fontSize: 14 },
});
