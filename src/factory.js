// this file will help to get access to already deployed verison of factory
import web3 from "./web3"; // this will retrieve local instance of web3
import CampaignFactory from "./build/CampaignFactory.json"; // this will retrieve abi of our contract

const address ="0x1A5a07F6ECf6DDe506571401fB10FC97a504fbD2"

const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
