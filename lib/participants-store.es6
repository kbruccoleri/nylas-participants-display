import _ from 'underscore';
import request from 'request';
import NylasStore from 'nylas-store';
import {FocusedContentStore} from 'nylas-exports';

// This package uses the Flux pattern - Nylas Store is a small singleton that
// observes other parts of the application and vends data to our React
// component.
class ParticipantsStore extends NylasStore {
  constructor() {
    super();

    this._participants = null;
    this._loading = false;
    this._error = null;

    // Register a callback with the FocusedContactsStore. This will tell us
    // whenever the selected person has changed so we can refresh our data.
    this.listenTo(FocusedContentStore, this._onFocusedContentChanged);
  }

  // Getter Methods
  participantsForFocusedContent() {
    return this._participants;
  }

  loading() {
    return this._loading;
  }

  // Called when the FocusedContactStore `triggers`, notifying us that the data
  // it vends has changed.
  _onFocusedContentChanged = () => {

    // Grab the thread from the new focused content
    const focusedThread = FocusedContentStore.focused('thread');
    if (focusedThread !== undefined) {
      if (focusedThread.participants !== undefined) {
        // If we are focused on a thread, take the participants.
        // Clear the content that we're currently showing and `trigger`. Since
        // our React component observes our store, `trigger` causes our React component
        // to re-render.
        this._participants = focusedThread.participants;
        this.trigger(this);
      }
    }
  }

}

export default new ParticipantsStore();
