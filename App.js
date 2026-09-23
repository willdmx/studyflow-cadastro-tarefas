// Esse é o nosso ponto de entrada visual do App

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRoutes from './src/navigation/AppRoutes';


export default function App() {
  return (
    // SafeAreaProvider Informa  ao app as aereas seguras da tela 
    // isso evita que o conteudo fique atras da barra de status
    <SafeAreaProvider>
      <AppRoutes/>
    </SafeAreaProvider>
  );
}


