type TTokenScopes = 'access' | 'register';

interface IGeneratePayloadArgs {
  scope: TTokenScopes[];
  data: Record<string, unknown>;
}

interface IJWTPayload extends IGeneratePayloadArgs {
  expires_at: number;
}

export type { TTokenScopes, IGeneratePayloadArgs, IJWTPayload };
