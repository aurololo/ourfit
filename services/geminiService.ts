import { GoogleGenAI, Type } from "@google/genai";
import { Product, User, ChatMessage } from "../types";

// Initialize Gemini
let _ai: InstanceType<typeof GoogleGenAI> | null = null;
const getAI = () => { if (!_ai) _ai = new GoogleGenAI({ apiKey: process.env.API_KEY ?? '' }); return _ai; };

/**
 * Client-side utility to remove solid black background from an image string.
 * Converts the image to a transparent PNG.
 */
const removeBlackBackground = (base64Data: string): Promise<string> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(base64Data);
            return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(base64Data);
                return;
            }
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const threshold = 25; // Tolerance for "black" (0-255)

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Calculate perceived brightness or max channel
                const maxVal = Math.max(r, g, b);

                if (maxVal < threshold) {
                    data[i + 3] = 0; // Fully transparent
                } else if (maxVal < threshold + 20) {
                    // Soft edge anti-aliasing for transition pixels
                    // Linear ramp from 0 to 255 alpha
                    const alpha = ((maxVal - threshold) / 20) * 255;
                    data[i + 3] = alpha;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
            console.warn("Failed to process image background");
            resolve(base64Data);
        };
        img.src = base64Data;
    });
};

/**
 * Edits a product image based on a text prompt using Gemini 2.5 Flash Image.
 */
export const editProductImage = async (base64Image: string, prompt: string): Promise<string | null> => {
    try {
        // Strip the data:image/xyz;base64, header if present
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        const model = 'gemini-2.5-flash-image';

        const response = await getAI().models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Data
                        }
                    },
                    {
                        text: prompt
                    }
                ]
            }
        });

        // Extract image from response
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    // Re-attach header for browser display. Assuming JPEG as commonly returned/requested.
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }

        return null;
    } catch (error) {
        console.error("Gemini Image Edit failed:", error);
        return null;
    }
};

/**
 * Generates a "Vibe Check" description for a product.
 */
export const generateVibeCheck = async (productTitle: string, tags: string[]): Promise<string> => {
    try {
        const model = 'gemini-3-flash-preview';

        const prompt = `
      You are a GenZ fashion curator for "ourFIT", a brutalist Indian streetwear marketplace.
      Write a short, punchy, "indie-sleaze" style description for a garment titled "${productTitle}" with tags: ${tags.join(', ')}.
      
      Rules:
      1. Use slang appropriate for Bangalore/Mumbai creative scene (e.g., "Main character energy", "Archive vibe", "Crazy aura").
      2. Keep it under 40 words.
      3. Be slightly dismissive but hype at the same time.
      4. No emojis, just raw text.
    `;

        const response = await getAI().models.generateContent({
            model: model,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 },
                temperature: 1.2,
            }
        });

        return response.text || "Aura too strong to describe.";
    } catch (error) {
        console.error("Gemini Vibe Check failed:", error);
        return "This piece speaks for itself. Pure atmosphere.";
    }
};

/**
 * Simulates an AI Stylist suggesting an upcycle idea
 */
