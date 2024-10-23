import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xEa70A973E41F7451eA9777BAeCE87a71778C621F'
);

export default instance;
