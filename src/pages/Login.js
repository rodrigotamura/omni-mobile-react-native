import React, { useState, useEffect } from 'react';

/**
 * useState:
 * Quando damos um F5 no app ele atualiza e volta pra tela inicial.
 * Entao, vamos instalar uma dependencia que trabalhe com armazenamento local
 * > yarn add @react-native-community/async-storage
 * 
 * Na verdade nao precisa de nenhuma configuracao a mais.
 * 
 * Soh no iOS que precisa dar o comando pra embutir a lib
 * 
 * useEffect:
 * Dispara funcionalidades assim quando um componente e disparado
 * na tela ou quando alguma informação muda
 */
import AsyncStorage from '@react-native-community/async-storage';

import { 
    KeyboardAvoidingView, 
    Platform, 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TextInput, 
    TouchableOpacity 
} from 'react-native';

/**
 * Se importássemos o Button, teríamos que nos sujeitar em utilizar um botão
 * que terá a aparencia de acordo com o Andoird ou iOS.
 * Já o TouchableOpacity podemos estilizar. E quando apertar ele ele terá um
 * efeito de opacidade.
 *  * O TouchableOpacity precisa de um Text dentro para escrevermos algo.
 * 
 * KeyboardAvoidingView
 * Somente para iOS, nao permite que o teclado fique em cima do campo input que
 * o usuario esta digitando. No Android isso eh automatico.
 * 
 * Platform
 * Podemos por meio dele detectar qual o OS do usuario
 * Platform.OS === android / ios
 */

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({ navigation }) {
    const [ user, setUser ] = useState('');

    useEffect(() => {
        // Consulta se o user que foi gravado no local storage esta preenchido
        // Se estiver o usuario eh redirecionado para o componente Main, com o param user
        AsyncStorage.getItem('user').then(user => {
            if(user) {
                navigation.navigate('Main', { user });
            }
        })
        }, [
            // se vazio será executado somente quando for exibido na tela
    ]);

    async function handleLogin() {
        const response = await api.post('/devs', { username:user });

        const { _id } = response.data;

        // salvando no storage.
        // o AsyncStorage trabalha de forma assincrona
        // Assim como o Storage do navegador, ele so armazena strings e integers
        await AsyncStorage.setItem('user', _id);
        navigation.navigate('Main', { user:_id }); // navegaÇão com parametro passando o _id
    }

    return (
        <KeyboardAvoidingView 
            // Configs. do KeyboardAvoidingView (para iOS):
            behavior="padding" // conteudo vai pra cima quando abre o teclado
            enabled={Platform.OS === 'ios'} // Este recurso soh vai funcionar se for no ios

            style={styles.container}>
            <Image source={logo} />

            <TextInput 
                autoCorrect={false} // nao deixa auto corrigir
                autoCapitalize="none" // nao permitira letra maiuscula
                placeholder="Digite seu usuário no GitHub"
                placeholderTextColor="#999" // cor do placeholder
                style={styles.input}
                onChangeText={setUser} // quando mudado, executa o setUser
                />
            
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },

    input: {
        height: 40,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
})