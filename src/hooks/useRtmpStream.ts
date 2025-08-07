import { useCallback, useRef, useState } from 'react';

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
  const chunksRef = useRef<Blob[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

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

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      try {
        // Dynamic import of ffmpeg.wasm to avoid bundling when not needed
        const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
        const ffmpeg = createFFmpeg({ log: false });
        await ffmpeg.load();

        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        chunksRef.current = [];

        ffmpeg.FS('writeFile', 'input.webm', await fetchFile(blob));
        await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-f', 'flv', 'output.flv');
        const data = ffmpeg.FS('readFile', 'output.flv');

        const target = rtmpUrl.endsWith('/') ? rtmpUrl + streamKey : `${rtmpUrl}/${streamKey}`;
        await fetch(target, {
          method: 'POST',
          headers: { 'Content-Type': 'application/octet-stream' },
          body: data.buffer,
        });
        } catch (error) {
          console.error('Failed to push stream', error);
        }
      };

    recorder.start(1000);
    recorderRef.current = recorder;
    setIsStreaming(true);
  }, [overlay, rtmpUrl, streamKey, isStreaming]);

  const stop = useCallback(() => {
    if (!isStreaming) {
      return;
    }
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsStreaming(false);
  }, [isStreaming]);

  return { start, stop, isStreaming };
};

export default useRtmpStream;

