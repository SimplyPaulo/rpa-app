import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../../api/api';
import './ReportProblem.css';

/**
 * Report Problem page — allows users to submit accessibility issues.
 * Features: camera capture, text description, geolocation toggle.
 */
export default function ReportProblem() {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [useLocation, setUseLocation] = useState(false);
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ── Image handling ────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Geolocation handling ──────────────────────────────
  const toggleLocation = () => {
    if (useLocation) {
      setUseLocation(false);
      setCoords(null);
      setLocationStatus('idle');
      return;
    }

    setUseLocation(true);
    setLocationStatus('loading');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('success');
      },
      () => {
        setLocationStatus('error');
        setUseLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Form submission ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setError('');
    setLoading(true);

    try {
      // Build multipart/form-data with the actual image file
      const formData = new FormData();
      formData.append('description', description.trim());

      if (coords?.lat != null) {
        formData.append('latitude', coords.lat.toString());
      }
      if (coords?.lng != null) {
        formData.append('longitude', coords.lng.toString());
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const report = await reportsApi.create(formData);

      // Navigate to confirmation page with the protocol number
      navigate('/confirmation', { state: { report } });
    } catch (err) {
      setError(err.message || 'Erro ao enviar relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const charCount = description.length;
  const isOverLimit = charCount > 500;

  return (
    <div className="page-container report-page">
      <h1 className="page-title">Reportar Problema</h1>
      <p className="page-desc">
        Descreva o problema de acessibilidade e, se possível, tire uma foto do local.
      </p>

      <form className="report-form" onSubmit={handleSubmit}>
        {/* ── Image Upload ──────────────────────────────── */}
        <div className="report-section glass-card">
          <span className="section-label">📷 Foto do problema</span>

          {imagePreview ? (
            <div className="image-preview animate-scale-in">
              <img src={imagePreview} alt="Preview do problema" />
              <button
                type="button"
                className="image-remove"
                onClick={removeImage}
                aria-label="Remover imagem"
                id="btn-remove-image"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="upload-area" htmlFor="input-image">
              <span className="upload-icon">📸</span>
              <span className="upload-text">
                Toque para <strong>tirar uma foto</strong> ou selecionar da galeria
              </span>
            </label>
          )}

          <input
            ref={fileInputRef}
            id="input-image"
            className="upload-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
          />
        </div>

        {/* ── Description ──────────────────────────────── */}
        <div className="report-section glass-card">
          <span className="section-label">✏️ Descrição</span>
          <div className="form-group">
            <textarea
              id="input-description"
              className="form-textarea"
              placeholder="Descreva o problema de acessibilidade encontrado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              required
            />
            <span className={`char-count ${isOverLimit ? 'limit' : ''}`}>
              {charCount}/500
            </span>
          </div>
        </div>

        {/* ── Location Toggle ──────────────────────────── */}
        <div className="report-section glass-card">
          <span className="section-label">📍 Localização</span>

          <div
            className={`toggle-container ${useLocation ? 'active' : ''}`}
            onClick={toggleLocation}
            role="switch"
            aria-checked={useLocation}
            id="toggle-location"
          >
            <span className="toggle-label">
              <span>Usar localização atual</span>
            </span>
            <span className="toggle-switch" />
          </div>

          {locationStatus === 'loading' && (
            <div className="location-info location-loading">
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              Obtendo localização...
            </div>
          )}
          {locationStatus === 'success' && coords && (
            <div className="location-info">
              ✅ Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
            </div>
          )}
          {locationStatus === 'error' && (
            <div className="location-info location-error">
              ⚠️ Não foi possível obter a localização.
            </div>
          )}
        </div>

        {/* ── Error ────────────────────────────────────── */}
        {error && (
          <div className="auth-error">{error}</div>
        )}

        {/* ── Submit ───────────────────────────────────── */}
        <div className="report-submit">
          <button
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading || !description.trim()}
            id="btn-submit-report"
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              'Enviar Relatório'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
