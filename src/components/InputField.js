// Campo de formulario reutilizavel

import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../styles/colors";


export default function InputField({
    label,
    value, 
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitaliza = 'sentences',
}){
    //Props recebidas:
    // - label: texto acima do campo
    // - value:  valor atual do campo, controlado pela tela que usa o componente.
    // - onChengeText:  função chamada sempre   que o usuario o digita
    // - placeholder: texto  de ajuda exibido quando o campo esta vazio
    // - secureTextEntry: oculta o texto, ultil para senhas
    // - keyboardType: escolhe o tipo de teclado no celular.
    // - autoCapitaliza : controlar letras maiusculas automaticas.

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textLight}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitaliza}
                keyboardType={keyboardType}
                style={styles.input}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        width:'100%',
        gap: 8,
    },
    label: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    input:{
        minHeight: 52,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        backgroundColor: colors.surface,
        color: colors.text,
        fontSize:16,
        paddingHorizontal: 16,
    },

});
