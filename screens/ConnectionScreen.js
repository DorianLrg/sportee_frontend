import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button, ImageBackground, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"
import Svg, { Path } from "react-native-svg"
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AuthSession from "expo-auth-session"
import Feather from 'react-native-vector-icons/Feather';


WebBrowser.maybeCompleteAuthSession()

export default ConnectionScreen = ({ navigation }) => {

    const [userInfo, setUserInfo] = useState(null)

    const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
        clientId: "1016759034555-pt2a62f4a0q7msu6f9p7rt9aetlin4a4.apps.googleusercontent.com",
        scopes: ["openid", "profile", "email"],
    })

    const [facebookRequest, facebookResponse, promptFacebookAsync] = Facebook.useAuthRequest({
        clientId: "495706416016280",
        scopes: ["public_profile", "email"],
    })

    useEffect(() => {

        if (googleResponse && googleResponse.type === "success" && googleResponse.authentication) {
            (async () => {
                const userInfoResponse = await fetch(
                    "https://www.googleapis.com/userinfo/v2/me",
                    {
                        headers: { Authorization: `Bearer ${googleResponse.authentication.accessToken}` },
                    }
                )
                const userInfo = await userInfoResponse.json()
                setUserInfo(userInfo)
            })()
        } else if (facebookResponse && facebookResponse.type === "success" && facebookResponse.authentication) {
            (async () => {
                const userInfoResponse = await fetch(
                    `https://graph.facebook.com/me?access_token=${facebookResponse.authentication.accessToken}&fields=id,name,picture.type(large)`
                )
                const userInfo = await userInfoResponse.json()
                setUserInfo(userInfo)
            })();
        }
    }, [googleResponse, facebookResponse, userInfo])

    const handleGooglePressAsync = async () => {
        const result = await promptGoogleAsync()
        if (result.type === 'success') {
            const userInfoResponse = await fetch(
                'https://www.googleapis.com/userinfo/v2/me',
                {
                    headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
                }
            )
            const userInfo = await userInfoResponse.json()
            setUserInfo(userInfo)

            await sendUserInfoToDatabase(userInfo)
        } else {
            alert('Une erreur s\'est produite lors de l\'authentification Google.')
        }

    }

    const handleFacebookPressAsync = async () => {
        const result = await promptFacebookAsync()
        if (result.type === 'success') {
            const userInfoResponse = await fetch(
                `https://graph.facebook.com/me?access_token=${result.authentication.accessToken}&fields=id,name,picture.type(large)`
            )
            const userInfo = await userInfoResponse.json()
            setUserInfo(userInfo)

            await sendUserInfoToDatabase(userInfo)
        } else {
            alert('Une erreur s\'est produite lors de l\'authentification Facebook.')
        }
    }

    const sendUserInfoToDatabase = async (userInfo) => {
        try {
            const response = await fetch('https://sportee-backend.vercel.app/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInfo }),
            })
        } catch (error) {
            console.error('error', error)
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.background}
                source={require("../assets/background3.png")}
            >
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Recherche')}>
                    <Feather name='arrow-left' size={25} color='#121C6E' />
                </TouchableOpacity>
                {userInfo === null ? (

                    <View style={styles.buttonContainer}>
                        <Image style={styles.logo} source={require('../assets/Logo.png')} />

                        <TouchableOpacity style={styles.button} onPress={handleGooglePressAsync}>
                            <Svg style={styles.iconGoogle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px">
                                <Path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <Path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <Path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <Path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </Svg>
                            <Text style={styles.buttonTextGoogle}>Connection avec Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleFacebookPressAsync}>
                            <Svg style={styles.iconFb} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                                <Path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z" />
                                <Path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z" />
                            </Svg>
                            <Text style={styles.buttonTextFacebook}>Connection avec Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConnectionMail')}>
                            <Feather style={styles.iconMail} name='mail' size={25} color='white' />
                            <Text style={styles.buttonTextEmail}>Connection avec un email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUpJoin')}>
                            <Text style={styles.buttonTextInscription}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // navigation.navigate('HomeScreen'))}
                    <Text style={styles.text}>Welcome: {JSON.stringify(userInfo)}</Text>
                )}
            </ImageBackground>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backBtn: {
        alignSelf: 'flex-start',
        marginTop: 50,
        marginLeft: 15,
        flexDirection: 'row',
    },
    iconGoogle: {
        marginLeft: 3,
    },
    iconFb: {
        marginLeft: 2,
    },
    iconMail: {
        marginLeft: 7,
    },
    background: {
        height: '100%',
        flex: 1,
    },
    backBtnTxt: {
        color: '#D9D9D9',
        marginLeft: 10,
        fontSize: 16,

    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        color: 'black'
    },
    buttonContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        height: 300,
        marginTop: 170,
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 275,
        height: 140,
        marginLeft: 70,
        marginBottom: 10,
    },
    button: {
        height: 50,
        width: 250,
        backgroundColor: '#121C6E',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    buttonTextGoogle: {
        color: '#ffffff',
        fontSize: 14,
        marginRight: 16,
    },
    buttonTextFacebook: {
        color: '#ffffff',
        fontSize: 14,
        marginRight: 4,
    },
    buttonTextInscription: {
        color: '#ffffff',
        fontSize: 14,
    },
    buttonTextEmail: {
        color: '#ffffff',
        fontSize: 14,
        marginRight: 9,
    },

})
