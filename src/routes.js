/**
 * Vamos implementar a navegação instalando:
 * > yarn add react-navigation react-native-gesture-handler react-native-reanimated
 *  - react-native-navigation: faz a parte de navegação básica
 * 
 *  - react-native-gesture-handler: dependência do react-navigation utilizada para lidar com gestos
 *    do usuário (menu que arrasta da direita pra esquerda, por exemplo)
 *          - PARA ANDROID será necessário fazer uma configuração na pasta .\android\app\src\main\java\com\tindev\MainActivity.java
 *            (vide a documentação desta implementação do GETTING STARTED no doc desta lib)
 * 
 *  - react-native-reanimated: algumas transições de rotas possui animações, o qual podemos
 *    implementar - estas animações - através desta lib
 */

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

/**
 * createAppContainer: é padrão para trabalhar com rotas no react native.
 *                     Dentro dele deveremos definir qual a forma de menu
 *                     iremos utilizar.
 * 
 * createSwitchNavigator: Cria uma navegação entre as telas sem qualquer tipo de feedback visual
 *                        ou seja, sem animação, nem cabeçalho, nem abas, o usuário não vai poder
 *                        voltar para a rota... é como um redirect puro!
 *                        Diferente do createStackNavigator, que insere um cabeçalho, que possui
 *                        um botão de BACK, etc.
 */

import Login from './pages/Login';
import Main from './pages/Main';

export default createAppContainer(
    createSwitchNavigator({
        Login, 
        Main,
    })
)