// Centraliza a navegação do aplicativo.

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import TaskFormScreen from "../screens/TaskFormScreen";
import TaskListScreen from "../screens/TaskListScreen";

// A ideia  deste arquivo é separar  a regra de navegação das telas

// Cria um objeto que gerencia  uma pilha de telas.
const Stack = createNativeStackNavigator();

export default function AppRoutes() {
    return (
        // ele envolve todos os navegadores do app.
        <NavigationContainer>
            {/*criar as nossas navegações */}
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    // Oculta o cabecalho padrão
                    headerShown: false,
                }}
            >
                {/*O Atributo name e o nome usado em navigation.navigate/replace */}
            <Stack.Screen name="Splash" component={SplashScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="TaskForm" component={TaskFormScreen}/>
            <Stack.Screen name="TaskList" component={TaskListScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    ) 

}
