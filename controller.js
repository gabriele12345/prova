const apiEndpoint =
    // 'http://localhost:8000/api/todos';
    'https://nigithoracademy-rest-api-mock.herokuapp.com/api/todos';
const authHeader = {'Authorization': 'Bearer token123'};

const controller = {

    /**
     * Salva una nuova voce todo con le informazioni contenute nel parametro todoInfo.
     * Se il salvataggio termina con successo, viene richiamata la funzione 'callback' passata come parametro.
     * La funzione callback viene richiamata con parametro l'id della nuova todo salvata.
     * @param todoInfo è un oggetto contenente i valori del nuovo todo
     * @param callback
     */
    saveTodo: function (todoInfo, callback) {
        $.post({
            url: apiEndpoint,
            headers: authHeader,
            data: todoInfo,
            success: function (result) {
                callback(result);
            }
        });
    },

    checkTodo: function (todoInfo, callback) {
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: apiEndpoint,
            data: {done: todoInfo.done, id: todoInfo.id},
            headers: authHeader,
            success: function (result) {
                callback(result);
            }
        });
    },

    deleteTodo: function (todoInfo, callback) {
        $.ajax({
            type: 'DELETE',
            dataType: 'json',
            url: apiEndpoint + '/' + todoInfo.id,
            headers: authHeader,
            success: function (result) {
                callback(result);
            }
        });
    },

    getTodos: function (callback) {
        $.get({
            url: apiEndpoint,
            headers: authHeader,
            success: function (result) {
                callback(result);
            }
        });
    }

};
