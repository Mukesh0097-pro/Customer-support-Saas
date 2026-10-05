/**
 * SupportAI Embeddable Customer Chat Widget
 * Lightweight, standalone, Shadow-DOM isolated chat widget.
 */
(function () {
  if (window.SupportAIWidgetInitialized) return;
  window.SupportAIWidgetInitialized = true;

  // Retrieve configuration from current script tag or global config
  const currentScript =
    document.currentScript ||
    document.querySelector("script[src*='widget.js']") ||
    {};

  const config = {
    apiBase:
      currentScript.getAttribute("data-api-base") ||
      (window.SupportAIConfig && window.SupportAIConfig.apiBase) ||
      "http://localhost:5000/api",
    botName:
      currentScript.getAttribute("data-bot-name") ||
      (window.SupportAIConfig && window.SupportAIConfig.botName) ||
      "SupportAI Assistant",
    greeting:
      currentScript.getAttribute("data-greeting") ||
      (window.SupportAIConfig && window.SupportAIConfig.greeting) ||
      "Hi there! 👋 How can I help you today?",
    primaryColor:
      currentScript.getAttribute("data-primary-color") ||
      (window.SupportAIConfig && window.SupportAIConfig.primaryColor) ||
      "#000000",
    position:
      currentScript.getAttribute("data-position") ||
      (window.SupportAIConfig && window.SupportAIConfig.position) ||
      "right", // 'right' | 'left'
  };

  // State
  let isOpen = false;
  let isLoading = false;
  let conversationId =
    sessionStorage.getItem("supportai_conv_id") ||
    "conv-widget-" + Date.now();
  sessionStorage.setItem("supportai_conv_id", conversationId);

  let messages = [
    {
      id: "greet-1",
      sender: "bot",
      text: config.greeting,
      timestamp: "Just now",
      citations: [],
    },
  ];

  const suggestions = [
    "What is your refund policy?",
    "How do I authenticate API requests?",
    "Is customer data encrypted?",
    "I need to speak to a human",
  ];

  // Create Host Container with Shadow DOM for CSS isolation
  const host = document.createElement("div");
  host.id = "supportai-widget-host";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  // Stylesheet
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    
    .widget-container {
      position: fixed;
      bottom: 24px;
      ${config.position === "left" ? "left: 24px;" : "right: 24px;"}
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      align-items: ${config.position === "left" ? "flex-start" : "flex-end"};
    }

    /* Floating Bubble Button */
    .widget-btn {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: #ffffff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    }
    .widget-btn:hover {
      transform: scale(1.06);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
    }
    .widget-btn:active {
      transform: scale(0.96);
    }
    .widget-btn svg {
      width: 26px;
      height: 26px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.2s ease;
    }

    /* Chat Window */
    .chat-window {
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 540px;
      max-height: calc(100vh - 100px);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: none;
      flex-direction: column;
      margin-bottom: 14px;
      overflow: hidden;
      animation: popIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .chat-window.open {
      display: flex;
    }
    @keyframes popIn {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Header */
    .chat-header {
      background: ${config.primaryColor};
      color: #ffffff;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bot-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 15px;
    }
    .bot-title {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.2px;
      line-height: 1.2;
    }
    .bot-status {
      font-size: 11px;
      opacity: 0.85;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }
    .bot-status::before {
      content: "";
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      display: inline-block;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #ffffff;
      opacity: 0.8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 8px;
      transition: opacity 0.15s, background 0.15s;
    }
    .close-btn:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.15);
    }

    /* Message List */
    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #fafafa;
    }
    .msg-row {
      display: flex;
      flex-direction: column;
      max-width: 82%;
    }
    .msg-row.user {
      align-self: flex-end;
      align-items: flex-end;
    }
    .msg-row.bot {
      align-self: flex-start;
      align-items: flex-start;
    }
    .msg-bubble {
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.45;
      word-break: break-word;
    }
    .msg-row.user .msg-bubble {
      background: ${config.primaryColor};
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .msg-row.bot .msg-bubble {
      background: #ffffff;
      color: #1f2937;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .msg-time {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 4px;
      padding: 0 4px;
    }
    .citation-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 3px 8px;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 11px;
      color: #4b5563;
      border: 1px solid #e5e7eb;
    }

    /* Suggestions */
    .suggestions-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .suggestion-chip {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      color: #374151;
      padding: 6px 10px;
      border-radius: 16px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }
    .suggestion-chip:hover {
      background: #f9fafb;
      border-color: #d1d5db;
      color: #111827;
      transform: translateY(-1px);
    }

    /* Typing indicator */
    .typing-bubble {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 14px;
      width: fit-content;
    }
    .typing-dot {
      width: 6px;
      height: 6px;
      background: #9ca3af;
      border-radius: 50%;
      animation: pulseDot 1.2s infinite ease-in-out;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulseDot {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* Input area */
    .chat-input-bar {
      padding: 12px 14px;
      background: #ffffff;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .chat-input {
      flex: 1;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 9px 14px;
      font-size: 13px;
      outline: none;
      transition: border 0.15s;
    }
    .chat-input:focus {
      border-color: ${config.primaryColor};
    }
    .send-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${config.primaryColor};
      color: #ffffff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.15s, transform 0.15s;
      flex-shrink: 0;
    }
    .send-btn:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
    .send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }
    .send-btn svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;

  // HTML Structure
  const container = document.createElement("div");
  container.className = "widget-container";
  container.innerHTML = `
    <div class="chat-window" id="chat-win">
      <div class="chat-header">
        <div class="header-info">
          <div class="bot-avatar">${config.botName.slice(0, 1)}</div>
          <div>
            <div class="bot-title">${config.botName}</div>
            <div class="bot-status">Instant AI Assistance</div>
          </div>
        </div>
        <button class="close-btn" id="close-win-btn" aria-label="Close chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div class="chat-messages" id="chat-msgs"></div>

      <form class="chat-input-bar" id="chat-form">
        <input type="text" class="chat-input" id="chat-inp" placeholder="Type a message…" autocomplete="off" />
        <button type="submit" class="send-btn" id="chat-snd" aria-label="Send message">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>
    </div>

    <button class="widget-btn" id="toggle-btn" aria-label="Open chat">
      <svg id="icon-open" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <svg id="icon-close" viewBox="0 0 24 24" style="display:none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;

  shadow.appendChild(style);
  shadow.appendChild(container);

  // DOM references inside Shadow DOM
  const chatWin = shadow.getElementById("chat-win");
  const toggleBtn = shadow.getElementById("toggle-btn");
  const closeWinBtn = shadow.getElementById("close-win-btn");
  const iconOpen = shadow.getElementById("icon-open");
  const iconClose = shadow.getElementById("icon-close");
  const chatMsgs = shadow.getElementById("chat-msgs");
  const chatForm = shadow.getElementById("chat-form");
  const chatInp = shadow.getElementById("chat-inp");

  // Render messages
  function renderMessages() {
    chatMsgs.innerHTML = "";

    messages.forEach((msg) => {
      const row = document.createElement("div");
      row.className = `msg-row ${msg.sender === "user" ? "user" : "bot"}`;

      let citationsHtml = "";
      if (msg.citations && msg.citations.length > 0) {
        citationsHtml = `
          <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px;">
            ${msg.citations
              .map(
                (c) =>
                  `<span class="citation-badge" title="${c.snippet || ""}">📄 ${c.title || "Docs"}</span>`
              )
              .join("")}
          </div>
        `;
      }

      row.innerHTML = `
        <div class="msg-bubble">${escapeHtml(msg.text)}${citationsHtml}</div>
        <div class="msg-time">${msg.timestamp || ""}</div>
      `;
      chatMsgs.appendChild(row);
    });

    // If only greeting exists, render starter suggestion chips
    if (messages.length === 1) {
      const sugWrap = document.createElement("div");
      sugWrap.className = "suggestions-wrap";
      suggestions.forEach((text) => {
        const chip = document.createElement("button");
        chip.className = "suggestion-chip";
        chip.textContent = text;
        chip.addEventListener("click", () => {
          sendMessage(text);
        });
        sugWrap.appendChild(chip);
      });
      chatMsgs.appendChild(sugWrap);
    }

    // Typing bubble
    if (isLoading) {
      const typing = document.createElement("div");
      typing.className = "msg-row bot";
      typing.innerHTML = `
        <div class="typing-bubble">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      chatMsgs.appendChild(typing);
    }

    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function toggleChat(forceState) {
    isOpen = typeof forceState === "boolean" ? forceState : !isOpen;
    if (isOpen) {
      chatWin.classList.add("open");
      iconOpen.style.display = "none";
      iconClose.style.display = "block";
      setTimeout(() => chatInp.focus(), 100);
    } else {
      chatWin.classList.remove("open");
      iconOpen.style.display = "block";
      iconClose.style.display = "none";
    }
  }

  async function sendMessage(text) {
    if (!text || !text.trim() || isLoading) return;
    const cleanText = text.trim();

    messages.push({
      id: "msg-" + Date.now(),
      sender: "user",
      text: cleanText,
      timestamp: "Just now",
    });
    chatInp.value = "";
    isLoading = true;
    renderMessages();

    try {
      const res = await fetch(`${config.apiBase}/chat/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanText,
          conversationId: conversationId,
        }),
      });

      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      if (data.conversationId) {
        conversationId = data.conversationId;
        sessionStorage.setItem("supportai_conv_id", conversationId);
      }

      messages.push({
        id: "msg-" + Date.now(),
        sender: "bot",
        text: data.reply || "Thank you for reaching out.",
        citations: data.citations || [],
        timestamp: "Just now",
      });
    } catch (err) {
      messages.push({
        id: "msg-" + Date.now(),
        sender: "bot",
        text: "Sorry, I am having trouble connecting to the support server right now. Please try again shortly.",
        timestamp: "Just now",
      });
    } finally {
      isLoading = false;
      renderMessages();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  toggleBtn.addEventListener("click", () => toggleChat());
  closeWinBtn.addEventListener("click", () => toggleChat(false));
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(chatInp.value);
  });

  // Initial render
  renderMessages();
})();
