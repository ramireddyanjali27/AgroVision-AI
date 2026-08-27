import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { detectionService } from '../services/detectionService'
import { getCropInfo, NUTRITION_KEYS, MICRO_KEYS } from '../services/cropData'
import Loader from '../components/Loader'
import './Result.css'

const severityColor = {
  Low: 'badge-info',
  Moderate: 'badge-warning',
  High: 'badge-danger',
  Critical: 'badge-danger',
  None: 'badge-success',
}

const LOW_CONFIDENCE = 60
const VALID_STATUS = /^healthy$/i

const Result = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true)
      try {
        const data = await detectionService.getById(id)
        setResult(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load detection result.')
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [id])

  const downloadReport = () => {
    if (!result) return
    const cropInfo = getCropInfo(result.plantName)
    const line = (k, v) => `<tr><td><strong>${k}</strong></td><td>${v || '—'}</td></tr>`
    const ul = (items) =>
      items && items.length
        ? '<ul>' + items.map((i) => `<li>${i}</li>`).join('') + '</ul>'
        : '<p>Not available.</p>'

    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<title>AgroVision Detection Report — ${result.plantName || 'Crop'}</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1f2937;max-width:720px;margin:24px auto;padding:0 16px;line-height:1.5}
  h1{color:#0b5a3a;border-bottom:2px solid #0b5a3a;padding-bottom:8px}
  h2{color:#0b5a3a;margin-top:28px}
  .status{display:inline-block;padding:6px 14px;border-radius:999px;font-weight:700;color:#fff;background:${result.healthStatus === 'Healthy' ? '#16a34a' : '#dc2626'}}
  table{border-collapse:collapse;width:100%;margin-top:8px}
  td{border:1px solid #e5e7eb;padding:8px 10px;font-size:14px;vertical-align:top}
  .muted{color:#6b7280;font-size:12px;margin-top:20px}
</style></head><body>
<h1>🌱 AgroVision AI — Crop Health Report</h1>
<p><strong>Report ID:</strong> ${result.id} &nbsp;·&nbsp; <strong>Detected on:</strong> ${
      result.detectionDate ? new Date(result.detectionDate).toLocaleString() : '—'
    }</p>
<p><span class="status">${
      result.healthStatus === 'Healthy' ? 'Healthy' : 'Diseased'
    }</span></p>
<table>
  ${line('Crop', result.plantName)}
  ${line('Category', result.plantCategory)}
  ${line('Disease', result.diseaseName)}
  ${line('Confidence', result.confidence != null ? result.confidence.toFixed(1) + '%' : '—')}
  ${line('Severity', result.severity)}
</table>
<h2>Description</h2>
<p>${result.description || 'Not available.'}</p>
${result.healthStatus !== 'Healthy' ? `
<h2>Possible Causes</h2>${ul(result.causes)}
<h2>Treatment / Rectification</h2>${ul(result.treatment)}
<h2>Prevention Tips</h2>${ul(result.prevention)}
` : ''}
<h2>Crop Management</h2>${cropInfo ? ul(cropInfo.management) : '<p>Management guidance unavailable for this crop.</p>'}
<h2>Crop Protection</h2>${cropInfo ? ul(cropInfo.protection) : '<p>Protection guidance unavailable for this crop.</p>'}
<p class="muted">This report is generated using AI and should be used as guidance only. For serious crop problems, consult a qualified agricultural expert. Protection guidance is general and educational — always follow product labels and local regulations.</p>
</body></html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AgroVision-Report-${result.id}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Loader text="Loading detection result..." />

  if (error) {
    return (
      <div className="container result-wrap">
        <div className="alert alert-error">⚠️ {error}</div>
        <Link to="/detect" className="btn btn-primary">Back to Detect</Link>
      </div>
    )
  }

  const isHealthy = VALID_STATUS.test(result.healthStatus || '')
  const isLowConfidence = result.confidence != null && result.confidence < LOW_CONFIDENCE
  const cropInfo = getCropInfo(result.plantName)

  return (
    <div className="result-page">
      <div className="container">
        <div className="result-head">
          <div>
            <h1>Detection <span className="text-gradient">Result</span></h1>
            <p className="result-sub">
              {result.plantName ? `${result.plantName} report` : 'Crop health report'} ·{' '}
              {result.detectionDate ? new Date(result.detectionDate).toLocaleString() : '—'}
            </p>
          </div>
          <div className="result-actions">
            <Link to="/detect" className="btn btn-outline">↩ New Detection</Link>
            <button className="btn btn-primary" onClick={downloadReport}>⬇ Download Report</button>
          </div>
        </div>

        {isLowConfidence && (
          <div className="alert alert-warning low-confidence-alert">
            <strong>⚠️ Low confidence:</strong> The model is {result.confidence?.toFixed(1)}% sure.
            Review the image and consider a fresh, clear close-up before acting.
          </div>
        )}

        <div className="result-grid">
          <div className="result-left">
            <div className="result-image card">
              {result.imageUrl ? (
                <img src={result.imageUrl} alt={result.plantName || 'Plant'} />
              ) : (
                <div className="result-no-image">🌿</div>
              )}
            </div>

            <div className="card result-block">
              <h3>📋 Crop Information</h3>
              <div className="info-row">
                <span className="info-label">Crop Name</span>
                <span className="info-value">{result.plantName || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Category</span>
                <span className="info-value">{result.plantCategory || 'Plant'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Disease</span>
                <span className="info-value">{result.diseaseName || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Severity</span>
                <span className="info-value">
                  <span className={`badge ${severityColor[result.severity] || 'badge-muted'}`}>
                    {result.severity || '—'}
                  </span>
                </span>
              </div>
            </div>

            <div className="card result-block">
              <h3>⚙️ Crop Management</h3>
              {cropInfo ? (
                <ul className="list-check">
                  {cropInfo.management.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">Management guidance unavailable for this crop.</p>
              )}
            </div>
          </div>

          <div className="result-right">
            <div className="card result-status-card">
              <div className={`status-banner ${isHealthy ? 'healthy' : 'diseased'}`}>
                <div className="status-icon">{isHealthy ? '✅' : '⚠️'}</div>
                <div>
                  <div className="status-text">
                    {isHealthy ? 'Healthy' : 'Diseased'}
                  </div>
                  <div className="status-sub">
                    {isHealthy
                      ? 'No disease detected'
                      : `Detected: ${result.diseaseName}`}
                  </div>
                </div>
              </div>
              {!isHealthy && (
                <div className="disease-name">
                  <span className="label-small">Disease</span>
                  <strong>{result.diseaseName}</strong>
                </div>
              )}
            </div>

            <div className="card result-block">
              <h3>🔬 Analysis Details</h3>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <div className="analysis-label">Confidence</div>
                  <div className="confidence-value">{result.confidence?.toFixed(1)}%</div>
                  <div className="confidence-bar">
                    <span style={{ width: `${result.confidence ?? 0}%` }}></span>
                  </div>
                </div>
                <div className="analysis-item">
                  <div className="analysis-label">Severity</div>
                  <span className={`badge ${severityColor[result.severity] || 'badge-muted'}`}>
                    {result.severity || '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card result-block">
              <h3>📝 Description</h3>
              <p className="desc-text">{result.description || 'No description available.'}</p>
            </div>

            {!isHealthy && (
              <>
                <div className="card result-block">
                  <h3>🔍 Possible Causes</h3>
                  {result.causes?.length ? (
                    <ul className="list-check">
                      {result.causes.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">No causes recorded.</p>
                  )}
                </div>

                <div className="card result-block">
                  <h3>💊 Treatment / Rectification</h3>
                  {result.treatment?.length ? (
                    <ol className="list-numbered">
                      {result.treatment.map((t, i) => (
                        <li key={i}>
                          <span className="step-num">{i + 1}</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="no-data">No treatment recorded.</p>
                  )}
                </div>

                <div className="card result-block">
                  <h3>🌱 Prevention Tips</h3>
                  {result.prevention?.length ? (
                    <ul className="list-check">
                      {result.prevention.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">No prevention tips recorded.</p>
                  )}
                </div>

                <div className="card result-block result-protection">
                  <h3>🛡️ Crop Protection</h3>
                  {cropInfo ? (
                    <ul className="list-check">
                      {cropInfo.protection.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">Crop protection guidance unavailable for this crop.</p>
                  )}
                </div>
              </>
            )}

            <div className="card result-block result-nutrition">
              <h3>🥗 Nutrition Facts {cropInfo?.emoji}</h3>
              {cropInfo ? (
                <>
                  <p className="nutrition-note">
                    Dry-weight-free edible portion, approximate per <strong>100 g raw</strong>.
                  </p>
                  <table className="nutrition-table">
                    <thead>
                      <tr>
                        <th>Nutrient</th>
                        <th>Value / 100g</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NUTRITION_KEYS.map(({ key, label }) => (
                        <tr key={key}>
                          <td>{label}</td>
                          <td>{cropInfo.nutrition[key] || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <details className="nutrition-more">
                    <summary>Vitamins &amp; minerals</summary>
                    <table className="nutrition-table">
                      <tbody>
                        {MICRO_KEYS.filter(({ key }) => cropInfo.nutrition[key]).map(({ key, label }) => (
                          <tr key={key}>
                            <td>{label}</td>
                            <td>{cropInfo.nutrition[key]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                </>
              ) : (
                <p className="no-data">Nutrition information unavailable for this crop.</p>
              )}
            </div>

            <div className="result-actions-inline">
              <Link to="/detect" className="btn btn-outline">🔁 Analyze Another</Link>
              <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
                📊 View History
              </button>
            </div>

            <div className="disclaimer">
              ℹ️ The detection result is generated using AI and should be used as
              guidance. For serious crop problems, consult a qualified
              agricultural expert. Crop protection guidance is general and
              educational — always follow product labels and local regulations.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
