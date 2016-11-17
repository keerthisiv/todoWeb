import React from 'react';
import {render} from 'react-dom';

export default class Task extends React.Component {

  render() {
    const liClassName = this.props.completed ? "completed" : ""
    return (
        <li className={liClassName}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={this.props.completed}
              onChange={(event) => this.props.onToggle(this.props.id)}
            />
            <label>
              {this.props.description}
            </label>
            <button className="destroy" 
            onClick={(event) => this.props.onDestroy(this.props.id)}/>
          </div>
          <input
            ref="editfield"
            className="edit"
          />
        </li>
      )
  }

}


