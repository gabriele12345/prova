//const apiEndpoint = 'http://localhost:8000/api/todos';
const apiEndpoint = 'https://nigithoracademy-rest-api-mock.herokuapp.com/api/todos';

const authHeader = {'Authorization': 'Bearer token123'};

const controller = {
    allTodos: [],
    filters: {
        done: true,
        todo: true
    },

    addTodoToList: function (todoInfos) {
        this.allTodos.push(todoInfos);
    },

    removeTodoFromList: function (todoId) {
        for (let i = 0; i < this.allTodos.length; i++) {
            if (this.allTodos[i].id === todoId) {
                this.allTodos.splice(i, 1);
            }
        }
    },

    getTodoItem: function (id) {
        for (let i = 0; i < this.allTodos.length; i++) {
            if (this.allTodos[i].id === id) {
                return this.allTodos[i];
            }
        }
    },

    /**
     * Salva una nuova voce todo con le informazioni contenute nel parametro todoInfo.
     * Se il salvataggio termina con successo, viene richiamata la funzione 'callback' passata come parametro.
     * La funzione callback viene richiamata con parametro l'id della nuova todo salvata.
     * @param todoItem è un oggetto contenente i valori del nuovo todo
     * @param callback
     */
    saveTodo: function (todoItem, callback) {
        const _this = this;
        $.post({
            url: apiEndpoint,
            headers: authHeader,
            data: todoItem,
            success: function (result) {
                todoItem.id = result.id;
                _this.addTodoToList(todoItem);
                callback(todoItem);
            }
        });
    },

    checkTodo: function (todoId, done, callback) {
        const todoItem = this.getTodoItem(todoId);
        todoItem.done = done;
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: apiEndpoint,
            data: todoItem,
            headers: authHeader,
            success: function (result) {
                callback(result);
            }
        });
    },

    deleteTodo: function (todoId, callback) {
        const _this = this;
        $.ajax({
            type: 'DELETE',
            dataType: 'json',
            url: apiEndpoint,
            data: {id: todoId},
            headers: authHeader,
            success: function (result) {
                _this.removeTodoFromList(todoId);
                callback(result);
            }
        });
    },

    getTodos: function (callback) {
        const _this = this;
        $.get({
            url: apiEndpoint,
            headers: authHeader,
            success: function (result) {
                _this.allTodos = result;
                callback(result);
            }
        });
    },

    getFilterTodos: function () {
        const filteredTodos = [];
        for (let i = 0; i < this.allTodos.length; i++) {
            if ((this.filters.done && this.allTodos[i].done) || (this.filters.todo && !this.allTodos[i].done)) {
                filteredTodos.push(this.allTodos[i]);
            }
        }
        return filteredTodos;
    }
};
