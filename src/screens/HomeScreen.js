import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../styles/colors";

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>StudyFlow</Text>
                <Text style={styles.subtitle}>
                    Organize seus estudos. Cadastre suas tarefas para começar.
                </Text>
                <PrimaryButton
                    title="Cadastrar Tarefa"
                    onPress={() => navigation.navigate("TaskForm")}
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
        padding: 24,
        gap: 24,
    },
    title: {
        color: colors.primary,
        fontSize: 32,
        fontWeight: "800",
    },
    subtitle: {
        color: colors.textLight,
        fontSize: 16,
        lineHeight: 24,
    },
});
