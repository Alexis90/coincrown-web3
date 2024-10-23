const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts, factory, campaignAddress, campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // create contract using abi and deploy it using its bytecode
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  // create a campaign instance passing in minumn 100 weth
  // add send() when sending a transaction
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000',
  });

  // add call() when calling a view function
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaign', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      gas: '1000000',
      value: '200',
    });

    // const approvers = await campaign.methods.approvers().call()
    // won't retrieve the mapping
    // instead, we need to pass a value(key) to the mapping methods
    // and it will return a true/false
    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert(isApprover);

    const approversCount = await campaign.methods.approversCount().call();
    assert.equal(1, approversCount);
  });

  // when it is payable method, the gas parameter is not required
  // because a prompt will show from wallet(metamask) to ask the sender to pay
  // it is not the contract who should pay
  it('requires a minium contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '10',
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to make a request', async () => {
    await campaign.methods
      .createRequest('A test request', '1000', accounts[2])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    // request method will not return the full array, 
    // so we need to pass in a value to indicate which request we want to retreive
    const request = await campaign.methods.requests(0).call();
    assert.equal('A test request', request.description);
  });

  it('processes request', async () => {
    const manager = accounts[0]
    const contributor = accounts[1]
    const contributeValue = web3.utils.toWei('10', 'ether')
    const newRequestValue = web3.utils.toWei('5', 'ether')
    const newRequestRecipient = accounts[3]

    // become a contributor
    await campaign.methods.contribute().send({
      from: contributor,
      gas: '1000000',
      value: contributeValue,
    });


    // create new quest
    await campaign.methods
      .createRequest('A', newRequestValue, newRequestRecipient)
      .send({
        from: manager,
        gas: '1000000',
      });


    // contributor approves new request
    await campaign.methods.approveRequest(0).send({
      from: contributor,
      gas: '1000000',
    })

    await campaign.methods.finalizeRequest(0).send({
      from: manager,
      gas: '1000000',
    })

    // web3.eth.getBalance returns a string in wei
    let balance = await web3.eth.getBalance(newRequestRecipient)
    balance = web3.utils.fromWei(balance, 'ether') // to ether
    balance = parseFloat(balance) // to a decimal number

    assert(balance > 104);

  })
});
