export type CompanyConnection = {
  organizationId: string;
  provider: string;
  baseUrl: string;
  enabled: boolean;
};

export type IntegrationContext = {
  organizationId: string;
  userId: string;
  permissions: string[];
};

export type ProjectFileReference = {
  id: string;
  organizationId: string;
  customerId?: string | null;
  projectId?: string | null;
  orderId?: string | null;
  environmentId?: string | null;
  itemId?: string | null;
  fileName: string;
  fileType: string;
  sourceUrl?: string | null;
};

export interface FerrazConnector {
  getConnection(): Promise<CompanyConnection | null>;
  getContext(): Promise<IntegrationContext | null>;
  findCustomer(query: string): Promise<unknown[]>;
  findProject(query: string): Promise<unknown[]>;
  findOrder(query: string): Promise<unknown[]>;
  listProjectFiles(projectId: string): Promise<ProjectFileReference[]>;
  recordEvent(input: {
    entityType: string;
    entityId: string;
    eventType: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
}
