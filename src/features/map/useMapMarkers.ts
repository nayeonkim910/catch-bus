import { useEffect } from 'react'
import type { BusStation } from '../../shared/types/bus'
import { createBusStopMarker } from './busStopMarker'
import type { Coordinates } from './useCurrentLocation'

type StationMarker = {
  overlay: kakao.maps.CustomOverlay
  element: HTMLButtonElement
  handleClick: () => void
}

export function useCurrentLocationMarker(
  map: kakao.maps.Map | null,
  coordinates: Coordinates | null,
) {
  useEffect(() => {
    if (!map || !coordinates) return

    const position = new kakao.maps.LatLng(coordinates.latitude, coordinates.longitude)
    const markerElement = document.createElement('div')
    markerElement.className = 'h-4 w-4 rounded-full border-[3px] border-white bg-blue-600 shadow-[0_0_0_8px_rgb(37_99_235/20%)]'

    const overlay = new kakao.maps.CustomOverlay({
      position,
      content: markerElement,
      zIndex: 3,
    })

    overlay.setMap(map)
    map.setCenter(position)
    map.setLevel(4)

    return () => overlay.setMap(null)
  }, [coordinates, map])
}

type UseStationMarkersParams = {
  map: kakao.maps.Map | null
  stations: BusStation[] | undefined
  selectedStationId: string
  onStationSelect: (station: BusStation) => void
}

export function useStationMarkers({
  map,
  stations,
  selectedStationId,
  onStationSelect,
}: UseStationMarkersParams) {
  useEffect(() => {
    if (!map || !stations) return

    // 가까운 정류장도 서로 다른 stationId를 가지므로 조회 결과를 생략하지 않는다.
    const markers: StationMarker[] = stations.map((station) => {
      const isSelected = station.id === selectedStationId
      const element = createBusStopMarker(station.name, isSelected)
      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(station.latitude, station.longitude),
        content: element,
        xAnchor: 0.5,
        yAnchor: 1.1,
        zIndex: isSelected ? 4 : 2,
        clickable: true,
      })
      const handleClick = () => onStationSelect(station)

      element.addEventListener('click', handleClick)
      overlay.setMap(map)
      return { overlay, element, handleClick }
    })

    return () => {
      markers.forEach(({ overlay, element, handleClick }) => {
        element.removeEventListener('click', handleClick)
        overlay.setMap(null)
      })
    }
  }, [map, onStationSelect, selectedStationId, stations])
}
