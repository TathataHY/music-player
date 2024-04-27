import { PlaylistListItem } from '@/components'
import { unknownTrackImageUri } from '@/constants/images'
import { playlistNameFilter } from '@/helpers/filter'
import { Playlist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { utilsStyles } from '@/styles'
import { useMemo } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'

type PlaylistsListProps = {
  playlists: Playlist[]
  onPlaylistPress: (playlist: Playlist) => void
} & Partial<FlatListProps<Playlist>>

const ItemSeparatorComponent = () => (
  <View style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }} />
)

const ListEmptyComponent = () => {
  return (
    <View>
      <Text style={utilsStyles.emptyContentText}>No playlist found</Text>

      <FastImage
        source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
        style={utilsStyles.emptyContentImage}
      />
    </View>
  )
}

export const PlaylistsList = ({
  playlists,
  onPlaylistPress: handlePlaylistPress,
  ...flatListProps
}: PlaylistsListProps) => {
  const { search } = useNavigationSearch({
    searchBarOptions: {
      placeholder: 'Find in playlist',
    },
  })

  const filteredPlaylist = useMemo(() => {
    return playlists.filter(playlistNameFilter(search))
  }, [playlists, search])

  return (
    <FlatList
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListFooterComponent={ItemSeparatorComponent}
      ListEmptyComponent={ListEmptyComponent}
      data={filteredPlaylist}
      renderItem={({ item: playlist }) => (
        <PlaylistListItem playlist={playlist} onPress={() => handlePlaylistPress(playlist)} />
      )}
      {...flatListProps}
    />
  )
}
