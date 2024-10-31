/**
 * SimpleChatbot class to interact with Azure Cognitive Services
 * using Axios.
 *
 * @author Indra Basak
 * @since 2024-10-29
 */
import axios from 'axios';

export class SimpleChatbot {
  static async getAzureToken(azureTenantId: string, azureClientId: string, azureClientSecret: string) {
    const url = `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/token`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
      grant_type: 'client_credentials',
      client_id: azureClientId,
      client_secret: azureClientSecret,
      scope: 'https://cognitiveservices.azure.com/.default',
    };
    const response = await axios.post(url, data, { headers });
    return response.data.access_token;
  }

  static async getCannedAnswer(token: string, question: string) {
    const url =
      'https://cog-sandbox-dev-eastus2-001.openai.azure.com/openai/deployments/gpt-35-turbo-blue/chat/completions?api-version=2023-05-15';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const data = {
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps employees.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    };

    const response = await axios.post(url, data, { headers });
    return response.data.choices;
  }
}
