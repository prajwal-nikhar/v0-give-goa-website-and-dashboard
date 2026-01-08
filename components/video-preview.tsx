"use client"

import * as React from "react"
import { Play } from "lucide-react"

interface VideoPreviewProps {
  videoUrl: string
  thumbnail: string
}

export function VideoPreview({ videoUrl, thumbnail }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={isPlaying}
        poster={thumbnail || "/placeholder.svg"}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <button
            onClick={handlePlay}
            className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Play video"
          >
            <Play className="h-8 w-8 ml-1" fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  )
}
