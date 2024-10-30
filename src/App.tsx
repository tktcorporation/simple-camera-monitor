import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { CameraSelector } from './components/CameraSelector';
import { ResolutionSelector } from './components/ResolutionSelector';
import { VideoPlayer } from './components/VideoPlayer';

interface VideoDevice {
  deviceId: string;
  label: string;
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [resolution, setResolution] = useState<'4k' | 'fhd'>('fhd');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string>('');

  const resolutions = {
    '4k': { width: 3840, height: 2160 },
    'fhd': { width: 1920, height: 1080 }
  };

  const requestCameraPermission = async () => {
    try {
      // First request camera access to trigger the permission dialog
      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
      initialStream.getTracks().forEach(track => track.stop()); // Stop initial stream
      
      // After permission is granted, enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 4)}...`
        }));

      if (videoDevices.length === 0) {
        setError('カメラが見つかりませんでした');
        return;
      }

      setDevices(videoDevices);
      setSelectedDevice(videoDevices[0].deviceId);
      setError('');
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('カメラへのアクセスが拒否されました。ブラウザの設定でカメラへのアクセスを許可してください。');
        } else if (err.name === 'NotFoundError') {
          setError('カメラが見つかりませんでした。カメラが接続されているか確認してください。');
        } else {
          setError(`カメラの初期化に失敗しました: ${err.message}`);
        }
      } else {
        setError('予期せぬエラーが発生しました');
      }
      console.error('Camera permission error:', err);
    }
  };

  useEffect(() => {
    requestCameraPermission();

    // Listen for device changes (e.g., camera connected/disconnected)
    navigator.mediaDevices.addEventListener('devicechange', requestCameraPermission);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', requestCameraPermission);
    };
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      if (!selectedDevice) return;

      try {
        // Stop any existing stream
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: {
            deviceId: { exact: selectedDevice },
            width: { ideal: resolutions[resolution].width },
            height: { ideal: resolutions[resolution].height }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setError('');
        }
      } catch (err) {
        if (err instanceof DOMException) {
          if (err.name === 'OverconstrainedError') {
            setError('選択された解像度はこのカメラでサポートされていません');
          } else {
            setError(`カメラの起動に失敗しました: ${err.message}`);
          }
        } else {
          setError('カメラの起動中に予期せぬエラーが発生しました');
        }
        console.error('Camera start error:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [selectedDevice, resolution]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-8 w-8" />
            <h1 className="text-2xl font-bold">カメラモニター</h1>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <CameraSelector
              devices={devices}
              selectedDevice={selectedDevice}
              onDeviceChange={setSelectedDevice}
            />
            <ResolutionSelector
              resolution={resolution}
              onResolutionChange={setResolution}
            />
          </div>
        </div>

        <VideoPlayer
          videoRef={videoRef}
          error={error}
          isFullscreen={isFullscreen}
          onFullscreenToggle={toggleFullscreen}
        />

        <div className="mt-4 text-center text-sm text-gray-400">
          現在の解像度: {resolution === '4k' ? '3840×2160' : '1920×1080'}
        </div>
      </div>
    </div>
  );
}

export default App;