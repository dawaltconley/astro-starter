import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'

interface Source {
  src: string
  type: string
}

export interface VideoProps extends ComponentPropsWithoutRef<'video'> {
  sources: Source[]
  play?: boolean
  volume?: number
  onReady: () => void
}

export default function Video({
  sources,
  play = false,
  onReady,
  volume = 1,
  ...props
}: VideoProps) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video.current && video.current.readyState >= 3) {
      onReady()
    }
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (play) {
      v.currentTime = 0
      v.play()
    } else {
      v.pause()
    }
  }, [play])

  useEffect(() => {
    if (!video.current) return
    video.current.volume = volume
  }, [volume])

  return (
    <video ref={video} onCanPlayThrough={onReady} {...props}>
      {sources.map((s) => (
        <source key={s.src} {...s} />
      ))}
    </video>
  )
}
