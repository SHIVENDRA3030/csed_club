import React, { useState, useRef, useEffect } from 'react';
import './EventFeature.css'; // Import the CSS file for styling

const EventFeature = ({
  imageUrl,
  videoUrl,
  heading,
  subheading,
  description,
  stats,
}) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [hoveredMedia, setHoveredMedia] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentVideoSource, setCurrentVideoSource] = useState(0);

  // Multiple fallback video sources
  const videoSources = [
    videoUrl,
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
  ].filter(Boolean); // Remove any null/undefined values

  const handleVideoError = (event) => {
    const mediaError = event.target.error;
    let errorMsg = "Unknown error";

    if (mediaError) {
      switch (mediaError.code) {
        case mediaError.MEDIA_ERR_ABORTED:
          errorMsg = "Video loading was aborted";
          break;
        case mediaError.MEDIA_ERR_NETWORK:
          errorMsg = "Network error while loading video";
          break;
        case mediaError.MEDIA_ERR_DECODE:
          errorMsg = "Video codec error";
          break;
        case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = "Video format not supported";
          break;
        default:
          errorMsg = `Error code: ${mediaError.code}`;
      }
    }

    console.error("Error loading video:", errorMsg);
    console.log("Video source:", event.target.src);
    console.log("Current source index:", currentVideoSource);

    // Try next video source if available
    if (currentVideoSource < videoSources.length - 1) {
      console.log(`Trying fallback source ${currentVideoSource + 1}...`);
      setCurrentVideoSource(prev => prev + 1);
      setVideoError(false);
    } else {
      console.warn("All video sources failed");
      setVideoError(true);
    }
  };

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully");
    setVideoLoaded(true);
    setVideoError(false);
  };

  // Effect to initialize and log video sources
  useEffect(() => {
    console.log('EventFeature initialized with:', {
      providedVideoUrl: videoUrl,
      availableSources: videoSources,
      totalSources: videoSources.length
    });
  }, []);

  // Effect to handle video source changes
  useEffect(() => {
    if (videoRef.current && currentVideoSource < videoSources.length) {
      const src = videoSources[currentVideoSource];
      console.log(`Loading video source ${currentVideoSource}: ${src}`);

      // Reset video element
      videoRef.current.src = src;
      videoRef.current.load(); // Reload the video with new source
    }
  }, [currentVideoSource, videoSources]);

  // Effect to start video playing when loaded
  useEffect(() => {
    if (videoRef.current && videoLoaded && !videoError) {
      videoRef.current.play().catch(console.error);
    }
  }, [videoLoaded, videoError]);

  return (
    <div className="event-feature-container">
      <div className="hero-background-shapes"></div> {/* Add hero-background-shapes to EventFeature component */}

       {/* Left Side: Media Section (Image and Video) */}
      <div className="media-section">
        {/* Image Wrapper: Handles hover for the image */}
        <div
          className="media-wrapper media-image-wrapper"
          onMouseEnter={() => {
            setHoveredMedia('image'); // Set to 'image' to highlight image and make video transparent
          }}
          onMouseLeave={() => {
            setHoveredMedia(null); // Return to normal state
          }}
        >
          <img
            src={imageUrl || "https://placehold.co/800x500/007bff/FFFFFF?text=Image+Placeholder"}
            alt="Feature event"
            className={`media-image ${hoveredMedia === 'image' ? 'media-hovered' : ''} ${hoveredMedia === 'video' ? 'media-dimmed' : ''}`}
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x500/cccccc/333333?text=Image+Load+Error"; }}
          />
        </div>

        {/* Video Wrapper: Handles hover for the video */}
        <div
          className="media-wrapper media-video-wrapper"
          onMouseEnter={() => {
            setHoveredMedia('video');
          }}
          onMouseLeave={() => {
            setHoveredMedia(null);
          }}
        >
          {!videoError && videoSources.length > 0 ? (
            <video
              key={`video-${currentVideoSource}`}
              ref={videoRef}
              src={videoSources[currentVideoSource]}
              className={`media-video ${hoveredMedia === 'video' ? 'media-hovered' : ''} ${hoveredMedia === 'image' ? 'media-dimmed' : ''}`}
              loop
              muted
              autoPlay
              playsInline
              onError={handleVideoError}
              onLoadedData={handleVideoLoaded}
              onCanPlay={() => console.log("Video can play")}
              style={{
                opacity: videoLoaded ? (hoveredMedia === 'image' ? 0.2 : 1) : 0.5
              }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="video-fallback" style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#050208',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c9d1d9',
              borderRadius: '0.75rem',
              border: '2px solid rgba(157, 0, 255, 0.2)',
              padding: '20px'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff00c8" strokeWidth="1.5" style={{ marginBottom: '10px' }}>
                <path d="m22 2-20 20M7 7l10 10M2 22l20-20"/>
              </svg>
              <p style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>Video unavailable</p>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: '0.7', textAlign: 'center' }}>
                {videoSources.length > 0
                  ? `Tried ${currentVideoSource + 1} of ${videoSources.length} sources`
                  : 'No video source provided'}
              </p>
              {videoSources.length === 0 && (
                <p style={{ margin: '0', fontSize: '11px', opacity: '0.6', textAlign: 'center' }}>
                  Please provide a valid video URL
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Text Content Section */}
      <div className="text-section">
        <h2>{heading || "About Our Events"}</h2>
        <h3 className="subheading">
          {subheading || "INNOVATION HUB, GLA"}
        </h3>
        <p>{description || "We are the entrepreneurship cell of a premier institution, dedicated to nurturing innovation, fostering creativity, and building the next generation of leaders."}</p>

        <div className="stats-section">
          {stats && stats.length > 0 ? (
            stats.map((stat, index) => (
              <div key={index} className="stat-box">
                <span className="number">{stat.number}</span>
                <span className="label">{stat.label}</span>
              </div>
            ))
          ) : (
            <>
              <div className="stat-box">
                <span className="number">150+</span>
                <span className="label">Days of Events</span>
              </div>
              <div className="stat-box">
                <span className="number">25+</span>
                <span className="label">Keynote Speakers</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventFeature;
