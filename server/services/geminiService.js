// server/routes/geminiRoutes.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-seo", async (req, res) => {
  try {
    const { departure, arrival, routesData } = req.body;
    
    console.log('🤖 [BACKEND] Génération SEO pour:', departure, '→', arrival);
    
    // Préparer les données pour Gemini
    const routeInfo = {
      departure,
      arrival,
      companyCount: routesData?.length || 0,
      minPrice: routesData?.length > 0 ? Math.min(...routesData.map(r => r.priceRange?.min || r.price || 6000)) : 6000,
      maxPrice: routesData?.length > 0 ? Math.max(...routesData.map(r => r.priceRange?.max || r.price || 8000)) : 8000,
      duration: routesData?.[0]?.estimatedDuration || '5-6 heures',
      hasVIP: routesData?.some(route => route.busType === 'vip') || false
    };

    const prompt = `
En tant qu'expert SEO et rédacteur spécialisé dans le transport en Côte d'Ivoire, génère un contenu optimisé pour la page : "Bus ${departure} → ${arrival}".

CONTEXTE:
- Trajet: ${departure} vers ${arrival}
- Prix: ${routeInfo.minPrice} - ${routeInfo.maxPrice} FCFA
- Durée: ${routeInfo.duration}
- Nombre de compagnies: ${routeInfo.companyCount}
- Service: Conciergerie indépendante (nous ne sommes PAS une compagnie de transport)

GÉNÈRE UN JSON AVEC:
1. title: 55-120 caractères, accrocheur, avec prix et année
2. description: 150-160 caractères, persuasive, avec emojis
3. h1: 40-100 caractères, engageant
4. content: 6 phrases riches en informations utiles

FORMAT DE RÉPONSE UNIQUEMENT:
{
  "title": "",
  "description": "", 
  "h1": "",
  "content": ""
}

Ton public: Voyageurs ivoiriens cherchant des bus fiables et économiques.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extraire le JSON de la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Format de réponse Gemini invalide');
    }
    
    const seoContent = JSON.parse(jsonMatch[0]);
    
    console.log('✅ [BACKEND] SEO généré:', seoContent);
    
    res.json({
      success: true,
      data: seoContent
    });
    
  } catch (error) {
    console.error('❌ [BACKEND] Erreur Gemini:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;