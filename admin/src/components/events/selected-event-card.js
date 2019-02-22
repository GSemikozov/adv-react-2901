import React, { Component } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { connect } from 'react-redux'

import { addPersonToEvent } from '../../ducks/events'
import { peopleByIdsSelector } from '../../ducks/people'
import DragPreview from './event-drag-preview'

class SelectedEventCard extends Component {
  static propTypes = {}

  componentDidMount() {
    this.props.connectPreview(getEmptyImage())
  }

  render() {
    const { event, dropTarget, dragSource, canDrop, isOver, scale } = this.props
    const borderColor = canDrop ? (isOver ? 'red' : 'green') : 'black'

    return dragSource(
      dropTarget(
        <div
          style={{
            width: 400,
            height: 150,
            border: `1px solid ${borderColor}`,
            boxSizing: 'border-box',
            transform: `scale(${scale})`
          }}
        >
          <h3>{event.title}</h3>
          <h4>{event.where}</h4>
          {this.getPeopleList()}
        </div>
      )
    )
  }

  getPeopleList() {
    return <h4>{this.props.people.map((person) => person.email).join('; ')}</h4>
  }
}

const dropSpec = {
  drop(props, monitor) {
    props.addPersonToEvent(monitor.getItem().id, props.event.id)
  }
}

const dropCollect = (connect, monitor) => ({
  dropTarget: connect.dropTarget(),
  canDrop: monitor.canDrop(),
  isOver: monitor.isOver()
})

const dragSpec = {
  beginDrag(props) {
    return {
      id: props.event.id,
      DragPreview
    }
  }
}

const dragCollect = (connect) => ({
  dragSource: connect.dragSource(),
  connectPreview: connect.dragPreview()
})

export default connect(
  (state, { event }) => ({
    people: peopleByIdsSelector(state, event.peopleIds)
  }),
  { addPersonToEvent }
)(
  DropTarget(['person'], dropSpec, dropCollect)(
    DragSource('event', dragSpec, dragCollect)(SelectedEventCard)
  )
)
