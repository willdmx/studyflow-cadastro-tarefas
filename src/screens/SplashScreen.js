// Tela de abertura

import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

export default function SplashScreen({ navigation }) {
    // useRef guarda os valores que devem continuar existindo entre as renderizações.
    //Animated.Value representa um numero que pode mudar ao longo do tempo
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current

    useEffect(() => {
        //useEffect rodar depois que a tela aparecer
        //aqui ele dispara a animação e agenda a troca de tela 

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 900,
                //  useNativeDriver mlhora a performance em animações suportadas.
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();

        // aguarda um pequeno periodo e troca o Slplash pelo Login
        // replace remove o splash do historico, evitando voltar para ela.
        const time = setTimeout(() => {
            navigation.replace('Login');
        }, 2200);

        // Limpa o temporizador caso o componente seja desmontado antes do tempo.
        //Evita tentar navegar depois que a tela já saiu da memoria.
        return () => clearTimeout(time);
    }, [navigation, opacity, scale]);


    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity,
                        transform: [{ scale }],
                    }
                ]}
            >
                <Text style={styles.logo}>SF</Text>
                <Text style={styles.title}>StudyFlow</Text>
                <Text style={styles.subtitle}>Organize seus estudos. Evolua todos os dias.</Text>

            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        padding: 24,
    },
    content: {
        alignItems: 'center',
        gap: 12,
    },

    logo: {
        color: colors.surface,
        fontSize: 72,
        fontWeight: '800',
    },
    title: {
        color: colors.surface,
        fontSize: 38,
        fontWeight: '800',
    },

    subtitle: {
        maxWidth: 280,
        color: colors.surface,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        opacity: 0.9,
    }

})