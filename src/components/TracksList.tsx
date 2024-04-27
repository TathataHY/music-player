import { QueueControls, TrackListItem } from '@/components'
import { unknownTrackImageUri } from '@/constants/images'
import { useQueue } from '@/store/queue'
import { utilsStyles } from '@/styles'
import { useRef } from 'react'
import { FlatList, FlatListProps, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import TrackPlayer, { Track } from 'react-native-track-player'

export type TracksListProps = Partial<FlatListProps<Track>> & {
  id: string
  tracks: Track[]
  hideQueueControls?: boolean
}

const ItemSeparatorComponent = () => (
  <View style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

const ListEmptyComponent = () => {
  return (
    <View>
      <Text style={utilsStyles.emptyContentText}>No songs found</Text>
      <FastImage
        source={{ uri: unknownTrackImageUri, priority: FastImage.priority.normal }}
        style={utilsStyles.emptyContentImage}
      />
    </View>
  )
}

export const TracksList = ({
  id,
  tracks,
  hideQueueControls = false,
  ...flatListProps
}: TracksListProps) => {
  const queueOffset = useRef(0)
  const { activeQueueId, setActiveQueueId } = useQueue()

  const handleTrackSelected = async (selectedTrack: Track) => {
    const trackIndex = tracks.findIndex((track) => track.url === selectedTrack.url)
    if (trackIndex === -1) return
    const isChangingQueue = activeQueueId !== id
    if (isChangingQueue) {
      const beforeTracks = tracks.slice(0, trackIndex)
      const afterTracks = tracks.slice(trackIndex + 1)
      await TrackPlayer.reset()
      await TrackPlayer.add(selectedTrack)
      await TrackPlayer.add(afterTracks)
      await TrackPlayer.add(beforeTracks)
      await TrackPlayer.play()
      queueOffset.current = trackIndex
      setActiveQueueId(id)
    } else {
      const nextTrackIndex =
        trackIndex - queueOffset.current < 0
          ? tracks.length + trackIndex - queueOffset.current
          : trackIndex - queueOffset.current
      TrackPlayer.skip(nextTrackIndex)
      await TrackPlayer.play()
    }
  }

  return (
    <FlatList
      data={tracks}
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
      ListHeaderComponent={
        !hideQueueControls ? (
          <QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
        ) : undefined
      }
      ListFooterComponent={ItemSeparatorComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListEmptyComponent={ListEmptyComponent}
      keyExtractor={(track) => track.url}
      renderItem={({ item: track }) => (
        <TrackListItem track={track} onTrackSelected={handleTrackSelected} />
      )}
      {...flatListProps}
    />
  )
}
