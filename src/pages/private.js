import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import PropTypes from 'prop-types';

// import * as SockJS from './js/'

import LetterAvatarList from '../components/letterAvatarList';
import Notifier, { openSnackbar } from '../components/notifier';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import DeleteSweep from '@material-ui/icons/DeleteSweep';
import Assignment from '@material-ui/icons/Assignment';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';


import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
   display: 'flex',
   justifyContent: 'space-between'
  },
  leftBar: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.grey[100]
  },
  mainContent: {
    width: '100%',
    backgroundColor: theme.palette.grey[50]

  },
  pinkIcon: {
    color: '#fff',
    backgroundColor: pink[500],
  },
  greenIcon: {
    color: '#fff',
    backgroundColor: green[500],
  }
});

var stompClient = null;
var subscriptions = [];

class Private extends Component {
  
  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false, user: null, userList: [], selectedIndex: -1, message: null };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({onLoad: 'login-required', checkLoginIframe: false}).then(authenticated => {
      keycloak.loadUserInfo().then(userInfo => {
        this.setState({ keycloak: keycloak, authenticated: authenticated, user: userInfo });
        var socket = new window.SockJS('http://localhost:9002/ws');
        stompClient = window.Stomp.over(socket);
        stompClient.connect({ 'username': this.state.user.preferred_username, id: this.state.user.sub},  (frame) => {
          console.log('Connected: ' + frame);
        });
      });
    })
  }


  handleConnect = (channelId, selectedIndex) => {
   var subscription = stompClient.subscribe('/topic/'+ channelId +'/connected.users',  (channels) => {
                        this.setState({userList: Object.assign(JSON.parse(channels.body))})
                        openSnackbar({message : new Date().toISOString()});
                      });

    this.setState({selectedIndex : selectedIndex});
  
    this.subscribeChannel(channelId, this.state.user.sub);
    subscriptions.push(subscription);
  };

  subscribeChannel(channelId, userSubId) {
    stompClient.send("/app/channels/join",{}, channelId + ':' + userSubId);
  }

  handleLeave = (channelId) => {
    stompClient.send("/app/channels/leave",{}, channelId + ':' + this.state.user.sub);
  }

  unsubscribeChannel() {
    // TODO: handle unsubscribe event on individual channels
    this.subscriptions.map(subscription => subscription.unsubscribe());
  }

  handleDisconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
  }

  render() {
    const { classes } = this.props;

    if (this.state.keycloak) {
      if (this.state.authenticated) {
        return (
          <div>
            <LetterAvatarList users={this.state.userList} currentUser={this.state.user}/>
            <div className={classes.root}>

              <div className={classes.leftBar}>
                <h5>Health Center</h5>
                {/* Health Center */}
                <List component="nav" >
                  <ListItem button selected={this.state.selectedIndex === 0}>
                    <Avatar className={classes.pinkIcon}>
                      <WorkIcon />
                    </Avatar>
                    <ListItemText primary="Health Center 1" secondary="Ch-6c5b5a2a-add1" onClick={() => { this.handleConnect('Ch-6c5b5a2a-add1', 0) }} />
                    <ListItemSecondaryAction onClick={() => { this.handleLeave('Ch-6c5b5a2a-add1') }}>
                      <IconButton aria-label="Leave">
                        <DeleteSweep />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem button  selected={this.state.selectedIndex === 1}>
                    <Avatar className={classes.pinkIcon}>
                      <WorkIcon />
                    </Avatar>
                    <ListItemText primary="Health Center 2" secondary="Ch-6c5b5a2a-add2" onClick={() => { this.handleConnect('Ch-6c5b5a2a-add2', 1) }} />
                    <ListItemSecondaryAction onClick={() => { this.handleLeave('Ch-6c5b5a2a-add2') }}>
                      <IconButton aria-label="Leave">
                        <DeleteSweep />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </div>


            <div className={classes.mainContent}>
              <h5>Appointments</h5>

              {/* Appointments */}
              { this.state.selectedIndex >= 0 &&
              <List component="nav">
                  <ListItem button>
                    <Avatar className={classes.greenIcon}>
                      <Assignment />
                    </Avatar>
                    <ListItemText primary="Appointment 1" secondary="Start time: 12:30 PM" onClick={() => { this.handleConnect('Ch-6c5b5a2a-add3') }} />
                    <ListItemSecondaryAction onClick={() => { this.handleLeave('Ch-6c5b5a2a-ad31') }}>
                      <IconButton aria-label="Leave">
                        <DeleteSweep />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem button>
                    <Avatar className={classes.greenIcon}>
                      <Assignment />
                    </Avatar>
                    <ListItemText primary="Appointment 2" secondary="Start time: 02:00 PM" onClick={() => { this.handleConnect('Ch-6c5b5a2a-add4') }} />
                    <ListItemSecondaryAction onClick={() => { this.handleLeave('Ch-6c5b5a2a-add4') }}>
                      <IconButton aria-label="Leave">
                        <DeleteSweep />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
               }

               { this.state.selectedIndex === -1 &&
                <h4>No health center is selected.</h4>
               }
              </div>

            </div>
            <Notifier />
          </div> );
      } else {
        return (<div>Unable to authenticate!</div>)
      }
    } else {
      return (
        <div>
          <LinearProgress />
        </div>
      );
    }
 
  }
}

Private.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Private);