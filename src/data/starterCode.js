export const starterCode = {
  html: `<main class="page">
  <section class="hero">
    <p class="eyebrow">Practice Studio</p>
    <h1>Build the reference, one pixel at a time.</h1>
    <p class="lede">
      Drop a screenshot on the left, then recreate its layout with HTML, CSS, and JS.
    </p>
    <button type="button">Start matching</button>
  </section>
</main>`,
  css: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f6f7f9;
  color: #1f2933;
}

.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px 20px;
}

.hero {
  width: min(980px, 100%);
  padding: clamp(32px, 7vw, 88px);
  border: 1px solid #d8dde5;
  background: white;
}

.eyebrow {
  color: #0f766e;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  max-width: 720px;
  margin-top: 18px;
  font-size: clamp(2.2rem, 7vw, 5.8rem);
  line-height: 1;
}

.lede {
  max-width: 540px;
  margin-top: 20px;
  color: #5b6472;
  font-size: 1.05rem;
  line-height: 1.7;
}

button {
  margin-top: 28px;
  border: 0;
  background: #1f2933;
  color: white;
  padding: 14px 18px;
  cursor: pointer;
}`,
  js: `document.querySelector('button')?.addEventListener('click', () => {
  console.log('Keep practicing.');
});`,
};
