import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
/**
 * SafeAreaView
 * Vai jogar os elementos na area apropriada. Experimente no iOS sem esta opcao e entenderas!
 * (nao ocupa a area do notch)
 */

 import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {
    const id = navigation.getParam('user'); // pegando parametro em Main (Login, metodo handleLogin)
    const [ users, setUsers ] = useState([]);
    const [ matchDev, setMatchDev ] = useState(null); // essa variável vai ficar sendo escutada


    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    // interessante separar o useEffect por funcionalidade. Mas funcionaria se aproveitássemos o de cima
    useEffect(() => {
        /**
         * Esse useEffect está fazendo a chamada ao WebSocket
         */
        const socket = io(  // estabelendo conexão
            'http://10.0.3.2:3333', // onde está o API
            // http://localhost:3333 caso de o comando > adb reverse tcp:3333 tcp:33333
            // teria então que inserir http://10.0.3.2 com o Genymotion
            // ou o IP da máquina caso USB
            // 10.0.2.2:3333 caso esteja no emulador Android Studio
            {// este segundo parâmetro seriam os dados que passaríamos a mais
                query: { user: id }
            }
            );

            // ouvindo emit do tipo 'match' do servidor
            socket.on('match', dev => {
                console.log(dev);
                setMatchDev(dev);
            });

        /* TESTES PARA CONHECER O BÁSICO DO WEBSOCKET LADO CLIENT
        setTimeout(() => {
            socket.emit(
                'hello',  // emitindo uma mensagem ao servidor do tipo 'hello'
                { // neste segundo parametro podemos enviar qualquer outra coisa, um objeto por exemplo
                    message: 'Hello World'
                }
            );
        }, 3000);

        // Recebendo mensagem do API do tipo 'world'
        socket.on('world', message => {
            console.log(message);
        })
        */

    }, [id]);

    async function handleLike() {
        // pegando a primeira posicao do array
        // user pega o primeiro usuario da lista, e rest o restante
        const [ user, ...rest ] = users; 
        await api.post(`/devs/${user._id}/likes`, null, {
            headers: {
                user: id
            }
        });

        setUsers(rest);
    }

    async function handleDislike() {
        const [ user, ...rest ] = users; 
        await api.post(`/devs/${user._id}/deslikes`, null, {
            headers: {
                user: id
            }
        });

        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}><Image style={styles.logo} source={logo} /></TouchableOpacity>
            

            <View style={styles.cardsContainer}>
                { users.length === 0 
                ? <Text style={styles.empty}>Acabou :(</Text>
                : users.map((user, index) => (
                    <View key={user._id} style={[
                                    styles.card,  // alem do estilo...
                                    { zIndex: users.length - index } // ... podemos passar estilos isolados por aqui
                                ]}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <View style={styles.footer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text 
                                style={styles.bio} 
                                numberOfLines={3} // o conteudo tera no max 3 linhas
                                >{user.bio}</Text>
                        </View>
                    </View>
                )) }
            </View>

            { users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={dislike} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            ) }

            { matchDev && ( // se tiver algo dentro do matchDev entao faça...
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} style={styles.matchImage} />
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            ) }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logo: {
        marginTop: 30
    },
    empty: {
        alignSelf: 'center',
        fontSize: 24,
        color: '#999',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cardsContainer: {
        flex:1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
    },

    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    avatar: {
        flex: 1,
        height: 300
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 20
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2, // sombra - android
        // sombra - iOS:
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        /**
         * a linha acima possui:
         *  position: "absolute";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
         */
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain' // faz com que a img caiba no container dela
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderWidth: 5,
        borderRadius: 80,
        borderColor: '#FFF',
        marginVertical: 30
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF'
    },

    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'

    }
})