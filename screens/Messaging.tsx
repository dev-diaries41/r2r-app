import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, getFirestore, where } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { auth } from '../firebase';

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const { recipient } = route?.params;
  const db = getFirestore();
  const chatId = getChatId(auth?.currentUser?.uid, recipient);

  function getChatId(userId1, userId2) {
    // Create a unique chat ID based on the two user IDs
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  }

  useLayoutEffect(() => {
    const collectionRef = collection(db, 'messages');
    const q = query(collectionRef, where('chatId', '==', chatId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }));
      setMessages(updatedMessages);
    });

    return unsubscribe;
  }, [db, chatId]);

  const onSend = useCallback(async (messages = []) => {
    const message = messages[0];
    const { _id, createdAt, text, user } = message;

    await addDoc(collection(db, 'messages'), {
      _id,
      createdAt: serverTimestamp(),
      text,
      user,
      recipient,
      chatId,
    });
  }, [db, recipient, chatId]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: auth?.currentUser?.uid,
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default Messaging;
