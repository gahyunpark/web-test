import { Check, ImagePlus, X } from 'lucide-react';

export default function ReferencePanel({ image, onImageChange, onImageClear }) {
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    onImageChange(imageUrl);
    event.target.value = '';
  }

  return (
    <section className="panel reference-panel" aria-label="Reference image">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Reference</p>
          <h2>원본 이미지</h2>
        </div>
        {image ? (
          <button className="icon-button" type="button" onClick={onImageClear} title="이미지 제거">
            <X size={18} />
          </button>
        ) : null}
      </div>

      <label className={image ? 'upload-box has-image' : 'upload-box'}>
        <input type="file" accept="image/*" onChange={handleFile} />
        {image ? (
          <img src={image} alt="업로드한 참고 화면" />
        ) : (
          <span>
            <ImagePlus size={24} />
            전체 화면 캡쳐 이미지를 업로드하세요
          </span>
        )}
      </label>

      <div className="reference-source-state">
        <p>
          <Check size={14} />
          {image ? '캡처 이미지가 overlay와 이미지 분석에 사용됩니다.' : '캡처 이미지를 업로드하면 색상과 비율 단서를 분석합니다.'}
        </p>
        <p>
          <Check size={14} />
          {image ? '큰 이미지는 멈춤 방지를 위해 자동 저장하지 않고 현재 탭에서만 유지됩니다.' : '업로드 후 하단에서 맞춤 참고 문서를 확인할 수 있습니다.'}
        </p>
      </div>
    </section>
  );
}
