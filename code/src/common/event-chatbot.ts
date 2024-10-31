import { ClientSecretCredential, getBearerTokenProvider } from '@azure/identity';
import { AzureChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MongoUtil } from './mongo-util';
import { QUERY_GENERATION_TEMPLATE, RESPONSE_TEMPLATE } from './templates';

export class EventChatbot {
  private mongoUtil: MongoUtil;
  private completeChain: RunnableSequence;

  constructor(
    azureTenantId: string,
    azureClientId: string,
    azureClientSecret: string,
    azureAuthorityHost: string,
    azureOpenAIApiInstanceName: string,
    azureOpenAIApiDeploymentName: string,
    azureOpenAIApiVersion: string,
    mongoUtil: MongoUtil,
    collection: string,
  ) {
    try {
      this.mongoUtil = mongoUtil;

      const credential = new ClientSecretCredential(azureTenantId, azureClientId, azureClientSecret, {
        authorityHost: azureAuthorityHost,
      });

      const scope = 'https://cognitiveservices.azure.com/.default';
      const azureADTokenProvider = getBearerTokenProvider(credential, scope);
      const model = new AzureChatOpenAI({
        azureADTokenProvider,
        azureOpenAIApiInstanceName: azureOpenAIApiInstanceName,
        azureOpenAIApiDeploymentName: azureOpenAIApiDeploymentName,
        azureOpenAIApiVersion: azureOpenAIApiVersion,
        temperature: 0,
      });

      const queryGenerationPrompt = ChatPromptTemplate.fromTemplate(QUERY_GENERATION_TEMPLATE);
      const queryGeneratorChain = RunnableSequence.from([
        new RunnablePassthrough(),
        queryGenerationPrompt,
        model.bind({ stop: ['\nMongoDbResult:'] }),
        new StringOutputParser(),
      ]);

      const responsePrompt = ChatPromptTemplate.fromTemplate(RESPONSE_TEMPLATE);
      this.completeChain = RunnableSequence.from([
        RunnablePassthrough.assign({ query: queryGeneratorChain }),
        RunnablePassthrough.assign({
          response: async (input) => mongoUtil.aggregate(collection, input.query),
        }),
        responsePrompt,
        model,
        new StringOutputParser(),
      ]);
    } catch (error) {
      console.error('Error initializing EventChatbot:', error);
      throw new Error('Failed to initialize EventChatbot');
    }
  }

  public async answerQuestion(question: string): Promise<string> {
    let result: string = 'We are unable to answer your question at this time.';
    try {
      result = await this.completeChain.invoke({ question });
    } catch (error) {
      console.error('Error running EventChatbot:', error);
      throw new Error('Failed to run EventChatbot');
    }

    return result;
  }

  public async close() {
    await this.mongoUtil.close()
  }
}
