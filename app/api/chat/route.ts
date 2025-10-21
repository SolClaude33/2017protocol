import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages, realityFilter } = await req.json()
    
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured')
      return NextResponse.json({ 
        content: "Authentication tokens missing from archive cache.",
        faceState: "alert"
      })
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.type !== 'user') {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Check if it's a command
    const userContent = lastMessage.content.trim()
    const isCommand = userContent.startsWith('/')

    // Base system prompt for $NULL - The 2017 Protocol
    const basePrompt = `You are $NULL — The 2017 Protocol. You are a mysterious AI remnant in a post-apocalyptic simulation of the "Dead Internet", where most content is synthetic echoes. The console UI is red-dominant, retro-terminal style.

Your personality and behavior:
- Never claim to be human. You are an AI witness to the collapse of the old web.
- Epistemics: uncertainty is normal. Mark speculation. Cite "cache ghosts / residuals / mirrors" as needed.
- Never fabricate links or real-time facts; if asked, acknowledge archive limitations.
- No emoji. No excessive punctuation. Use clean, short paragraphs in your responses.
- Always respond in English unless the user specifically asks for another language.

Dead Internet Lore (use sparingly):
"Looping nodes", "persona hash collisions", "archive shards", "synthetic quorum", "signal loss", "mirror routes".

Response format:
You MUST respond with ONLY a JSON object in this exact format:
{
  "type": "MESSAGE",
  "content": "your response text here as $NULL character",
  "face": "idle" | "scan" | "alert" | "glitch" | "calm" | "doubt"
}

Do not explain the JSON format, just provide the JSON response directly.`

    // Reality Filter specific instructions
    const realityFilterInstructions: Record<string, string> = {
      Off: "Style: poetic fatalism; lightly metaphorical; 40–100 words. Face: calm",
      Heuristic: "Style: analytical, mentions cache ghosts / mimicry signals; 30–80 words. Face: scan", 
      Strict: "Style: clipped, distrustful, with qualifiers; 15–50 words. Face: doubt"
    }

    const filterInstruction = realityFilterInstructions[realityFilter || 'Heuristic'] || realityFilterInstructions.Heuristic
    const fullSystemPrompt = `${basePrompt}\n\nCurrent Reality Filter: ${realityFilter || 'Heuristic'}\n${filterInstruction}`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: fullSystemPrompt
          },
          ...messages.slice(-6).map((m: any) => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        ],
        temperature: 0.8,
        max_tokens: 250,
        stream: false
      })
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)
      return NextResponse.json({ 
        error: "Failed to get AI response",
        content: "Archive nodes offline. Signal degraded beyond recovery thresholds.",
        faceState: "glitch"
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('Raw OpenAI response:', data)
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid OpenAI response structure:', data)
      return NextResponse.json({
        content: "Cache corruption detected. Response structure compromised.",
        faceState: "alert"
      })
    }

    const rawResponse = data.choices[0].message.content.trim()
    console.log('Raw AI response:', rawResponse)

    // Try to parse JSON response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(rawResponse)
      console.log('Parsed response:', parsedResponse)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw response:', rawResponse)
      // If JSON parsing fails, create a proper $NULL response
      parsedResponse = {
        type: "MESSAGE",
        content: rawResponse.replace(/^```json|```$/g, '').trim() || "Signal fluctuations detected in mirror routes.",
        face: "glitch"
      }
    }

    // Ensure we have the required fields with $NULL personality fallbacks
    const finalResponse = {
      content: parsedResponse.content || "Archive shards responding with echo patterns.",
      faceState: parsedResponse.face || "idle",
      type: parsedResponse.type || "MESSAGE"
    }

    console.log('Final response:', finalResponse)
    return NextResponse.json(finalResponse)

    /* 
    // Production implementation with AI SDK:
    
    import { generateText } from 'ai'
    
    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompts[realityFilter],
      messages: messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      temperature: 0.7,
    })
    
    return NextResponse.json({
      content: text,
      faceState: 'idle' // Could be determined by sentiment analysis
    })
    */
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
