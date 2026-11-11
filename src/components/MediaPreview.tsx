import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  QrCode,
  Volume2,
  VolumeX,
  Maximize2,
  Play,
  Pause,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Music,
  Film,
} from 'lucide-react';
import { ExtractionResult, MediaItem } from '../types';
import { useApp } from '../context/AppContext';

interface MediaPreviewProps {
  data: ExtractionResult;
  onReset: () => void;
  onOpenQr: (url: string, title: string) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ data, onReset, onOpenQr }) => {
  const { addToHistory, showToast, t } = useApp();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  // Custom Video Player States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');

  // Audio Player States
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const isVideoCategory = data.category === 'video' || data.category === 'reels';
  const isPhotoCategory = data.category === 'photo';
  const isAudioCategory = data.category === 'audio';
  const isStoryCategory = data.category === 'story';
  const isMultiItem = data.items.length > 1;

  // Primary item currently selected (for carousel) or first item
  const currentItem = data.items[carouselIndex] || data.items[0];

  // Guaranteed audio item extracted or derived for video/reel/story media
  const audioItem: MediaItem = data.items.find((it) => it.type === 'audio') || {
    id: `${currentItem?.id || 'media'}-audio`,
    type: 'audio',
    url: currentItem?.url || '',
    thumbnail: currentItem?.thumbnail || '',
    quality: 'Original Audio (MP3 320kbps)',
    downloadFilename: (currentItem?.downloadFilename || 'snapsave_media.mp4').replace(/\.mp4$/i, '') + '_audio.mp3',
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(formatSeconds(cur));
      if (dur > 0) {
        setVideoProgress((cur / dur) * 100);
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(formatSeconds(videoRef.current.duration));
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleDownload = (item: MediaItem) => {
    setDownloadingId(item.id);
    setDownloadSuccess(null);

    // Save entry to local history with user consent
    addToHistory({
      category: data.category,
      title: data.title || `${item.type.toUpperCase()} from @${data.author.username}`,
      thumbnail: item.thumbnail,
      author: data.author.username,
      downloadUrl: item.url,
      filename: item.downloadFilename,
      quality: item.quality,
    });

    // Call server-side proxy endpoint for attachment download
    const proxyUrl = `/api/download/proxy?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(
      item.downloadFilename
    )}&type=${encodeURIComponent(item.type)}`;

    const link = document.createElement('a');
    link.href = proxyUrl;
    link.setAttribute('download', item.downloadFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Success confirmation
    const successMsg = `Download initiated! Saving "${item.downloadFilename}" in original quality.`;
    setDownloadSuccess(successMsg);
    showToast(successMsg);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      showToast(t.linkCopied);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Reference Screenshot Style: Pure White Background Card with subtle modern border and shadow */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-indigo-950/10 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        
        {/* Centered Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Download</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Search Result
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <span>@{data.author.username}</span>
            <span>•</span>
            <span className="capitalize">{data.category}</span>
            {data.items[0]?.quality && (
              <>
                <span>•</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {data.items[0]?.quality.split('(')[0]}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Notice/Alert if applicable */}
        {data.notice && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p>{data.notice}</p>
          </div>
        )}

        {/* Download Success Confirmation Message Banner */}
        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{downloadSuccess}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 1: VIDEO AND REELS                                        */}
        {/* ============================================================== */}
        {isVideoCategory && currentItem && (
          <div className="flex flex-col items-center">
            {/* Large Black Video Preview Area */}
            <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black aspect-video sm:aspect-16/10 max-h-[500px] flex items-center justify-center shadow-lg group">
              <video
                ref={videoRef}
                src={currentItem.url}
                poster={currentItem.thumbnail}
                playsInline
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full max-h-[500px] object-contain bg-black cursor-pointer"
                onClick={togglePlay}
              />

              {/* Big Centered Play/Pause Button Overlay (fades out when playing) */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-xl backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer z-10"
                >
                  <Play className="w-8 h-8 fill-white ml-1" />
                </button>
              )}

              {/* Professional Video Controls in the Top-Right */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                {/* Quality Badge */}
                <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase border border-white/10">
                  {currentItem.quality.includes('1080') ? '1080p HD' : 'HD Video'}
                </div>

                {/* Sound Toggle */}
                <button
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Fullscreen Control */}
                <button
                  onClick={toggleFullscreen}
                  title="Fullscreen"
                  className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Video Progress & Duration Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-[11px] font-mono text-white/90 z-20">
                <div className="flex items-center gap-2">
                  <button onClick={togglePlay} className="hover:text-blue-400 transition-colors cursor-pointer">
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  </button>
                  <span>{currentTime} / {videoDuration !== '0:00' ? videoDuration : currentItem.duration || '0:15'}</span>
                </div>
                <span className="text-white/70">MP4 • 24fps</span>
              </div>
            </div>

            {/* Video Duration & Quality specs below video */}
            <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400 px-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Film className="w-3.5 h-3.5 text-blue-500" />
                <span>Format: {currentItem.quality}</span>
              </span>
              {currentItem.formattedSize && (
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Size: {currentItem.formattedSize}
                </span>
              )}
            </div>

            {/* PROMINENT DUAL DOWNLOAD BUTTONS: VIDEO & AUDIO */}
            <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Download Video Button */}
              <button
                onClick={() => handleDownload(currentItem)}
                disabled={downloadingId === currentItem.id}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {downloadingId === currentItem.id
                    ? 'Starting Download...'
                    : `Download Video (${currentItem.quality.split(' ')[0]})`}
                </span>
              </button>

              {/* Primary Download Audio Button */}
              <button
                onClick={() => handleDownload(audioItem)}
                disabled={downloadingId === audioItem.id}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white font-extrabold text-base shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2.5 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <Music className="w-5 h-5 stroke-[2.5]" />
                <span>
                  {downloadingId === audioItem.id
                    ? 'Starting Download...'
                    : 'Download Audio (MP3)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 2: PHOTO & CAROUSEL                                       */}
        {/* ============================================================== */}
        {isPhotoCategory && currentItem && (
          <div className="flex flex-col items-center">
            {/* Image Preview Container */}
            <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 aspect-4/3 sm:aspect-16/10 max-h-[500px] flex items-center justify-center shadow-lg group">
              <img
                src={currentItem.thumbnail || currentItem.url}
                alt={data.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[500px] object-contain rounded-2xl"
              />

              {/* Zoom Modal Button */}
              <button
                onClick={() => setImageModalUrl(currentItem.url)}
                title="View full resolution"
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer opacity-90 hover:opacity-100"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Carousel Arrows if multiple photos */}
              {isMultiItem && (
                <>
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : data.items.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition-transform hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev < data.items.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition-transform hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold backdrop-blur-md">
                    Photo {carouselIndex + 1} of {data.items.length}
                  </div>
                </>
              )}
            </div>

            {/* Photo thumbnails if carousel */}
            {isMultiItem && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {data.items.map((it, idx) => (
                  <button
                    key={it.id}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      carouselIndex === idx
                        ? 'border-blue-600 scale-105 shadow-md shadow-blue-500/20'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={it.thumbnail} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* LARGE DOWNLOAD IMAGE BUTTON DIRECTLY BELOW IT */}
            <div className="w-full mt-4">
              <button
                onClick={() => handleDownload(currentItem)}
                disabled={downloadingId === currentItem.id}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <Download className="w-6 h-6 stroke-[2.5]" />
                <span>
                  {downloadingId === currentItem.id
                    ? 'Starting Download...'
                    : `Download Image ${isMultiItem ? `(#${carouselIndex + 1})` : ''} (Original HD)`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 3: CURRENT STORY ONLY                                     */}
        {/* ============================================================== */}
        {isStoryCategory && currentItem && (
          <div className="flex flex-col items-center">
            {/* Story Indicator Badge */}
            <div className="w-full max-w-sm flex items-center justify-between mb-3 px-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                Current Active Story
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                @{data.author.username}
              </span>
            </div>

            {/* Vertical 9:16 Aspect Story Preview Container */}
            <div className="w-full max-w-sm relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black aspect-9/16 max-h-[520px] flex items-center justify-center shadow-xl group border border-slate-200 dark:border-slate-800">
              {currentItem.type === 'video' ? (
                <video
                  src={currentItem.url}
                  poster={currentItem.thumbnail}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={currentItem.thumbnail || currentItem.url}
                  alt="Current Instagram Story"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Story Specs */}
            <div className="w-full max-w-sm flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400 px-1">
              <span className="font-medium">
                {currentItem.type === 'video' ? 'Video Story (MP4)' : 'Photo Story (JPG)'}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {currentItem.quality}
              </span>
            </div>

            {/* Prominent Action Buttons: Video + Audio options for video story */}
            {currentItem.type === 'video' ? (
              <div className="w-full max-w-sm mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleDownload(currentItem)}
                  disabled={downloadingId === currentItem.id}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{downloadingId === currentItem.id ? 'Downloading...' : 'Download Video'}</span>
                </button>

                <button
                  onClick={() => handleDownload(audioItem)}
                  disabled={downloadingId === audioItem.id}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <Music className="w-4 h-4 stroke-[2.5]" />
                  <span>{downloadingId === audioItem.id ? 'Downloading...' : 'Download Audio (MP3)'}</span>
                </button>
              </div>
            ) : (
              <div className="w-full max-w-sm mt-4">
                <button
                  onClick={() => handleDownload(currentItem)}
                  disabled={downloadingId === currentItem.id}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>{downloadingId === currentItem.id ? 'Starting Download...' : 'Download Story Photo'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE 4: AUDIO                                                  */}
        {/* ============================================================== */}
        {isAudioCategory && currentItem && (
          <div className="flex flex-col items-center">
            {/* Audio Player Container */}
            <div className="w-full p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 animate-pulse">
                <Music className="w-10 h-10 text-blue-400" />
              </div>

              <h3 className="text-base sm:text-lg font-bold mb-1 max-w-md line-clamp-1">
                {data.title || 'Original Reel Audio Track'}
              </h3>
              <p className="text-xs text-blue-300 mb-5 font-mono">
                High-Bitrate 320 kbps MP3 • Clear Studio Quality
              </p>

              {/* Native Audio Player */}
              <audio
                ref={audioRef}
                src={currentItem.url}
                controls
                className="w-full max-w-md mb-2"
                onPlay={() => setIsAudioPlaying(true)}
                onPause={() => setIsAudioPlaying(false)}
              />
            </div>

            {/* LARGE DOWNLOAD AUDIO BUTTON DIRECTLY BELOW AUDIO PLAYER */}
            <div className="w-full mt-4">
              <button
                onClick={() => handleDownload(currentItem)}
                disabled={downloadingId === currentItem.id}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <Download className="w-6 h-6 stroke-[2.5]" />
                <span>
                  {downloadingId === currentItem.id ? 'Starting Download...' : 'Download Audio (320kbps MP3)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Bottom Utility Actions: Reset, Copy Link, QR Code, Source Link  */}
        {/* ============================================================== */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyLink(currentItem?.url || data.sourceUrl, 'share-link')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              {copiedId === 'share-link' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'share-link' ? 'Copied Link' : 'Copy Direct Link'}</span>
            </button>

            <button
              onClick={() => onOpenQr(currentItem?.url || data.sourceUrl, currentItem?.downloadFilename || 'media')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Mobile QR</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>View Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
            >
              Download Another
            </button>
          </div>
        </div>

      </div>

      {/* Image Zoom Modal */}
      {imageModalUrl && (
        <div
          onClick={() => setImageModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-200"
        >
          <img
            src={imageModalUrl}
            alt="Full Resolution View"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
