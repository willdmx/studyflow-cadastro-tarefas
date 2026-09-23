import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import Task from "../models/Task";
import { colors } from "../styles/colors";

export default function TaskFormScreen({ navigation }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleSave() {
        setError("");
        setSuccess("");

        try {
            const task = new Task(title, category);
            task.saveLocal();
            setTitle("");
            setCategory("");
            setSuccess("Tarefa cadastrada com sucesso!");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Nova Tarefa</Text>
                    <InputField
                        label="Título da tarefa"
                        placeholder="Ex: Estudar JavaScript"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <InputField
                        label="Categoria"
                        placeholder="Ex: Programação"
                        value={category}
                        onChangeText={setCategory}
                    />
                    {error ? (
                        <Text
                            style={styles.error}
                            accessibilityRole="alert"
                            accessibilityLiveRegion="polite"
                        >
                            {error}
                        </Text>
                    ) : null}
                    {success ? (
                        <Text style={styles.success} accessibilityLiveRegion="polite">
                            {success}
                        </Text>
                    ) : null}
                    <PrimaryButton title="Salvar Tarefa" onPress={handleSave} />
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>Voltar para a tela inicial</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboard: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: 24,
        gap: 24,
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "800",
    },
    error: {
        color: colors.erro,
        fontSize: 16,
        lineHeight: 24,
    },
    success: {
        color: colors.sucess,
        fontSize: 16,
        lineHeight: 24,
    },
    backButton: {
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
    },
    backText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
