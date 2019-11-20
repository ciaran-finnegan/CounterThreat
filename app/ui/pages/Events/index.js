import React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import eventsQuery from '../../queries/Events.gql';
import handleReverseActionMutation from '../../mutations/Events.gql';
import Loading from '../../components/Loading';
import { timeago, epochToHuman, epicToISO } from '../../../modules/dates';
import { StyledEvents, Event } from './styles';

const PER_PAGE = 25;

class Events extends React.Component {
  state = {
    loading: true,
    events: [],
    totalEvents: 0,
    activeEvent: null,
    perPage: PER_PAGE,
    currentPage: 1,
  };

  componentWillMount() {
    this.fetchEvents();

    this.refetchTimer = setInterval(() => {
      this.fetchEvents();
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.refetchTimer);
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

    this.setState({ loading: false, totalEvents, events });
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
    const { loading, totalEvents, events } = this.state;
    const eventsWithParsedGuardDutyEvent = events.map(({ guardDutyEvent, ...rest }) => ({
      ...rest,
      guardDutyEvent: this.parseGuardDutyEvent(guardDutyEvent),
    }));

    if (loading) return <Loading />;

    return (
      <React.Fragment>
        <StyledEvents>
          {eventsWithParsedGuardDutyEvent.map(
            ({ _id, sourceSeverity, createdAt, guardDutyEvent, actionParameters, actions }) => {
              console.log(createdAt, typeof createdAt);
              const detail = _.get(guardDutyEvent, 'detail', {});
              const title = _.get(detail, 'title', 'Unknown event.');
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
                      <div className="mobile-event-title">
                        <h5>Full Event</h5>
                        <pre>{title}</pre>
                      </div>
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
                        {actions && actions.length > 0 ? (
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
                                        ignored: (
                                          <i
                                            className="fas fa-shield-check"
                                            data-tip="No action taken, check senstivity level in remediation playbook"
                                          />
                                        ),
                                        pending: (
                                          <i className="fas fa-clock" data-tip="Action pending" />
                                        ),
                                        successful: (
                                          <i
                                            className="fas fa-check"
                                            data-tip="Action taken successfully"
                                          />
                                        ),
                                        failed: (
                                          <i
                                            className="fas fa-remove"
                                            data-tip="Failed to take the action"
                                          />
                                        ),
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
                                        <i
                                          className="fas fa-refresh"
                                          data-tip="Click to undo action"
                                        />
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                              <ReactTooltip place="top" type="dark" effect="solid" />
                            </p>
                          </li>
                        ) : null}
                      </ul>
                    </footer>
                  )}
                </Event>
              );
            },
          )}
        </StyledEvents>
        {totalEvents && this.state.perPage && totalEvents > this.state.perPage
          ? this.renderPagination()
          : null}
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
