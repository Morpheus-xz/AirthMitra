import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAI(
  prompt: string,
  systemInstruction?: string,
  temperature = 0.7
): Promise<string> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1024,
      temperature,
    });

    return res.choices[0]?.message?.content || 'Unable to generate response';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function callOpenAIWithImage(
  prompt: string,
  base64Image: string,
  mimeType: string
): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 2048,
      temperature: 0.3,
    });

    return res.choices[0]?.message?.content || 'Unable to extract data';
  } catch (error) {
    console.error('OpenAI Vision API error:', error);
    throw error;
  }
}

export async function callOpenAIChat(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  systemInstruction: string
): Promise<string> {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemInstruction }, ...messages],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return res.choices[0]?.message?.content || 'Unable to generate response';
  } catch (error) {
    console.error('OpenAI Chat API error:', error);
    throw error;
  }
}
