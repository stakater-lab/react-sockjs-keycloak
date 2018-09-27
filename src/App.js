import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import logo from './logo.svg';
import Public from './pages/public';
import Private from './pages/private';
import './App.css';
import 'typeface-roboto';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: 'white',
 }
});

class App extends Component {

  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter>

        <div className="App">

          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                  <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="title" color="inherit" className={classes.grow}>
                
                  </Typography>
                  <Button  component={Link} to="/" className={classes.menuButton}  >
                    Public
                  </Button>
                  <Button  component={Link} to="/private" className={classes.menuButton}  >
                    Private
                  </Button>
                   <IconButton  onClick={ () => this.logout() } color="inherit">
                      <PowerSettingsNew />
                   </IconButton>
              </Toolbar>
            </AppBar>
          </div>

          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            {/* <h1 className="App-title"> Keycloak with Web Sockets</h1> */}
            {/* <h1>Hello, {this.state.user.name}</h1> */}
            <h1>Hello, User</h1>

          </header>

          <div>
            <Route exact path="/" component={Public} />
            <Route path="/private" component={Private} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
