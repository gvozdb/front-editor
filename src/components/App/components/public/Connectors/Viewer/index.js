import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { parse } from 'graphql';

class Viewer extends Component {

  static propTypes = {
    query: PropTypes.string,
    parentQuery: PropTypes.string,
    ConnectorContext: PropTypes.object.isRequired,
  }

  static contextType = Context;


  state = {}


  componentWillMount() {


    const {
      query,
      parentQuery,
      ConnectorContext,
    } = this.props;


    let Query;

    /**
     * queryName используется в фильтрах
     */
    let queryName;



    if (query) {

      queryName = query;

      const {
        query: {
          [query]: apiQuery,
        },
      } = this.context;

      Query = apiQuery;

    }
    else if (parentQuery) {

      Query = parentQuery;

      // Получаем название операции из готового запроса
      queryName = this.getQueryNameFromQuery(parentQuery);

    }



    if (Query) {

      Query = this.extendQuery(Query);

      this.Renderer = graphql(gql(Query))(props => {


        const {
          children,
          ...other
        } = props;

        return <ConnectorContext.Consumer>
          {context => <ConnectorContext.Provider
            value={{
              ...context,
              ...other,
            }}
          >
            {children}
          </ConnectorContext.Provider>}
        </ConnectorContext.Consumer>;

      });

      Object.assign(this.state, {
        queryName,
      })

    }

    super.componentWillMount && super.componentWillMount();
  }


  /**
   * Расширяем запрос
   */
  extendQuery(Query) {

    if (Query) {


      const {
        schema,
      } = this.context;

      /**
       * Проходим запрос на предмет директив в фрагментах
       */



      const parsedQuery = parse(Query);



      if (parsedQuery && schema) {

        const {
          types,
        } = schema;

        const {
          definitions,
        } = parsedQuery;

        if (definitions && definitions.length) {

          definitions.reduceRight((current, definition) => {

            const {
              kind,
              directives,
              // loc: {
              //   start,
              //   end,
              //   source: {
              //     body,
              //   },
              // },
              selectionSet: {
                loc: {
                  start,
                  end,
                  source: {
                    body,
                  },
                },
              },
              typeCondition,
            } = definition;

            if (kind === "FragmentDefinition" && typeCondition) {


              const needAutoloadFields = directives && directives.find(n => n && n.name && n.name.value === "prismaCmsFragmentAllFields") ? true : false;

              if (needAutoloadFields) {

                const {
                  kind,
                  name: {
                    value: type,
                  },
                } = typeCondition;








                /**
                 * Если указана автоподгрузка типов и получен тип, то получаем все скалярные поля для этого типа
                 */






                const fragmentSource = body.slice(start, end);



                if (type) {

                  const field = types.find(n => {

                    const {
                      kind,
                      name,
                    } = n;

                    return kind === "OBJECT" && name === type;

                  });




                  if (field) {

                    let {
                      fields,
                    } = field;




                    fields = fields.filter(n => {

                      return n && n.name && this.isScalar(n) ? true : false;
                    });




                    /**
                     * Если были получены скалярные поля,
                     * добавляем их в запрос
                     */
                    if (fields.length) {

                      const fieldsList = "\n" + fields.map(({ name }) => name).join("\n") + "\n";



                      const position = end - 1;

                      Query = [Query.slice(0, position), fieldsList, Query.slice(position)].join('');



                    }

                  }

                }

              }

            }

            return current;

          }, []);

        }

      }

    }

    return Query;
  }


  isScalar(field) {

    const {
      type: {
        kind,
        ofType,
      },
    } = field;

    if (kind === "SCALAR") {
      return true;
    }
    else if ((kind === "NON_NULL" || kind === "LIST") && ofType) {
      return this.isScalar({
        type: ofType,
      });
    }
    else {
      return false;
    }
  }


  getQueryNameFromQuery(query) {


    const parsedSchema = parse(query);



    if (parsedSchema) {


      const {
        definitions,
      } = parsedSchema;

      if (definitions) {

        const OperationDefinition = definitions.find(n => n.kind === "OperationDefinition");

        if (OperationDefinition) {

          const {
            value,
          } = OperationDefinition.name || {};

          return value;

        }

      }

    }

  }

}


/**
 * For Objects connector
 */
export class ObjectsView extends Viewer {


  render() {

    const {
      query,
      children,
      first,
      pagevariable: pageVariable = "page",
      ConnectorContext,
      ...other
    } = this.props;

    const {
      Renderer,
    } = this;

    const {
      queryName,
    } = this.state;


    const {
      uri,
    } = this.context;


    let {
      [pageVariable]: page,
    } = uri.query(true);


    page = parseInt(page) || 0;

    const skip = page ? (page - 1) * first : 0;



    // return "Sdfdsf";

    return <ConnectorContext.Provider
      value={{
        query,
        queryName,
        pageVariable,
      }}
    >
      {Renderer ?
        <Renderer
          page={page}
          skip={skip}
          first={first}
          {...other}
        >
          {children}
        </Renderer> :
        children
      }
    </ConnectorContext.Provider>

  }

}

/**
 * For Object connector
 */
export class ObjectView extends Viewer {


  render() {

    const {
      query,
      children,
      ConnectorContext,
      ...other
    } = this.props;

    const {
      Renderer,
    } = this;

    const {
      queryName,
    } = this.state;




    return <ConnectorContext.Provider
      value={{
        query,
        queryName,
        // pageVariable,
      }}
    >
      {Renderer ?
        <Renderer
          // page={page}
          // skip={skip}
          // first={first}
          {...other}
        >
          {children}
        </Renderer> :
        children
      }
    </ConnectorContext.Provider>

  }

}

export default Viewer;