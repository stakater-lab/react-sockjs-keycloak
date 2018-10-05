import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  avatar: {
    margin: 10,
    backgroundColor: green[500],
  },
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
  blueAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: blue[500],
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  warningMessage: {
    color: '#f00'
  }
});


class LetterAvatarList extends Component {


  componentWillReceiveProps(nextProps) {
      this.setState({ users: nextProps.users });
      this.setState({ currentUser: nextProps.currentUser });
  }

  getFirstLetter(name) {
    if(!name) return '-';
    return name[0].toUpperCase();
  }

  render() {
    const { classes } = this.props;
    if (this.props.users.length>0) {
      return (
        <div className={classes.row}>
        {
            this.props.users.map((user, index) => {
              if (this.props.currentUser.sub !== user.id) {
                if (index % 4===0) {
                  return  <Avatar key={ index } className={ classes.purpleAvatar }>{this.getFirstLetter(user.name)}</Avatar>;
                }
                else if (index % 4===1) {
                  return  <Avatar key={ index } className={ classes.orangeAvatar }>{this.getFirstLetter(user.name)}</Avatar>;
                }
                else if (index % 4===2) {
                  return  <Avatar key={ index } className={ classes.blueAvatar }>{this.getFirstLetter(user.name)}</Avatar>;
                } 
                else {
                  return  <Avatar key={ index } className={ classes.avatar }>{this.getFirstLetter(user.name)}</Avatar>;
                }
              } else {
                if (this.props.users.length === 1) {
                  return <h4 key={ index }>You are the first one here</h4>;
                } else {
                  return <span key={ index }></span>;
                }
              }
            })
          }
        </div>
      );
    } else {
      return <h4 className={classes.warningMessage}>No users connected to any channel</h4>;
    }
  }
}

LetterAvatarList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LetterAvatarList);