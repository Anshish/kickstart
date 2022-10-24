import React, { useEffect, useState } from "react";
import { Button, Table, Message, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import Campaign from "../campaign";
import web3 from "../web3";
import { Link, useNavigate, useParams } from "react-router-dom";

const INITIAL_TRANSACTION_STATE = {
  loading: "",
  error: "",
  success: "",
};

function Requests() {
  const { address } = useParams();
  const navigate = useNavigate();

  const [requestCount, setRequestCount] = useState();
  const [requests, setRequests] = useState([]);
  const [approversCount, setApproversCount] = useState();

  const [transactionState, setTransactionState] = useState(
    INITIAL_TRANSACTION_STATE
  );
  const { Header, Row, Body, Cell, HeaderCell } = Table;
  const { loading, error, success } = transactionState;

  useEffect(() => {
    async function load() {
      const campaign = Campaign({ address });

      const requestCountState = await campaign.methods
        .getRequestsCount()
        .call();
      setRequestCount(requestCountState);

      const requestsState = await Promise.all(
        Array(parseInt(requestCountState))
          .fill()
          .map((element, index) => {
            return campaign.methods.requests(index).call();
          })
      );
      setRequests(requestsState);

      const approversCountState = await campaign.methods
        .approversCount()
        .call();
      setApproversCount(approversCountState);
    }
    load();
  }, []);

  const onApprove = async (id) => {
    const campaign = Campaign({ address });
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Approval is processing....",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(parseInt(id))
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

  const onFinalise = async (id) => {
    const campaign = Campaign({ address });
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Finalise request is processing....",
    });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(parseInt(id))
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
            <Message.Header>Request Successful!</Message.Header>
          )}
          {loading ? loading : error ? error : success}
        </Message.Content>
      </Message>
    );
  };

  const renderRow = (
    { approvalCount, complete, description, recipient, value },
    index
  ) => {
    console.log(index);
    return (
      <Row key={index} textAlign="center" disabled={complete}>
        <Cell>{index}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>
          {approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {complete ? (
            "Finalised"
          ) : approvalCount >= approversCount / 2 ? (
            "Quota met"
          ) : (
            <Button
              color="green"
              basic
              size="large"
              disabled={Boolean(loading)} // don't allow more clicks if loading
              onClick={() => onApprove(index)}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {complete ? (
            "Finalised"
          ) : (
            <Button
              color="pink"
              basic
              size="large"
              disabled={Boolean(loading)}
              onClick={() => onFinalise(index)}
            >
              Finalise
            </Button>
          )}
        </Cell>
      </Row>
    );
  };

  return (
    <Layout>
      <h1>Requests</h1>
      <Link to={`/campaigns/requests/new/${address}`}>
        <Button
          // add onclick
          color="blue"
          size="large"
          floated="right"
          style={{ marginBottom: "20px" }}
        >
          Add Request
        </Button>
      </Link>

      <Table>
        <Header>
          <Row textAlign="center">
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (eth)</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalise</HeaderCell>
          </Row>
        </Header>
        <Body>
          {/* Loop through all the requests to render them */}
          {requests ? (
            requests.map((request, index) => {
              return renderRow(request, index);
            })
          ) : (
            <Row>Something went wrong</Row>
          )}
        </Body>
      </Table>
      {Boolean(loading || error || success) && renderMessage()}
    </Layout>
  );
}

export default Requests;
