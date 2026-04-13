import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';
import { assistantFlow } from './flows/assistant-flow';
import { assistantImageFlow } from './flows/assistant-image-flow';
import { whatsappWebhook } from './whatsapp-webhook';

const geminiApiKey = defineSecret('GEMINI_API_KEY');

export const assistantFlowCallable = onCallGenkit(
  {
    secrets: [geminiApiKey],
  },
  assistantFlow
);

export const assistantImageFlowCallable = onCallGenkit(
  {
    secrets: [geminiApiKey],
  },
  assistantImageFlow
);

export { whatsappWebhook };