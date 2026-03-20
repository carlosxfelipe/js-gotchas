import { html } from "htm/preact";
import { render } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import { chaptersList } from "./chapters.js";

function App() {
  const [activeChapter, setActiveChapter] = useState(chaptersList[0]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    loadChapter(activeChapter.id);
  }, [activeChapter]);

  // Aplica o Syntax Highlighting após o Preact injetar o HTML
  useEffect(() => {
    if (content && contentRef.current && window.hljs) {
      const blocks = contentRef.current.querySelectorAll("pre code");
      blocks.forEach((block) => {
        window.hljs.highlightElement(block);
      });
    }
  }, [content]);

  const loadChapter = async (filename) => {
    setLoading(true);
    setError(false);

    // O scroll volta pro topo automaticamente na troca
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }

    try {
      const response = await fetch(`./markdown/${filename}`);
      if (!response.ok) {
        throw new Error("Falha ao carregar");
      }
      const markdown = await response.text();
      // O marcada interpreta o texto pra HTML puro
      const htmlContent = marked.parse(markdown);
      setContent(htmlContent);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = chaptersList.findIndex((c) => c.id === activeChapter.id);
  const prevChapter = currentIndex > 0 ? chaptersList[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chaptersList.length - 1
      ? chaptersList[currentIndex + 1]
      : null;

  return html`
    <button class="menu-toggle" onClick=${() => setIsMenuOpen(!isMenuOpen)}>
      ☰
    </button>
    <div class="sidebar ${isMenuOpen ? "open" : ""}">
      <div class="sidebar-header">
        <div class="sidebar-title">As Pegadinhas do JS</div>
        <div class="sidebar-subtitle">O guia definitivo de sobrevivência</div>
      </div>

      <ul class="chapter-list">
        ${chaptersList.map(
          (chapter) => html`
            <li
              key=${chapter.id}
              class="chapter-item ${activeChapter.id === chapter.id
                ? "active"
                : ""}"
              onClick=${() => {
                setActiveChapter(chapter);
                setIsMenuOpen(false);
              }}
            >
              ${chapter.title}
            </li>
          `,
        )}
      </ul>
    </div>

    <div class="content-area" ref=${contentRef}>
      ${loading
        ? html`<div class="loading">Carregando Conhecimento...</div>`
        : error
          ? html`
              <div class="error-state">
                <h2>Ops! Problema de CORS ou Arquivo Inexistente.</h2>
                <p>
                  Como estamos carregando ".md" via Fetch API local, você
                  precisa servir a pasta raiz usando um mini-servidor para
                  driblar o bloqueio de segurança dos navegadores.
                </p>
                <div style="margin-top:20px; text-align:left;">
                  <p>Abra o terminal e rode:</p>
                  <code>npx serve .</code><br />ou<br /><code
                    >python3 -m http.server</code
                  >
                </div>
              </div>
            `
          : html`
              <div
                class="markdown-body"
                dangerouslySetInnerHTML=${{ __html: content }}
              />
              <div class="navigation-buttons">
                ${prevChapter
                  ? html`<button
                      class="nav-btn prev"
                      onClick=${() => setActiveChapter(prevChapter)}
                    >
                      <span class="nav-mobile">← Anterior</span>
                      <span class="nav-desktop">← ${prevChapter.title}</span>
                    </button>`
                  : html`<div></div>`}
                ${nextChapter
                  ? html`<button
                      class="nav-btn next"
                      onClick=${() => setActiveChapter(nextChapter)}
                    >
                      <span class="nav-desktop">${nextChapter.title} →</span>
                      <span class="nav-mobile">Próxima →</span>
                    </button>`
                  : html`<div></div>`}
              </div>
            `}
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("app"));
