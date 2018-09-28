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
import store from '../store';
import { loginSuccess } from '../store/actions/authentication.actions';
import { userSuccess } from '../store/actions/user.actions';

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
  },
  warningMessage: {
    color: '#f00'
  }
});

var stompClient = null;
var subscriptions = [];

class Private extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      keycloak: null, 
      authenticated: false, 
      user: null, 
      userList: [], 
      selectedHealthCenter: null, 
      message: null,
      appointments: [
        { 
          id: 'Ch-sub-6c5b5a2a-add1',
          title: 'Appointment 1',
          startTime: new Date(2018,9,1,1,1,0),
          healthCenterId: 'Ch-6c5b5a2a-add1'
        },
        { 
          id: 'Ch-sub-6c5b5a2a-add2',
          title: 'Appointment 2',
          startTime: new Date(2018,10,2,1,1,0),
          healthCenterId: 'Ch-6c5b5a2a-add1'
        },
        { 
          id: 'Ch-sub-6c5b5a2a-add3',
          title: 'Appointment 3',
          startTime: new Date(2018,12,3,1,1,0),
          healthCenterId: 'Ch-6c5b5a2a-add2'
        },
        { 
          id: 'Ch-sub-6c5b5a2a-add4',
          title: 'Appointment 4',
          startTime: new Date(2018,19,4,1,1,0),
          healthCenterId: 'Ch-6c5b5a2a-add3'
        },
      ]
    };
  }

  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({onLoad: 'login-required', checkLoginIframe: false}).then(authenticated => {
      store.dispatch(loginSuccess());
      keycloak.loadUserInfo().then(userInfo => {
        this.setState({ keycloak: keycloak, authenticated: authenticated, user: userInfo });
        store.dispatch(userSuccess(userInfo));

        var socket = new window.SockJS('http://localhost:9002/ws');
        stompClient = window.Stomp.over(socket);
        stompClient.connect({ Authorization: "Bearer " + keycloak.token},  (frame) => {
          console.log('Connected: ' + frame);
        });
      });
    })
  }

  handleConnect = (channelId) => {
   var subscription = stompClient.subscribe('/topic/'+ channelId +'/connected.users',  (channels) => {
                        this.setState({userList: Object.assign(JSON.parse(channels.body))})
                        if(this.state.userList.length>1) {
                          openSnackbar({message :'New user has joined' });
                        }
                      });

    this.setState({selectedHealthCenterId : channelId});
    this.subscribeChannel(channelId);
    subscriptions.push(subscription);
  };

  subscribeChannel(channelId) {
    stompClient.send("/app/channels/join",{}, channelId);
  }

  handleChannelLeave = (channelId) => {
    stompClient.send("/app/channels/leave",{}, channelId);
  }


  subscribeSubChannel(subChannelId) {
    stompClient.send("/app/subchannels/join",{}, subChannelId);
  }

  handleSubChannelLeave = (subChannelId) => {
    stompClient.send("/app/subchannels/leave",{}, subChannelId);
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
                  <ListItem button selected={this.state.selectedHealthCenterId === 'Ch-6c5b5a2a-add1'}>
                    <Avatar className={classes.pinkIcon}>
                      <WorkIcon />
                    </Avatar>
                    <ListItemText primary="Health Center 1" secondary="Ch-6c5b5a2a-add1" onClick={() => { this.handleConnect('Ch-6c5b5a2a-add1') }} />
                    <ListItemSecondaryAction onClick={() => { this.handleChannelLeave('Ch-6c5b5a2a-add1') }}>
                      <IconButton aria-label="Leave">
                        <DeleteSweep />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem button  selected={this.state.selectedHealthCenterId === 'Ch-6c5b5a2a-add2'}>
                    <Avatar className={classes.pinkIcon}>
                      <WorkIcon />
                    </Avatar>
                    <ListItemText primary="Health Center 2" secondary="Ch-6c5b5a2a-add2" onClick={() => { this.handleConnect('Ch-6c5b5a2a-add2') }} />
                    <ListItemSecondaryAction onClick={() => { this.handleChannelLeave('Ch-6c5b5a2a-add2') }}>
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
              <List component="nav">
                {this.state.appointments
                  .filter(appointment => appointment.healthCenterId === this.state.selectedHealthCenterId)
                  .map((appointment, index) => {
                      return (
                        <ListItem button key={index}>
                          <Avatar className={classes.greenIcon}>
                            <Assignment />
                          </Avatar>
                          <ListItemText primary={ appointment.title } secondary={appointment.startTime.toDateString()} onClick={() => { this.subscribeSubChannel(appointment.id) }} />
                          <ListItemSecondaryAction onClick={() => { this.handleSubChannelLeave(appointment.id) }}>
                            <IconButton aria-label="Leave">
                              <DeleteSweep />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                  })}


                </List>

               { this.state.selectedHealthCenterId === null &&
                <h4 className={classes.warningMessage}>No health center is selected.</h4>
               }
              </div>

            </div>

            {/* Inject Notifier */}
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