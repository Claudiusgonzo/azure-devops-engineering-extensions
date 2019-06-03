import tl = require('azure-pipelines-task-lib/task');
import * as azureGitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api/WebApi';
import { IPipeline } from "./IPipeline";
import { EnvironmentConfigurations } from './EnvironmentConfigurations';

export abstract class AbstractAzureApi{
    private connection: WebApi;

    constructor (uri: string, accessKey: string) {
        this.connection = this.createConnection(uri, accessKey);
    }

    public async abstract getCurrentPipeline(configurations: EnvironmentConfigurations): Promise<IPipeline>;

    public async abstract getMostRecentPipelinesOfCurrentType(project: string, definition?: number, reason?: number, status?: number, maxNumber?: number, branchName?: string): Promise<IPipeline[]>;

    protected getConnection(): WebApi{
        return this.connection;
    }

    public async postNewCommentThread(thread: azureGitInterfaces.GitPullRequestCommentThread, pullRequestId: number, repositoryId: string, projectName: string): Promise<void>{
        (await this.getConnection().getGitApi()).createThread(thread, repositoryId, pullRequestId, projectName);
    }

    public async getPullRequestData(repositoryId: string, pullRequestId: number, projectName: string): Promise<azureGitInterfaces.GitPullRequest>{
        return (await this.getConnection().getGitApi()).getPullRequest(repositoryId, pullRequestId, projectName);
    }

    private createConnection(uri: string, accessToken: string): WebApi {
        let creds = getPersonalAccessTokenHandler(accessToken);
        return new WebApi(uri, creds);
    }
}