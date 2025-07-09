import { ChatbotTemplate } from '@/types/chatbot';

export const chatbotTemplates: ChatbotTemplate[] = [
    {
        id: 'modern-blue',
        name: 'Modern Blau',
        description: 'Sauberes, modernes Design mit blauem Farbschema',
        category: 'modern',
        design: {
            colors: {
                primary: '#3b82f6',
                secondary: '#1e40af',
                background: '#ffffff',
                text: '#1f2937',
                border: '#e5e7eb',
                accent: '#60a5fa',
                hover: '#2563eb',
                success: '#10b981',
                error: '#ef4444'
            },
            size: {
                width: '400px',
                height: '600px',
                minWidth: '300px',
                maxWidth: '500px'
            },
            borderRadius: '16px',
            position: 'bottom-right',
            fontFamily: 'Inter, sans-serif',
            shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: {
                enabled: true,
                type: 'slide',
                duration: 300,
                easing: 'ease-out'
            },
            behavior: {
                welcomeMessage: 'Hallo! Wie kann ich Ihnen heute helfen?',
                autoOpen: false,
                autoOpenDelay: 3000,
                showTypingIndicator: true,
                typingSpeed: 50,
                closeOnOutsideClick: true,
                rememberPosition: true
            },
            opacity: 1,
            borderStyle: 'solid',
            borderWidth: '1px',
            zIndex: 1000
        }
    },
    {
        id: 'minimal-gray',
        name: 'Minimal Grau',
        description: 'Minimalistisches Design mit grauem Farbschema',
        category: 'minimal',
        design: {
            colors: {
                primary: '#6b7280',
                secondary: '#374151',
                background: '#f9fafb',
                text: '#111827',
                border: '#d1d5db',
                accent: '#9ca3af',
                hover: '#4b5563',
                success: '#10b981',
                error: '#ef4444'
            },
            size: {
                width: '350px',
                height: '500px',
                minWidth: '280px',
                maxWidth: '450px'
            },
            borderRadius: '8px',
            position: 'bottom-right',
            fontFamily: 'system-ui, sans-serif',
            shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            animation: {
                enabled: true,
                type: 'fade',
                duration: 200,
                easing: 'ease-in-out'
            },
            behavior: {
                welcomeMessage: 'Hi! Was kann ich für Sie tun?',
                autoOpen: false,
                autoOpenDelay: 5000,
                showTypingIndicator: false,
                typingSpeed: 30,
                closeOnOutsideClick: true,
                rememberPosition: false
            },
            opacity: 0.95,
            borderStyle: 'solid',
            borderWidth: '1px',
            zIndex: 1000
        }
    },
    {
        id: 'colorful-gradient',
        name: 'Buntes Gradient',
        description: 'Farbenfrohes Design mit Gradient-Hintergrund',
        category: 'colorful',
        design: {
            colors: {
                primary: '#8b5cf6',
                secondary: '#7c3aed',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                text: '#ffffff',
                border: '#a855f7',
                accent: '#a855f7',
                hover: '#7c3aed',
                success: '#10b981',
                error: '#f59e0b'
            },
            size: {
                width: '420px',
                height: '650px',
                minWidth: '320px',
                maxWidth: '520px'
            },
            borderRadius: '20px',
            position: 'bottom-right',
            fontFamily: 'Poppins, sans-serif',
            shadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
            animation: {
                enabled: true,
                type: 'bounce',
                duration: 500,
                easing: 'ease-out'
            },
            behavior: {
                welcomeMessage: '🎉 Willkommen! Lass uns chatten!',
                autoOpen: true,
                autoOpenDelay: 2000,
                showTypingIndicator: true,
                typingSpeed: 60,
                closeOnOutsideClick: false,
                rememberPosition: true
            },
            opacity: 1,
            borderStyle: 'solid',
            borderWidth: '2px',
            zIndex: 1000
        }
    },
    {
        id: 'business-dark',
        name: 'Business Dunkel',
        description: 'Professionelles dunkles Design für Unternehmen',
        category: 'business',
        design: {
            colors: {
                primary: '#1f2937',
                secondary: '#111827',
                background: '#ffffff',
                text: '#1f2937',
                border: '#d1d5db',
                accent: '#3b82f6',
                hover: '#1e40af',
                success: '#059669',
                error: '#dc2626'
            },
            size: {
                width: '450px',
                height: '700px',
                minWidth: '350px',
                maxWidth: '550px'
            },
            borderRadius: '12px',
            position: 'bottom-right',
            fontFamily: 'Roboto, sans-serif',
            shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            animation: {
                enabled: true,
                type: 'slide',
                duration: 400,
                easing: 'ease-in-out'
            },
            behavior: {
                welcomeMessage: 'Guten Tag! Wie kann ich Ihnen behilflich sein?',
                autoOpen: false,
                autoOpenDelay: 10000,
                showTypingIndicator: true,
                typingSpeed: 40,
                closeOnOutsideClick: true,
                rememberPosition: true
            },
            opacity: 1,
            borderStyle: 'solid',
            borderWidth: '1px',
            zIndex: 1000
        }
    },
    {
        id: 'casual-warm',
        name: 'Casual Warm',
        description: 'Gemütliches Design mit warmen Farben',
        category: 'casual',
        design: {
            colors: {
                primary: '#f59e0b',
                secondary: '#d97706',
                background: '#fef3c7',
                text: '#92400e',
                border: '#fbbf24',
                accent: '#fbbf24',
                hover: '#d97706',
                success: '#10b981',
                error: '#ef4444'
            },
            size: {
                width: '380px',
                height: '580px',
                minWidth: '300px',
                maxWidth: '480px'
            },
            borderRadius: '16px',
            position: 'bottom-right',
            fontFamily: 'Nunito, sans-serif',
            shadow: '0 20px 25px -5px rgba(245, 158, 11, 0.1), 0 10px 10px -5px rgba(245, 158, 11, 0.04)',
            animation: {
                enabled: true,
                type: 'fade',
                duration: 300,
                easing: 'ease-out'
            },
            behavior: {
                welcomeMessage: 'Hey! 👋 Schön, dass du da bist!',
                autoOpen: false,
                autoOpenDelay: 4000,
                showTypingIndicator: true,
                typingSpeed: 45,
                closeOnOutsideClick: true,
                rememberPosition: false
            },
            opacity: 0.98,
            borderStyle: 'solid',
            borderWidth: '2px',
            zIndex: 1000
        }
    }
]; 