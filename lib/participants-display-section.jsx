import _ from 'underscore';
import ParticipantsStore from "./participants-store";
import {
  React,
  Actions,
} from 'nylas-exports';

// Small React component that renders the user's email profile.
const EmailProfiles = function EmailProfiles(props) {

  // Destructuring the props 
  const {participants} = props;

  handleClick(event) {
    // This function is to be based through the EmailProfiles react component
    console.log(query);
    Actions.findInThread(query);
  }
  
  // Transform the profile's array of addresses into an array of React elements
  const participantElements = _.map(participants, (participant) => {
    return (
      <div key={participant.email} className="sidebar-participant-email">
        <a href={"mailto:" + participant.email}>
          {participant.name}
        </a>
        <a onClick={handleClick} data-email={participant.email}>
          Search
        </a>
      </div>
    );
  });

  // Remember - this looks like HTML, but it's actually CJSX, which is converted into
  // Coffeescript at transpile-time. We're actually creating a nested tree of Javascript
  // objects here that *represent* the DOM we want.
  return (
    <div className="email-row">
      <div>{participantElements}</div>
    </div>
  );
}
EmailProfiles.propTypes = {
  // This component takes a `participants` object as a prop. Listing props is optional
  // but enables nice React warnings when our expectations aren't met.
  participants: React.PropTypes.array.isRequired,
}

export default class ParticipantsDisplay extends React.Component {
  static displayName = 'ParticipantsDisplay';

  static containerStyles = {
    order: 11,
  }

  constructor(props) {
    super(props);
    this.state = this._getStateFromStores();
  }

  componentDidMount() {
    // When our component mounts, start listening to the ParticipantsStore.
    // When the store `triggers`, our `_onChange` method will fire and allow
    // us to replace our state.
    this._unsubscribe = ParticipantsStore.listen(this._onChange);
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _getStateFromStores = () => {
    return {
      participants: ParticipantsStore.participantsForFocusedContent(),
      loading: ParticipantsStore.loading(),
    };
  }

  // The data vended by the ParticipantsStore has changed. Calling `setState:`
  // will cause React to re-render our view to reflect the new values.
  _onChange = () => {
    this.setState(this._getStateFromStores())
  }

  _renderInner() {
    // Handle various loading states by returning early
    if (this.state.loading) {
      return (<div className="pending">Loading...</div>);
    }

    if (!this.state.participants) {
      return (<div className="pending">No Participants</div>);
    }

    return (
      <EmailProfiles participants={this.state.participants} />
    );
  }

  render() {
    return (
      <div className="sidebar-participants-list">
        <h2>Participants</h2>
        {this._renderInner()}
      </div>
    );
  }
}
