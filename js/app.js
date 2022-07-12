
    var filters = {
        all: function (todos) {
            return todos;
        },
        completed: function (todos) {
            return todos.filter(function (todo) {
                return todo.completed;
            })
        },
        active: function (todos) {
            return todos.filter(function (todo) {
                return !todo.completed;
            })
        }
    };

    var todoStorage = {
        getTodo: function() {
            var todos = JSON.parse(localStorage.getItem('todos') || '[]');
            return todos 
            ;
        },
        setTodo: function(todos) {
            localStorage.setItem('todos', JSON.stringify(todos));
        },
        getVisibility: function() {
            return localStorage.getItem('visibility') ?? 'all'
        },
        setVisibility: function(visibility) {
            localStorage.setItem('visibility', visibility);
        }
    }

    new Vue({
        el: '.todoapp',
        data: {
            todos: todoStorage.getTodo(),
            newTodo: '',
            visibility: todoStorage.getVisibility(),
            editId: '',
            oldTitle: ''
        },
        'computed': {
            todoList: function () {
                return filters[this.visibility](this.todos);
            },
            remainingTodos: function () {
                return filters.active(this.todos).length;
            },
            allDone: {
                get: function () {
                    return this.remainingTodos === 0;
                },
                set: function (value) {
                    this.todos.forEach(function (todo) {
                        todo.completed = value;
                });
                }
            }
        },
        methods: {
            deleteToDo: function (index) {
                this.todos.splice(index, 1);
            },
            addToDo: function () {
                if (!this.newTodo) {
                    return;
                }
                var todoObj = {
                    'title': this.newTodo,
                    'completed': false,
                }
                this.todos.push(todoObj);
                this.newTodo = '';
            },
            clearCompleted: function () {
                this.todos = filters.active(this.todos);
            },
            editTodo: function(todo, index) {
                this.editId = index;
                this.oldTitle = todo.title;
                
            },
            cancelEditing: function(index) {
                this.todos[index].title = this.oldTitle;
                this.oldTitle = '';
                this.editId = '';
            },
            saveEdit: function(todo, index) {
                if(!todo.title) {
                    this.deleteToDo(index);
                }
                this.editId = '';
            }
        },
        watch: {
            todos: {
                // deep watch
                handler: function(todos) { 
                    todoStorage.setTodo(todos);
                },
                deep: true
            },
            visibility: function(visibility) {
                todoStorage.setVisibility(visibility);
            }

        }
    });
