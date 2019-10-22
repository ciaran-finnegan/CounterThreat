import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import PropTypes from 'prop-types';
import eventsQuery from '../../queries/Events.gql';
import handleReverseActionMutation from '../../mutations/Events.gql';
import { timeago } from '../../../modules/dates';

import { StyledEvents, Event } from './styles';

const PER_PAGE = 100;

class Events extends React.Component {
  state = {
    events: [],
    totalEvents: 0,
    activeEvent: null,
    perPage: PER_PAGE,
    currentPage: 1,
  };

  componentWillMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
    const { client } = this.props;
    const {
      data: {
        events: { totalEvents, events },
      },
    } = await client.query({
      query: eventsQuery,
      variables: {
        perPage: this.state.perPage,
        currentPage: this.state.currentPage,
      },
    });

    this.setState({ totalEvents, events });
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

  handleReverseAction = (event, eventId, actionType) => {
    event.stopPropagation();

    if (confirm(`Are you sure? This will reverse the ${actionType} action on this event.`)) {
      const { handleReverseAction } = this.props;

      handleReverseAction({
        variables: {
          eventId,
          actionType,
        },
      });
    }
  };

  onChangePage = (currentPage) => {
    this.setState({ currentPage }, () => {
      this.fetchEvents();
    });
  };

  renderPagination = () => {
    const { totalEvents } = this.state;
    const pages = [];
    const pagesToGenerate = Math.ceil(totalEvents / this.state.perPage);

    for (let pageNumber = 1; pageNumber <= pagesToGenerate; pageNumber += 1) {
      pages.push(
        <li
          role="presentation"
          key={`pagination_${pageNumber}`}
          className={pageNumber === this.state.currentPage ? 'active' : ''}
          onClick={() => this.onChangePage(pageNumber)}
          onKeyDown={() => this.onChangePage(pageNumber)}
        >
          <a href="#" onClick={(event) => event.preventDefault()}>
            {pageNumber}
          </a>
        </li>,
      );
    }

    return <ul className="pagination pagination-md">{pages}</ul>;
  };

  render() {
    const { data } = this.props;
    const { totalEvents, events } = this.state;
    const eventsWithParsedGuardDutyEvent = events.map(({ guardDutyEvent, ...rest }) => ({
      ...rest,
      guardDutyEvent: this.parseGuardDutyEvent(guardDutyEvent),
    }));

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
                                {actions.map(({ status, type, isReversible }) => (
                                  <li
                                    key={`${status}_${type}`}
                                    className={`action action-${status} ${isReversible &&
                                      status === 'successful' &&
                                      'is-reversible'}`}
                                  >
                                    {
                                      {
                                        pending: <i className="fas fa-clock" />,
                                        successful: <i className="fas fa-check" />,
                                        failed: <i className="fas fa-remove" />,
                                      }[status]
                                    }
                                    <span>{type}</span>
                                    {isReversible && status === 'successful' && (
                                      <div
                                        className={`reverse-action`}
                                        onClick={(event) =>
                                          this.handleReverseAction(event, _id, type)
                                        }
                                      >
                                        <i className="fas fa-refresh" />
                                      </div>
                                    )}
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
        {totalEvents &&
          this.state.perPage &&
          totalEvents > this.state.perPage &&
          this.renderPagination()}
      </React.Fragment>
    );
  }
}

Events.propTypes = {
  data: PropTypes.object.isRequired,
};

export default compose(
  graphql(handleReverseActionMutation, {
    name: 'handleReverseAction',
  }),
)(withApollo(Events));
