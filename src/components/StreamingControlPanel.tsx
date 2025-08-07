import React, { useEffect, useState } from 'react';

const StreamingControlPanel: React.FC = () => {
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRtmpUrl(window.localStorage.getItem('rtmp.url') ?? '');
      setStreamKey(window.localStorage.getItem('rtmp.key') ?? '');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('rtmp.url', rtmpUrl);
    }
  }, [rtmpUrl]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('rtmp.key', streamKey);
    }
  }, [streamKey]);

  const validateUrl = (url: string) => {
    if (!url) return false;
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
    setIsValid(validateUrl(value));
  };

  const copyLink = async () => {
    const link = streamKey
      ? `${rtmpUrl.replace(/\/$/, '')}/${streamKey}`
      : rtmpUrl;
    await navigator.clipboard.writeText(link);
  };

  return (
    <form className="p-4 space-y-4">
      <div>
        <label className="block mb-1 font-medium" htmlFor="rtmpUrl">
          RTMP URL
        </label>
        <input
          id="rtmpUrl"
          type="url"
          value={rtmpUrl}
          onChange={handleUrlChange}
          className="w-full border rounded px-2 py-1"
        />
        {!isValid && (
          <p className="text-sm text-red-600 mt-1">Please enter a valid URL.</p>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="streamKey">
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
        onClick={copyLink}
        disabled={!validateUrl(rtmpUrl)}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        Copy link
      </button>
    </form>
  );
};

export default StreamingControlPanel;
