import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { detectionService } from '../services/detectionService'
import CameraCapture from '../components/CameraCapture'
import './Detect.css'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_EXTS = ['jpg', 'jpeg', 'png', 'webp']

const Detect = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const fileInputRef = useRef(null)
  const [mode, setMode] = useState('upload') // upload | camera
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [sourceLabel, setSourceLabel] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)

  // Revoke previous object URL when a new file is selected or on unmount.
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    }
  }, [])

  const clearCurrent = (keepUrl = true) => {
    if (keepUrl && preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(null)
    setFile(null)
    setSourceLabel('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validateFile = (selected, label = '') => {
    if (!selected) return
    const type = selected.type
    const ext = selected.name?.split('.').pop()?.toLowerCase()
    if (!ACCEPTED_TYPES.includes(type) && !ACCEPTED_EXTS.includes(ext)) {
      setError('Unsupported file type. Please upload a JPG, JPEG, PNG or WEBP image.')
      clearCurrent(false)
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.')
      clearCurrent(false)
      return
    }
    setError('')
    clearCurrent(true)
    setFile(selected)
    setSourceLabel(label)
    setPreview(URL.createObjectURL(selected))
  }

  const handleFileChange = (e) => {
    validateFile(e.target.files?.[0], e.target.files?.[0]?.name || '')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    validateFile(dropped, dropped?.name || '')
  }

  const handleCameraCapture = (blobFile) => {
    setCameraOpen(false)
    validateFile(blobFile, '📷 Camera capture')
  }

  const removeImage = () => {
    clearCurrent(true)
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select or capture an image to analyze.')
      return
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/detect' } })
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await detectionService.analyze(file)
      navigate(`/result/${result.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="detect-page">
      <div className="container">
        <div className="detect-header">
          <h1>
            Detect Plant <span className="text-gradient">Disease</span>
          </h1>
          <p>
            Upload a photo of your plant leaf, fruit or vegetable — or capture
            one live with your camera — and get an instant AI health analysis.
          </p>
          <div className="detect-formats">
            <span>JPG</span>
            <span>JPEG</span>
            <span>PNG</span>
            <span>WEBP</span>
          </div>
        </div>

        <div className="detect-tabs">
          <button
            className={`detect-tab ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => setMode('upload')}
          >
            📤 Upload Image
          </button>
          <button
            className={`detect-tab ${mode === 'camera' ? 'active' : ''}`}
            onClick={() => setMode('camera')}
          >
            📷 Take a Picture
          </button>
        </div>

        <div className="detect-grid">
          <div className="detect-source card">
            {mode === 'upload' ? (
              <div
                className={`dropzone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
                onClick={() => !preview && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  hidden
                />
                {preview ? (
                  <div className="preview-wrap">
                    <img src={preview} alt="Preview" className="preview-img" />
                    <button
                      type="button"
                      className="preview-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage()
                      }}
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                    <div className="preview-file">{sourceLabel || file?.name}</div>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <div className="drop-icon">📤</div>
                    <h3>Drag &amp; drop your image here</h3>
                    <p>or</p>
                    <span className="btn btn-primary">Browse Files</span>
                    <p className="drop-hint">JPG, JPEG, PNG or WEBP · Max 10MB</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="camera-launch">
                <div className="camera-launch-icon">📷</div>
                <h3>Capture a plant image</h3>
                <p>
                  Take a close-up photo of the leaf, fruit or vegetable you want
                  to check. The photo will be analyzed directly by our AI model.
                </p>
                {preview ? (
                  <div className="camera-launch-preview">
                    <img src={preview} alt="Captured preview" className="preview-img" />
                    <div className="camera-launch-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setPreview(null)
                          setFile(null)
                          setSourceLabel('')
                        }}
                      >
                        ↺ Retake
                      </button>
                      <span className="camera-launch-name">{sourceLabel || file?.name}</span>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={() => setCameraOpen(true)}>
                    📷 Open Camera
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="detect-actions card">
            <h3>Ready to analyze?</h3>
            <p>
              Our AI will examine your image and provide the crop, disease,
              confidence, severity, causes, treatment and prevention guidance.
            </p>
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            <div className="detect-buttons">
              {preview && (
                <button onClick={removeImage} className="btn btn-outline">
                  Remove Image
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading || !file}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Analyzing...
                  </>
                ) : (
                  <>🔍 Analyze Disease</>
                )}
              </button>
            </div>
            {loading && (
              <div className="analyzing-note">
                <div className="analyzing-bar">
                  <span></span>
                </div>
                <p>AI is analyzing your image...</p>
              </div>
            )}
            {!isAuthenticated && preview && (
              <p className="auth-note">You&apos;ll be asked to log in before analyzing.</p>
            )}
          </div>
        </div>
      </div>

      {cameraOpen && (
        <div className="camera-modal" onClick={(e) => e.target === e.currentTarget && setCameraOpen(false)}>
          <div className="camera-modal-card card">
            <CameraCapture
              onCapture={handleCameraCapture}
              onCancel={() => setCameraOpen(false)}
              busy={loading}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Detect
