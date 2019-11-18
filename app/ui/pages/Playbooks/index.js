import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import { ButtonGroup, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
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

  handleUpdatePlaybookSensitivity = (reliability, _id) => {
    const { updatePlaybook } = this.props;

    this.setState(
      ({ playbooks }) => {
        const playbookToUpdate = playbooks.find((playbook) => playbook._id === _id);
        playbookToUpdate.reliability = reliability;

        return {
          playbooks,
        };
      },
      () => {
        delay(() => {
          const { playbooks } = this.state;
          const playbookToUpdateOnServer = playbooks.find((playbook) => playbook._id === _id);

          updatePlaybook({
            variables: {
              _id: playbookToUpdateOnServer._id,
              reliability,
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
                        <ButtonGroup>
                          <Button
                            data-tip="Caution, this means no auto-remediation action will be taken"
                            bsStyle={reliability === -10 ? 'danger' : 'default'}
                            onClick={() => {
                              this.handleUpdatePlaybookSensitivity(-10, _id);
                            }}
                          >
                            Disabled
                          </Button>
                          <Button
                            data-tip="Caution, only auto-remediate high severity threat events (GuardDuty Severity 7+)"
                            bsStyle={reliability === 3 ? 'warning' : 'default'}
                            onClick={() => {
                              this.handleUpdatePlaybookSensitivity(3, _id);
                            }}
                          >
                            Low
                          </Button>
                          <Button
                            data-tip="Recommended, auto-remediate medium and high severity threat events (GuardDuty Severity 5+)"
                            bsStyle={reliability === 5 ? 'primary' : 'default'}
                            onClick={() => {
                              this.handleUpdatePlaybookSensitivity(5, _id);
                            }}
                          >
                            Medium
                          </Button>
                          <Button
                            data-tip="Paranoid, auto-remediate low, medium and high severity threat events (GuardDuty Severity 3+)"
                            bsStyle={reliability === 7 ? 'success' : 'default'}
                            onClick={() => {
                              this.handleUpdatePlaybookSensitivity(7, _id);
                            }}
                          >
                            High
                          </Button>
                        </ButtonGroup>
                        <ReactTooltip place="top" type="dark" effect="solid" />
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
