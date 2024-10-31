/**
 * This class is responsible for handling the chatbot logic for the Event Chatbot.
 *
 * @author Indra Basak
 * @since 2024-10-29
 */
import { ClientSecretCredential, getBearerTokenProvider } from '@azure/identity';
import { AzureChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MongoUtil } from './mongo-util';
import { QUERY_GENERATION_TEMPLATE, RESPONSE_TEMPLATE } from './templates';

export class EventChatbot {
  private mongoUtil: MongoUtil;
  private model: AzureChatOpenAI;
  private queryGenerationPrompt: ChatPromptTemplate;
  private completeChain: RunnableSequence;

  /**
   * Constructor for the Event Chatbot.
   *
   * @param azureTenantId Azure tenant id
   * @param azureClientId Azure client id
   * @param azureClientSecret Azure client secret
   * @param azureAuthorityHost Azure authority host
   * @param azureOpenAIApiInstanceName Azure openai api instance name
   * @param azureOpenAIApiDeploymentName Azure openai api deployment name
   * @param azureOpenAIApiVersion Azure openai api version
   * @param mongoUtil MongoDB utility
   * @param collection MongoDB collection name
   */
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
      console.log('azureTenantId', azureTenantId);
      console.log('azureClientId', azureClientId);
      console.log('azureClientSecret', azureClientSecret);
      console.log('azureAuthorityHost', azureAuthorityHost);
      console.log('azureOpenAIApiInstanceName', azureOpenAIApiInstanceName);
      console.log('azureOpenAIApiDeploymentName', azureOpenAIApiDeploymentName);
      console.log('azureOpenAIApiVersion', azureOpenAIApiVersion);
      console.log('collection', collection);

      this.mongoUtil = mongoUtil;

      const credential = new ClientSecretCredential(azureTenantId, azureClientId, azureClientSecret, {
        authorityHost: azureAuthorityHost,
      });

      const scope = 'https://cognitiveservices.azure.com/.default';
      const azureADTokenProvider = getBearerTokenProvider(credential, scope);
      this.model = new AzureChatOpenAI({
        azureADTokenProvider,
        azureOpenAIApiInstanceName: azureOpenAIApiInstanceName,
        azureOpenAIApiDeploymentName: azureOpenAIApiDeploymentName,
        azureOpenAIApiVersion: azureOpenAIApiVersion,
        temperature: 0,
      });

      this.queryGenerationPrompt = ChatPromptTemplate.fromTemplate(QUERY_GENERATION_TEMPLATE);
      const queryGeneratorChain = RunnableSequence.from([
        new RunnablePassthrough(),
        this.queryGenerationPrompt,
        this.model.bind({ stop: ['\nMongoDbResult:'] }),
        new StringOutputParser(),
      ]);

      const responsePrompt = ChatPromptTemplate.fromTemplate(RESPONSE_TEMPLATE);
      this.completeChain = RunnableSequence.from([
        RunnablePassthrough.assign({ query: queryGeneratorChain }),
        RunnablePassthrough.assign({
          response: async (input) => mongoUtil.aggregate(collection, input.query),
        }),
        responsePrompt,
        this.model,
        new StringOutputParser(),
      ]);
    } catch (error) {
      console.error('Error initializing EventChatbot:', error);
      throw new Error('Failed to initialize EventChatbot');
    }
  }

  /**
   * Test the query generation prompt to improve the prompt quality.
   *
   * @param question Question to test the query generation prompt
   */
  public async testQueryGenPrompt(question: string | null) {
    let result: string = 'We are unable to answer your question at this time.';
    try {
      const chain = this.queryGenerationPrompt.pipe(this.model);
      const chainResult = await chain.invoke({
        question,
      });
      result = chainResult.content.toString();
    } catch (error) {
      console.error('Error running EventChatbot:', error);
      throw new Error('Failed to run EventChatbot');
    }

    return result;
  }

  /**
   * Answer a question using the Event Chatbot.
   *
   * @param question Question to answer
   */
  public async answerQuestion(question: string | null): Promise<string> {
    let result: string = 'We are unable to answer your question at this time.';
    console.log('-----answerQuestion-----1');

    if (question === null) {
      console.log('-----answerQuestion-----2');
      return result;
    }

    try {
      console.log('-----answerQuestion-----3');
      result = await this.completeChain.invoke({ question });
      console.log('-----answerQuestion-----4');
    } catch (error) {
      console.error('Error running EventChatbot:', error);
      throw new Error('Failed to run EventChatbot');
    }

    return result;
  }

  /**
   * Close the Event Chatbot.
   */
  public async close() {
    await this.mongoUtil.close();
  }
}
