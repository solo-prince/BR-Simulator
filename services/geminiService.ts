
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerLoadout } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function simulateMatch(loadout: PlayerLoadout) {
  const inventoryStr = loadout.inventory.map(i => `${i.name} (${i.rarity})`).join(', ');
  
  const prompt = `
    Narrate a high-intensity Battle Royale match for a mobile game like Free Fire.
    
    Player Loadout:
    - Character: ${loadout.character.name} (Ability: ${loadout.character.ability})
    - Primary: ${loadout.primaryWeapon.name} (Dmg: ${loadout.primaryWeapon.damage}, Reload: ${loadout.primaryWeapon.reloadSpeed})
    - Secondary: ${loadout.secondaryWeapon.name}
    - Looted Items: ${inventoryStr || 'None'}

    Context:
    The player has already scavenged these items. Incorporate them into the story. 
    If they have a Medkit, they might use it after a close fight. 
    If they have an Extended Mag, they might win because they didn't have to reload.
    
    Create a chronological list of 10 events.
    The match must be exciting. 
    Format: JSON array of objects with 'time', 'message', 'type' ("kill", "info", "zone", "danger", "loot").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              message: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["kill", "info", "zone", "danger", "loot"] }
            },
            required: ["time", "message", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Match simulation failed:", error);
    return [
      { time: "0:00", message: "Error contacting the battle server. Deployment aborted.", type: "danger" }
    ];
  }
}
