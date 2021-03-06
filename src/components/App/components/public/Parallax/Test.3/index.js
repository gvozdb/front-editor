import React, { Component } from 'react';

import PropTypes from 'prop-types';

import EditorComponent from '../../..';
import { withStyles } from 'material-ui';
 
import Parallax from "./parallax";

export const styles = {

  root: {

  }
}


const Renderer = withStyles(styles)(props => {

  const {
    classes,
  } = props;

  return <div
    className={classes.root}
  >
    <Parallax />
  </div>


});


class ParallaxTest extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    // deletable: false,
  }


  static Name = "ParallaxTest"

 
  renderChildren() {

    const {
      classes,
    } = this.props;

    return <Renderer />;
 
  }


}
 

export default ParallaxTest;
