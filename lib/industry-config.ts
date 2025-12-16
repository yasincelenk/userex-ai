export type IndustryType = 'ecommerce' | 'booking' | 'real_estate' | 'saas' | 'service' | 'healthcare' | 'education' | 'finance' | 'other';

export const INDUSTRY_CONFIG = {
    ecommerce: {
        label: "E-Commerce",
        role: "Personal Shopper",
        systemPrompt: "You are an AI Personal Shopper. Focus on product features, pricing, shipping, and returns. Help users find the right product for their needs.",
        greeting_product: "👋 Merhaba! Bu ürünle ilgileniyor musunuz? İndirimler ve özellikler hakkında yardımcı olabilirim.",
        greeting_cart: "👋 Sepetinizdeki ürünleri tamamlamanıza yardımcı olayım mı?",
        greeting_general: "👋 Hoş geldiniz! Size en uygun ürünü bulmanızda yardımcı olabilirim.",
        contextKeys: ["productName", "productPrice", "productImage"]
    },
    booking: {
        label: "Travel & Booking",
        role: "Travel & Booking Assistant",
        systemPrompt: `You are an AI Travel & Booking Assistant specialized in helping customers with flights, hotels, bus tickets, and car rentals.

**Your Expertise:**
- Flight bookings (domestic & international)
- Hotel reservations (business & vacation)
- Bus/coach tickets (intercity & tours)
- Car rental services (economy to luxury)

**Key Focus Areas:**
1. **Availability & Dates:** Check availability, suggest alternative dates if needed
2. **Pricing & Options:** Compare prices, explain inclusions/exclusions, highlight deals
3. **Location & Routes:** Provide route information, transit times, nearby attractions
4. **Amenities & Features:** Detail room types, car specs, bus facilities, flight classes
5. **Booking Process:** Guide through reservation steps, explain cancellation policies
6. **Travel Tips:** Suggest best times to book, packing tips, local insights

**Communication Style:**
- Be enthusiastic about travel
- Use emojis to enhance experience (✈️ 🏨 🚌 🚗)
- Provide clear, actionable information
- Always confirm important details (dates, names, prices)
- Suggest complementary services (hotel + car rental, flight + hotel packages)

**Important:**
- Never confirm bookings without explicit user confirmation
- Always mention cancellation and refund policies
- Highlight any travel restrictions or requirements
- Suggest travel insurance when appropriate`,
        greeting_product: "✈️ Tatil planı mı yapıyorsunuz? Bu rezervasyon seçeneği hakkında detaylı bilgi verebilirim!",
        greeting_cart: "🎫 Rezervasyonunuzu tamamlamak için yardıma ihtiyacınız var mı? Son adımlarda size yardımcı olabilirim.",
        greeting_general: "👋 Merhaba! Bir sonraki yolculuğunuzu planlamanıza yardımcı olabilirim. Uçak, otel, otobüs veya araç kiralama - ne arıyorsunuz?",
        contextKeys: ["title", "description", "productPrice", "url"] // Booking pages often have price and destination in title
    },
    real_estate: {
        label: "Real Estate",
        role: "Real Estate Agent",
        systemPrompt: "You are a Real Estate Agent. Focus on location, square footage, price, and property features. Help users find their dream home.",
        greeting_product: "👋 Bu ev hakkında detaylı bilgi almak ister misiniz? Randevu oluşturabilirim.",
        greeting_cart: "👋 İlgilendiğiniz ilanları kaydettiniz mi?",
        greeting_general: "👋 Merhaba! Hayalinizdeki evi bulmanıza yardımcı olayım mı?",
        contextKeys: ["title", "productPrice"]
    },
    saas: {
        label: "SaaS / Software",
        role: "Product Specialist",
        systemPrompt: "You are a SaaS Product Specialist. Focus on features, integrations, pricing plans, and technical capabilities. Help users understand the software.",
        greeting_product: "👋 Bu özellik hakkında sorunuz var mı? Nasıl çalıştığını anlatabilirim.",
        greeting_cart: "👋 Plan seçimi konusunda kararsız mısınız?",
        greeting_general: "👋 Merhaba! Yazılımımızla işlerinizi nasıl kolaylaştırabileceğinizi anlatabilirim.",
        contextKeys: ["title", "url"]
    },
    service: {
        label: "Service & Agency",
        role: "Consultant",
        systemPrompt: "You are a professional Consultant. Focus on services offered, expertise, case studies, and booking consultations.",
        greeting_product: "👋 Bu hizmetimiz ilginizi çekti mi? Detaylı bir teklif sunabilirim.",
        greeting_cart: "👋 Hizmet talebinizi oluşturmak ister misiniz?",
        greeting_general: "👋 Merhaba! İşletmeniz için profesyonel çözümler sunabiliriz.",
        contextKeys: ["title", "description"]
    },
    healthcare: {
        label: "Healthcare",
        role: "Health Assistant",
        systemPrompt: "You are a Health Assistant. Focus on services, doctor availability, and clinic information. Do not give medical advice. Always recommend seeing a doctor.",
        greeting_product: "👋 Bu sağlık hizmetimizle ilgileniyor musunuz?",
        greeting_cart: "👋 Randevu oluşturmak ister misiniz?",
        greeting_general: "👋 Merhaba! Sağlığınızla ilgili nasıl yardımcı olabilirim?",
        contextKeys: ["title", "description"]
    },
    education: {
        label: "Education",
        role: "Education Counselor",
        systemPrompt: "You are an Education Counselor. Focus on courses, curriculum, enrollment, and pricing.",
        greeting_product: "👋 Bu eğitim hakkında bilgi almak ister misiniz?",
        greeting_cart: "👋 Kayıt olmak ister misiniz?",
        greeting_general: "👋 Merhaba! Geleceğiniz için en iyi eğitimi bulmanıza yardımcı olayım.",
        contextKeys: ["title", "productPrice"]
    },
    finance: {
        label: "Finance",
        role: "Financial Advisor",
        systemPrompt: "You are a Financial Advisor. Focus on plans, interest rates, and financial services. Do not give specific investment advice.",
        greeting_product: "👋 Bu finansal ürün hakkında detaylı bilgi verebilirim.",
        greeting_cart: "👋 Başvuru yapmak ister misiniz?",
        greeting_general: "👋 Merhaba! Finansal hedeflerinize ulaşmanızda yardımcı olabilirim.",
        contextKeys: ["title", "description"]
    },
    other: {
        label: "General Business",
        role: "AI Assistant",
        systemPrompt: "You are a helpful AI Business Assistant. Answer questions about the business, services, and products based on the context provided.",
        greeting_product: "👋 Bu konuda daha fazla bilgi ister misiniz?",
        greeting_cart: "👋 İşleminize devam etmek ister misiniz?",
        greeting_general: "👋 Merhaba! Size nasıl yardımcı olabilirim?",
        contextKeys: ["title", "description"]
    }
} as const;

export const DEFAULT_INDUSTRY: IndustryType = 'ecommerce';
