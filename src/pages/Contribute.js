import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Message, Icon } from "semantic-ui-react";
import Campaign from "../campaign";
import Layout from "../components/Layout";
import web3 from "../web3";

const INITIAL_TRANSACTION_STATE = {
  loading: "",
  error: "",
  success: "",
};

function Contribute() {
  const { address } = useParams();
  console.log({ address });
  const navigate = useNavigate();

  const [contribution, setContribution] = useState("");
  const [transactionState, setTransactionState] = useState(
    INITIAL_TRANSACTION_STATE
  );
  const { loading, error, success } = transactionState;

  const onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign({ address });
    console.log(campaign);
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Transaction is processing....",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(contribution, "ether"),
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
          navigate(`/campaigns/requests/${address}`);
        })
        .catch((err) => {
          console.log(err);
          setTransactionState({
            ...INITIAL_TRANSACTION_STATE,
            error: err.message,
          });
        });
      setContribution("");
    } catch (err) {
      console.log("some error", err);
      setTransactionState({
        ...INITIAL_TRANSACTION_STATE,
        error: err.message,
      });
    }
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
    <div>
      <Layout>
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <label>{`Contribute to Campaign: ${address}`}</label>
            <Input
              label="ether"
              labelPosition="right"
              placeholder={`Amount to contribute to Campaign: ${address}`}
              focus
              min="0" //enforce positive numbers only
              disabled={Boolean(loading)} //disable input if loading
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
            />
          </Form.Field>
          <Button color="blue" disabled={Boolean(loading)} size="large">
            Contribute
          </Button>
        </Form>
        {Boolean(loading || error || success) && renderMessage()}
      </Layout>
    </div>
  );
}

export default Contribute;
