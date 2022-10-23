import React, { useEffect, useState } from "react";
import Campaign from "../campaign";
import Layout from "../components/Layout";
import web3 from "../web3";
// import ContributeForm from "../components/ContributeForm";
import { Card, Button, Grid } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Contribute from './Contribute';

function Details() {
  const { address } = useParams();
  const [campaignAddress, setCampaignAddress] = useState("");
  const [minimumContribution, setMinumumContribution] = useState("");
  const [balance, setBalance] = useState("");
  const [requestCount, setRequestCount] = useState("");
  const [approversCount, setApproversCount] = useState("");
  const [manager, setManager] = useState("");

  useEffect(() => {
    async function load() {
      const campaignDetails = Campaign({ address });
      const summary = await campaignDetails.methods.getSummary().call();
      setCampaignAddress({ address });
      setMinumumContribution(summary[0]);
      setBalance(summary[1]);
      setRequestCount(summary[2]);
      setApproversCount(summary[3]);
      setManager(summary[4]);
    }
    load();
  }, []);

  const items = [
    {
      header: "Manager Address",
      meta: manager,
      description:
        "The manager created this campaign and can create requests to withdraw this money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Minimum Contribution",
      meta: `${minimumContribution} wei`,
      description:
        "The minimum amount to contribute to this campaign in wei to become an approver",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Camapaign Balance",
      meta: `${web3.utils.fromWei(balance, "ether")} eth`,
      description: "How much money this campaign has left to spend",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Number of requests",
      meta: requestCount,
      description:
        "A request tries to withdraw money from the account. Requests must be approved by a minimum 50% of approvers",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Number of Approvers",
      meta: approversCount,
      description:
        "The number of approvers that have already contributed to this campaign",
      style: { overflowWrap: "break-word" },
    },
  ];

  return (
    <Layout>
      <h1>Campaign Details</h1>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items}></Card.Group>
          </Grid.Column>

          <Grid.Column width={6}>
            <Contribute campaignAddress={address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link to={`/campaigns/requests/${address}`}>
              <Button
                color="blue"
                size="large"
              >
                Show Requests
              </Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

export default Details;
