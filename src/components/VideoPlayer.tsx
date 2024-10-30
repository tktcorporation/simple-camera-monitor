import React, { RefObject } from 'react';
import { Maximize2, Minimize2, Settings2 } from 'lucide-react';

interface VideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  error: string;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
}

export function VideoPlayer({ videoRef, error, isFullscreen, onFullscreenToggle }: VideoPlayerProps) {
  return (
    <div className="relative rounded-xl bg-black">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50">
          <div className="rounded-lg bg-red-800 p-4 text-white">
            <p className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              {error}
            </p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="mx-auto aspect-video w-full rounded-xl"
      />
      <button
        onClick={onFullscreenToggle}
        className="absolute bottom-4 right-4 rounded-lg bg-gray-800/80 p-2 hover:bg-gray-700 transition-colors"
      >
        {isFullscreen ? (
          <Minimize2 className="h-6 w-6" />
        ) : (
          <Maximize2 className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}