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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    time {
      color: var(--gray);
      margin-left: auto;
      white-space: nowrap;
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

    .mobile-event-title {
      margin-bottom: 20px;

      h5 {
        margin: 0 0 10px 0;
      }
    }

    > ul {
      /* display: flex; */
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
        /* display: flex; */
        align-items: center;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      > ul li:not(:first-child) {
        /* margin-left: 10px; */
      }

      > ul li:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    > ul li:not(:first-child) {
      margin-left: 0px;
    }

    > ul > li:not(:last-child) {
      margin-bottom: 15px;
    }

    > ul li.action {
      width: 100%;
      padding: 0px;
      border-radius: 3px;
      font-size: 13px;
      position: relative;

      > .action-content {
        padding: 7px;
        font-size: 13px;
        line-height: 13px;
      }

      &.is-reversible {
        padding: 2px 0px 2px 0;
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
        right: 0px;
        height: 29px;
        border-radius: 0px 3px 3px 0px;
        margin-left: 3px;
        background: rgba(0, 0, 0, 0.2);
        padding: 2px 7px;
        font-size: 10px;
        text-transform: uppercase;
        font-weight: bold;

        i {
          margin-right: 0;
        }
      }

      .mobile-explanation {
        padding: 5px 10px;
        border-top: 1px solid #ddd;
      }

      &.action-ignored {
        background: var(--gray-lighter);
        color: var(--gray);
      }

      &.action-pending {
        background: var(--gray-lighter);
        color: var(--gray);
      }

      &.action-successful {
        background: var(--success);
        color: #fff;

        .mobile-explanation {
          border-top: 1px solid #3a943a;
        }
      }

      &.action-failed {
        background: var(--danger);
        color: #fff;

        .mobile-explanation {
          border-top: 1px solid #b33431;
        }
      }
    }
  }

  @media screen and (min-width: 992px) {
    .event-footer {
      > ul {
        display: flex;
      }

      > ul > li:not(:last-child) {
        margin-right: 30px;
      }

      > ul li:not(:last-child) {
        margin-bottom: 0px;
      }

      > ul li p ul {
        display: flex;
        flex-wrap: wrap;
        margin-top: -10px;
      }

      > ul li p ul li.action {
        width: auto;
        margin-top: 10px;

        &.is-reversible {
          padding: 0px 57px 0px 0;
        }

        .reverse-action {
          height: 27px;
        }
      }

      > ul li p ul li:not(:last-child) {
        margin-bottom: 0px;
        margin-right: 10px;
      }

      .mobile-explanation {
        display: none;
      }
    }
    .event-footer .mobile-event-title {
      display: none;
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-lighter);
  }
`;
