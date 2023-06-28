import { Api } from '@neondatabase/api-client';

export type CommonProps = {
  apiClient: Api<unknown>;
  apiKey: string;
  apiHost: string;
  output: 'yaml' | 'json' | 'table';
};

export type ProjectScopeProps = CommonProps & {
  project: {
    id: string;
  };
};

export type IdOrNameProps = {
  id: string;
};

export type BranchScopeProps = ProjectScopeProps & {
  branch: {
    id: string;
  };
};

export type EndpointScopeProps = ProjectScopeProps & {
  endpoint: {
    id: string;
  };
};
