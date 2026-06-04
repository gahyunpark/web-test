function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function toHex(value) {
  return value.toString(16).padStart(2, '0');
}

function getDominantColors(image) {
  const canvas = document.createElement('canvas');
  const size = 96;
  const ratio = image.naturalWidth / image.naturalHeight;
  canvas.width = ratio > 1 ? size : Math.max(1, Math.round(size * ratio));
  canvas.height = ratio > 1 ? Math.max(1, Math.round(size / ratio)) : size;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const colors = new Map();

  for (let index = 0; index < pixels.length; index += 16) {
    const alpha = pixels[index + 3];
    if (alpha < 120) continue;

    const red = Math.round(pixels[index] / 32) * 32;
    const green = Math.round(pixels[index + 1] / 32) * 32;
    const blue = Math.round(pixels[index + 2] / 32) * 32;
    const key = `#${toHex(Math.min(red, 255))}${toHex(Math.min(green, 255))}${toHex(Math.min(blue, 255))}`;
    colors.set(key, (colors.get(key) || 0) + 1);
  }

  return [...colors.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 6)
    .map(([color]) => color);
}

function getImageNotes(image) {
  const ratio = image.naturalWidth / image.naturalHeight;
  const orientation = ratio > 1.25 ? '가로형 화면' : ratio < 0.8 ? '세로형 화면' : '정사각형에 가까운 화면';
  const breakpointHint = image.naturalWidth >= 1200 ? 'desktop 기준 분석에 적합합니다.' : 'tablet/mobile 기준 분석에 적합합니다.';

  return {
    size: `${image.naturalWidth} x ${image.naturalHeight}`,
    orientation,
    ratio: ratio.toFixed(2),
    colors: getDominantColors(image),
    notes: [
      breakpointHint,
      '이미지 분석은 픽셀에서 추정한 단서라 실제 HTML 계층이나 CSS 속성명을 직접 알 수는 없습니다.',
      'overlay와 grid guide를 함께 켜고 큰 덩어리, 간격, 타이포 크기 순서로 맞추면 좋습니다.',
    ],
  };
}

function summarizeHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const elements = [...doc.body.querySelectorAll('*')];
  const tagCounts = elements.reduce((counts, element) => {
    counts[element.tagName.toLowerCase()] = (counts[element.tagName.toLowerCase()] || 0) + 1;
    return counts;
  }, {});

  const classes = [...new Set(elements.flatMap((element) => [...element.classList]))].slice(0, 16);
  const landmarks = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer']
    .filter((tag) => doc.body.querySelector(tag));

  return {
    elementCount: elements.length,
    topTags: Object.entries(tagCounts)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 8)
      .map(([tag, count]) => `${tag} ${count}`),
    classes,
    landmarks,
  };
}

function summarizeCss(css) {
  const rules = css.match(/[^{@}]+\{[^{}]*\}/g) || [];
  const mediaQueries = css.match(/@media[^{]+/g) || [];
  const uses = [
    css.includes('display: grid') && 'grid',
    css.includes('display: flex') && 'flex',
    css.includes('clamp(') && 'clamp typography',
    css.includes('var(') && 'CSS variables',
    css.includes('position: absolute') && 'absolute positioning',
    css.includes('@media') && 'media queries',
  ].filter(Boolean);

  return {
    ruleCount: rules.length,
    mediaQueryCount: mediaQueries.length,
    uses,
    selectors: rules
      .map((rule) => rule.split('{')[0].trim())
      .filter(Boolean)
      .slice(0, 10),
  };
}

function summarizeJs(js) {
  const uses = [
    js.includes('querySelector') && 'querySelector',
    js.includes('querySelectorAll') && 'querySelectorAll',
    js.includes('addEventListener') && 'addEventListener',
    js.includes('classList') && 'classList',
    js.includes('fetch(') && 'fetch',
    js.includes('localStorage') && 'localStorage',
  ].filter(Boolean);

  return {
    lineCount: js.split('\n').filter((line) => line.trim()).length,
    eventCount: (js.match(/addEventListener/g) || []).length,
    functionCount: (js.match(/\bfunction\b|=>/g) || []).length,
    uses,
  };
}

export async function analyzeAnswer({ code, referenceImage }) {
  const image = referenceImage ? await loadImage(referenceImage).then(getImageNotes) : null;

  return {
    generatedAt: new Date().toLocaleString('ko-KR'),
    image,
    userCode: {
      html: summarizeHtml(code.html),
      css: summarizeCss(code.css),
      js: summarizeJs(code.js),
    },
  };
}
