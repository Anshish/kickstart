import React, { useState} from "react";
import { Navigate, redirect } from "react-router-dom";
import { Button, Form, Input, Message, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import factory from "../factory";
import web3 from "../web3";
import { useNavigate } from "react-router-dom";
const INITIAL_TRANSACTION_STATE = {
  loading: "",
  error: "",
  success: "",
};

function NewPage() {
  const [minumumContribution, setMinimumContribution] = useState("");
  const [transactionState, setTransactionState] = useState(
    INITIAL_TRANSACTION_STATE
  );
  const { loading, error, success } = transactionState;

  const onSubmit = async (event) => {
    console.log('sumbmitting');
    event.preventDefault();
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Transaction is processing....",
    });
    console.log('passed transaction passing phase 1')
    const accounts = await web3.eth.getAccounts();
    await factory.methods
      .createCampaign(minumumContribution)
      .send({
        //no need to specify gas amount -metamask does this
        from: accounts[0],
      })
      .then((res) => {
        console.log(res);
        const etherscanLink = `https://rinkeby.etherscan.io/tx/${res.transactionHash}`;
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          success: (
            <a href={etherscanLink} target="_blank">
              View the transaction on Etherscan
            </a>
          ),
        });
        console.log('passed');
        redirect('/');
      })
      .catch((err) => {
        console.log(err);
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          error: err.message,
        });
      });
    setMinimumContribution("");
  };

  const renderMessage = () => {
    return (
      <Message icon negative={Boolean(error)} success={Boolean(success)}>
        <Icon
          name={
            loading ? "circle notched" : error ? "times circle" : "check circle"
          }
          loading={Boolean(loading)}
        />
        <Message.Content>
          {Boolean(success) && (
            <Message.Header>Transaction Success!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  return (
    <Layout>
      <h1 style={{ color: "grey" }}>Create new Campaign</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minumum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            focus
            min="0"
            type="number" // enforce number only content
            disabled={Boolean(loading)} //disable input if loading
            value={minumumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>
        <Button color="blue" disabled={Boolean(loading)}>
          Create!
        </Button>
      </Form>
      {Boolean(loading || error || success) && renderMessage()}
    </Layout>
  );
}

export default NewPage;
