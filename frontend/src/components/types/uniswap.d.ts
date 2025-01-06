export interface UniswapDappSharedLogicContext {
    supportedNetworkTokens: {
      chainId: ChainId;
      defaultInputValue?: string | undefined;
      defaultInputToken?: string | undefined;
      defaultOutputToken?: string | undefined;
      supportedTokens: {
        tokenImageContext?: {
          image: string;
          isSvg?: boolean | undefined;
        };
        contractAddress: string;
      }[];
    }[];
    ethereumAddress: string;
    ethereumProvider: any;
    settings?: UniswapPairSettings | undefined;
    theming?: {
      backgroundColor?: string | undefined;
      textColor?: string | undefined;
      button?: {
        textColor?: string | undefined;
        backgroundColor?: string | undefined;
      };
      panel?: {
        textColor?: string | undefined;
        backgroundColor?: string | undefined;
      };
    };
  }
  
  export class UniswapPairSettings {
    slippage: number;
    deadlineMinutes: number;
    disableMultihops: boolean;
    uniswapVersions: UniswapVersion[];
    constructor(settings?: {
      slippage?: number | undefined;
      deadlineMinutes?: number | undefined;
      disableMultihops?: boolean | undefined;
      uniswapVersions?: UniswapVersion[] | undefined;
    });
  }
  
  export enum UniswapVersion {
    v2 = 'v2',
    v3 = 'v3',
  }
  