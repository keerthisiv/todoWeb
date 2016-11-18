import React from 'react';
import {render} from 'react-dom';
import Task from './task';
import TodoFooter from './TodoFooter';
import 'whatwg-fetch';
var R = require('ramda');

const ENTER_KEY = 13;

class App extends React.Component {
  constructor() {
    super()
    this.state = {todos: [], newTodo: '', toggleAll: false, selectedOption: 'All'}
  }

  componentDidMount() {
    fetch('http://127.0.0.1:3000/tasks.json')
      .then(response => response.json())
      .then(body => this.setState({todos: body}))
  }

  activeTasks = () => {
    let isActive = n => n["completed"] === false;
    return R.filter(isActive, this.state.todos) || []
  }

  completedTasks = () => {
    let isCompleted = n => n["completed"] === true;
    return R.filter(isCompleted, this.state.todos) || []
  }

  handleChange = (event) => {
    this.setState({newTodo: event.target.value});
  }

  showTasks = () => {
    if (this.state.selectedOption == 'Active') {
      return this.activeTasks()
    } else if (this.state.selectedOption == 'Completed') {
      return this.completedTasks()
    } else {
      return this.state.todos
    }
  }

  toggleAll = () => {
    let toggleState = this.state.toggleAll;
    fetch('http://127.0.0.1:3000/tasks_toggle_all', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          toggle: toggleState,
        })
      }).then(response => response.json())
        .then(body => this.setState({todos: body, toggleAll: !toggleState}))
  }

  toggle = (id) => {
    if (id > 0) {
      fetch('http://127.0.0.1:3000/task_complete', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            task_id: id,
          })
          }).then(response => response.json())
      .then(body => this.setState({todos: body, newTodo: ''}))
    }
  }


  handleNewTodoKeyDown = (event) => {
    if (event.keyCode == ENTER_KEY) {
      event.preventDefault();
      const val = this.state.newTodo.trim();
      if (val) {
        fetch('http://127.0.0.1:3000/tasks', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            description: val,
            completed: false
          })
        }).then(response => response.json())
        .then(body => this.setState({todos: body, newTodo: ''}))
      }
    } 
  }

  destroy = (id) => {
    if (id > 0) {
      fetch("http://127.0.0.1:3000/tasks/" + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Origin': '*'
          }
          }).then(response => response.json())
      .then(body => this.setState({todos: body}))
    }
  }

  update = (id, newDesc) => {
    fetch("http://127.0.0.1:3000/tasks_update/" + id, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        description: newDesc
      })
    }).then(response => response.json())
    .then(body => this.setState({todos: body}))
  }

  setSelection = (selection) => {
    this.setState({selectedOption: selection})
  }

  render () {
    var todoItems = this.showTasks().map( todo => {
      return (
          <Task
            description={todo.description}
            completed={todo.completed}
            key={todo.id}
            id={todo.id}
            onToggle={this.toggle}
            onDestroy={this.destroy}
            updateTask={this.update}
            />
          )
    });

    if (this.state.todos.length) {
      var mainSection = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
          />
          <ul className="todo-list">
            {todoItems}
          </ul>
        </section>
      )

      var footer =  (
          <TodoFooter
            count={this.activeTasks().length}
            completedCount={this.completedTasks().length}
            selected={this.setSelection}
            selection={this.state.selectedOption}
          />
      )
    }


    return (
      <div>
      <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={this.state.newTodo}
          onChange={this.handleChange}
          onKeyDown={this.handleNewTodoKeyDown}
          autoFocus={true}
        />
      </header>
      {mainSection}
      {footer}
      </section>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));
