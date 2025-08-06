import React from 'react';
import { Keyboard, Wifi, Usb, Smartphone } from 'lucide-react';

export const ExternalControlInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 dark:bg-blue-900 dark:border-blue-700">
      <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2 dark:text-blue-100">
        <Wifi className="w-5 h-5" />
        External Timer Control Options
      </h4>

      <div className="space-y-4 text-sm">
        {/* Keyboard Shortcuts */}
        <div className="bg-white rounded-lg p-4 border border-blue-100 dark:bg-gray-800 dark:border-blue-700">
          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2 dark:text-gray-100">
            <Keyboard className="w-4 h-4" />
            Keyboard Shortcuts (Built-in)
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Start/Pause:</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200">Spacebar</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stop Timer:</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200">Esc</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Reset:</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200">Ctrl+R</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Home Possession:</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200">A or 1</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Away Possession:</span>
              <kbd className="bg-gray-100 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200">D or 2</kbd>
            </div>
            <div className="text-xs text-gray-500 mt-2 dark:text-gray-400">
              * Possession shortcuts only work when timer is running
            </div>
          </div>
        </div>

        {/* Hardware Options */}
        <div className="bg-white rounded-lg p-4 border border-blue-100 dark:bg-gray-800 dark:border-blue-700">
          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2 dark:text-gray-100">
            <Usb className="w-4 h-4" />
            Hardware Integration Options
          </h5>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>• <strong>USB Foot Pedals:</strong> Can be programmed to send spacebar/escape key presses</li>
            <li>• <strong>Wireless Presenters:</strong> Most have programmable buttons for start/stop</li>
            <li>• <strong>Game Controllers:</strong> Xbox/PlayStation controllers via USB</li>
            <li>• <strong>Arduino/Raspberry Pi:</strong> Custom hardware with USB HID interface</li>
          </ul>
        </div>

        {/* Mobile App */}
        <div className="bg-white rounded-lg p-4 border border-blue-100 dark:bg-gray-800 dark:border-blue-700">
          <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2 dark:text-gray-100">
            <Smartphone className="w-4 h-4" />
            Mobile Remote Control
          </h5>
          <p className="text-gray-700 mb-2 dark:text-gray-300">
            Access this URL on any mobile device connected to the same network:
          </p>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs block dark:bg-gray-700 dark:text-gray-200">
            {window.location.origin}/#/remote
          </code>
          <p className="text-gray-600 text-xs mt-1 dark:text-gray-400">
            (Feature can be implemented for referee mobile control)
          </p>
        </div>

        {/* Professional Solutions */}
        <div className="bg-white rounded-lg p-4 border border-blue-100 dark:bg-gray-800 dark:border-blue-700">
          <h5 className="font-medium text-gray-900 mb-2 dark:text-gray-100">Professional Referee Systems</h5>
          <ul className="space-y-1 text-gray-700 text-xs dark:text-gray-300">
            <li>• <strong>Referee Watch Systems:</strong> Integrate with systems like RefLink or similar</li>
            <li>• <strong>Wireless Buzzers:</strong> Simple start/stop buttons for referees</li>
            <li>• <strong>Court-side Tablets:</strong> Dedicated control interface for officials</li>
            <li>• <strong>API Integration:</strong> Connect with existing sports timing systems</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900 dark:border-yellow-700">
        <p className="text-yellow-800 text-xs dark:text-yellow-200">
          <strong>Quick Setup:</strong> For immediate use, any USB foot pedal or wireless presenter
          can be configured to send spacebar presses for start/stop control.
        </p>
      </div>
    </div>
  );
};
