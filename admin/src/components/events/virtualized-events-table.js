import 'react-virtualized/styles.css'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Column, InfiniteLoader, Table } from 'react-virtualized'

import {
  eventListSelector,
  fetchAllEvents,
  fetchLazy,
  loadedSelector,
  loadingSelector,
  toggleSelection
} from '../../ducks/events'

export class VirtualizedEventsTable extends Component {
  static propTypes = {}

  componentDidMount() {
    this.props.fetchLazy()
  }

  render() {
    const { loaded, events } = this.props
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={loaded ? events.length : events.length + 1}
      >
        {({ onRowsRendered, registerChild }) => (
          <Table
            ref={registerChild}
            width={600}
            height={500}
            rowHeight={40}
            headerHeight={60}
            overscanRowCount={5}
            rowCount={events.length}
            rowGetter={this.rowGetter}
            onRowClick={this.handleClick}
            onRowsRendered={onRowsRendered}
          >
            <Column dataKey="title" label="Title" width={300} />
            <Column dataKey="where" label="Where" width={300} />
            <Column dataKey="when" label="When" width={300} />
          </Table>
        )}
      </InfiniteLoader>
    )
  }

  rowGetter = ({ index }) => this.props.events[index]
  handleClick = ({ rowData }) => this.props.toggleSelection(rowData.id)

  isRowLoaded = ({ index }) => index < this.props.events.length

  loadMoreRows = () => {
    this.props.fetchLazy()
  }
}

export default connect(
  (state) => ({
    events: eventListSelector(state),
    loading: loadingSelector(state),
    loaded: loadedSelector(state)
  }),
  { fetchAllEvents, toggleSelection }
)(VirtualizedEventsTable)
