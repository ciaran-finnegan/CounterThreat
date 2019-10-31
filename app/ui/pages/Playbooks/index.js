import React from 'react';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import PropTypes from 'prop-types';
import playbooksQuery from '../../queries/Playbooks.gql';

import StyledPlaybooks from './styles';

class Playbooks extends React.Component {
  state = {};

  render() {
    const { data } = this.props;
    const playbooks = _.get(data, 'playbooks', []);
    console.log(data, playbooks);
    return (
      <StyledPlaybooks>
        <ul>
          {playbooks.map(({ type, permissibleActions, actions }) => {
            return (
              <li>
                <header>{type}</header>
                <ol>
                  {permissibleActions.map((permissibleAction) => {
                    const checked = actions.includes(permissibleAction);
                    return (
                      <li>
                        <label>
                          <input type="checkbox" checked={checked} /> {permissibleAction}
                        </label>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ul>
      </StyledPlaybooks>
    );
  }
}

Playbooks.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default compose(graphql(playbooksQuery))(Playbooks);
