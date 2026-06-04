import { ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const baseGroups = [
  {
    title: 'HTML',
    description: '캡처 화면을 섹션 단위로 나눌 때 먼저 확인하세요.',
    links: [
      ['HTML 소개', 'https://codingeverybody.kr/category/html/'],
      ['HTML elements', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements'],
      ['main element', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main'],
      ['button element', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button'],
    ],
  },
  {
    title: 'CSS',
    description: '레이아웃, 간격, 반응형을 맞출 때 기본으로 보는 문서입니다.',
    links: [
      ['CSS 소개', 'https://codingeverybody.kr/category/css/'],
      ['display', 'https://developer.mozilla.org/en-US/docs/Web/CSS/display'],
      ['flexbox guide', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout'],
      ['grid guide', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout'],
      ['clamp()', 'https://developer.mozilla.org/en-US/docs/Web/CSS/clamp'],
      ['media queries', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries'],
    ],
  },
  {
    title: 'JavaScript',
    description: '캡처 화면에 버튼, 메뉴, 모달 같은 상호작용이 있을 때 참고하세요.',
    links: [
      ['JavaScript 소개', 'https://codingeverybody.kr/category/javascript/'],
      ['querySelector()', 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector'],
      ['addEventListener()', 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener'],
      ['console.log()', 'https://developer.mozilla.org/en-US/docs/Web/API/console/log_static'],
    ],
  },
];

function loadImageMeta(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({
      width: image.naturalWidth,
      height: image.naturalHeight,
      ratio: image.naturalWidth / image.naturalHeight,
    });
    image.onerror = reject;
    image.src = src;
  });
}

function getRecommendedGroups(meta) {
  if (!meta) return baseGroups;

  const isMobileLike = meta.width <= 520 || meta.ratio < 0.8;
  const isWide = meta.width >= 1200 || meta.ratio > 1.35;
  const isTall = meta.height > meta.width * 1.4;

  return [
    {
      title: '이미지 분석',
      description: `${meta.width} x ${meta.height}px 캡처입니다. ${isMobileLike ? '모바일 화면 단서가 강합니다.' : isWide ? '데스크톱 레이아웃 단서가 강합니다.' : '중간 폭 화면 기준으로 보입니다.'}`,
      links: [
        ['CSS values and units', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units'],
        ['color picker guide', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Color_picker_tool'],
        ['box model', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model'],
      ],
    },
    {
      title: isMobileLike ? 'Mobile CSS' : 'Layout CSS',
      description: isMobileLike
        ? '작은 화면에서는 폭, 줄바꿈, 터치 가능한 버튼 크기부터 맞춰보세요.'
        : '큰 덩어리 배치와 내부 정렬을 grid/flex로 나눠서 맞춰보세요.',
      links: [
        ['media queries', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries'],
        [isWide ? 'grid layout' : 'flexbox layout', isWide ? 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout' : 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout'],
        ['min(), max(), clamp()', 'https://developer.mozilla.org/en-US/docs/Web/CSS/clamp'],
        ['CodingEverybody CSS', 'https://codingeverybody.kr/category/css/'],
      ],
    },
    {
      title: isTall ? 'Scroll Structure' : 'HTML Structure',
      description: isTall
        ? '긴 캡처는 header, section, footer처럼 반복 구간을 먼저 나누면 좋습니다.'
        : '첫 화면 안의 의미 단위부터 HTML 태그로 정리해보세요.',
      links: [
        ['section element', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/section'],
        ['main element', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main'],
        ['heading elements', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements'],
        ['CodingEverybody HTML', 'https://codingeverybody.kr/category/html/'],
      ],
    },
    {
      title: 'Interaction JS',
      description: '캡처에 메뉴, 탭, 모달, 슬라이더가 보이면 JS는 작은 동작부터 붙이면 됩니다.',
      links: [
        ['querySelector()', 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector'],
        ['addEventListener()', 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener'],
        ['classList', 'https://developer.mozilla.org/en-US/docs/Web/API/Element/classList'],
        ['CodingEverybody JavaScript', 'https://codingeverybody.kr/category/javascript/'],
      ],
    },
  ];
}

export default function ReferenceLinksPanel({ referenceImage }) {
  const [imageMeta, setImageMeta] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (!referenceImage) {
      setImageMeta(null);
      return;
    }

    loadImageMeta(referenceImage)
      .then((meta) => {
        if (!ignore) setImageMeta(meta);
      })
      .catch(() => {
        if (!ignore) setImageMeta(null);
      });

    return () => {
      ignore = true;
    };
  }, [referenceImage]);

  const linkGroups = useMemo(() => getRecommendedGroups(imageMeta), [imageMeta]);

  return (
    <section className="reference-links-panel" aria-label="Reference links">
      <div className="subpanel-header">
        <div>
          <h3>코드 참고 링크</h3>
          <p className="subpanel-note">
            {imageMeta ? '업로드한 캡처 이미지 기준으로 추천했습니다.' : '캡처 이미지를 업로드하면 추천 링크가 더 구체적으로 바뀝니다.'}
          </p>
        </div>
      </div>
      <div className="reference-link-groups">
        {linkGroups.map((group) => (
          <article key={group.title} className="reference-link-group">
            <div>
              <h4>{group.title}</h4>
              <p>{group.description}</p>
            </div>
            <div className="reference-link-list">
              {group.links.map(([label, url]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  <span>{label}</span>
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
