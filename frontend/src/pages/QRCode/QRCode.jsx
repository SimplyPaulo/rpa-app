import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QRCode.css';

/**
 * QR Code page — generates a printable QR code that links to the RPA app.
 * When scanned with a phone camera, it opens the app's home page.
 *
 * The URL can be changed to the production domain when deployed.
 */

// Change this to your production URL when deploying
const SITE_URL = window.location.origin;

export default function QRCodePage() {
  const qrRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    // Convert SVG to PNG for download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;

      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR with padding
      const padding = 64;
      ctx.drawImage(img, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);

      const link = document.createElement('a');
      link.download = 'rpa-qrcode.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="page-container qrcode-page">
      <div className="glass-card qrcode-card">
        <h1 className="qrcode-title">📱 QR Code</h1>
        <p className="qrcode-subtitle">
          Escaneie este código para acessar a plataforma RPA e reportar problemas de acessibilidade.
        </p>

        {/* ── QR Code ───────────────────────────────────── */}
        <div className="qrcode-wrapper" ref={qrRef}>
          <QRCodeSVG
            value={SITE_URL}
            size={220}
            level="H"
            includeMargin={false}
            bgColor="white"
            fgColor="#0f0f23"
          />
        </div>

        {/* ── URL Display ──────────────────────────────── */}
        <div className="qrcode-url">{SITE_URL}</div>

        {/* ── Actions ──────────────────────────────────── */}
        <div className="qrcode-actions">
          <button
            className="btn btn-primary"
            onClick={handlePrint}
            id="btn-print-qr"
          >
            🖨️ Imprimir
          </button>
          <button
            className="btn btn-outline"
            onClick={handleDownload}
            id="btn-download-qr"
          >
            📥 Baixar PNG
          </button>
        </div>

        {/* ── Instructions ─────────────────────────────── */}
        <div className="qrcode-instructions">
          <h3>Como usar:</h3>
          <ul className="qrcode-steps">
            <li>
              <span className="step-number">1</span>
              Imprima ou baixe o QR Code acima
            </li>
            <li>
              <span className="step-number">2</span>
              Cole em locais públicos com problemas de acessibilidade
            </li>
            <li>
              <span className="step-number">3</span>
              Qualquer pessoa pode escanear com a câmera do celular
            </li>
            <li>
              <span className="step-number">4</span>
              Será redirecionado para a plataforma para reportar o problema
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
