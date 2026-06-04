import { Columns2, Grid3X3, Layers, Monitor, Ruler } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const presets = [
  ['desktop', 'Desktop', 1440],
  ['laptop', 'Laptop', 1280],
  ['tablet', 'Tablet', 768],
  ['mobile', 'Mobile', 390],
];

export default function PreviewPanel({
  srcDoc,
  referenceImage,
  viewport,
  customWidth,
  overlay,
  overlayOpacity,
  gridSize,
  compareMode,
  onViewportChange,
  onCustomWidthChange,
  onOverlayChange,
  onOverlayOpacityChange,
  onGridSizeChange,
  onCompareModeChange,
}) {
  const width = viewport === 'custom' ? customWidth : presets.find(([id]) => id === viewport)?.[2] || 1440;
  const shellRef = useRef(null);
  const [imageRatio, setImageRatio] = useState(null);
  const [frameMetrics, setFrameMetrics] = useState({ scale: 1, height: 520 });

  useEffect(() => {
    if (!referenceImage) {
      setImageRatio(null);
      return;
    }

    let ignore = false;
    const image = new Image();
    image.onload = () => {
      if (!ignore) setImageRatio(image.naturalHeight / image.naturalWidth);
    };
    image.onerror = () => {
      if (!ignore) setImageRatio(null);
    };
    image.src = referenceImage;

    return () => {
      ignore = true;
    };
  }, [referenceImage]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    function updateFrameMetrics() {
      const contentWidth = Math.max(shell.clientWidth - 32, 240);
      const contentHeight = Math.max(shell.clientHeight - 32, 520);
      const scale = Math.min(1, contentWidth / width);
      const imageHeight = imageRatio ? width * imageRatio : 0;
      const height = Math.max(520, contentHeight / scale, imageHeight);

      setFrameMetrics({ scale, height });
    }

    updateFrameMetrics();

    const observer = new ResizeObserver(updateFrameMetrics);
    observer.observe(shell);
    window.addEventListener('resize', updateFrameMetrics);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFrameMetrics);
    };
  }, [width, imageRatio, compareMode]);

  return (
    <section className="panel preview-panel" aria-label="Preview">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Preview</p>
          <h2>실시간 결과</h2>
        </div>
        <div className="preview-actions">
          <button
            className={compareMode ? 'icon-button active' : 'icon-button'}
            type="button"
            onClick={() => onCompareModeChange(!compareMode)}
            title="좌우 비교"
          >
            <Columns2 size={18} />
          </button>
          <button
            className={overlay ? 'icon-button active' : 'icon-button'}
            type="button"
            onClick={() => onOverlayChange(!overlay)}
            title="원본 overlay"
          >
            <Layers size={18} />
          </button>
          <button
            className={gridSize ? 'icon-button active' : 'icon-button'}
            type="button"
            onClick={() => onGridSizeChange(gridSize ? 0 : 8)}
            title="grid guide"
          >
            <Grid3X3 size={18} />
          </button>
        </div>
      </div>

      <div className="viewport-toolbar">
        <div className="segmented scrollable" aria-label="Viewport presets">
          {presets.map(([id, label, value]) => (
            <button
              key={id}
              className={viewport === id ? 'active' : ''}
              type="button"
              onClick={() => onViewportChange(id)}
            >
              <Monitor size={14} />
              {label}
              <small>{value}</small>
            </button>
          ))}
        </div>
        <label className="custom-width">
          <Ruler size={15} />
          <input
            type="number"
            min="240"
            max="1920"
            value={customWidth}
            onFocus={() => onViewportChange('custom')}
            onChange={(event) => onCustomWidthChange(Number(event.target.value))}
          />
          px
        </label>
      </div>

      <div className="fine-controls">
        <label>
          Overlay opacity
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={overlayOpacity}
            onChange={(event) => onOverlayOpacityChange(Number(event.target.value))}
          />
          <strong>{Math.round(overlayOpacity * 100)}%</strong>
        </label>
        <div className="grid-buttons" aria-label="Grid size">
          {[0, 8, 10].map((size) => (
            <button
              key={size}
              className={gridSize === size ? 'active' : ''}
              type="button"
              onClick={() => onGridSizeChange(size)}
            >
              {size ? `${size}px` : 'Off'}
            </button>
          ))}
        </div>
      </div>

      <div className={compareMode ? 'preview-stage compare' : 'preview-stage'}>
        {compareMode ? (
          <div className="compare-reference">
            {referenceImage ? <img src={referenceImage} alt="비교용 원본" /> : <span>원본 이미지 없음</span>}
          </div>
        ) : null}
        <div className="frame-shell" ref={shellRef}>
          <div
            className="frame-scale-space"
            style={{
              width: `${width * frameMetrics.scale}px`,
              height: `${frameMetrics.height * frameMetrics.scale}px`,
            }}
          >
            <div
              className="frame-wrap"
              style={{
                width: `${width}px`,
                height: `${frameMetrics.height}px`,
                '--preview-scale': frameMetrics.scale,
                '--overlay-opacity': overlay && referenceImage ? overlayOpacity : 0,
                '--grid-size': gridSize ? `${gridSize}px` : '0px',
              }}
            >
              <iframe title="실시간 preview" srcDoc={srcDoc} sandbox="allow-scripts" />
              {referenceImage ? <img className="preview-overlay" src={referenceImage} alt="" aria-hidden="true" /> : null}
              {gridSize ? <div className="grid-overlay" aria-hidden="true" /> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
