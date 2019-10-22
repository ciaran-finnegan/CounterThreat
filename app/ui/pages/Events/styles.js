import styled from 'styled-components';

export const StyledEvents = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--gray-lighter);
  border-radius: 3px;
`;

export const Event = styled.li`
  padding: 15px;

  .event-header {
    display: flex;
    align-items: center;
  }

  .event-header .severity-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    min-width: 30px;
    height: 30px;
    min-height: 30px;
    border-radius: 30px;

    .fa-warning {
      color: #fff;
    }

    &.green {
      background: var(--success);
    }

    &.yellow {
      background: var(--warning);
    }

    &.red {
      background: var(--danger);
    }
  }

  .event-header header {
    display: flex;
    align-items: center;

    p {
      margin: 0;
      font-weight: 500;
      color: var(--gray-dark);
    }

    time {
      color: var(--gray);
      margin-left: auto;
    }

    .fa-caret-up,
    .fa-caret-down {
      margin-left: 10px;
      font-size: 18px;
      color: var(--gray);
    }
  }

  .event-content {
    margin-left: 15px;
    width: calc(100% - 45px);
  }

  .event-content ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .event-content ul li {
    color: var(--gray);
    float: left;

    &:not(:last-child) {
      margin-right: 15px;
    }
  }

  .event-footer {
    background: #fafafa;
    padding: 15px;
    margin: 15px -15px -15px -15px;
    border-top: 1px solid var(--gray-lighter);

    > ul {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    > ul li h5 {
      margin: 0 0 5px 0;
    }

    > ul li p {
      margin: 0;

      ul {
        display: flex;
        align-items: center;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      > ul li:not(:first-child) {
        margin-left: 10px;
      }
    }

    > ul li:not(:first-child) {
      margin-left: 30px;
    }

    > ul li.action {
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 13px;
      position: relative;

      &.is-reversible {
        padding: 2px 30px 2px 6px;
      }

      i {
        display: inline-block;
        margin-right: 7px;
      }

      .reverse-action {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        border-radius: 0px 3px 3px 0px;
        display: inline-block;
        margin-left: 3px;
        background: rgba(0, 0, 0, 0.2);
        padding: 2px 5px;

        i {
          margin-right: 0;
        }
      }

      &.action-pending {
        background: var(--gray-lighter);
        color: var(--gray);
      }

      &.action-successful {
        background: var(--success);
        color: #fff;
      }

      &.action-failed {
        background: var(--danger);
        color: #fff;
      }
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-lighter);
  }
`;
