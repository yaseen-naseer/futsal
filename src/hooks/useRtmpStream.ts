import { useCallback, useRef, useState } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

/**
 * Hook for capturing an overlay element and pushing it to an RTMP endpoint.
 * The overlay can be a canvas element (using `captureStream`) or any
 * HTMLElement that implements `captureStream`. Recorded data is transcoded
 * with `ffmpeg.wasm` and sent to the concatenated RTMP url.
 *
 * Note: A proper fallback for generic HTMLElements that do not support
 * `captureStream` would require an additional rasterisation step (e.g. via
 * html2canvas). This is left as a TODO.
 */
export const useRtmpStream = (
  overlay: HTMLElement | HTMLCanvasElement | null,
  rtmpUrl: string,
  streamKey: string,
) => {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const ffmpegRef = useRef<{
    ffmpeg: FFmpeg;
    fetchFile: (file: Blob | string) => Promise<Uint8Array>;
  } | null>(null);
  const processingRef = useRef<Promise<void>>(Promise.resolve());

  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionState, setConnectionState] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    if (isStreaming || !overlay) {
      return;
    }

    let stream: MediaStream;

    type Captureable = HTMLElement & { captureStream?: () => MediaStream };
    if ((overlay as Captureable).captureStream) {
      // Canvas or other element with captureStream support
      stream = (overlay as Captureable).captureStream!();
    } else {
      // TODO: Implement HTMLElement capture using html2canvas + MediaRecorder
      throw new Error('Provided overlay element cannot be captured.');
    }

    try {
      setConnectionState('connecting');

      // Dynamic import of ffmpeg.wasm to avoid bundling when not needed
      const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
      const ffmpeg = createFFmpeg({ log: false });
      await ffmpeg.load();
      ffmpegRef.current = { ffmpeg, fetchFile };

      const target = rtmpUrl.endsWith('/')
        ? rtmpUrl + streamKey
        : `${rtmpUrl}/${streamKey}`;
      const wsUrl = target.replace(/^rtmp(s)?:\/\//, 'ws$1://');
      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';
      ws.onopen = () => setConnectionState('connected');
      ws.onerror = e => {
        console.error('WebSocket error', e);
        setConnectionState('error');
        setError('WebSocket connection failed');
      };
      ws.onclose = () => {
        setConnectionState(prev => (prev === 'error' ? 'error' : 'disconnected'));
        setIsStreaming(false);
      };
      wsRef.current = ws;

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      const processChunk = async (blob: Blob) => {
        if (!ffmpegRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }
        const { ffmpeg, fetchFile } = ffmpegRef.current;
        try {
          ffmpeg.FS('writeFile', 'input.webm', await fetchFile(blob));
          await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-f', 'flv', 'output.flv');
          const data = ffmpeg.FS('readFile', 'output.flv');
          wsRef.current.send(data.buffer);
          ffmpeg.FS('unlink', 'input.webm');
          ffmpeg.FS('unlink', 'output.flv');
        } catch (err) {
          console.error('Failed to push chunk', err);
          setError('Encoding error');
          setConnectionState('error');
          wsRef.current.close();
        }
      };

      processingRef.current = Promise.resolve();

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          processingRef.current = processingRef.current.then(() => processChunk(event.data));
        }
      };

      recorder.start(1000);
      recorderRef.current = recorder;
      setIsStreaming(true);
    } catch (err) {
      console.error('Failed to start streaming', err);
      setConnectionState('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [overlay, rtmpUrl, streamKey, isStreaming]);

  const stop = useCallback(() => {
    if (!isStreaming) {
      return;
    }
    recorderRef.current?.stop();
    recorderRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    ffmpegRef.current = null;
    setIsStreaming(false);
    setConnectionState('disconnected');
  }, [isStreaming]);

  return { start, stop, isStreaming, connectionState, error };
};

export default useRtmpStream;

