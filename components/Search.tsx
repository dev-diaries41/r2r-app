import React, { useEffect, useRef } from 'react';
import {View, TextInput,TouchableOpacity,StyleSheet,BackHandler,} from 'react-native';
import { useSearchContext } from '../context/searchContext';
import { Ionicons } from '@expo/vector-icons';
import { themes, sizes } from '../constants/layout';
import debounce from 'debounce';
import { SearchProps } from '../constants/types';


const Search = ({
  properties, 
  placeholder = 'Search...', 
  backgroundColor = themes.dark.card,
  borderRadius= sizes.layout.medium,
  paddingHorizontal= sizes.layout.medium,
  paddingVertical= sizes.layout.small,
  marginBottom= sizes.layout.medium,
  color = themes.dark.text,
}: SearchProps) => {
  const {searchQuery, setQuery, setSearchResults} = useSearchContext();
  const searchInputRef = useRef<TextInput>(null);
  const isSearching = !!searchQuery;
  const customizableStyles = {backgroundColor, borderRadius,paddingHorizontal, paddingVertical, marginBottom};

  // Allow the back button to clear the search bar (optional)
  useEffect(() => {
    const backAction = () => {
      if (isSearching) {
        handleCancel();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isSearching]);

  const handleQueryChange = (text: string) => {
    setQuery(text)
  }
  
  const handleSearch = () => {
    try {
      const filteredProperties = properties.filter(properties => properties.city.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(filteredProperties);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Use debouncing to optimize search
  // This stops the handleSearch function being called for every keystroke
  const debouncedSearch = debounce(handleSearch, 500);

  const handleCancel = () => {
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    setQuery('')
    setSearchResults([]);
  };

  useEffect(() => {
    if(properties.length > 0 && searchQuery){
      debouncedSearch();
    }
  }, [searchQuery]);

  return (
    <View style={[styles.searchContainer, customizableStyles]}>
      <Ionicons name='search-outline' size={24} color={themes.placeholder} style={styles.icon}/>
      <TextInput
        ref={searchInputRef}
        style={[styles.searchInput, {color}]}
        placeholder={placeholder}
        placeholderTextColor={themes.placeholder}        
        value={searchQuery}
        onChangeText={(text) => handleQueryChange(text)}
      />
    {isSearching && (
      <TouchableOpacity onPress={handleCancel} style={styles.icon}>
        <Ionicons name='close-circle' size={24} color={themes.placeholder}/>
      </TouchableOpacity>
    )}
  </View>
  );
  }  

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
      shadowColor: themes.light.text,
      shadowOffset: {
        width: 5,
        height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: sizes.layout.small,
  },
  searchInput: {
    flex: 1,
    color: themes.dark.text,
    fontFamily:'monserrat-regular',
    height:20
  },
  icon: {
    marginHorizontal: sizes.layout.small,
  },
});

export default Search;