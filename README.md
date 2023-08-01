# Chat Copilot Sample Application

This sample allows you to build your own integrated large language model (LLM) chat copilot. The sample uses two applications: a front-end web UI app and a back-end API server. 

These quick-start instructions run the sample locally. To deploy the sample to Azure, please view [Deploying Chat Copilot](https://github.com/microsoft/semantic-kernel/blob/main/samples/apps/copilot-chat-app/deploy/README.md).

> **IMPORTANT:** This sample is for educational purposes only and is not recommended for production deployments.

> **IMPORTANT:** Each chat interaction will call Azure OpenAI/OpenAI which will use tokens that you may be billed for.

<img src="images/UI-Sample.png" alt="Chat Copilot UI" width="800"/>

# Prerequisites
You will need the following items to run the sample:

**Frontend application:**
The web UI application will run on Azure.

- [Azure account](https://azure.microsoft.com/en-us/free)
- [Azure AD Tenant](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant)
- [Registered application](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application)
- [Application (client) ID](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app#register-an-application)

**Backend API:**
Requirements depend on your AI Service choice.

| AI Service   | Item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Azure OpenAI | - [Access](https://aka.ms/oai/access)<br>- [Resource](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource)<br>- [Deployed model](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) (`gpt-35-turbo`) <br>- [Endpoint](https://learn.microsoft.com/en-us/azure/ai-services/openai/tutorials/embeddings?tabs=command-line#retrieve-key-and-endpoint) (e.g., `http://contoso.openai.azure.com`)<br>- [API key](https://learn.microsoft.com/en-us/azure/ai-services/openai/tutorials/embeddings?tabs=command-line#retrieve-key-and-endpoint) |
| OpenAI       | - [Account](https://platform.openai.com)<br>- [API key](https://platform.openai.com/account/api-keys)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |


# Setup Instructions
## Windows
1. Open PowerShell as an administrator.
2. Configure environment.

    ```powershell
    cd <path to chat-copilot>\scripts
    .\Install.ps1
    ```

3. Configure Chat Copilot.
  
      ```powershell
    .\Configure.ps1 -AIService {AI_SERVICE} -APIKey {API_KEY} -Endpoint {AZURE_OPENAI_ENDPOINT} -ClientId {AZURE_APPLICATION_ID} 
    ```

    - `AI_SERVICE`: `AzureOpenAI` or `OpenAI`.
    - `API_KEY`: The `API key` for Azure OpenAI or for OpenAI.
    - `AZURE_OPENAI_ENDPOINT`: The Azure OpenAI resource `Endpoint` address. Omit `-Endpoint` if using OpenAI.
    - `AZURE_APPLICATION_ID`: The `Application (client) ID` associated with the registered application.

4. Run Chat Copilot locally. This step starts both the backend API and frontend application.
    
    ```powershell
    .\Start.ps1 
    ```

    > **IMPORTANT:** Confirm pop-ups are not bocked and you are logged in with the same account used to register the application.
    

## Ubuntu/Debian Linux
1. Open Bash as an administrator.
2. Configure environment.
  
    ```bash
    cd <path to chat-copilot>/scripts/
    ./Install.sh
    ```

3. Configure Chat Copilot.

    ```bash
    ./Configure.sh --aiservice {AI_SERVICE} --apikey {API_KEY} --endpoint {AZURE_OPENAI_ENDPOINT} --clientid {AZURE_APPLICATION_ID} 
    ```

    - `AI_SERVICE`: `AzureOpenAI` or `OpenAI`.
    - `API_KEY`: The `API key` for Azure OpenAI or for OpenAI.
    - `AZURE_OPENAI_ENDPOINT`: The Azure OpenAI resource `Endpoint` address. Omit `--endpoint` if using OpenAI.
    - `AZURE_APPLICATION_ID`: The `Application (client) ID` associated with the registered application.

4. Run Chat Copilot locally. This step starts both the backend API and frontend application.

    ```bash
    ./Start.sh
    ```

    > **IMPORTANT:** Confirm pop-ups are not bocked and you are logged in with the same account used to register the application.

## Other Linux/macOS
All steps must be completed manually at this time.
1. Configure environment. Install:

   - [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
   - [Node.js](https://nodejs.org/) 14 or newer
   - [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) classic v1.22.19

2. Run Chat Copilot backend locally. This step configures and runs the sample's backend API.

    - Open a terminal and set your Azure OpenAI or OpenAI key:
    
        ```bash
        cd <path to chat-copilot>/webapi/
        dotnet user-secrets set "AIService:Key" "MY_AZUREOPENAI_OR_OPENAI_KEY"
        ```

    - Install dev certificate:
  
        Linux:
        ```bash
        dotnet dev-certs https
        ```

        macOS:
        ```bash
        dotnet dev-certs https --trust
        ```

    - Update configuration settings:

        1. Open `appsettings.json`
        2. Find the `AIService` section and update:

            - `Type`: `AzureOpenAI` or `OpenAI`.
            - `Endpoint`: The Azure OpenAI resource `Endpoint` address. Leave this empty if using OpenAI.
            - `Completion`, `Embedding`, `Planner`: The models you will use. 
                > **IMPORTANT:** For OpenAI, use a '.' with `gpt-3.5-turbo`.  For Azure OpenAI, omit the '.' with `gpt-35-turbo`.

    -  Run the backend:

        ```bash
        dotnet build && dotnet run
        ```

3. Run Chat Copilot frontend locally. This step configures and runs the sample's frontend application.

    - Open a terminal and create an `.env` file from the template:
    
        ```bash
        cd <path to chat-copilot>/webapp/
        cp .env.example .env
        ```

    - Update configuration settings:

        1. Open `.env`
        2. Update `REACT_APP_AAD_CLIENT_ID` with the `Application (client) ID` associated with the registered application.

            ```bash
            REACT_APP_BACKEND_URI=https://localhost:40443/
            REACT_APP_AAD_AUTHORITY=https://login.microsoftonline.com/common
            REACT_APP_AAD_CLIENT_ID={Application (client) ID}
            ```
      
    - Run the frontend:

        ```bash
        yarn install && yarn start
        ```

        > **IMPORTANT:** Confirm pop-ups are not bocked and you are logged in with the same account used to register the application.
    
# Troubleshooting

1. **_Issue:_** Unable to load chats. 
   
    _Details_: interaction_in_progress: Interaction is currently in progress._ 

    _Explanation_: The WebApp can display this error when the application is configured for a different AAD tenant from the browser, (e.g., personal/MSA account vs work/school account). 
    
    _Solution_: Either use a private/incognito browser tab or clear your browser credentials/cookies. Confirm you are logged in with the same account used to register the application.

2. **_Issue:_**: Challenges using text completion models, such as `text-davinci-003`

    _Solution_: For OpenAI, see [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) for
    the complete list of current models supporting chat completions. For Azure OpenAI, see [model summary table and region availability](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability).

3. **_Issue:_** Localhost SSL certificate errors / CORS errors

    <img src="images/Cert-Issue.png" alt="Certificatw error message in browser" width="600"/>

    _Explanation_: Your browser may be blocking the frontend access to the backend while waiting for your permission to connect. 
    
    _Solution_:
    
    1. Confirm the backend service is running. Open a web browser and navigate to `https://localhost:40443/healthz`
       - You should see a confirmation message: `Healthy`
       - If your browser asks you to acknowledge the risks of visiting an insecure website, you must acknowledge this before the frontend can connect to the backend server. 
    2. Navigate to `http://localhost:3000` or refresh the page to use the Chat Copilot application.

4. **_Issue:_** Yarn is not working.

    _Explanation_: You may have the wrong Yarn version installed such as v2.x+.

    _Solution_: Use the classic version.

    ```bash
    npm install -g yarn
    yarn set version classic
    ```
