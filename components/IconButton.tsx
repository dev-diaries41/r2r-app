import {TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from '../constants/layout';
import { IconButtonProps } from '../constants/types';

const IconButton = ({ onPress, color=themes.dark.icon, icon, size = 30 }:IconButtonProps) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Ionicons name={icon} size={size} color={color} />
      </TouchableOpacity>
    );
  };


  export default IconButton