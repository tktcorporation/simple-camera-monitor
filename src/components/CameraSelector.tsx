import React from 'react';
import { Camera } from 'lucide-react';

interface VideoDevice {
  deviceId: string;
  label: string;
}

interface CameraSelectorProps {
  devices: VideoDevice[];
  selectedDevice: string;
  onDeviceChange: (deviceId: string) => void;
}

export function CameraSelector({ devices, selectedDevice, onDeviceChange }: CameraSelectorProps) {
  return (
    <div className="relative min-w-[300px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Camera className="h-5 w-5 text-gray-400" />
      </div>
      <select
        value={selectedDevice}
        onChange={(e) => onDeviceChange(e.target.value)}
        className="w-full appearance-none rounded-lg bg-gray-800 pl-10 pr-8 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {devices.map((device) => (
          <option
            key={device.deviceId}
            value={device.deviceId}
            className="py-2"
          >
            {device.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg className="h-4 w-4 fill-current text-gray-400" viewBox="0 0 20 20">
          <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
        </svg>
      </div>
    </div>
  );
}