import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSettingsContext } from '../context/settingsContext';
import { themes, sizes } from '../constants/layout';

const Inbox = () => {
  const [chats, setChats] = useState([]);
  const {theme} = useSettingsContext();
  const dark = theme === "dark" ; //dark theme


  useEffect(() => {
    // Simulating fetching chats from the database
    const fetchedChats = [
      {
        id: 'chat1',
        senderName: 'John Doe',
        lastMessage: 'Hey, are you available this weekend?',
      },
      {
        id: 'chat2',
        senderName: 'Jane Smith',
        lastMessage: 'Just confirming our meeting tomorrow.',
      },
      {
        id: 'chat3',
        senderName: 'Alex Johnson',
        lastMessage: 'I have some questions about the rental agreement.',
      },
    ];

    setChats(fetchedChats);
  }, []);

  const navigateToChat = (chatId) => {
    console.log('Navigating to chat with ID:', chatId);
  };

  const renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => navigateToChat(item.id)}
      >
        <Image source={require('../assets/inbox.png')} style={[styles.inboxIcon, dark && {tintColor:themes.dark.icon}]} />

        <View style={styles.chatContent}>
          <Text style={[styles.senderName, dark && {color:themes.dark.text}]}>{item.senderName}</Text>
          <Text style={[styles.lastMessage, dark && {color:themes.dark.text}]}>{item.lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, dark && {backgroundColor:themes.dark.background}]}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:"#fff"
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  inboxIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  chatContent: {
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
  },
});

export default Inbox;
