import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import RenderWidgets from '../Lists/RenderWidgets';

const styles = theme => ({
  footer: {
    margin: `80px 5% 10px`,
  },
});

function Footer({ widgets, classes }) {
  return (
    <Grid item xs={12} md={12}>
      <footer className={classes.footer}>
        <RenderWidgets contents={widgets} />
      </footer>
    </Grid>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  widgets: PropTypes.array.isRequired,
};

export default withStyles(styles)(Footer);
