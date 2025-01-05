import { ethers, parseUnits } from 'ethers';

const ROUTER_ADDRESS = '0x7a250d5630b4cf539739df2c5dacabd31d1ee5fc'; // Uniswap V2 Router
const ROUTER_ABI = [
    "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)"
];

const ALLOWED_TOKENS = {
    WETH: '0x...', // Адрес WETH
    WBTC: '0x...', // Адрес WBTC
    USDC: '0x...'  // Адрес USDC
};

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/86ac0ce41c12438abcc8705d64e0d3c9'); // Замените на свой RPC
const signer = provider.getSigner(); // Или используйте Web3Provider для MetaMask

const routerContract = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

export async function swapTokens(amountIn, tokenIn, tokenOut, to) {
    if (!ALLOWED_TOKENS[tokenIn] || !ALLOWED_TOKENS[tokenOut]) {
        throw new Error('Токен не разрешен для торговли');
    }

    const path = [ALLOWED_TOKENS[tokenIn], ALLOWED_TOKENS[tokenOut]];
    const amountOutMin = 0; // Установите минимальное значение для безопасности
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 минут

    return await routerContract.swapExactTokensForTokens(
        parseUnits(amountIn.toString(), 18), // Используйте parseUnits
        amountOutMin,
        path,
        to,
        deadline
    );
}
