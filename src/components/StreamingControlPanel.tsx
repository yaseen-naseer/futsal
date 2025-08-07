import React, { useEffect, useState } from 'react';

interface StreamingControlPanelProps {
  rtmpUrl: string;
  streamKey: string;
  onUrlChange: (url: string) => void;
  onKeyChange: (key: string) => void;
  onStart: () => Promise<void> | void;
  onStop: () => void;
  isStreaming: boolean;
}

/**
 * Panel to configure RTMP streaming credentials and control the stream.
 * Values are provided by the parent component and persisted there.
 */
const StreamingControlPanel: React.FC<StreamingControlPanelProps> = ({
  rtmpUrl,
  streamKey,
  onUrlChange,
  onKeyChange,
  onStart,
  onStop,
  isStreaming,
}) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsValidUrl(validateUrl(rtmpUrl));
  }, [rtmpUrl]);

  const validateUrl = (url: string) => {
    if (!url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUrlChange(value);
    setIsValidUrl(validateUrl(value));
  };

  const handleCopy = async () => {
    const base = rtmpUrl.replace(/\/$/, '');
    const link = streamKey ? `${base}/${streamKey}` : base;
    const clipboard =
      typeof navigator !== 'undefined' && navigator.clipboard
        ? navigator.clipboard
        : null;
    if (!clipboard) {
      if (typeof window !== 'undefined') {
        window.alert('Clipboard API is not available in this environment');
      }
      return;
    }
    await clipboard.writeText(link);
  };

  const handleStart = async () => {
    if (!isValidUrl) {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');
    try {
      await onStart();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start stream';
      setError(`Failed to connect: ${message}`);
    }
  };

  return (
    <form className="p-4 space-y-4">
      <div>
        <label htmlFor="rtmpUrl" className="block mb-1 font-medium">
          RTMP URL
        </label>
        <input
          id="rtmpUrl"
          type="url"
          value={rtmpUrl}
          onChange={handleUrlChange}
          className="w-full border rounded px-2 py-1"
        />
        {!isValidUrl && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid URL.</p>
        )}
      </div>

      <div>
        <label htmlFor="streamKey" className="block mb-1 font-medium">
          Stream Key (optional)
        </label>
        <input
          id="streamKey"
          type="text"
          value={streamKey}
          onChange={e => onKeyChange(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!isValidUrl}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Copy link
        </button>
        <button
          type="button"
          onClick={handleStart}
          disabled={!isValidUrl || isStreaming}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Start
        </button>
        <button
          type="button"
          onClick={onStop}
          disabled={!isStreaming}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Stop
        </button>
      </div>

      <p className="text-sm mt-2">
        Status{' '}
        <span className={isStreaming ? 'text-green-600' : 'text-gray-600'}>
          {isStreaming ? 'Streaming…' : 'Disconnected'}
        </span>
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p>
          Use the following in OBS or similar software under <strong>Settings &gt; Stream</strong>:
        </p>
        <p>
          <strong>Server:</strong> {rtmpUrl || '—'}
        </p>
        <p>
          <strong>Stream Key:</strong> {streamKey || '—'}
        </p>
      </div>
    </form>
  );
};

export default StreamingControlPanel;
