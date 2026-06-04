export function createPreviewDocument({ html, css, js }) {
  // srcDoc 하나로 HTML/CSS/JS를 합쳐서 iframe 안에서 독립적으로 실행합니다.
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${js}<\/script>
  </body>
</html>`;
}
