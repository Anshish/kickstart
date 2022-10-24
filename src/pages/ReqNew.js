import React, { useState } from "react";
import { Form, Button, Message, Icon, Input } from "semantic-ui-react";
import Layout from "../components/Layout";
import web3 from "../web3";
import Campaign from "../campaign";
import { useNavigate, useParams } from "react-router-dom";

const INITIAL_TRANSACTION_STATE = {
  loading: "",
  error: "",
  success: "",
};

function ReqNew() {
  const { address } = useParams();
  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    recipient: "",
  });

  const { description, amount, recipient } = formData;

  const [transactionState, setTransactionState] = useState(
    INITIAL_TRANSACTION_STATE
  );

  const { loading, error, success } = transactionState;

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("submitting", { address });
    const campaign = Campaign({ address });
    console.log(campaign);
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Create request transaction is processing....",
    });
    try {
      const accounts = await web3.eth.getAccounts(); //goes to catch if error
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(amount, "ether"),
          recipient
        )
        .send({
          from: accounts[0],
          gas:"1000000"
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
      <Message
        icon
        negative={Boolean(error)}
        success={Boolean(success)}
        style={{ overflowWrap: "break-word" }}
      >
        <Icon
          name={
            loading ? "circle notched" : error ? "times circle" : "check circle"
          }
          loading={Boolean(loading)}
        />
        <Message.Content>
          {Boolean(success) && (
            <Message.Header>Request Created Successfully!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  return (
    <Layout>
      <h1>Create a Request</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input
            label="ether"
            labelPosition="right"
            type="number" // enforce number only content
            // min="0" //enforce positive numbers only
            value={amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) =>
              setFormData({ ...formData, recipient: e.target.value })
            }
          />
        </Form.Field>

        <Button disabled={Boolean(loading)} color="blue" size="large">
          Create Request
        </Button>
        {Boolean(loading || error || success) && renderMessage()}
      </Form>
    </Layout>
  );
}

export default ReqNew;
