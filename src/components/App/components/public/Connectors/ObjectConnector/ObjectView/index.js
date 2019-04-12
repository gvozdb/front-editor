import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';

import ViewIcon from "material-ui-icons/ViewModule";
import { ConnectorContext } from '../../Connector';
import EditorComponent from '../../../..';


import { ObjectContext } from '../../Connector/ListView';

class ObjectView extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    spacing: 8,
  };

  static Name = "ObjectView"


  renderPanelView() {

    const {
      classes,
    } = this.context;


    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      {/* <ViewIcon />  */}
      Object View
    </div>);
  }


  getRenderProps() {

    const {
      style,
      ...props
    } = super.getRenderProps();

    return {
      style: {
        width: "100%",
        ...style,
      },
      ...props,
    }
  }


  renderChildren() {

    const {
      ...other
      // } = this.getRenderProps();
    } = this.getComponentProps(this);


    console.log("ObjectView renderChildren props", this.props);

    let children = super.renderChildren();

    return <ConnectorContext.Consumer>
      {context => {

        const {
          data,
        } = context;

        console.log("ObjectView renderChildren context", { ...context });

        if (!data) {
          return null;
        }


        const {
          object,
        } = data;

        return <ObjectContext.Provider
          value={{
            object,
          }}
        >
          {children}
        </ObjectContext.Provider>

      }}
    </ConnectorContext.Consumer>;
  }

}


export default ObjectView;