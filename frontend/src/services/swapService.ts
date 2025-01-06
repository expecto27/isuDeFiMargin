import {
    CurrencyAmount,
    Percent,
    Token,
    TradeType,
  } from '@uniswap/sdk-core';
  import {
    Pool,
    Route,
    SwapOptions,
    SwapQuoter,
    SwapRouter,
    Trade,
  } from '@uniswap/v3-sdk';
  import { ethers } from 'ethers';
  import JSBI from 'jsbi';
  
  import { CurrentConfig } from '../config';
  import {
    ERC20_ABI,
    QUOTER_CONTRACT_ADDRESS,
    SWAP_ROUTER_ADDRESS,
    TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  } from './../constants';
  import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from './../constants';
  import { getPoolInfo } from '../pool';
  import { fromReadableAmount } from '../utils';
  
  // Функция для создания трейда
  export async function createTrade(amountIn: number, fromToken: Token, toToken: Token): Promise<Trade<Token, Token, TradeType>> {
    const poolInfo = await getPoolInfo();
  
    const pool = new Pool(
      fromToken,
      toToken,
      CurrentConfig.tokens.poolFee,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick
    );
  
    const swapRoute = new Route([pool], fromToken, toToken);
  
    const amountOut = await getOutputQuote(swapRoute, amountIn, fromToken);
  
    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(
        fromToken,
        fromReadableAmount(amountIn, fromToken.decimals).toString()
      ),
      outputAmount: CurrencyAmount.fromRawAmount(
        toToken,
        JSBI.BigInt(amountOut)
      ),
      tradeType: TradeType.EXACT_INPUT,
    });
  
    return uncheckedTrade;
  }
  
  // Функция для выполнения сделки
  export async function executeTrade(
    trade: Trade<Token, Token, TradeType>,
    signer: ethers.Signer
  ): Promise<string> {
    const walletAddress = await signer.getAddress();
  
    // Approval
    const approvalResult = await getTokenTransferApproval(trade.inputAmount.currency as Token, signer);
    if (!approvalResult) {
      throw new Error('Approval failed');
    }
  
    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 0.5%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      recipient: walletAddress,
    };
  
    const methodParameters = SwapRouter.swapCallParameters([trade], options);
  
    const tx = await signer.sendTransaction({
      data: methodParameters.calldata,
      to: SWAP_ROUTER_ADDRESS,
      value: methodParameters.value,
      gasLimit: 300000, // Опционально
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    });
  
    return tx.hash; // Возвращаем хеш транзакции
  }
  
  // Одобрение токенов для использования маршрутизатором
  async function getTokenTransferApproval(token: Token, signer: ethers.Signer): Promise<boolean> {
    const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
  
    const tx = await tokenContract.approve(
      SWAP_ROUTER_ADDRESS,
      fromReadableAmount(TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, token.decimals).toString()
    );
  
    const receipt = await tx.wait();
    return receipt.status === 1; // Проверяем, успешна ли транзакция
  }
  
  // Получение котировки
  async function getOutputQuote(route: Route<any, any>, amountIn: number, fromToken: Token): Promise<string> {
    const calldata = SwapQuoter.quoteCallParameters(
      route,
      CurrencyAmount.fromRawAmount(
        fromToken,
        fromReadableAmount(amountIn, fromToken.decimals).toString()
      ),
      TradeType.EXACT_INPUT
    );
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const quoteCallReturnData = await provider.call({
      to: QUOTER_CONTRACT_ADDRESS,
      data: calldata.calldata,
    });
  
    return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)[0];
  }
  