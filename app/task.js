import React from 'react';
import {render} from 'react-dom';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default class Task extends React.Component {
  constructor() {
    super()
    this.state = {editing: false}
  }

  handleEdit = () => {
    this.setState({editing: true, editText: this.props.description});
  }

  handleChange = (event) => {
    if (this.state.editing) {
      this.setState({editText: event.target.value});
    }
  }

  handleSubmit = (event) => {
    var val = this.state.editText.trim();
    if (val) {
      this.setState({editing: false})
      this.props.updateTask(this.props.id, val);
    } else {
      this.props.onDestroy(this.props.id);
    }
  }

  handleKeyDown = (event) => {
    if (event.which === ESCAPE_KEY) {
      this.setState({editText: this.props.description, editing: false});
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  render() {
    let liClass = this.props.completed ? "completed" : null
    let liClassName = this.state.editing ? "editing" : liClass

    return (
        <li className={liClassName}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={this.props.completed}
              onChange={(event) => this.props.onToggle(this.props.id)}
            />
            <label onDoubleClick={this.handleEdit}>
              {this.props.description}
            </label>
            <button className="destroy" 
            onClick={(event) => this.props.onDestroy(this.props.id)}/>
          </div>
          <input
            ref="editfield"
            className="edit"
            value={this.state.editText}
            onChange={this.handleChange}
            onBlur={this.handleSubmit}
            onKeyDown={this.handleKeyDown}
          />
        </li>
      )
  }

}


