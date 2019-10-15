import React from 'react';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import PropTypes from 'prop-types';
import eventsQuery from '../../queries/Events.gql';
import { timeago } from '../../../modules/dates';

import { StyledEvents, Event } from './styles';

class Events extends React.Component {
  state = {
    activeEvent: null,
  };

  getSeverityIcon = (severity) => {
    // Low = 0.1 - 3.9
    // Medium = 4.0 - 6.9
    // High = 7.0 - 8.9

    if (severity && severity >= 0.1 && severity <= 3.9) {
      return (
        <div className="severity-icon green">
          <i className="fas fa-warning" />
        </div>
      );
    }

    if (severity && severity >= 4.0 && severity <= 6.9) {
      return (
        <div className="severity-icon yellow">
          <i className="fas fa-warning" />
        </div>
      );
    }

    if (severity && severity >= 7.0 && severity <= 8.9) {
      return (
        <div className="severity-icon red">
          <i className="fas fa-warning" />
        </div>
      );
    }

    return (
      <div className="severity-icon">
        <i className="fas fa-warning" />
      </div>
    );
  };

  parseGuardDutyEvent = (guardDutyEvent) => {
    if (guardDutyEvent && typeof guardDutyEvent === 'string') {
      return JSON.parse(guardDutyEvent);
    }

    return {};
  };

  toggleActiveEvent = (eventId) => {
    this.setState(({ activeEvent }) => ({
      activeEvent: activeEvent === eventId ? null : eventId,
    }));
  };

  render() {
    const { data } = this.props;
    const events = _.get(data, 'events', []);
    const eventsWithParsedGuardDutyEvent = events.map(({ guardDutyEvent, ...rest }) => ({
      ...rest,
      guardDutyEvent: this.parseGuardDutyEvent(guardDutyEvent),
    }));

    console.log(eventsWithParsedGuardDutyEvent);

    return (
      <React.Fragment>
        <StyledEvents>
          {eventsWithParsedGuardDutyEvent.map(
            ({ _id, guardDutyEvent, actionParameters, actions }) => {
              const detail = _.get(guardDutyEvent, 'detail', {});
              const title = _.get(detail, 'title', 'Uknonwn event.');
              const createdAt = _.get(detail, 'createdAt', null);
              const severity = _.get(detail, 'severity', 0);
              const isActiveEvent = this.state.activeEvent === _id;
              return (
                <Event key={_id} onClick={() => this.toggleActiveEvent(_id)}>
                  <div className="event-header">
                    {this.getSeverityIcon(severity)}
                    <div className="event-content">
                      <header>
                        <p>{title}</p>
                        {createdAt && <time>{timeago(createdAt)}</time>}
                        <i className={`fas ${isActiveEvent ? 'fa-caret-up' : 'fa-caret-down'}`} />
                      </header>
                    </div>
                  </div>
                  {isActiveEvent && (
                    <footer className="event-footer">
                      <ul>
                        {actionParameters && actionParameters.username && (
                          <li>
                            <h5>Username</h5>
                            <p>{actionParameters.username}</p>
                          </li>
                        )}
                        {actionParameters && actionParameters.ipAddress && (
                          <li>
                            <h5>IP Address</h5>
                            <p>{actionParameters.ipAddress}</p>
                          </li>
                        )}
                        {actionParameters && actionParameters.domain && (
                          <li>
                            <h5>Domain</h5>
                            <p>{actionParameters.domain}</p>
                          </li>
                        )}
                        {actionParameters && actionParameters.instanceId && (
                          <li>
                            <h5>Instance ID</h5>
                            <p>{actionParameters.instanceId}</p>
                          </li>
                        )}
                        {actionParameters && actionParameters.vpcId && (
                          <li>
                            <h5>VPC ID</h5>
                            <p>{actionParameters.vpcId}</p>
                          </li>
                        )}
                        {actions && actions.length && (
                          <li>
                            <h5>Actions</h5>
                            <p>
                              <ul>
                                {actions.map(({ status, type }) => (
                                  <li
                                    key={`${status}_${type}`}
                                    className={`action action-${status}`}
                                  >
                                    {
                                      {
                                        pending: <i className="fas fa-clock" />,
                                        successful: <i className="fas fa-check" />,
                                        failed: <i className="fas fa-remove" />,
                                      }[status]
                                    }
                                    <span>{type}</span>
                                  </li>
                                ))}
                              </ul>
                            </p>
                          </li>
                        )}
                      </ul>
                    </footer>
                  )}
                </Event>
              );
            },
          )}
        </StyledEvents>
      </React.Fragment>
    );
  }
}

Events.propTypes = {
  data: PropTypes.object.isRequired,
};

export default graphql(eventsQuery)(Events);
