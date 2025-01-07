import web3 from "./web3";
import FaucetABI from "../../web3-demo/build/contracts/Faucet.json"; // Укажите путь к ABI

const contractAddress = "0x041e395fEDFc480c660714C198707CEf34771609"; // Адрес вашего контракта Faucet
const faucetContract = new web3.eth.Contract(FaucetABI.abi, contractAddress);

export default faucetContract;