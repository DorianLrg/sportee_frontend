import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addAllActivities } from '../reducers/activities'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ActivityCard from '../components/ActivityCard';
import Map from '../components/Map';
import ModalFilter from '../components/ModalFilter';
import ModaleConnect from '../components/ModaleConnect';

const HomeScreen = ({ navigation }) => {
    const [showMap, setShowMap] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [mapIconColor, setMapIconColor] = useState('#121C6E')
    const [mapTextColor, setMapTextColor] = useState('#121C6E')
    const [listIconColor, setListIconColor] = useState('#121C6E')
    const [listTextColor, setListTextColor] = useState('#121C6E')
    const connectedUser = useSelector((state) => state.user.value)
    const preferences = useSelector((state) => state.preferences.value)
    const activityData = useSelector((state) => state.activities.value)
    // const [filteredActivities, setFilteredActivities] = useState([])
    let dispatch = useDispatch()

    //On loading component, fetch all activities from DB and send then in activities store
    const { sports, level, dateTime, slotOption, selectedParticipants } = preferences
    let filteredActivities = activityData
    useEffect(() => {
        fetch('https://sportee-backend.vercel.app/activities')
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Erreur lors de la récupération de l\'activité')
                }
            })
            .then(data => {
                dispatch(addAllActivities(data.activities))
                // setFilteredActivities(data.activities)
            })
            .catch(error => {
                console.error(error);
            })
    }, [])


    !sports.every(e => e === null) && (filteredActivities = filteredActivities.filter(activity => {

        return sports.some(e => e?.name === activity.sport?.name)
    }))

    selectedParticipants && (filteredActivities = filteredActivities.filter(activity => {
        return (activity.nbMaxParticipants >= selectedParticipants)
    }))

    level && (filteredActivities = filteredActivities.filter(activity => {
        return (activity.level === level)
    }))

    dateTime && (filteredActivities = filteredActivities.filter(activity => {
        const activityDate = new Date(activity.date).toISOString().split('T')[0];
        const filterDate = new Date(dateTime).toISOString().split('T')[0];
        return activityDate === filterDate;
    }))

    // Create algo to calculate the distance !!!!

    // sliderValue && (filteredActivities = filteredActivities.filter(activity => {
    //     return (activity.sliderValue <= sliderValue)
    // }))

    // Create algo to determine if a date is matin midi or soir !!!!
    function timePeriod(date) {
        const hour = new Date(date).getHours()

        if (hour >= 6 && hour <= 11) {
            return "Matin"
        } else if (hour >= 12 && hour <= 13) {
            return "Midi"
        } else if (hour >= 14 && hour <= 17) {
            return "Après-midi"
        } else if (hour >= 18 && hour <= 23) {
            return "Soir"
        }
        console.log(hour)
    }

    if (slotOption !== '') {
        filteredActivities = filteredActivities;
    } else {
        filteredActivities = filteredActivities.filter(activity => {
            const period = timePeriod(activity.date)
            return period === slotOption
        })
    }


    console.log(filteredActivities.map(e => e.sport))

    console.log(preferences)


    const listContent = (
        <View>
            <Text style={styles.titlePopulate}>Activités populaires autour de moi</Text>
            <FlatList
                data={filteredActivities}
                renderItem={({ item }) => {
                    return <ActivityCard {...item} />
                }
                }
                keyExtractor={(item, i) => i}
                contentContainerStyle={styles.cardContainerTop}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.titleForMe}>Activités liées à mes préférences</Text>
            <FlatList
                data={filteredActivities}
                renderItem={({ item }) => {
                    return <ActivityCard {...item} />
                }
                }
                keyExtractor={(item, i) => i}
                contentContainerStyle={styles.cardContainer}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
            />
        </View>
    )

    const handleNavigate = () => {
        navigation.navigate('ConnectionAll')
    }

    let content = listContent
    if (showMap) {
        content = (
            <View>
                {!connectedUser.email && <ModaleConnect handleNavigate={handleNavigate} />}

                <Map />

            </View>

        )
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.topInfos}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <FontAwesome5 name='sliders-h' size={25} color='#121C6E' style={styles.filterIcon} />
                </TouchableOpacity>
                <ModalFilter modalVisible={modalVisible} setModalVisible={setModalVisible} />
                <TextInput placeholder='Rechercher une activité' style={styles.input}></TextInput>
                <View style={styles.userIconContainer}>
                    <FontAwesome name='user' size={25} color='#f8f8ff' style={styles.userIcon} onPress={() => { connectedUser.email ? navigation.navigate('Profil') : navigation.navigate('ConnectionAll') }} />
                </View>
            </View>

            <View style={styles.iconsNavigate}>
                <View style={styles.listIconContainer}>
                    <TouchableOpacity onPress={() => {
                        setShowMap(false)
                        setMapIconColor('#121C6E');
                        setMapTextColor('#121C6E');
                        setListIconColor('#EA7810');
                        setListTextColor('#EA7810');
                    }}>
                        <FontAwesome name='list-ul'
                            size={25}
                            color={listIconColor}
                            style={styles.listIcon} />
                        <Text style={[styles.texte, { color: listTextColor }]}>Liste</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mapIconContainer}>
                    <TouchableOpacity onPress={() => {
                        setShowMap(true);
                        setMapIconColor('#EA7810');
                        setMapTextColor('#EA7810');
                        setListIconColor('#121C6E');
                        setListTextColor('#121C6E');
                    }}>
                        <FontAwesome name='map'
                            size={25}
                            color={mapIconColor}
                            style={styles.mapIcon}
                        />
                        <Text style={[styles.texte, { color: mapTextColor }]}>Carte</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.principalContent}>
                {content}
            </View>
        </SafeAreaView >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
    },

    topInfos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 20,
    },

    input: {
        width: '60%',
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 7,
        fontSize: 16,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 15,
    },

    userIconContainer: {
        backgroundColor: '#121C6E',
        borderRadius: 50,
        width: 42,
        height: 42,
        padding: 8,
    },

    userIcon: {
        marginLeft: 4,
    },

    mapIcon: {
        marginBottom: 10,
        marginLeft: 5,
    },

    listIcon: {
        marginBottom: 10,
        marginLeft: 2.5,
    },

    filterIcon: {
        padding: 10,
    },

    iconsNavigate: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 15,
    },

    texte: {
        color: '#121C6E',
    },

    mapIconContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },

    listIconContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },

    principalContent: {
        // alignItems: 'flex-start',
        // flexGrow: 1,
        width: '100%',
        // height: '100%',
    },

    titlePopulate: {
        fontSize: 18,
        fontWeight: '500',
        color: '#121C6E',
        marginBottom: 15,
        marginTop: 10,
        marginLeft: 23,
    },

    titleForMe: {
        fontSize: 18,
        fontWeight: '500',
        color: '#121C6E',
        marginBottom: 5,
        marginTop: 20,
        marginLeft: 23,
    },

    cardContainer: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '94%',
        flexGrow: 1,
        // flexWrap: 'wrap',
        // overflow: 'scroll',
        marginLeft: 12,
        marginRight: 10,
    },

    cardContainerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 152,
        overflow: 'scroll',
        marginBottom: 10,
        marginLeft: 12,
        marginRight: 10,
    },
});


