export interface ChatbotColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
}

export interface ChatbotSize {
    width: string;
    height: string;
}

export interface ChatbotDesign {
    colors: ChatbotColors;
    size: ChatbotSize;
    borderRadius: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    fontFamily: string;
    shadow: string;
}

export interface ChatbotConfig {
    id: string;
    name: string;
    design: ChatbotDesign;
}

export interface ChatbotDesigns {
    chatbots: Record<string, ChatbotConfig>;
} 