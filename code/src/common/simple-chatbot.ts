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
    // curl --request POST \
    //   --url 'https://cog-sandbox-dev-eastus2-001.openai.azure.com/openai/deployments/gpt-35-turbo-blue/chat/completions?api-version=2023-05-15' \
    //   --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCIsImtpZCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCJ9.eyJhdWQiOiJodHRwczovL2NvZ25pdGl2ZXNlcnZpY2VzLmF6dXJlLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzY3YmZmNzllLTdmOTEtNDQzMy1hOGU1LWM5MjUyZDJkZGMxZC8iLCJpYXQiOjE3MzAzODc3NjYsIm5iZiI6MTczMDM4Nzc2NiwiZXhwIjoxNzMwMzkxNjY2LCJhaW8iOiJrMkJnWURoLzIyUFdnMHRQN3p4UG1wU1FjeUsvQlFBPSIsImFwcGlkIjoiYzU1N2YzNDktZDFiNy00NDAyLWI4ZmYtODgxMDg0MmE2YTJiIiwiYXBwaWRhY3IiOiIxIiwiZ3JvdXBzIjpbIjNhOTgyZDFiLWYzZDMtNDFhNi04ODRjLWE3NjU0YTE0YzRkZiJdLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82N2JmZjc5ZS03ZjkxLTQ0MzMtYThlNS1jOTI1MmQyZGRjMWQvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJmMmVkMmVmNC0yMjEwLTRhYTEtYjEyYS1jM2VjNmQ0OWNhZWQiLCJyaCI6IjAuQVJNQW52ZV9aNUZfTTBTbzVja2xMUzNjSFpBaU1YM0lLRHhIb08yT1UzU2JiVzBUQUFBLiIsInN1YiI6ImYyZWQyZWY0LTIyMTAtNGFhMS1iMTJhLWMzZWM2ZDQ5Y2FlZCIsInRpZCI6IjY3YmZmNzllLTdmOTEtNDQzMy1hOGU1LWM5MjUyZDJkZGMxZCIsInV0aSI6InNDd1BBSUtrdzBhREhnTDZYYlNEQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfaWRyZWwiOiIyMCA3In0.A1wImSrLDJJzIXLNE51ZxkuLzNXREarYmRydj3yQNQazFGhJr1OU-Z4fGwdmAKC8oy0EDjZAwCi8HtVzzfvUiCzBkXe3jV7untrAoFaHcf64jYtoKpHpz42t-6SamZjEk27JhW53m7UPPkajBQq4iYuBkZTcrUU0cF7z8BYEijqSwcFOnrhLMPH4pNL5m4jsBvTqUjuOOX7EPJ4Aj_fAOTrkl_VM44PYvWVBGvtTy7Z_XScjixlIjn9oCMZfIx0ruLfYELzUL-bDZ5aoIiOw5JvcxZxY6P68T5DMBNWMMMF6sGJn9ocqJCk_Uc6O7ne34rcsOIB62VEtkKfwqoywmw' \
    //   --header 'Content-Type: application/json' \
    //   --data '{
    // 	"messages": [
    // 		{
    // 			"role": "system",
    // 			"content": "You are an AI assistant that helps employees."
    // 		},
    // 		{
    // 			"role": "user",
    // 			"content": "Hi, what is your name?"
    // 		}
    // 	]
    // }'
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
