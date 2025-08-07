import React, { useEffect, useState } from 'react';

/**
 * Simple panel to configure RTMP streaming credentials.
 *
 * Values are persisted to localStorage so the form remembers
 * previous input on reload. A helper button concatenates the
 * configured URL and stream key for easy sharing.
 */
const StreamingControlPanel: React.FC = () => {
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  // Load any stored values on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedUrl = window.localStorage.getItem('rtmp.url') ?? '';
    const storedKey = window.localStorage.getItem('rtmp.key') ?? '';
    setRtmpUrl(storedUrl);
    setStreamKey(storedKey);
    setIsValidUrl(validateUrl(storedUrl));
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('rtmp.url', rtmpUrl);
    window.localStorage.setItem('rtmp.key', streamKey);
  }, [rtmpUrl, streamKey]);

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
    setRtmpUrl(value);
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
          onChange={e => setStreamKey(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!isValidUrl}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        Copy link
      </button>
    </form>
  );
};

export default StreamingControlPanel;
