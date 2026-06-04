import { CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { analyzeAnswer } from '../utils/analyzer.js';

function SummaryList({ items }) {
  if (!items?.length) return <p className="muted">감지된 항목이 없습니다.</p>;
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function AnswerCheckPanel({ code, referenceImage }) {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    setStatus('loading');
    try {
      setResult(await analyzeAnswer({ code, referenceImage }));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="answer-check-panel" aria-label="Answer check">
      <div className="subpanel-header answer-header">
        <div>
          <h3>정답 확인</h3>
          <p>업로드한 캡처 이미지와 내 코드 구조를 함께 분석합니다.</p>
        </div>
        <button className="primary-button" type="button" onClick={handleAnalyze} disabled={status === 'loading'}>
          {status === 'loading' ? <Loader2 size={16} className="spin" /> : <CheckCircle2 size={16} />}
          정답 확인
        </button>
      </div>

      {status === 'idle' ? (
        <div className="answer-empty">
          캡처 이미지를 업로드한 뒤 버튼을 누르면 화면 비율, 색상 단서, 내 HTML/CSS/JS 구조를 한 번에 정리합니다.
        </div>
      ) : null}

      {status === 'error' ? <div className="answer-empty error">분석 중 문제가 발생했습니다.</div> : null}

      {result ? (
        <div className="answer-results">
          <div className="answer-meta">분석 시간: {result.generatedAt}</div>

          <article className="answer-card">
            <h4>참고 이미지 분석</h4>
            {result.image ? (
              <>
                <dl>
                  <div>
                    <dt>크기</dt>
                    <dd>{result.image.size}</dd>
                  </div>
                  <div>
                    <dt>비율</dt>
                    <dd>{result.image.ratio} / {result.image.orientation}</dd>
                  </div>
                </dl>
                <div className="color-row">
                  {result.image.colors.map((color) => (
                    <span key={color} style={{ background: color }} title={color}>
                      {color}
                    </span>
                  ))}
                </div>
                <SummaryList items={result.image.notes} />
              </>
            ) : (
              <p className="muted">업로드된 참고 이미지가 없습니다.</p>
            )}
          </article>

          <article className="answer-card">
            <h4>내 코드 구조</h4>
            <div className="answer-columns">
              <div>
                <strong>HTML</strong>
                <SummaryList items={[...result.userCode.html.landmarks, ...result.userCode.html.topTags]} />
              </div>
              <div>
                <strong>CSS</strong>
                <SummaryList items={result.userCode.css.uses} />
              </div>
              <div>
                <strong>JS</strong>
                <SummaryList items={result.userCode.js.uses} />
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
