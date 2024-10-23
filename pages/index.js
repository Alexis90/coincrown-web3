import React from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { CardGroup, Button } from 'semantic-ui-react';

export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { props: { campaigns } };
}

export default function CampaignIndex({ campaigns }) {
  const renderCampaigns = () => {
    const items = campaigns.map((c) => {
      return {
        header: c,
        description: <a>View campaign</a>,
        fluid: true,
      };
    });

    return <CardGroup items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open campaigns</h3>

        <Button
          floated="right"
          content="New campaign"
          icon="add"
          primary
          labelPosition="left"
        />

        <div>{renderCampaigns()}</div>
      </div>
    </Layout>
  );
}
