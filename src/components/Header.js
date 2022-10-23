import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Menu className="ui massive" style={{ marginTop: "2em" }}>
      <Link to="/">
        <Menu.Item>KickStarter</Menu.Item>
      </Link>

      <Menu.Menu position="right">
        <Link to="/">
          <Menu.Item>Campaigns</Menu.Item>
        </Link>

        <Menu.Item>
          <Link to="/pages/NewPage">
            <Icon name="add circle" />
          </Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;
