export const snippets = [
  {
    id: 'reset',
    title: 'reset CSS',
    target: 'css',
    code: `* {
  box-sizing: border-box;
}

body, h1, h2, h3, p, ul, ol, figure {
  margin: 0;
}

img {
  display: block;
  max-width: 100%;
}

button, input, textarea {
  font: inherit;
}`,
  },
  {
    id: 'flex-center',
    title: 'flex center',
    target: 'css',
    code: `.center {
  display: flex;
  align-items: center;
  justify-content: center;
}`,
  },
  {
    id: 'responsive-grid',
    title: 'responsive grid',
    target: 'css',
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(16px, 3vw, 32px);
}`,
  },
  {
    id: 'clamp-type',
    title: 'clamp typography',
    target: 'css',
    code: `.headline {
  font-size: clamp(2rem, 6vw, 5rem);
  line-height: 1.05;
}`,
  },
  {
    id: 'modal',
    title: 'modal basic',
    target: 'html',
    code: `<div class="modal-backdrop">
  <section class="modal" role="dialog" aria-modal="true">
    <h2>Modal title</h2>
    <p>Modal content goes here.</p>
    <button type="button">Close</button>
  </section>
</div>`,
  },
  {
    id: 'hamburger',
    title: 'hamburger menu',
    target: 'html',
    code: `<button class="menu-button" type="button" aria-label="Open menu">
  <span></span>
  <span></span>
  <span></span>
</button>`,
  },
];
