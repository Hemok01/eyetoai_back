// generateGPTMessage.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GPT 메시지 생성 함수
async function generateGPTMessage(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125', // 파인튜닝된 모델 이름
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('GPT 메시지 생성 실패:', error);
    return '메시지 생성 실패';
  }
}

export default generateGPTMessage;
