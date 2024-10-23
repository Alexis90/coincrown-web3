import React, { useState } from 'react';
import { Form, FormField, Button, Input, Message } from 'semantic-ui-react';
import Layout from '@/components/Layout';
import factory from '@/ethereum/factory';
import web3 from '@/ethereum/web3';

export default function newCampaign() {
  const [minContribution, setMinContribution] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErrMessage('');
    setIsLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContribution).send({
        from: accounts[0],
      });
    } catch (e) {
      setErrMessage(
        e.message || 'An issue occurred, please try again later...'
      );
    }

    setIsLoading(false);
  }

  return (
    <>
      <Layout>
        <div>
          <h2>Create your own caimpaign</h2>
          <Form
            loading={isLoading}
            error={!!errMessage}
            onSubmit={handleSubmit}
          >
            <FormField>
              <label>Minium contribution</label>
              <Input
                type="number"
                value={minContribution}
                label="wei"
                labelPosition="right"
                placeholder="Amount..."
                onChange={(e) => setMinContribution(e.target.value)}
              />
            </FormField>
            {errMessage && (
              <Message
                error
                header="Something went wrong"
                content={errMessage}
              />
            )}

            <Button primary type="submit">
              Create
            </Button>
          </Form>
        </div>
      </Layout>
    </>
  );
}
