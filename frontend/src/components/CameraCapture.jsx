import { useEffect, useRef, useState, useCallback } from 'react'
import './CameraCapture.css'

function isSecureContext() {
  return typeof window !== 'undefined' && window.isSecureContext === true
}

function supportsUserMedia() {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia
  )
}

const CameraCapture = ({ onCapture, onCancel, busy }) => {
  const [state, setState] = useState('idle') // idle | starting | live | capturing | error
  const [facing, setFacing] = useState('environment')
  const [errorMsg, setErrorMsg] = useState('')
  const [capturedUrl, setCapturedUrl] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const previewRef = useRef(null)

  const stopStream = useCallback(() => {
    const stream = streamRef.current
    if (stream && typeof stream.getTracks === 'function') {
      stream.getTracks().forEach((t) => t.stop())
    }
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopStream()
      if (previewRef.current) {
        previewRef.current.onload = null
      }
    }
  }, [stopStream])

  const startCamera = useCallback(async () => {
    setErrorMsg('')
    setState('starting')
    try {
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setState('live')
    } catch (err) {
      if (err && err.name === 'NotAllowedError') {
        setErrorMsg('Camera access was denied. Please allow camera permission to take a picture.')
      } else if (err && err.name === 'NotFoundError') {
        setErrorMsg('No camera was found on this device.')
      } else if (err && err.name === 'NotReadableError') {
        setErrorMsg('The camera is already in use or unavailable.')
      } else {
        setErrorMsg('Unable to access the camera. You can still upload an image instead.')
      }
      setState('error')
    }
  }, [facing])

  const switchCamera = useCallback(() => {
    stopStream()
    setFacing((f) => (f === 'environment' ? 'user' : 'environment'))
  }, [stopStream])

  useEffect(() => {
    if (state === 'idle' || state === 'starting') return
    if (state !== 'live') {
      stopStream()
      return
    }
    // When facing changes, stop the current stream then restart with the new camera.
    stopStream()
    startCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facing])

  const capture = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    setState('capturing')
    canvas.toBlob((blob) => {
      if (!blob) {
        setErrorMsg('Could not process the captured image.')
        setState('live')
        return
      }
      const url = URL.createObjectURL(blob)
      setCapturedBlob(blob)
      setCapturedUrl(url)
      setState('live')
    }, 'image/png')
  }, [])

  const retake = useCallback(() => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl)
    setCapturedUrl(null)
    setCapturedBlob(null)
    setState('live')
  }, [capturedUrl])

  const cancel = useCallback(() => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl)
    if (previewRef.current) previewRef.current.onload = null
    stopStream()
    setCapturedUrl(null)
    setCapturedBlob(null)
    onCancel()
  }, [capturedUrl, stopStream, onCancel])

  const useCaptured = useCallback(() => {
    if (!capturedBlob) return
    let name = 'camera-capture.png'
    const file = new File([capturedBlob], name, { type: 'image/png' })
    onCapture(file)
    if (previewRef.current) previewRef.current.onload = null
    stopStream()
  }, [capturedBlob, onCapture, stopStream])

  // Save a reference to the rendered preview for cleanup.
  const setPreviewNode = useCallback(
    (node) => {
      previewRef.current = node
    },
    []
  )

  if (!isSecureContext()) {
    return (
      <div className="camera-shell">
        <div className="camera-msg">📷 Camera capture requires a secure (HTTPS or localhost) connection.</div>
        <div className="camera-actions">
          <button className="btn btn-outline" type="button" onClick={onCancel}>Close</button>
        </div>
      </div>
    )
  }

  if (!supportsUserMedia()) {
    return (
      <div className="camera-shell">
        <div className="camera-msg">📷 Camera capture is not supported in this browser. Please upload an image instead.</div>
        <button className="btn btn-outline" type="button" onClick={onCancel}>Close</button>
      </div>
    )
  }

  return (
    <div className="camera-shell">
      <div className="camera-topbar">
        <span className="camera-title">Take a Picture</span>
        <div className="camera-controls">
          {state === 'live' && (
            <button type="button" className="camera-icon-btn" onClick={switchCamera} title="Switch camera" aria-label="Switch camera">
              ⟳
            </button>
          )}
          <button type="button" className="camera-close-btn" onClick={cancel} aria-label="Close camera">✕</button>
        </div>
      </div>

      {state === 'idle' && (
        <div className="camera-start">
          <div className="camera-start-icon">📷</div>
          <p>Use your device camera to capture a close-up of the plant leaf, fruit or vegetable.</p>
          <button className="btn btn-primary" type="button" onClick={startCamera} disabled={busy}>
            Start Camera
          </button>
          {errorMsg && <div className="camera-error">⚠️ {errorMsg}</div>}
        </div>
      )}

      {state === 'starting' && (
        <div className="camera-busy">
          <div className="spinner"></div>
          <p>Requesting camera access...</p>
        </div>
      )}

      {state === 'error' && (
        <div className="camera-start">
          <div className="camera-error">⚠️ {errorMsg}</div>
          <button className="btn btn-primary" type="button" onClick={startCamera}>
            Try Again
          </button>
          <button className="btn btn-outline" type="button" onClick={cancel}>Close</button>
        </div>
      )}

      {state === 'live' && (
        <div className="camera-viewport">
          {capturedUrl ? (
            <>
              <img ref={setPreviewNode} className="camera-preview" src={capturedUrl} alt="Captured preview" />
              <div className="camera-preview-actions">
                <button className="btn btn-outline" type="button" onClick={retake}>↺ Retake</button>
                <button className="btn btn-primary" type="button" onClick={useCaptured} disabled={busy}>
                  ✓ Use Photo
                </button>
              </div>
            </>
          ) : (
            <>
              <video ref={videoRef} className="camera-video" playsInline muted autoPlay></video>
              <div className="camera-frame" aria-hidden="true"></div>
              <div className="camera-hint">Align the plant within the frame</div>
              <button type="button" className="camera-shutter" onClick={capture} aria-label="Capture photo"></button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CameraCapture
