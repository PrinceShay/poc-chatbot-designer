export interface ChatbotColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    accent: string;
    hover: string;
    success: string;
    error: string;
}

export interface ChatbotSize {
    width: string;
    height: string;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
}

export interface ChatbotAnimation {
    enabled: boolean;
    type: 'fade' | 'slide' | 'bounce' | 'none';
    duration: number;
    easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

export interface ChatbotBehavior {
    welcomeMessage: string;
    autoOpen: boolean;
    autoOpenDelay: number;
    showTypingIndicator: boolean;
    typingSpeed: number;
    closeOnOutsideClick: boolean;
    rememberPosition: boolean;
}

export interface ChatbotDesign {
    colors: ChatbotColors;
    size: ChatbotSize;
    borderRadius: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    fontFamily: string;
    shadow: string;
    animation: ChatbotAnimation;
    behavior: ChatbotBehavior;
    opacity: number;
    borderStyle: 'solid' | 'dashed' | 'dotted' | 'none';
    borderWidth: string;
    zIndex: number;
}

export interface ChatbotConfig {
    id: string;
    name: string;
    design: ChatbotDesign;
    template?: string;
}

export interface ChatbotDesigns {
    chatbots: Record<string, ChatbotConfig>;
}

export interface ChatbotTemplate {
    id: string;
    name: string;
    description: string;
    design: ChatbotDesign;
    category: 'business' | 'casual' | 'modern' | 'minimal' | 'colorful';
} 