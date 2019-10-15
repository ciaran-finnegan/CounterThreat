import React from 'react';
import { Button } from 'react-bootstrap';
import { graphql } from 'react-apollo';
import eventsQuery from '../../queries/Events.gql';
import Styles from './styles';

const Index = ({ data }) => {
  console.log(data);

  return (
    <Styles.Index>
      <img
        src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
        alt="CounterThreat"
      />
      <h1>CounterThreat</h1>
      <p>Auto-remediate threats to your cloud</p>
      <div>
        <Button href="https://github.com/slartibastfast/CounterThreat.git">
          <i className="fa fa-star" />
          {' Star on GitHub'}
        </Button>
      </div>
      <footer>
        <p>
          {'Shoot first, ask questions later '}
          <a href="https://counterthreat.co">
            Find out more at CounterThreat.co
          </a>
          .
        </p>
      </footer>
    </Styles.Index>
  );
};

export default graphql(eventsQuery)(Index);

// createContainer(() => {
//   return {
//     data: [],
//   };
// }, Index)
