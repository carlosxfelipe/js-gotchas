import { html } from "htm/preact";
import { render } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import { chaptersList } from "./chapters.js";

const APP_TITLE = "As Pegadinhas do JS";
const APP_SUBTITLE = "O guia definitivo de sobrevivência";

function App() {
  const [chapters, setChapters] = useState(chaptersList);
  const [activeChapter, setActiveChapter] = useState(chaptersList[0]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const contentRef = useRef(null);

  // Calcula tempo de leitura dinamicamente para todos os capítulos
  useEffect(() => {
    const updateReadingTimes = async () => {
      const updatedChapters = await Promise.all(
        chaptersList.map(async (chapter) => {
          try {
            const response = await fetch(`./markdown/${chapter.id}`);
            const text = await response.text();
            // Estimativa: ~200 palavras por minuto
            const words = text.split(/\s+/).length;
            const minutes = Math.ceil(words / 200);
            return { ...chapter, readingTime: `${minutes} min` };
          } catch (e) {
            return { ...chapter, readingTime: "---" };
          }
        })
      );
      setChapters(updatedChapters);
    };

    updateReadingTimes();
  }, []);

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
        <div class="sidebar-title">${APP_TITLE}</div>
        <div class="sidebar-subtitle">${APP_SUBTITLE}</div>
      </div>

      <ul class="chapter-list">
        ${chapters.map(
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
              <div class="chapter-info">
                <span class="chapter-name">${chapter.title}</span>
                ${chapter.readingTime &&
                html`<span class="reading-time">${chapter.readingTime}</span>`}
              </div>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="m15 18-6-6 6-6"/></svg>
                      <span class="nav-mobile">Anterior</span>
                      <span class="nav-desktop">${prevChapter.title}</span>
                    </button>`
                  : html`<div></div>`}
                ${nextChapter
                  ? html`<button
                      class="nav-btn next"
                      onClick=${() => setActiveChapter(nextChapter)}
                    >
                      <span class="nav-desktop">${nextChapter.title}</span>
                      <span class="nav-mobile">Próxima</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 8px;"><path d="m9 18 6-6-6-6"/></svg>
                    </button>`
                  : html`<div></div>`}
              </div>
            `}
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("app"));
