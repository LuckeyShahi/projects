(function () {
  const params = new URLSearchParams(window.location.search);
  const lnd = params.get("lnd") || Object.keys(cfg)[0];
  const data = cfg[lnd];
  const app = document.getElementById("app");

  if (!data) {
    app.innerHTML = `<p>Missing config for lnd=<strong>${lnd}</strong>.</p>`;
    return;
  }

  const state = {
    expanded: false,
    popupOpen: false,
    feedback: new Map(),
    aboutExpanded: false
  };

  const safe = (v) => (v ?? "").toString();
  const stars = (n) => {
    const full = Math.round(Number(n) || 0);
    const filled = "★".repeat(full);
    const empty = "★".repeat(5 - full);
    return `<span style="color: #01875f;">${filled}</span><span style="color: #e8eaed;">${empty}</span>`;
  };

  function formatDateAgo(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - (Number(daysAgo) || 0));
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function getLikes(comment, idx) {
    const reaction = state.feedback.get(idx);
    return Number(comment.likes || 0) + (reaction === "yes" ? 1 : 0);
  }

  function renderRatingBars() {
    const dist = data["rating-distribution"];
    if (!dist) return '';
    
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    let barsHtml = '';
    
    for (let i = 5; i >= 1; i--) {
      const count = dist[i] || 0;
      const pct = total === 0 ? 0 : Math.round((count / total) * 100);
      barsHtml += `
        <div class="rating-bar-row">
          <span class="rating-bar-num">${i}</span>
          <div class="rating-bar-track">
            <div class="rating-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="rating-summary-container">
        <div class="rating-summary-left">
          <div class="rating-summary-score">${safe(data.rating)}</div>
          <div class="rating-summary-stars">${stars(data.rating)}</div>
          <div class="rating-summary-count">${safe(data["reviews-count"])}</div>
        </div>
        <div class="rating-summary-right">
          ${barsHtml}
        </div>
      </div>
    `;
  }

  function renderComment(comment, idx) {
    const reaction = state.feedback.get(idx);
    const likes = getLikes(comment, idx);
    const commentDate = formatDateAgo(comment.daysAgo);

    return `
      <article class="comment" data-idx="${idx}">
        <div class="comment-head">
          <img src="${safe(comment.icon)}" alt="${safe(comment.name)}" />
          <strong>${safe(comment.name)}</strong>
        </div>
        <div class="comment-stars">${stars(comment.stars)} <span class="comment-date">${commentDate}</span></div>
        <div class="comment-body">${safe(comment.content)}</div>
        <div class="likes">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#5f6368" stroke-width="2"/>
          </svg>
          <span class="likes-num">${likes}</span>
        </div>
        <div class="helpful">
          <span>${safe(data["find-helpful"])}</span>
          <button class="pill yes-btn ${reaction === "yes" ? "active" : ""}" type="button">${safe(data.yes)}</button>
          <button class="pill no-btn ${reaction === "no" ? "active" : ""}" type="button">${safe(data.no)}</button>
        </div>
        ${
          comment.reply
            ? `<div class="dev-reply"><div class="dev-reply-head"><strong>${safe(
                comment.reply.developer
              )}</strong><span>${formatDateAgo(comment.reply.daysAgo)}</span></div><p>${safe(comment.reply.content)}</p></div>`
            : ""
        }
      </article>
    `;
  }

  function renderAboutPopup() {
    const popup = data["about-this-app-popup"];
    if (!state.popupOpen || !popup) {
      return "";
    }

    const infoKeys = [
      "version",
      "updated-on",
      "requires-android",
      "downloads",
      "rating",
      "interactive-elements",
      "released-on",
      "offered-by"
    ];

    // Parse description to format it properly
    function formatDescription(desc) {
      if (!desc) return '';
      
      const lines = desc.split('\n').filter(line => line.trim());
      let html = '';
      
      for (let line of lines) {
        line = line.trim();
        
        // Check if line starts with checkmark emoji or ✅
        if (line.startsWith('✅')) {
          const text = line.substring(1).trim();
          html += `<div class="popup-feature"><span class="popup-checkmark">✓</span><span class="popup-feature-text">${safe(text)}</span></div>`;
        }
        // Check if line starts with dice emoji (use image instead)
        else if (line.startsWith('🎲')) {
          const text = line.substring(1).trim();
          html += `<div class="popup-bullet"><img src="icon-dice.png" alt="Dice" class="popup-emoji-img" /><span class="popup-bullet-text">${safe(text)}</span></div>`;
        }
        // Check if line starts with other bullet emojis
        else if (line.match(/^[🎯🃏🎰💰⚡🎁]/)) {
          const emoji = line.charAt(0);
          const text = line.substring(1).trim();
          html += `<div class="popup-bullet"><span class="popup-emoji">${emoji}</span><span class="popup-bullet-text">${safe(text)}</span></div>`;
        }
        // Regular paragraph
        else {
          html += `<p class="popup-paragraph">${safe(line)}</p>`;
        }
      }
      
      return html;
    }

    return `
      <div class="popup-overlay" id="about-popup-overlay">
        <section class="about-popup" role="dialog" aria-modal="true" aria-label="${safe(data["about-this-app"])}">
          <header class="about-popup-head">
            <img src="${safe(popup.icon || data.icon)}" alt="App icon" />
            <div>
              <h3>${safe(data.title)}</h3>
              <p>${safe(data["about-this-app"])}</p>
            </div>
            <button class="popup-close" id="popup-close" type="button" aria-label="Close">✕</button>
          </header>
          
          <div class="about-popup-scroll">
            <div class="about-popup-content">
              ${formatDescription(popup.description)}
            </div>

            <div class="about-popup-grid">
              ${infoKeys
                .map((key) => {
                  const item = popup[key];
                  if (!item) return "";
                  return `<div class="about-popup-item"><h4>${safe(item.title)}</h4><p>${safe(item.description)}</p></div>`;
                })
                .join("")}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function render() {
    const comments = data.comments || [];
    const visible = state.expanded ? comments : comments.slice(0, 2);

    app.innerHTML = `
      <section class="app-header">
        <img class="app-icon" src="${safe(data.icon)}" alt="${safe(data.title)} icon" />
        <div>
        <div class="title-row">
            <h1 class="app-title">${safe(data.title)}</h1>
            <span class="verified-badge">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3963 1.63973C11.7583 1.23351 12.383 1.23351 12.745 1.63973L14.2885 3.3715C14.4965 3.60485 14.8142 3.71217 15.1189 3.65171L17.4116 3.19694C17.9472 3.09074 18.4419 3.49635 18.4907 4.04077L18.6991 6.36881C18.7271 6.6823 18.9134 6.9538 19.1856 7.07824L21.233 8.01358C21.7112 8.23204 21.8797 8.8309 21.5815 9.25203L20.3093 11.0487C20.1382 11.2905 20.1382 11.609 20.3093 11.8507L21.5815 13.6474C21.8797 14.0685 21.7112 14.6674 21.233 14.8858L19.1856 15.8212C18.9134 15.9456 18.7271 16.2171 18.6991 16.5306L18.4907 18.8587C18.4419 19.4031 17.9472 19.8087 17.4116 19.7025L15.1189 19.2477C14.8142 19.1873 14.4965 19.2946 14.2885 19.5279L12.745 21.2597C12.383 21.6659 11.7583 21.6659 11.3963 21.2597L9.85285 19.5279C9.64478 19.2946 9.32711 19.1873 9.02242 19.2477L6.72972 19.7025C6.19414 19.8087 5.69936 19.4031 5.65063 18.8587L5.44222 16.5306C5.41416 16.2171 5.22787 15.9456 4.95568 15.8212L2.90829 14.8858C2.43006 14.6674 2.26156 14.0685 2.55981 13.6474L3.83196 11.8507C4.00311 11.609 4.00311 11.2905 3.83196 11.0487L2.55981 9.25203C2.26156 8.8309 2.43006 8.23204 2.90829 8.01358L4.95568 7.07824C5.22787 6.9538 5.41416 6.6823 5.44222 6.36881L5.65063 4.04077C5.69936 3.49635 6.19414 3.09074 6.72972 3.19694L9.02242 3.65171C9.32711 3.71217 9.64478 3.60485 9.85285 3.3715L11.3963 1.63973Z" fill="#4CB5F9"/>
                <path d="M10.19 16L6 11.81L7.41 10.4L10.19 13.17L16.59 6.77L18 8.18L10.19 16Z" fill="#ffffff"/>
              </svg>
            </span>
          </div>
          <div class="developer">${safe(data.developer)}</div>
          <div class="ads">${safe(data["title-ads"])}</div>
        </div>
      </section>

      <section class="metrics-scroll"><div class="metrics">
        <div class="metric-card"><div class="metric-top rating-top">${safe(data.rating)}★</div><div class="metric-bottom">${safe(data["reviews-count"])} reviews</div></div>
        <div class="metric-card"><div class="metric-top">${safe(data["card-downloads"]?.top)}</div><div class="metric-bottom">${safe(data["card-downloads"]?.bottom)}</div></div>
        <div class="metric-card editor-choice-card"><img src="icon-editor-choice.png" alt="Editor's choice" class="metric-icon-img" /><div class="metric-bottom">${safe(data["card-editor-choice"])}</div></div>
        <div class="metric-card"><div class="age-top">${safe(data["card-age"])}+</div><div class="age-bottom">Rated for</div></div>
      </div></section>

      <button class="install-btn" type="button">${safe(data["install-button"])}</button>

      <div class="device-line"><img src="icon-devices.png" alt="Devices" class="device-icon" /> ${safe(data["device-availability"])}</div>

      <section class="swiper">
        ${(data["swiper-images"] || []).map((src) => `<img src="${safe(src)}" alt="Screenshot" />`).join("")}
      </section>

      <section>
        <div class="about-title-row">
          <h2 class="section-title">${safe(data["about-this-app"])}</h2>
          <button type="button" class="about-open-btn" id="about-open-btn" aria-label="Open about popup">→</button>
        </div>
        <p class="section-text about-desc ${state.aboutExpanded ? '' : 'collapsed'}" id="about-description">${safe(data.description)}</p>
        ${!state.aboutExpanded && data.description && data.description.length > 150 ? '<button class="read-more-btn" id="read-more-btn" type="button">More</button>' : ''}
      </section>

      <section>
        <h2 class="section-title">${safe(data["updated-on"])}</h2>
        <p class="section-text">${safe(data["update-on-desc"])}</p>
      </section>

      <section>
        <h2 class="section-title">${safe(data["whats-new"])}</h2>
        <p class="section-text">${safe(data["whats-new-desc"])}</p>
      </section>

      <section>
        <h2 class="section-title">${safe(data["data-safety"])}</h2>
        <p class="section-text">${safe(data["data-safety-desc"])}</p>
        <div class="safety-box">
          <div class="safety-item"><img src="share-icon.png" alt="Share icon" class="safety-icon" /><span>${safe(data["safety-block"]?.["third-parties"])}</span></div>
          <div class="safety-item"><img src="icon-collect.png" alt="Collect icon" class="safety-icon" /><span>${safe(data["safety-block"]?.["data-types"])}</span></div>
          <div class="safety-item"><img src="icon-encrypt.png" alt="Encrypt icon" class="safety-icon" /><span>${safe(data["safety-block"]?.encryption)}</span></div>
          <div class="safety-item"><img src="icon-delete.png" alt="Delete icon" class="safety-icon" /><span>${safe(data["safety-block"]?.["delete-request"])}</span></div>
        </div>
      </section>

      <section>
        <h2 class="section-title">${safe(data["rating-and-reviews"])}</h2>
        <p class="section-text verified-line">${safe(data["rating-and-reviews-verified"])} <span class="info-icon" aria-hidden="true">ⓘ</span></p>
        
        ${renderRatingBars()}

        ${(visible || []).map(renderComment).join("")}

        ${
          comments.length > 2 && !state.expanded
            ? `<button class="see-all" id="see-all-btn" type="button">${safe(data["see-all-reviews"])}</button>`
            : ""
        }
      </section>

      <section class="footer-meta">
        <h3>${safe(data["bottom-metadata"]?.store)}</h3>
        <p>${safe(data["bottom-metadata"]?.["gift-cards"])}</p>
        <p>${safe(data["bottom-metadata"]?.redeem)}</p>
        <p>${safe(data["bottom-metadata"]?.["family-sharing"])}</p>
        <h3>${safe(data["bottom-metadata"]?.["kids-and-family"])}</h3>
        <p>${safe(data["bottom-metadata"]?.["parent-guide"])}</p>
        <div class="footer-links">${(data.footer || []).map((f) => `<span>${safe(f)}</span>`).join("")}</div>
      </section>

      ${renderAboutPopup()}
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    const seeAllBtn = document.getElementById("see-all-btn");
    if (seeAllBtn) {
      seeAllBtn.addEventListener("click", function () {
        state.expanded = true;
        render();
      });
    }

    const readMoreBtn = document.getElementById("read-more-btn");
    if (readMoreBtn) {
      readMoreBtn.addEventListener("click", function () {
        state.aboutExpanded = true;
        render();
      });
    }

    const openPopup = document.getElementById("about-open-btn");
    if (openPopup) {
      openPopup.addEventListener("click", function () {
        state.popupOpen = true;
        render();
      });
    }

    const closePopup = document.getElementById("popup-close");
    if (closePopup) {
      closePopup.addEventListener("click", function () {
        state.popupOpen = false;
        document.body.style.overflow = '';
        render();
      });
    }

    const popupOverlay = document.getElementById("about-popup-overlay");
    if (popupOverlay) {
      popupOverlay.addEventListener("click", function (e) {
        if (e.target === popupOverlay) {
          state.popupOpen = false;
          render();
        }
      });

      // Prevent body scroll when popup is open
      const popupScroll = popupOverlay.querySelector('.about-popup-scroll');
      if (popupScroll) {
        popupScroll.addEventListener('touchmove', function(e) {
          e.stopPropagation();
        });
        popupScroll.addEventListener('wheel', function(e) {
          e.stopPropagation();
        });
      }
      
      // Disable body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    const installBtn = document.querySelector(".install-btn");
    if (installBtn) {
      installBtn.addEventListener("click", function () {
        if (installBtn.classList.contains("loading") || installBtn.classList.contains("opened")) return;

        installBtn.classList.add("loading");
        installBtn.innerHTML = `
          <div class="progress-bg"><div class="progress-fill" id="install-progress"></div></div>
          <span style="position:relative; z-index:2;">0%</span>
        `;
        
        const fill = document.getElementById("install-progress");
        const textSpan = installBtn.querySelector("span");
        let currentProgress = 0;

        function animateProgress(targetProgress, duration) {
          const startProgress = currentProgress;
          const progressDiff = targetProgress - startProgress;
          const startTime = Date.now();

          function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out curve for smoother deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            currentProgress = startProgress + (progressDiff * easeProgress);
            
            if (fill) fill.style.width = `${currentProgress}%`;
            if (textSpan) textSpan.textContent = `${Math.floor(currentProgress)}%`;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              currentProgress = targetProgress;
              if (currentProgress >= 100) {
                setTimeout(() => {
                  installBtn.innerHTML = "Open";
                  installBtn.classList.remove("loading");
                  installBtn.classList.add("opened");
                }, 100);
              }
            }
          }
          
          requestAnimationFrame(update);
        }

        // Stage 1: Quick to 70% (800ms)
        animateProgress(70, 800);
        
        // Stage 2: Slower to 80% (1200ms) - starts after first stage
        setTimeout(() => {
          animateProgress(80, 1200);
        }, 800);
        
        // Stage 3: Even slower to 100% (1500ms) - starts after second stage
        setTimeout(() => {
          animateProgress(100, 1500);
        }, 2000);
      });
    }

    app.querySelectorAll(".yes-btn, .no-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.target.closest(".comment")?.dataset.idx);
        if (Number.isNaN(idx)) return;
        
        const type = btn.classList.contains("yes-btn") ? "yes" : "no";
        const current = state.feedback.get(idx);
        
        if (current === type) {
          state.feedback.delete(idx);
        } else {
          state.feedback.set(idx, type);
        }
        render();
      });
    });
  }

  render();
})();