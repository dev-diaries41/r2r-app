import { TextStyle, DimensionValue, Falsy } from "react-native";


export interface ButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onPress: () => Promise<void> | void;
  text?: string;
  backgroundColor?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  icon?: any;
  fontSize?: number;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
}

export interface GradientButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onPress: () => Promise<void> | void;
  text: string;
  gradientColor?: string[];
  width?: DimensionValue;
  height?: DimensionValue;
  icon?: any;
  fontSize?: number;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
}

export interface PickerProps { 
  selectedValue: string; 
  onValueChange: (selectedValue: string) => void; 
  options: string [];
  borderRadius?: number;
  borderColor?: string;
  dropdownIconRippleColor?: string;
  dropdownIconColor?: string;
  label?: string;
  textColor?: string;
}

export interface DisplayModalProps { 
  visible: boolean; 
  onClose: () => void;
  description: string; 
  title: string;
  contentBackground: string;
  summaryBackground: string;
  textColor : string;
}

export interface ButtonConfig {
  condition?: boolean;
  onPress: () => void | Promise<void>;
  icon: string;
  iconColor: string;
  width?: DimensionValue;
}
export interface FooterButtonsProps { 
  buttonsConfig: ButtonConfig[]; 
  buttonsColor: string;
  backgroundColor: string; 
 }
 export interface IconButtonProps {
  onPress: (() => Promise<void> | void)
  color?: string;
  icon:any;
  size?: number;
}
export interface InfoCardProps { 
  title: string;
  description: string;
  metadata: string;
  icon: any, 
  metadataIcon: any, 
  highlighterBackground: string;
  color?: string;
  iconColor?: string;
  backgroundColor?: string;
}
export interface HeaderProps { 
  title: string; 
  icon: any;
  backgroundColor?: string;
  fontSize?: number;
  textAlign?: TextStyle["textAlign"];
  textDecorationLine: TextStyle["textDecorationLine"];
  iconSize?: number;
  iconColor: string;
  textColor: string;
}
export interface HeaderButtonProps { 
  buttonText: string;
  title: string; 
  icon: any;
  backgroundColor?: string;
  fontSize?: number;
  textAlign?: TextStyle["textAlign"];
  textDecorationLine: TextStyle["textDecorationLine"];
  iconSize?: number;
  iconColor: string;
  textColor: string;
  onPress: () => void;
}
export interface InputFieldProps { 
  value: string; 
  onChangeText: (text: string) => Promise<void> | void;
  error?: boolean | Falsy
  placeholder: string; 
  secureTextEntry?: boolean; 
  errorText?: string; 
  color: string; 
}
export interface SearchProps {
  placeholder?: string;
  backgroundColor?: string;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginBottom?: number;
  color?: string;
  properties: any[];
}
export interface SettingsCardProps {
  onPress: () => Promise<void> | void; 
  dark: boolean, 
  settingDescription: string; 
  settingTitle: string; 
  isSwitch?: boolean;
  value?: boolean;
}
export interface TextButtonProps { 
  onPress: () => Promise<void> | void; 
  buttonText: string; 
  fontSize?: number;
  color?: string; 
  margin?: number; 
  textAlign?: TextStyle['textAlign']; 
}
export interface TextWithIconButtonProps {
  onPress: () => Promise<void> | void; 
  buttonText: string; 
  fontSize?: number;
  color?: string; 
  margin?: number; 
  icon: any;
  iconSize?: number;
  justifyContent?: 'flex-start' | 'flex-end' | 'center';
  textAlign?: TextStyle['textAlign']; 
}
export interface SearchContextProps {
  searchQuery: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: any [];
  setSearchResults: React.Dispatch<React.SetStateAction<any[] | []>>;
  customerFilter: boolean; 
  setCustomerFilter: React.Dispatch<React.SetStateAction<boolean>>;
  pendingFilter: boolean; 
  setPendingFilter: React.Dispatch<React.SetStateAction<boolean>>;
  unansweredFilter: boolean; 
  setUnansweredFilter: React.Dispatch<React.SetStateAction<boolean>>;
  prospectFilter: boolean; 
  setProspectFilter: React.Dispatch<React.SetStateAction<boolean>>;
}
