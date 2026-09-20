import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Eye, EyeOff, Activity, AlertTriangle, TrendingUp, Shield } from 'lucide-react';

/**
 * BodyLanguageAnalyzer
 * 
 * Uses MediaPipe Face Landmarker (in-browser, no backend) to analyze:
 * - Eye contact (gaze direction via iris landmarks)
 * - Head stability (confidence via head movement tracking)
 * - Nervous movements (fidgeting via rapid position changes)
 * 
 * All processing happens client-side — no video data leaves the browser.
 */

// Landmark indices for key facial features
const LEFT_IRIS = [468, 469, 470, 471, 472];
const RIGHT_IRIS = [473, 474, 475, 476, 477];
const NOSE_TIP = 1;
const LEFT_EYE_INNER = 133;
const LEFT_EYE_OUTER = 33;
const RIGHT_EYE_INNER = 362;
const RIGHT_EYE_OUTER = 263;
const FOREHEAD = 10;
const CHIN = 152;

const BodyLanguageAnalyzer = ({ videoElement, isActive, onAnalysisUpdate }) => {
  const [metrics, setMetrics] = useState({
    eyeContact: 100,
    confidence: 100,
    stability: 100,
    alerts: []
  });

  const [sessionStats, setSessionStats] = useState({
    totalFrames: 0,
    eyeContactFrames: 0,
    avgConfidence: 100,
    avgStability: 100,
    nervousEpisodes: 0
  });

  const faceLandmarkerRef = useRef(null);
  const analysisLoopRef = useRef(null);
  const prevPositionsRef = useRef([]);
  const movementHistoryRef = useRef([]);
  const eyeContactHistoryRef = useRef([]);
  const isInitializedRef = useRef(false);

  // Initialize MediaPipe Face Landmarker
  const initFaceLandmarker = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const { FaceLandmarker, FilesetResolver } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true
      });

      faceLandmarkerRef.current = faceLandmarker;
      isInitializedRef.current = true;
      console.log('✅ MediaPipe Face Landmarker initialized');
    } catch (error) {
      console.error('❌ Failed to initialize MediaPipe:', error);
      // Fall back to motion-based analysis
      isInitializedRef.current = false;
    }
  }, []);

  // Calculate eye contact from iris positions
  const calculateEyeContact = useCallback((landmarks) => {
    if (!landmarks || landmarks.length === 0) return 0;

    const face = landmarks[0];

    // Get iris centers
    const leftIrisCenter = {
      x: LEFT_IRIS.reduce((sum, i) => sum + face[i].x, 0) / LEFT_IRIS.length,
      y: LEFT_IRIS.reduce((sum, i) => sum + face[i].y, 0) / LEFT_IRIS.length
    };

    const rightIrisCenter = {
      x: RIGHT_IRIS.reduce((sum, i) => sum + face[i].x, 0) / RIGHT_IRIS.length,
      y: RIGHT_IRIS.reduce((sum, i) => sum + face[i].y, 0) / RIGHT_IRIS.length
    };

    // Get eye bounds
    const leftEyeWidth = Math.abs(face[LEFT_EYE_OUTER].x - face[LEFT_EYE_INNER].x);
    const rightEyeWidth = Math.abs(face[RIGHT_EYE_OUTER].x - face[RIGHT_EYE_INNER].x);

    // Calculate how centered the iris is within the eye
    const leftEyeCenter = (face[LEFT_EYE_OUTER].x + face[LEFT_EYE_INNER].x) / 2;
    const rightEyeCenter = (face[RIGHT_EYE_OUTER].x + face[RIGHT_EYE_INNER].x) / 2;

    const leftOffset = Math.abs(leftIrisCenter.x - leftEyeCenter) / (leftEyeWidth || 1);
    const rightOffset = Math.abs(rightIrisCenter.x - rightEyeCenter) / (rightEyeWidth || 1);

    // Average offset — lower means better eye contact
    const avgOffset = (leftOffset + rightOffset) / 2;

    // Convert to 0-100 score (0 offset = 100% eye contact)
    const eyeContactScore = Math.max(0, Math.min(100, (1 - avgOffset * 3) * 100));

    return eyeContactScore;
  }, []);

  // Calculate head stability (confidence proxy)
  const calculateStability = useCallback((landmarks) => {
    if (!landmarks || landmarks.length === 0) return 100;

    const face = landmarks[0];
    const noseTip = face[NOSE_TIP];
    const forehead = face[FOREHEAD];
    const chin = face[CHIN];

    const currentPosition = {
      noseX: noseTip.x,
      noseY: noseTip.y,
      headTilt: Math.abs(forehead.x - chin.x),
      headNod: Math.abs(forehead.y - chin.y)
    };

    const prev = prevPositionsRef.current;
    prev.push(currentPosition);

    // Keep last 15 frames
    if (prev.length > 15) prev.shift();
    if (prev.length < 3) return 100;

    // Calculate movement variance
    let totalMovement = 0;
    for (let i = 1; i < prev.length; i++) {
      const dx = prev[i].noseX - prev[i - 1].noseX;
      const dy = prev[i].noseY - prev[i - 1].noseY;
      totalMovement += Math.sqrt(dx * dx + dy * dy);
    }

    const avgMovement = totalMovement / (prev.length - 1);

    // Convert to stability score (less movement = higher stability)
    const stabilityScore = Math.max(0, Math.min(100, (1 - avgMovement * 50) * 100));

    return stabilityScore;
  }, []);

  // Generate alerts based on metrics
  const generateAlerts = useCallback((eyeContact, stability) => {
    const alerts = [];

    if (eyeContact < 40) {
      alerts.push({ type: 'warning', message: 'Looking away too often', icon: 'eye' });
    } else if (eyeContact < 60) {
      alerts.push({ type: 'info', message: 'Try maintaining more eye contact', icon: 'eye' });
    }

    if (stability < 35) {
      alerts.push({ type: 'warning', message: 'Excessive movement detected', icon: 'activity' });
    } else if (stability < 55) {
      alerts.push({ type: 'info', message: 'Try to stay still', icon: 'activity' });
    }

    return alerts;
  }, []);

  // Main analysis loop
  const runAnalysis = useCallback(() => {
    if (!isActive || !videoElement) return;

    const video = videoElement;

    if (video.readyState < 2) {
      analysisLoopRef.current = requestAnimationFrame(runAnalysis);
      return;
    }

    const now = performance.now();

    if (faceLandmarkerRef.current && isInitializedRef.current) {
      try {
        const results = faceLandmarkerRef.current.detectForVideo(video, now);

        if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
          const eyeContact = calculateEyeContact(results.faceLandmarks);
          const stability = calculateStability(results.faceLandmarks);

          // Smooth values using exponential moving average
          const alpha = 0.3;
          const smoothedEyeContact = alpha * eyeContact + (1 - alpha) * (eyeContactHistoryRef.current[eyeContactHistoryRef.current.length - 1] || 100);
          const smoothedStability = alpha * stability + (1 - alpha) * (movementHistoryRef.current[movementHistoryRef.current.length - 1] || 100);

          // Confidence is a blend of eye contact and stability
          const confidence = Math.round(smoothedEyeContact * 0.5 + smoothedStability * 0.5);

          eyeContactHistoryRef.current.push(smoothedEyeContact);
          movementHistoryRef.current.push(smoothedStability);

          // Keep history manageable
          if (eyeContactHistoryRef.current.length > 300) eyeContactHistoryRef.current.shift();
          if (movementHistoryRef.current.length > 300) movementHistoryRef.current.shift();

          const alerts = generateAlerts(smoothedEyeContact, smoothedStability);

          const newMetrics = {
            eyeContact: Math.round(smoothedEyeContact),
            confidence: confidence,
            stability: Math.round(smoothedStability),
            alerts
          };

          setMetrics(newMetrics);

          // Update session stats
          setSessionStats(prev => {
            const newTotal = prev.totalFrames + 1;
            const newEyeFrames = prev.eyeContactFrames + (smoothedEyeContact > 60 ? 1 : 0);
            return {
              totalFrames: newTotal,
              eyeContactFrames: newEyeFrames,
              avgConfidence: Math.round((prev.avgConfidence * prev.totalFrames + confidence) / newTotal),
              avgStability: Math.round((prev.avgStability * prev.totalFrames + smoothedStability) / newTotal),
              nervousEpisodes: prev.nervousEpisodes + (smoothedStability < 30 ? 1 : 0)
            };
          });

          // Notify parent
          if (onAnalysisUpdate) {
            onAnalysisUpdate(newMetrics);
          }
        }
      } catch (err) {
        // Silently handle frame analysis errors
      }
    } else {
      // Fallback: basic motion detection via canvas pixel diff
      runFallbackAnalysis(video);
    }

    // Run at ~12fps for performance
    setTimeout(() => {
      analysisLoopRef.current = requestAnimationFrame(runAnalysis);
    }, 80);
  }, [isActive, videoElement, calculateEyeContact, calculateStability, generateAlerts, onAnalysisUpdate]);

  // Fallback motion-based analysis when MediaPipe isn't available
  const fallbackCanvasRef = useRef(null);
  const prevFrameRef = useRef(null);

  const runFallbackAnalysis = useCallback((video) => {
    if (!fallbackCanvasRef.current) {
      fallbackCanvasRef.current = document.createElement('canvas');
      fallbackCanvasRef.current.width = 160;
      fallbackCanvasRef.current.height = 120;
    }

    const canvas = fallbackCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, 160, 120);
    const currentFrame = ctx.getImageData(0, 0, 160, 120);

    if (prevFrameRef.current) {
      let diff = 0;
      const data1 = prevFrameRef.current.data;
      const data2 = currentFrame.data;
      const len = data1.length;

      // Sample every 16th pixel for performance
      for (let i = 0; i < len; i += 16) {
        diff += Math.abs(data1[i] - data2[i]);
      }
      diff /= (len / 16);

      // Convert motion to stability (less motion = more stable)
      const stability = Math.max(0, Math.min(100, 100 - diff * 8));
      const confidence = Math.max(30, stability);

      setMetrics({
        eyeContact: -1, // -1 means unavailable
        confidence: Math.round(confidence),
        stability: Math.round(stability),
        alerts: stability < 40 ? [{ type: 'warning', message: 'Excessive movement detected', icon: 'activity' }] : []
      });
    }

    prevFrameRef.current = currentFrame;
  }, []);

  // Initialize and start/stop analysis
  useEffect(() => {
    if (isActive && videoElement) {
      initFaceLandmarker().then(() => {
        analysisLoopRef.current = requestAnimationFrame(runAnalysis);
      });
    }

    return () => {
      if (analysisLoopRef.current) {
        cancelAnimationFrame(analysisLoopRef.current);
      }
    };
  }, [isActive, videoElement, initFaceLandmarker, runAnalysis]);

  // Get session summary for parent component
  const getSessionSummary = useCallback(() => {
    const { totalFrames, eyeContactFrames, avgConfidence, avgStability, nervousEpisodes } = sessionStats;
    if (totalFrames === 0) return null;

    const eyeContactPct = Math.round((eyeContactFrames / totalFrames) * 100);
    const insights = [];

    if (eyeContactPct > 70) insights.push('✅ Great eye contact maintained throughout');
    else if (eyeContactPct > 45) insights.push('⚠️ Eye contact could be improved — try looking at the camera more');
    else insights.push('❌ Poor eye contact — you looked away frequently');

    if (avgConfidence > 70) insights.push('✅ Confident posture detected');
    else if (avgConfidence > 45) insights.push('⚠️ Moderate confidence — try sitting up straighter');
    else insights.push('❌ Low confidence posture — practice maintaining a strong posture');

    if (nervousEpisodes < 5) insights.push('✅ Minimal nervous movements');
    else if (nervousEpisodes < 20) insights.push('⚠️ Some fidgeting detected — try to stay calm');
    else insights.push('❌ Frequent nervous movements — practice stillness');

    return {
      eyeContactPercentage: eyeContactPct,
      avgConfidence,
      avgStability,
      nervousEpisodes,
      insights
    };
  }, [sessionStats]);

  // Expose summary via ref effect
  useEffect(() => {
    if (onAnalysisUpdate) {
      onAnalysisUpdate({ ...metrics, getSessionSummary });
    }
  }, [sessionStats]);

  if (!isActive) return null;

  const getMeterColor = (value) => {
    if (value > 70) return '#10b981';
    if (value > 40) return '#f59e0b';
    return '#ef4444';
  };

  const getMeterBg = (value) => {
    if (value > 70) return 'rgba(16, 185, 129, 0.15)';
    if (value > 40) return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(239, 68, 68, 0.15)';
  };

  return (
    <div className="body-language-panel">
      <div className="bl-header">
        <div className="bl-header-dot" />
        <span className="bl-header-title">BODY LANGUAGE AI</span>
        <Shield className="bl-header-icon" />
      </div>

      <div className="bl-metrics">
        {/* Eye Contact */}
        {metrics.eyeContact >= 0 && (
          <div className="bl-metric-row">
            <div className="bl-metric-label">
              {metrics.eyeContact > 60 ? (
                <Eye className="bl-metric-icon" style={{ color: getMeterColor(metrics.eyeContact) }} />
              ) : (
                <EyeOff className="bl-metric-icon" style={{ color: getMeterColor(metrics.eyeContact) }} />
              )}
              <span>Eye Contact</span>
            </div>
            <div className="bl-meter-track" style={{ background: getMeterBg(metrics.eyeContact) }}>
              <div
                className="bl-meter-fill"
                style={{
                  width: `${metrics.eyeContact}%`,
                  background: getMeterColor(metrics.eyeContact)
                }}
              />
            </div>
            <span className="bl-metric-value" style={{ color: getMeterColor(metrics.eyeContact) }}>
              {metrics.eyeContact}%
            </span>
          </div>
        )}

        {/* Confidence */}
        <div className="bl-metric-row">
          <div className="bl-metric-label">
            <TrendingUp className="bl-metric-icon" style={{ color: getMeterColor(metrics.confidence) }} />
            <span>Confidence</span>
          </div>
          <div className="bl-meter-track" style={{ background: getMeterBg(metrics.confidence) }}>
            <div
              className="bl-meter-fill"
              style={{
                width: `${metrics.confidence}%`,
                background: getMeterColor(metrics.confidence)
              }}
            />
          </div>
          <span className="bl-metric-value" style={{ color: getMeterColor(metrics.confidence) }}>
            {metrics.confidence}%
          </span>
        </div>

        {/* Stability */}
        <div className="bl-metric-row">
          <div className="bl-metric-label">
            <Activity className="bl-metric-icon" style={{ color: getMeterColor(metrics.stability) }} />
            <span>Stability</span>
          </div>
          <div className="bl-meter-track" style={{ background: getMeterBg(metrics.stability) }}>
            <div
              className="bl-meter-fill"
              style={{
                width: `${metrics.stability}%`,
                background: getMeterColor(metrics.stability)
              }}
            />
          </div>
          <span className="bl-metric-value" style={{ color: getMeterColor(metrics.stability) }}>
            {metrics.stability}%
          </span>
        </div>
      </div>

      {/* Alerts */}
      {metrics.alerts.length > 0 && (
        <div className="bl-alerts">
          {metrics.alerts.map((alert, i) => (
            <div key={i} className={`bl-alert bl-alert-${alert.type}`}>
              <AlertTriangle className="bl-alert-icon" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BodyLanguageAnalyzer;
