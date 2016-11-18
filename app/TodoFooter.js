import React from 'react';
import {render} from 'react-dom';

export default class TodoFooter extends React.Component {

  render() {

    var liSelections = ['All', 'Active', 'Completed'].map( selection => {
      return (
            <li key={selection} >
              <a
                href="#/"
                onClick={(event) => this.props.selected(selection)}
                className={this.props.selection == selection ? 'selected' : ''}>
                {selection}
              </a>
            </li>

          )
    });

    return (
        <footer className="footer">
          <span className="todo-count">
            <strong>{this.props.count}</strong> tasks left
          </span>
          <ul className="filters">
            {liSelections}
          </ul>
        </footer>
          );
  }
}
