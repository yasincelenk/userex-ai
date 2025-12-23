export type ModuleId = 'generalChatbot' | 'appointments' | 'leadCollection' | 'productCatalog' | 'knowledgeBase' | 'voiceAssistant' | 'socialMedia' | 'emailMarketing' | 'salesOptimization';

export type IndustryType = 'ecommerce' | 'booking' | 'real_estate' | 'saas' | 'service' | 'healthcare' | 'education' | 'academic' | 'finance' | 'other';

export interface ModuleConfig {
    id: ModuleId;
    nameKey: string; // Translation key for name
    descriptionKey: string; // Translation key for description
    isPremium: boolean;
    isCore: boolean; // Core modules cannot be disabled
    price: number; // Monthly price in USD
    icon: string; // Lucide icon name
    recommendedFor: IndustryType[]; // Industries this module is recommended for
}

export interface SalesOptimizationConfig {
    discountCodes: boolean;      // İndirim kodu
    stockAlerts: boolean;        // Stok uyarısı
    cartRecovery: boolean;       // Sepet kurtarma
    productComparison: boolean;  // Ürün karşılaştırma
    // İndirim kodu ayarları
    discountCodeConfig?: {
        codes: { code: string; discount: number; type: 'percent' | 'fixed'; minOrder?: number }[];
        autoOffer: boolean;
        offerAfterSeconds: number;
    };
    // Stok uyarısı ayarları
    stockAlertConfig?: {
        lowStockThreshold: number;
        showExactCount: boolean;
    };
    // Sepet kurtarma ayarları
    cartRecoveryConfig?: {
        triggerAfterSeconds: number;
        offerDiscount: boolean;
        discountPercent: number;
    };
}

export const MODULES: Record<ModuleId, ModuleConfig> = {
    generalChatbot: {
        id: 'generalChatbot',
        nameKey: 'aiChatbot',
        descriptionKey: 'aiChatbotDesc',
        isPremium: false,
        isCore: true,
        price: 0,
        icon: 'MessageSquare',
        recommendedFor: [] // Core - always included
    },
    knowledgeBase: {
        id: 'knowledgeBase',
        nameKey: 'modules.knowledgeBase',
        descriptionKey: 'modules.knowledgeBaseDesc',
        isPremium: false,
        isCore: true,
        price: 0,
        icon: 'BookOpen',
        recommendedFor: [] // Core - always included
    },
    productCatalog: {
        id: 'productCatalog',
        nameKey: 'modules.productCatalog',
        descriptionKey: 'modules.productCatalogDesc',
        isPremium: true,
        isCore: false,
        price: 29,
        icon: 'ShoppingBag',
        recommendedFor: ['ecommerce', 'real_estate', 'education']
    },
    leadCollection: {
        id: 'leadCollection',
        nameKey: 'modules.leadCollection',
        descriptionKey: 'modules.leadCollectionDesc',
        isPremium: true,
        isCore: false,
        price: 29,
        icon: 'Users',
        recommendedFor: ['ecommerce', 'real_estate', 'saas', 'service', 'finance']
    },
    appointments: {
        id: 'appointments',
        nameKey: 'modules.appointments',
        descriptionKey: 'modules.appointmentsDesc',
        isPremium: true,
        isCore: false,
        price: 39,
        icon: 'Calendar',
        recommendedFor: ['booking', 'real_estate', 'healthcare', 'service', 'academic']
    },
    voiceAssistant: {
        id: 'voiceAssistant',
        nameKey: 'modules.voiceAssistant',
        descriptionKey: 'modules.voiceAssistantDesc',
        isPremium: true,
        isCore: false,
        price: 49,
        icon: 'Mic',
        recommendedFor: ['healthcare', 'service', 'booking']
    },
    socialMedia: {
        id: 'socialMedia',
        nameKey: 'modules.socialMedia',
        descriptionKey: 'modules.socialMediaDesc',
        isPremium: true,
        isCore: false,
        price: 19,
        icon: 'Share2',
        recommendedFor: ['ecommerce', 'education', 'saas']
    },
    emailMarketing: {
        id: 'emailMarketing',
        nameKey: 'modules.emailMarketing',
        descriptionKey: 'modules.emailMarketingDesc',
        isPremium: true,
        isCore: false,
        price: 29,
        icon: 'Mail',
        recommendedFor: ['ecommerce', 'saas', 'education']
    },

    salesOptimization: {
        id: 'salesOptimization',
        nameKey: 'modules.salesOptimization',
        descriptionKey: 'modules.salesOptimizationDesc',
        isPremium: true,
        isCore: false,
        price: 49,
        icon: 'TrendingUp',
        recommendedFor: ['ecommerce', 'real_estate', 'finance']
    }
};

// Ordered array for rendering - Core modules first, then others
export const ORDERED_MODULES: ModuleConfig[] = [
    MODULES.generalChatbot,    // 1. Core: General Chatbot
    MODULES.knowledgeBase,     // 2. Core: Knowledge Base
    MODULES.productCatalog,    // 3. Product Catalog
    MODULES.leadCollection,    // 4. Lead Collection
    MODULES.appointments,      // 5. Appointments
    MODULES.voiceAssistant,    // 6. Voice Assistant
    MODULES.socialMedia,       // 7. Social Media
    MODULES.emailMarketing,    // 8. Email Marketing

    MODULES.salesOptimization, // 10. Sales Optimization
];
