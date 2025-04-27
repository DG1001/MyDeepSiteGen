/**
 * Generates a website based on the provided prompt using the DeepSeek API
 * 
 * @param apiKey - The DeepSeek API key
 * @param prompt - The prompt describing the website to generate
 * @param onChunk - Callback function that receives each chunk of the generated HTML
 */
export const generateWebsite = async (
  apiKey: string,
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    const systemPrompt = "Create the requested webpage in a single HTML file including CSS and JavaScript. Focus on clean, responsive design with modern aesthetics. Use only inline or internal CSS/JS - no external files or libraries unless specified. Your response must not contain anything else but the html code.";
    
    const apiUrl = "https://api.deepseek.com/v1/chat/completions";
    
    const payload = {
      model: "deepseek-coder",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000
    };
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to connect to DeepSeek API");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Failed to get response reader");

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines from the buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Remove 'data: ' prefix
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

    // Process any remaining data in the buffer
    if (buffer.trim() !== '') {
      try {
        const data = buffer.slice(6); // Remove 'data: ' prefix
        if (data !== '[DONE]') {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        }
      } catch (e) {
        console.error('Error parsing final SSE data:', e);
      }
    }
  } catch (error) {
    console.error("Error generating website:", error);
    throw error;
  }
};
