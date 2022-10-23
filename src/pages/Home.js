import React from "react";
import { useEffect, useState } from "react";
import factory from "../factory";
import Layout from "../components/Layout";
import { Button, Card, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";

function Home() {
  // const campaigns = async () => {
  //   await factory.methods.getDeployedCampaigns().call();
  // };
  // console.log(campaigns);
  // // const items = campaigns.map((campaignAddress) => {
  // //   console.log(campaignAddress);
  // //   return {
  // //     header: campaignAddress,
  // //     description: <a></a>,
  // //     fluid: true,
  // //   };
  // // });
  const [campaigns, setCampaigns] = useState("");
  const [campaignAddress, setCampaignsAddress] = useState("");

  useEffect(() => {
    async function load() {
      const accounts = await factory.methods.getDeployedCampaigns().call();
      setCampaigns(accounts);
      // console.log('accounts',accounts);
      // console.log('campaigns',campaigns);

      const items = accounts.map((it) => {
        return {
          header: it,
          description: (
            <Link to={`/campaigns/${it}`}>
              <a>View Campaign</a>
            </Link>
          ), //change description
          fluid: true,
        };
      });
      setCampaignsAddress(items);
      // console.log('items',items);
      // console.log('campaignAddress',campaignAddress);

      <Card.Group items={items} />;
    }
    load();
  }, [campaigns, campaignAddress]);

  return (
    <Layout>
      <div>
        <h1>Open Campaigns</h1>
        <Link to="/pages/NewPage">
          <Button
            icon
            floated="right"
            color="blue"
            size="large"
            style={{ marginBottom: "20px" }}
          >
            <Icon name="add circle" />
            {"   "}Create New Campaign
          </Button>
        </Link>
        <Card.Group items={campaignAddress} />
      </div>
    </Layout>
  );
}

export default Home;
