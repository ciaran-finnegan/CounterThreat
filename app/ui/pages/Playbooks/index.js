import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import PropTypes from 'prop-types';
import playbooksQuery from '../../queries/Playbooks.gql';
import updatePlaybookMutation from '../../mutations/Playbooks.gql';
import delay from '../../../modules/delay';

import { StyledPlaybooks, Playbook, PlaybookSettings, PlaybookSetting } from './styles';

class Playbooks extends React.Component {
  state = {
    playbooks: [],
    activePlaybook: null,
  };

  componentWillMount() {
    this.fetchPlaybooks();
  }

  fetchPlaybooks = async () => {
    const { client } = this.props;
    const {
      data: { playbooks },
    } = await client.query({
      query: playbooksQuery,
    });

    this.setState({ loading: false, playbooks });
  };

  toggleActivePlaybook = (playbookId) => {
    this.setState(({ activePlaybook }) => ({
      activePlaybook: activePlaybook === playbookId ? null : playbookId,
    }));
  };

  handleUpdatePlaybookAction = (event, _id) => {
    const { updatePlaybook } = this.props;
    event.persist();

    this.setState(
      ({ playbooks }) => {
        const playbookToUpdate = playbooks.find((playbook) => playbook._id === _id);
        const actionToUpdate = event.target.name;
        const playbookActions = playbookToUpdate.actions;

        if (playbookActions.includes(actionToUpdate)) {
          playbookToUpdate.actions = playbookActions.filter((action) => action !== actionToUpdate);
        } else {
          playbookToUpdate.actions = [...playbookActions, actionToUpdate].sort();
        }

        return {
          playbooks,
        };
      },
      () => {
        const playbookToUpdateOnServer = this.state.playbooks.find(
          (playbook) => playbook._id === _id,
        );

        updatePlaybook({
          variables: {
            _id: playbookToUpdateOnServer._id,
            actions: playbookToUpdateOnServer.actions,
          },
        }).then(() => {
          this.fetchPlaybooks();
        });
      },
    );
  };

  handleUpdatePlaybookSensitivity = (event, _id) => {
    const { updatePlaybook } = this.props;
    event.persist();

    this.setState(
      ({ playbooks }) => {
        const playbookToUpdate = playbooks.find((playbook) => playbook._id === _id);
        playbookToUpdate.reliability = event.target.value;

        return {
          playbooks,
        };
      },
      () => {
        delay(() => {
          const playbookToUpdateOnServer = this.state.playbooks.find(
            (playbook) => playbook._id === _id,
          );

          updatePlaybook({
            variables: {
              _id: playbookToUpdateOnServer._id,
              reliability: parseInt(playbookToUpdateOnServer.reliability, 10),
            },
          }).then(() => {
            this.fetchPlaybooks();
          });
        }, 500);
      },
    );
  };

  render() {
    return (
      <React.Fragment>
        <StyledPlaybooks>
          {this.state.playbooks.map(({ _id, type, permissibleActions, reliability, actions }) => {
            const isActivePlaybook = this.state.activePlaybook === _id;
            return (
              <Playbook
                open={isActivePlaybook}
                key={_id}
                onClick={() => this.toggleActivePlaybook(_id)}
              >
                <header>
                  {type}{' '}
                  <i className={`fas ${isActivePlaybook ? 'fa-caret-up' : 'fa-caret-down'}`} />
                </header>
                {isActivePlaybook && (
                  <PlaybookSettings onClick={(event) => event.stopPropagation()}>
                    <PlaybookSetting>
                      <h5>Sensitivity</h5>
                      <div>
                        <input
                          type="range"
                          step="1"
                          min="3"
                          max="7"
                          value={reliability}
                          onChange={(event) => this.handleUpdatePlaybookSensitivity(event, _id)}
                        />
                      </div>
                    </PlaybookSetting>
                    <PlaybookSetting>
                      <h5>Actions to Perform for {type}</h5>
                      <div>
                        <ol>
                          {permissibleActions.map((permissibleAction) => {
                            const checked = actions.includes(permissibleAction);
                            return (
                              <li key={permissibleAction}>
                                <label>
                                  <input
                                    type="checkbox"
                                    name={permissibleAction}
                                    checked={checked}
                                    onChange={(event) =>
                                      this.handleUpdatePlaybookAction(event, _id)
                                    }
                                  />{' '}
                                  {permissibleAction}
                                </label>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    </PlaybookSetting>
                  </PlaybookSettings>
                )}
              </Playbook>
            );
          })}
        </StyledPlaybooks>
      </React.Fragment>
    );
  }
}

Playbooks.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default compose(
  graphql(updatePlaybookMutation, {
    name: 'updatePlaybook',
  }),
)(withApollo(Playbooks));
