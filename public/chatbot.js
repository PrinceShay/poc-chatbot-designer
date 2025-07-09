(function () {
    'use strict';

    class ChatbotWidget {
        constructor(chatbotId, apiUrl) {
            this.chatbotId = chatbotId;
            // Verwende die aktuelle Domain für die API oder Fallback auf Vercel-URL
            if (apiUrl) {
                this.apiUrl = apiUrl;
            } else if (window.location.origin && window.location.origin !== 'null') {
                this.apiUrl = window.location.origin + '/api/chatbot';
            } else {
                // Fallback für lokale HTML-Dateien oder wenn origin null ist
                this.apiUrl = 'https://poc-chatbot-designer.vercel.app/api/chatbot';
            }
            this.isOpen = false;
            this.design = null;
            this.init();
        }

        async init() {
            try {
                // Design-Daten laden
                const response = await fetch(`${this.apiUrl}/${this.chatbotId}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                this.design = await response.json();

                // Widget erstellen
                this.createWidget();
                this.attachEventListeners();
            } catch (error) {
                console.error('Fehler beim Laden des Chatbots:', error);

                // Fallback: Verwende Standard-Design wenn API nicht erreichbar
                this.design = {
                    id: this.chatbotId,
                    name: 'Chatbot',
                    design: {
                        colors: {
                            primary: '#3b82f6',
                            secondary: '#1e40af',
                            background: '#ffffff',
                            text: '#1f2937',
                            border: '#e5e7eb'
                        },
                        size: {
                            width: '400px',
                            height: '600px'
                        },
                        borderRadius: '12px',
                        position: 'bottom-right',
                        fontFamily: 'Inter, sans-serif',
                        shadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }
                };

                // Widget trotzdem erstellen
                this.createWidget();
                this.attachEventListeners();
            }
        }

        createWidget() {
            // Container erstellen
            const container = document.createElement('div');
            container.id = 'chatbot-widget';
            container.style.cssText = `
        position: fixed;
        ${this.getPositionStyles()}
        z-index: 9999;
        font-family: ${this.design.design.fontFamily};
        transition: all 0.3s ease;
      `;

            // Chat-Button
            const chatButton = document.createElement('button');
            chatButton.id = 'chatbot-button';
            chatButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      `;
            chatButton.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${this.design.design.colors.primary};
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: ${this.design.design.shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      `;

            // Chat-Fenster
            const chatWindow = document.createElement('div');
            chatWindow.id = 'chatbot-window';
            chatWindow.style.cssText = `
        width: ${this.design.design.size.width};
        height: ${this.design.design.size.height};
        background: ${this.design.design.colors.background};
        border: 1px solid ${this.design.design.colors.border};
        border-radius: ${this.design.design.borderRadius};
        box-shadow: ${this.design.design.shadow};
        display: none;
        flex-direction: column;
        color: ${this.design.design.colors.text};
        overflow: hidden;
      `;

            // Header
            const header = document.createElement('div');
            header.style.cssText = `
        background: ${this.design.design.colors.primary};
        color: white;
        padding: 15px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
            header.innerHTML = `
        <span>${this.design.name}</span>
        <button id="chatbot-close" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
      `;

            // Chat-Bereich
            const chatArea = document.createElement('div');
            chatArea.id = 'chatbot-messages';
            chatArea.style.cssText = `
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        background: ${this.design.design.colors.background};
      `;

            // Input-Bereich
            const inputArea = document.createElement('div');
            inputArea.style.cssText = `
        padding: 15px;
        border-top: 1px solid ${this.design.design.colors.border};
        background: ${this.design.design.colors.background};
        display: flex;
        gap: 10px;
      `;

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Nachricht eingeben...';
            input.style.cssText = `
        flex: 1;
        padding: 10px;
        border: 1px solid ${this.design.design.colors.border};
        border-radius: 20px;
        outline: none;
        background: ${this.design.design.colors.background};
        color: ${this.design.design.colors.text};
      `;

            const sendButton = document.createElement('button');
            sendButton.innerHTML = 'Senden';
            sendButton.style.cssText = `
        padding: 10px 15px;
        background: ${this.design.design.colors.primary};
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
      `;

            // Zusammenbauen
            inputArea.appendChild(input);
            inputArea.appendChild(sendButton);
            chatWindow.appendChild(header);
            chatWindow.appendChild(chatArea);
            chatWindow.appendChild(inputArea);
            container.appendChild(chatButton);
            container.appendChild(chatWindow);

            document.body.appendChild(container);

            // Referenzen speichern
            this.container = container;
            this.chatButton = chatButton;
            this.chatWindow = chatWindow;
            this.input = input;
            this.sendButton = sendButton;
            this.messagesArea = chatArea;
        }

        getPositionStyles() {
            const position = this.design.design.position;
            switch (position) {
                case 'bottom-right':
                    return 'bottom: 20px; right: 20px;';
                case 'bottom-left':
                    return 'bottom: 20px; left: 20px;';
                case 'top-right':
                    return 'top: 20px; right: 20px;';
                case 'top-left':
                    return 'top: 20px; left: 20px;';
                default:
                    return 'bottom: 20px; right: 20px;';
            }
        }

        attachEventListeners() {
            // Chat-Button Click
            this.chatButton.addEventListener('click', () => {
                this.toggleChat();
            });

            // Close-Button Click
            document.getElementById('chatbot-close').addEventListener('click', () => {
                this.closeChat();
            });

            // Send-Button Click
            this.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });

            // Enter-Key im Input
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.chatWindow.style.display = this.isOpen ? 'flex' : 'none';

            if (this.isOpen && this.messagesArea.children.length === 0) {
                this.addMessage('Hallo! Wie kann ich dir helfen?', 'bot');
            }
        }

        closeChat() {
            this.isOpen = false;
            this.chatWindow.style.display = 'none';
        }

        sendMessage() {
            const message = this.input.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            this.input.value = '';

            // Simulierte Bot-Antwort
            setTimeout(() => {
                this.addMessage('Danke für deine Nachricht! Das ist eine Demo-Antwort.', 'bot');
            }, 1000);
        }

        addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
        margin-bottom: 10px;
        padding: 10px 15px;
        border-radius: 15px;
        max-width: 80%;
        word-wrap: break-word;
        ${sender === 'user'
                    ? `background: ${this.design.design.colors.primary}; color: white; margin-left: auto;`
                    : `background: ${this.design.design.colors.border}; color: ${this.design.design.colors.text};`
                }
      `;
            messageDiv.textContent = text;

            this.messagesArea.appendChild(messageDiv);
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }
    }

    // Globale Funktion zum Initialisieren des Chatbots
    window.initChatbot = function (chatbotId, apiUrl) {
        return new ChatbotWidget(chatbotId, apiUrl);
    };

    // Auto-Init wenn data-chatbot-id Attribut vorhanden
    document.addEventListener('DOMContentLoaded', function () {
        const scripts = document.querySelectorAll('script[data-chatbot-id]');
        scripts.forEach(script => {
            const chatbotId = script.getAttribute('data-chatbot-id');
            let apiUrl = script.getAttribute('data-api-url');

            // Fallback für lokale HTML-Dateien
            if (!apiUrl) {
                if (window.location.origin && window.location.origin !== 'null') {
                    apiUrl = window.location.origin + '/api/chatbot';
                } else {
                    apiUrl = 'https://poc-chatbot-designer.vercel.app/api/chatbot';
                }
            }

            if (chatbotId) {
                new ChatbotWidget(chatbotId, apiUrl);
            }
        });
    });
})(); 