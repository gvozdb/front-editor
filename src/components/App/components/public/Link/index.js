import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/Link";

import { Link as MuiLink } from "react-router-dom";
import { ObjectContext } from '../Connectors/Connector/ListView';

class Link extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    native: false,
    to: "",
  }

  static Name = "Link"

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Link
    </div>);
  }


  getRootElement() {


    return MuiLink;

  }


  prepareDragItemComponents() {

    return super.prepareDragItemComponents().concat([
      {
        name: "Typography",
        props: {},
        components: [],
      }
    ]);
  }


  // getRenderProps() {

  //   let renderProps = super.getRenderProps();

  //   console.log("ObjectContext.Consumer renderProps", { ...renderProps });
  //   console.log("ObjectContext.Consumer ObjectContext", ObjectContext);

  //   // let test = <ObjectContext.Consumer>
  //   //   {context => {

  //   //     console.log("ObjectContext.Consumer context 2", context);

  //   //     {/* return content; */}
  //   //   }}
  //   // </ObjectContext.Consumer>

  //   return renderProps;

  // }


  renderMainView() {

    const object = this.getObjectWithMutations();


    console.log("Link props", { ...this.props });

    // const {
    // } = this.props;

    let {
      to,
      ...props
    } = this.getComponentProps(this);


    // let content = super.renderMainView();;

    console.log("ObjectContext.Consumer to", to, { ...props });

    if (to) {
      /**
       * Проверяем есть ли параметры в УРЛ
       */

      let segments = to.split("/");

      console.log("ObjectContext.Consumer segments", segments);

      /**
       * Если есть, то нам надо обернуть вывод в контекст объекта
       */
      if (segments.find(n => n && n.startsWith(":"))) {

        return <ObjectContext.Consumer>
          {context => {

            console.log("ObjectContext.Consumer context", context);

            const {
              object,
            } = context;

            if (object) {

              to = segments.map(n => {

                if (n && n.startsWith(":")) {
                  n = object[n.replace(/^\:/, '')];
                }

                return n;
              }).join("/");

            }

            return super.renderMainView({
              to,
            });
          }}
        </ObjectContext.Consumer>
      }

    }


    return super.renderMainView();
  }

  // getRenderProps() {

  //   const {
  //     style,
  //     marginTop,
  //     marginBottom,
  //     // props: {
  //     //   ...otherProps
  //     // },
  //     ...other
  //   } = super.getRenderProps();

  //   // const {
  //   //   text,
  //   //   // type,
  //   //   // style,
  //   //   color,
  //   //   display,
  //   //   displayType,
  //   //   ...otherProps
  //   // } = this.getComponentProps(this);


  //   console.log("Link renderProps getRenderProps", { ...super.getRenderProps() });


  //   const renderProps = {
  //     style: {
  //       ...style,
  //       marginTop,
  //       marginBottom,
  //     },
  //     ...other,
  //     // ...otherProps
  //   }


  //   console.log("Link renderProps", renderProps);

  //   return renderProps;
  // }

  // renderMainView() {

  //   // const {
  //   //   marginTop,
  //   //   marginBottom,
  //   // } = this.getComponentProps(this);

  //   const {
  //     style,
  //     marginTop,
  //     marginBottom,
  //     ...other
  //   } = this.getRenderProps();

  //   return <div
  //     style={{
  //       marginTop,
  //       marginBottom,
  //       ...style,
  //     }}
  //     {...other}
  //   >
  //     {super.renderMainView()}
  //   </div>;
  // }

}

export default Link;
