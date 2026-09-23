import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/PrimaryButton";
import { colors } from "../styles/colors";

export default function LoginScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Tela de Login</Text>
            <PrimaryButton
                title="Ir para a tela inicial"
                onPress={() => navigation.replace("Home")}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        gap: 24,
        backgroundColor: colors.background,
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "800",
    },
});
