import React from 'react';
import {render} from 'react-dom';
import Task from './task';
import 'whatwg-fetch';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class App extends React.Component {
  constructor() {
    super()
    this.state = {todos: [], newTodo: '', toggleAll: false}
  }

  componentDidMount() {
    fetch('http://127.0.0.1:3000/tasks.json')
      .then(response => response.json())
      .then(body => this.setState({todos: body}))
  }

  handleChange = (event) => {
    this.setState({newTodo: event.target.value});
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

  render () {
    var todoItems = this.state.todos.map( todo => {
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

      </section>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));
