// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarginTrading is ReentrancyGuard {
    address public owner;
    uint256 public liquidationThreshold = 105; // 105%

    struct Position {
        uint256 collateral; // Сумма залога
        uint256 debt; // Сумма долга
        address collateralToken; // Токен залога
        address debtToken; // Токен долга
    }

    mapping(address => mapping(address => Position)) private positions; // Перемещение на два адреса для разных токенов
    mapping(address => mapping(address => uint256)) public exchangeRates; // Курсы обмена токенов

    event Deposit(address indexed user, uint256 amount, address token);
    event Borrow(address indexed user, uint256 amount, address token);
    event Trade(address indexed user, uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut);
    event Liquidated(address indexed user, uint256 collateralLiquidated);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Установка курса обмена между двумя токенами
    function setExchangeRate(address tokenIn, address tokenOut, uint256 rate) external onlyOwner {
        require(rate > 0, "Rate must be greater than zero");
        exchangeRates[tokenIn][tokenOut] = rate;
    }

    // Функция депозита с указанием токена
    function deposit(uint256 _amount, address _token) external nonReentrant {
        require(_amount > 0, "Amount must be greater than zero");

        // Переводим токены на контракт
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        // Обновляем залог для конкретного токена
        positions[msg.sender][_token].collateral += _amount;
        positions[msg.sender][_token].collateralToken = _token;

        emit Deposit(msg.sender, _amount, _token);
    }

    // Функция займа с указанием токена
    function borrow(uint256 _amount, address _token) external nonReentrant {
        Position storage position = positions[msg.sender][_token];

        // Проверяем, есть ли залог
        require(position.collateral > 0, "No collateral");

        // Проверка на максимальный размер займа
        uint256 maxBorrow = position.collateral * 10; // 10x leverage
        require(position.debt + _amount <= maxBorrow, "Borrow amount exceeds limit");

        // Обновляем долг и токен долга
        position.debt += _amount;
        position.debtToken = _token;

        // Отправляем токены заемщику
        IERC20(_token).transfer(msg.sender, _amount);

        emit Borrow(msg.sender, _amount, _token);
    }

    // Внутренний обмен токенов
    function trade(
        uint256 _amountIn,
        address _tokenIn,
        address _tokenOut
    ) external nonReentrant {
        require(_amountIn > 0, "Amount must be greater than zero");
        require(exchangeRates[_tokenIn][_tokenOut] > 0, "Exchange rate not set");

        Position storage position = positions[msg.sender][_tokenIn];
        require(position.debt > 0, "No open position");

        uint256 rate = exchangeRates[_tokenIn][_tokenOut];
        uint256 amountOut = (_amountIn * rate) / 1e18; // Предполагаем, что rate задан с точностью до 18 знаков

        // Проверяем баланс контракта
        require(IERC20(_tokenOut).balanceOf(address(this)) >= amountOut, "Not enough tokens in contract");

        // Обновляем данные позиции
        positions[msg.sender][_tokenIn].debt -= _amountIn;
        positions[msg.sender][_tokenOut].debt += amountOut;

        // Перевод токенов
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenOut).transfer(msg.sender, amountOut);

        emit Trade(msg.sender, _amountIn, amountOut, _tokenIn, _tokenOut);
    }

    // Функция ликвидации позиций
    function liquidate(address _user, address _collateralToken) external nonReentrant {
        Position storage position = positions[_user][_collateralToken];
        uint256 totalAssets = position.collateral + position.debt;
        uint256 healthFactor = (position.collateral * 100) / totalAssets;

        // Проверка, что позиция подлежит ликвидации
        require(healthFactor < liquidationThreshold, "Position is healthy");

        uint256 collateralToLiquidate = position.collateral;

        // Переводим залог на владельца контракта
        IERC20(position.collateralToken).transfer(owner, collateralToLiquidate);

        // Удаляем позицию пользователя
        delete positions[_user][_collateralToken];

        emit Liquidated(_user, collateralToLiquidate);
    }

    // Функция для получения информации о позиции пользователя для конкретного токена
    function getPosition(address _user, address _token) external view returns (uint256 collateral, uint256 debt, address collateralToken, address debtToken) {
        Position storage position = positions[_user][_token];
        return (position.collateral, position.debt, position.collateralToken, position.debtToken);
    }
}
