// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract MarginTrading {
    address public owner;
    IUniswapV2Router02 public uniswapRouter;
    IERC20 public collateralToken; // Токен для залога
    IERC20 public borrowToken; // Токен для займа

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public borrowAmounts;

    uint256 public constant LIQUIDATION_THRESHOLD = 105; // 105%

    constructor(
        address _uniswapRouter,
        address _collateralToken,
        address _borrowToken
    ) {
        owner = msg.sender;
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        collateralToken = IERC20(_collateralToken);
        borrowToken = IERC20(_borrowToken);
    }

    // Депозит залога
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        collateralToken.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount;
    }

    // Получение займа
    function borrow(uint256 amount) external {
        require(deposits[msg.sender] > 0, "No collateral deposited");
        require(
            (amount + borrowAmounts[msg.sender]) * 100 <=
                deposits[msg.sender] * 10,
            "Borrow limit exceeded"
        );
        borrowAmounts[msg.sender] += amount;
        borrowToken.transfer(msg.sender, amount);
    }

    // Ликвидация позиции
    function liquidate(address user) external {
        uint256 collateralValue = deposits[user];
        uint256 debtValue = borrowAmounts[user];

        require(
            debtValue * 100 > collateralValue * LIQUIDATION_THRESHOLD,
            "Not liquidatable"
        );

        // Продаем залоговые активы на Uniswap
        address[] memory path = new address[](2); // Создаем массив для маршрута свопа
        path[0] = address(collateralToken);
        path[1] = address(borrowToken);

        uint256 amountOutMin = 0; // Для тестирования
        collateralToken.approve(address(uniswapRouter), collateralValue);

        uniswapRouter.swapExactTokensForTokens(
            collateralValue,
            amountOutMin,
            path,
            address(this),
            block.timestamp
        );

        // Удаляем залог и долг пользователя
        delete deposits[user];
        delete borrowAmounts[user];
    }
}
