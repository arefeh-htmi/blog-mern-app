import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { map } from "lodash";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import DomainIcon from "@material-ui/icons/Domain";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
class SiteList extends Component {
  renderItems() {
    return (
      <Fragment>
        {map(this.props.sites, (site) => {
          const {
            title,
            _id: { domain },
          } = site;

          return (
            <ListItem button component="a" href={`/${domain}`} key={domain}>
              <ListItemIcon>
                <DomainIcon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          );
        })}

        <ListItem button component="" onClick={this.props.signout} >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItem>
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <Divider />
        <List>{this.renderItems()}</List>
      </div>
    );
  }
}

SiteList.propTypes = {
  sites: PropTypes.object.isRequired,
};

function mapStateToProps({ sites }) {
  return { sites };
}

export default connect(mapStateToProps)(SiteList);
