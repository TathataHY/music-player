import { colors } from '@/constants/tokens'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Platform } from 'react-native'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
  headerLargeTitle: true,
  headerLargeStyle: {
    backgroundColor: colors.background,
  },
  headerLargeTitleStyle: {
    color: colors.text,
  },
  headerTintColor: colors.background,
  headerBlurEffect: 'prominent',
  headerShadowVisible: false,
  ...(Platform.OS === 'ios' && { headerTransparent: true }), // Establecer headerTransparent solo en iOS
  ...(Platform.OS === 'android' && {
    // Establecer otros estilos solo en Android
    headerStyle: { backgroundColor: colors.background },
    headerTitleStyle: { color: colors.text },
  }),
}
