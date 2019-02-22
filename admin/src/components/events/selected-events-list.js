import React, { Component } from 'react'
import { Motion, spring, TransitionMotion } from 'react-motion'
import { connect } from 'react-redux'
import { List } from 'react-virtualized'

import { selectedEventsSelector } from '../../ducks/events'
import SelectedEventCard from './selected-event-card'

class SelectedEventsList extends Component {
  static propTypes = {}

  render() {
    return (
      <List
        width={400}
        height={300}
        rowCount={this.props.events.length}
        rowHeight={150}
        rowRenderer={this.rowRenderer}
        data={this.props.events}
      />
    )
  }

  rowRenderer = ({ index, key, style }) => (
    <Motion
      key={key}
      style={{ scale: spring(1, { stiffness: 170, damping: 26 }), style }}
      defaultStyle={{ scale: 0.1 }}
    >
      {(interpolatedStyle) => (
        <SelectedEventCard
          scale={interpolatedStyle.scale}
          event={this.props.events[index]}
        />
      )}
    </Motion>
  )
}

export default connect((state) => {
  return {
    events: selectedEventsSelector(state)
  }
})(SelectedEventsList)
