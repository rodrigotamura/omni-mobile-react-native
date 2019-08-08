import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

/**
 * SafeAreaView
 * Vai jogar os elementos na area apropriada. Experimente no iOS sem esta opcao e entenderas!
 * (nao ocupa a area do notch)
 */

 import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

export default function Main({ navigation }) {
    const id = navigation.getParam('user'); // pegando parametro em Main (Login, metodo handleLogin)
    const [ users, setUsers ] = useState([]);

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
})