export const suggestUpcycleIdea = async (productTitle: string): Promise<string> => {
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
            Suggest a 1-sentence upcycling idea for a used "${productTitle}" to make it high-fashion streetwear. 
            Focus on techniques like patchwork, distressing, or painting.
        `;
        const response = await getAI().models.generateContent({
            model,
            contents: prompt
        });
        return response.text || "Add patchwork denim and safety pins.";
    } catch (e) {
        return "Distress the hems and add bleach splatter.";
    }
}

/**
 * Auto-generates listing details (tags, description, aura score) from a user-provided title.
 */
export const generateListingDetails = async (title: string): Promise<{ tags: string[], description: string, auraScore: number }> => {
    try {
        const response = await getAI().models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate listing details for a fashion item titled: "${title}". The description should be "indie-sleaze" style, GenZ coded, under 20 words. The aura score should be between 70 and 99 based on how "cool" or "niche" the item sounds.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "5 relevant streetwear tags (e.g. 'archive', 'y2k', 'opium')"
                        },
                        description: {
                            type: Type.STRING,
                            description: "A short, edgy description of the item."
                        },
                        auraScore: {
                            type: Type.INTEGER,
                            description: "A score from 1-100 indicating how cool the item is."
                        }
                    },
                    required: ["tags", "description", "auraScore"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response text");
        return JSON.parse(text);
    } catch (error) {
        console.error("Auto-tag failed", error);
        return {
            tags: ["streetwear", "fashion"],
            description: "Fresh drop. Cop it before it's gone.",
            auraScore: 85
        };
    }
};

/**
 * Analyzes a user's closet/wishlist to generate a "Style Persona".
 */
export const generateStylePersona = async (products: Product[]): Promise<string> => {
    if (products.length === 0) return "Style data insufficient. Start copping.";

    // Deterministic mock — always returns something snappy
    await new Promise(resolve => setTimeout(resolve, 2200));

    const combined = products.flatMap(p => [...p.tags, p.title]).join(' ').toLowerCase();

    if (combined.includes('leather') || combined.includes('goth') || combined.includes('biker')) {
        return "Classic 'main character syndrome' meets dark academia — you're that person who makes all-black look like a whole personality. Archive-obsessed, chronically offline. Solid 9/10.";
    }
    if (combined.includes('kantha') || combined.includes('ikat') || combined.includes('bandhani') || combined.includes('ethnic')) {
        return "Gen Z meets grandma's almirah and honestly? We respect it. You're serving post-colonial cool with fusion silhouettes that confuse aunties and slay simultaneously.";
    }
    if (combined.includes('y2k') || combined.includes('cyber') || combined.includes('vintage')) {
        return "Your Pinterest board is 2003 mall rat and you've never recovered. Certified nostalgia trap energy — you probably own at least one chrome piece and justify it daily.";
    }
    if (combined.includes('techwear') || combined.includes('utility') || combined.includes('cargo')) {
        return "Gorpcore-adjacent techwear girlie who thinks cargo pockets are an entire identity. Simultaneously overdressed and underdressed for every occasion. Needs therapy, goes thrifting instead.";
    }
    if (combined.includes('sneaker') || combined.includes('custom') || combined.includes('embroidery')) {
        return "Sneaker brain meets handcraft obsessive. Your entire personality is 'limited edition' and 'no one else has this'. The hype gods are watching and they are mostly pleased.";
    }
    return "Chaotic eclectic with zero regard for cohesion — your fit pics are either immaculate or completely unhinged, no in-between. The fit god is watching. She is entertained.";
}

/**
 * Generates a "Nano Banana" style 3D badge for an Artist's craft.
 */
export const generateCraftBadge = async (craftName: string): Promise<string | null> => {
    try {
        const model = 'gemini-2.5-flash-image';
        const prompt = `
            Generate a high-quality, 3D glossy clay-style icon for the craft: "${craftName}".
            Style: Isometric, cute, plasticine texture, vibrant colors, similar to a high-end mobile game asset.
            Background: PURE SOLID BLACK BACKGROUND (#000000). This is mandatory for background removal.
            Object: A single tool or symbol representing ${craftName}, floating in the center.
            Lighting: Studio lighting with strong highlights.
        `;

        const response = await getAI().models.generateContent({
            model: model,
            contents: {
                parts: [{ text: prompt }]
            }
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const rawBase64 = `data:image/png;base64,${part.inlineData.data}`;
                    // Post-process to remove black background
                    return await removeBlackBackground(rawBase64);
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Badge generation failed:", error);
        return null;
    }
};

/**
 * Generates a realistic seller response during a chat negotiation.
 */
export interface SellerResponse {
    text: string;
    offerAction: 'NONE' | 'ACCEPT_OFFER' | 'DECLINE_OFFER' | 'COUNTER_OFFER';
    counterAmount?: number;
}

export const generateSellerChat = async (
    product: Product,
    seller: User,
    history: ChatMessage[],
    userLastMessage: string
): Promise<SellerResponse> => {
    // Realistic delay: sellers don't reply instantly
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1400));

    const lowerMsg = userLastMessage.toLowerCase();
    const lastMsg = history[history.length - 1];
    const msgCount = history.filter(m => m.senderId !== 'system').length;

    // ── Responding to an OFFER ────────────────────────────────────────────
    if (lastMsg.type === 'OFFER') {
        const offerAmount = lastMsg.offerAmount || 0;
        const ratio = offerAmount / product.price;

        if (ratio >= 0.93) {
            const acceptLines = [
                "Deal 🤝 Packaging it tonight.",
                "Aight bet. Send me your address.",
                "Locked. Will ship by tomorrow morning.",
                "Done done. DM me your pincode.",
                "Yaar theek hai, let's do this."
            ];
            return {
                text: acceptLines[Math.floor(Math.random() * acceptLines.length)],
                offerAction: 'ACCEPT_OFFER'
            };
        }

        if (ratio >= 0.80) {
            const counter = Math.floor(product.price * (0.91 + Math.random() * 0.03));
            const counterLines = [
                `Bhai itna nahi ho sakta. Best I can do is ₹${counter}, final.`,
                `Yaar ₹${counter} karo, then we have a deal. Below that nahi hoga.`,
                `Come up to ₹${counter}? That's already below what others offered.`,
                `₹${counter} and I'll throw in free shipping. Fair?`,
                `Anna ₹${counter} la, genuine piece hai yeh.`
            ];
            return {
                text: counterLines[Math.floor(Math.random() * counterLines.length)],
                offerAction: 'COUNTER_OFFER',
                counterAmount: counter
            };
        }

        // Very low offer — decline but stay in convo
        const declineLines = [
            `Nahi yaar, this took me 3 weeks to make. Can't do below ₹${Math.floor(product.price * 0.88)}.`,
            `That's way too low bro. I'd rather keep it. ₹${Math.floor(product.price * 0.90)} minimum.`,
            `Haha nahi, respect the craft. Best I'll go is ₹${Math.floor(product.price * 0.90)}.`
        ];
        return {
            text: declineLines[Math.floor(Math.random() * declineLines.length)],
            offerAction: 'DECLINE_OFFER'
        };
    }

    // ── Responding to TEXT messages ───────────────────────────────────────
    const isPriceQuestion = lowerMsg.includes('price') || lowerMsg.includes('rate') || lowerMsg.includes('how much') || lowerMsg.includes('cost') || lowerMsg.includes('kitna');
    const isConditionQuestion = lowerMsg.includes('condition') || lowerMsg.includes('worn') || lowerMsg.includes('damage') || lowerMsg.includes('defect') || lowerMsg.includes('flaw');
    const isShippingQuestion = lowerMsg.includes('ship') || lowerMsg.includes('deliver') || lowerMsg.includes('courier');
    const isSizeQuestion = lowerMsg.includes('size') || lowerMsg.includes('fit') || lowerMsg.includes('measurements');

    if (isPriceQuestion) {
        const priceResponses = [
            `Listed at ₹${product.price}. Make me an offer though, let's talk.`,
            `₹${product.price} but for the right person I can work something out. What are you thinking?`,
            `It's ₹${product.price} right now. Not in a rush to sell so not dropping much, but slide me a number.`
        ];
        return { text: priceResponses[Math.floor(Math.random() * priceResponses.length)], offerAction: 'NONE' };
    }

    if (isConditionQuestion) {
        const conditionResponses = [
            `Condition is ${product.specs.condition}. Worn maybe twice, no major flaws. Can send more pics if you want.`,
            `It's ${product.specs.condition} — honest listing. Small signs of life but nothing that shows when wearing.`,
            `${product.specs.condition} bro. I don't misrepresent my pieces, check my vouches.`
        ];
        return { text: conditionResponses[Math.floor(Math.random() * conditionResponses.length)], offerAction: 'NONE' };
    }

    if (isShippingQuestion) {
        return {
            text: `I ship via Delhivery, usually takes 3-5 days. Pack it real careful. Shipping is extra ₹120 unless you're in Bangalore, then free pickup.`,
            offerAction: 'NONE'
        };
    }

    if (isSizeQuestion) {
        return {
            text: `It's a ${product.specs.size}. Fits more like a ${product.specs.size === 'M' ? 'relaxed M or slim L' : product.specs.size}. I can share measurements if needed.`,
            offerAction: 'NONE'
        };
    }

    // First message — seller initiates with warmth
    if (msgCount <= 2) {
        const openLines = [
            `Hey! Thanks for sliding in. This piece is personal so I want it to go to the right person. Any questions?`,
            `Ayy, glad you reached out. ${product.title} is still available. You copping or just browsing?`,
            `What's up! Yeah it's still available. Make me an offer if you're serious, I'm open.`
        ];
        return { text: openLines[Math.floor(Math.random() * openLines.length)], offerAction: 'NONE' };
    }

    // Seller proactively throws an offer after some back-and-forth
    if (msgCount >= 4 && Math.random() > 0.5) {
        const proactiveCounter = Math.floor(product.price * (0.88 + Math.random() * 0.06));
        return {
            text: `Look yaar, I'll just make it easy — I'll do ₹${proactiveCounter} if you commit right now. That's my best number.`,
            offerAction: 'COUNTER_OFFER',
            counterAmount: proactiveCounter
        };
    }

    // Generic mid-convo responses
    const genericResponses = [
        "Legit piece yaar, you won't regret it.",
        "It's been sitting in my wardrobe untouched. Needs a new home.",
        "Happy to answer anything else. I'm pretty transparent about my listings.",
        "Original piece, no replicas in my closet.",
        "This one got a lot of attention when I listed it. Just saying."
    ];
    return {
        text: genericResponses[Math.floor(Math.random() * genericResponses.length)],
        offerAction: 'NONE'
    };
};