// Componente  de card usado para exibir uma informação resumida na Home

import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";

export default function InfoCard({
    icon,
    title,
    value
}){

    // Props recebidas:
    // icon: pequeno texto/ simbolo exibido no topo do card
    // -value : informação principal do card
    // - title: descrição da informação

    return (
        <View style={styles.card}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minHeight: 132,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 18,
        backgroundColor:colors.surface,
        // shadow* criar sombra no IOS.
        shadowColor:'#0000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        // elevation cria a sombra no Android.
        elevation: 3,
    },
    icon: {
        color: colors.primary,
        fontSize: 12,
        fontWeight:'800',
    },
    value : {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '800',
    },
    title : {
        color: colors.textLight,
        fontSize: 13,
        textAlign: 'center',
    }
})