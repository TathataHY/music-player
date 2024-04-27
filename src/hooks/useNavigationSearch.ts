import { colors } from '@/constants/tokens'
import { useNavigation } from 'expo-router'
import { useLayoutEffect, useState } from 'react'
import { SearchBarProps } from 'react-native-screens'

const defaulSearchOptions: SearchBarProps = {
  tintColor: colors.primary,
  hideWhenScrolling: false,
  // custom styles for android
  textColor: colors.text,
  hintTextColor: colors.text,
  headerIconColor: colors.icon,
}

export const useNavigationSearch = ({
  searchBarOptions,
}: {
  searchBarOptions?: SearchBarProps
}) => {
  const [search, setSearch] = useState('')

  const navigation = useNavigation()

  const handleOnChangeText: SearchBarProps['onChangeText'] = ({ nativeEvent: { text } }) => {
    setSearch(text)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        ...defaulSearchOptions,
        ...searchBarOptions,
        onChangeText: handleOnChangeText,
      },
    })
  }, [navigation, searchBarOptions])

  return { search }
}
