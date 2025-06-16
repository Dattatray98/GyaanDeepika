import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Hls from 'hls.js';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration?: string;
  views?: number;
  timestamp?: string;
  qualities?: { quality: string; url?: string; levelIndex?: number }[];
}

const LearningPageContent = () => {
  const location = useLocation();
  const incomingVideo = location.state as Video | null;
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const hlsInstance = useRef<Hls | null>(null);

  const handleQualityChange = (quality: string) => {
    if (!videoRef.current || !selectedVideo) return;

    setCurrentQuality(quality);

    if (quality === 'auto') {
      if (hlsInstance.current) {
        hlsInstance.current.currentLevel = -1;
      }
    } else {
      const levelIndex = selectedVideo.qualities?.find(q => q.quality === quality)?.levelIndex;
      if (levelIndex !== undefined && levelIndex >= 0 && hlsInstance.current) {
        hlsInstance.current.currentLevel = levelIndex;
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const setupHls = (videoUrl: string) => {
    try {
      if (videoRef.current) {
        if (hlsInstance.current) {
          hlsInstance.current.destroy();
        }

        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(videoRef.current);
          hlsInstance.current = hls;

          hls.on(Hls.Events.ERROR, (_event, data) => {
            console.error("HLS Error:", data);
            setError("Video playback error. Try refreshing or choose another video.");
          });

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            const levels = hls.levels.map((level, index) => ({
              quality: `${level.height}p`,
              levelIndex: index
            }));
            if (selectedVideo) {
              setSelectedVideo(prev => prev ? { ...prev, qualities: levels } : null);
            }
          });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = videoUrl;
        } else {
          throw new Error("HLS not supported on this device.");
        }
      }
    } catch (err: any) {
      console.error("setupHls error:", err);
      setError("Failed to initialize video. Please try another video.");
    }
  };

  useEffect(() => {
    if (incomingVideo) {
      setSelectedVideo(incomingVideo);
    }
  }, [incomingVideo]);

  useEffect(() => {
    if (selectedVideo) {
      setError(null);
      setupHls(selectedVideo.videoUrl);
    }
  }, [selectedVideo]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setError(null);
        const response = await axios.get<Video[]>("http://localhost:8000/videos");
        if (Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError("Unable to load videos. Please try again later.");
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="dark bg-[#0f172a] text-white min-h-screen p-4">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-2" ref={playerContainerRef}>
          {selectedVideo ? (
            <div className="relative">
              <video
                ref={videoRef}
                controls
                className="w-full h-[70vh] rounded-lg shadow-lg border"
                aria-label={`Video player for ${selectedVideo.title}`}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center">
                    <label htmlFor="speed" className="mr-2">Speed:</label>
                    <select
                      id="speed"
                      value={playbackRate}
                      onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                      className="bg-black/50 text-white p-1 rounded"
                    >
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <option key={speed} value={speed}>{speed}x</option>
                      ))}
                    </select>
                  </div>

                  {selectedVideo.qualities && (
                    <div className="flex items-center">
                      <label htmlFor="quality" className="mr-2">Quality:</label>
                      <select
                        id="quality"
                        value={currentQuality}
                        onChange={(e) => handleQualityChange(e.target.value)}
                        className="bg-black/50 text-white p-1 rounded"
                      >
                        <option value="auto">Auto</option>
                        {selectedVideo.qualities.map((q, i) => (
                          <option key={i} value={q.quality}>{q.quality}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    className="ml-auto bg-black/50 p-2 rounded hover:bg-black/70"
                  >
                    {isFullscreen ? '⤢' : '⤡'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[70vh] flex items-center justify-center bg-gray-700 rounded-lg">
              <p className="text-gray-300">Select a video to start learning.</p>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg p-5 shadow-md">
          <h2 className="text-2xl font-bold mb-2">
            {selectedVideo?.title || "No video selected"}
          </h2>
          <p className="text-sm text-gray-300">
            {selectedVideo?.description || "Click on a video below to view lesson details."}
          </p>

          <button className="w-full mt-4 bg-green-600 hover:bg-green-700 py-2 rounded-md">
            ✅ Mark as Completed
          </button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(videos) && videos.filter((v) => v.id !== selectedVideo?.id).map(video => (
          <div
            key={video.id}
            onClick={() => {
              setError(null);
              setSelectedVideo(video);
            }}
            className="cursor-pointer bg-slate-700 p-4 rounded shadow-md hover:shadow-xl transition"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="rounded mb-2 h-40 w-full object-cover"
            />
            <h4 className="font-semibold text-lg">{video.title}</h4>
            <p className="text-sm text-gray-300 line-clamp-2">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LearningPage = () => (
  <Router>
    <LearningPageContent />
  </Router>
);

export default LearningPage;
