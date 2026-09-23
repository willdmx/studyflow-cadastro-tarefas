// Componente reutilizado , como um botão principal

import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../styles/colors";

export default function PrimaryButton({title, onPress, disabled = false}){
    //Porps recebidas:
    // - title : texto  exibido dentro do botao.
    // - onPress : função executada quando o usuario tocar/ clicar no botão
    // - disabled : bloqueia o toque quando true.

    return (
        // Pressable permite mudar o estilo de acordo com o estado do toque
        <Pressable
            onPress={onPress} // Função a ser executada
            disabled={disabled} // habilitar ou desabilitar o botão
            style={({pressed}) =>[
                styles.button,
                pressed && styles.buttonPressed,
                disabled && styles.buttonDisabled,
            ]}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width:'100%',
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
    },

    buttonPressed: {
        opacity:0.8,
    },

    buttonDisabled:{
        opacity: 0.5,
    },

    buttonText :{
        color: colors.surface,
        fontSize: 16,
        fontWeight: '700',
    },

});