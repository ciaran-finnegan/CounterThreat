import styled from 'styled-components';

export const StyledPlaybooks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--gray-lighter);
  border-radius: 3px;
`;

export const Playbook = styled.li`
  > header {
    display: flex;
    align-items: center;
    padding: 15px;
    font-size: 15px;
    font-weight: bold;
    color: var(--gray);
    border-bottom: ${(props) => (props.open ? '1px solid var(--gray-lighter)' : 'none')};

    .fa-caret-up,
    .fa-caret-down {
      margin-left: auto;
      font-size: 18px;
      color: var(--gray);
    }
  }

  h5 {
    margin: 0;
    padding: 15px;
    background: #fafafa;
    color: #555;
    border-bottom: 1px solid #eee;
  }

  ol {
    padding: 0px;
    margin: 0;
    list-style: none;
    border: 1px solid var(--gray-lighter);
    border-radius: 3px;
  }

  ol li {
    padding: 15px;

    label input {
      margin-right: 5px;
    }

    label {
      margin: 0;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-lighter);
  }
`;

export const PlaybookSettings = styled.div`
  padding: 15px;
`;

export const PlaybookSetting = styled.div`
  border: 1px solid var(--gray-lighter);
  border-radius: 3px;

  > div {
    padding: 15px;
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;
