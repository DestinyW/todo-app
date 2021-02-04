const form = document.querySelector('#new-todo-form');
const todoInput = document.querySelector('#todo-input');
const list = document.querySelector('#list');
const template = document.querySelector('#list-item-template');
const listWrapper = document.querySelector('.todo-list-wrapper');
const todoFilterBtns = document.querySelectorAll('.todo-filters > button');
const LOCAL_STORAGE_PREFIX = 'TODO_LIST-APP';
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();
todos.forEach((todo) => {
    add(todo);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;
    if (inputValue === '') return;

    const newTodo = {
        value: inputValue,
        isComplete: false,
        id: new Date().valueOf().toString(),
    };

    todos.push(newTodo);
    add(newTodo);
    saveTodos();

    todoInput.value = '';
});

listWrapper.addEventListener('click', (e) => {
    if (e.target.matches('[data-delete-btn]')) {
        _delete(e.target);
    } else if (e.target.matches('[data-clear-btn]')) {
        const checkboxes = document.querySelectorAll('[data-checkbox]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) _delete(checkbox);
        });
    } else if (e.target.matches('[data-checkbox]')) {
        const listItem = e.target.closest('.list-item');
        const todo = todos.find((t) => t.id === listItem.dataset.id);
        todo.isComplete = e.target.checked;
        markAsComplete(
            todo.isComplete,
            listItem.querySelector('[data-list-item-text]')
        );
        saveTodos();
    }
    return;
});

// filterable list feature
todoFilterBtns.forEach((btn) => {
    let items = [];
    btn.addEventListener('click', (e) => {
        todoFilterBtns.forEach((btn) => {
            btn.classList.remove('active');
        });

        if (e.target.matches('[data-filter-all]')) {
            e.target.classList.add('active');
            list.innerHTML = '';
            todos.forEach((todo) => {
                add(todo);
            });
        } else if (e.target.matches('[data-filter-active]')) {
            filterSelection(
                todos.filter((t) => !t.isComplete),
                e.target
            );
        } else if (e.target.matches('[data-filter-completed]')) {
            filterSelection(
                todos.filter((t) => t.isComplete),
                e.target
            );
        }
        return;
    });
});
// filter given selection of todos handler
function filterSelection(array, btn) {
    if (array.length <= 0) return;
    btn.classList.add('active');
    list.innerHTML = '';
    array.forEach((todo) => {
        add(todo);
    });
}

// drop and drag feature
new Sortable(list, {
    animation: 350,
});

//add todos
function add(todo) {
    const tmpl = template.content.cloneNode(true);
    const listItem = tmpl.children[0];
    const textElement = tmpl.querySelector('[data-list-item-text]');
    const checkbox = tmpl.querySelector('[data-checkbox]');
    listItem.dataset.id = todo.id;
    textElement.innerText = todo.value;
    checkbox.checked = todo.isComplete;
    markAsComplete(checkbox.checked, textElement);
    list.append(listItem);
    updateCounter();
}

//delete todos
function _delete(element) {
    const listItem = element.closest('.list-item');
    const todoId = listItem.dataset.id;
    listItem.remove();
    todos = todos.filter((t) => t.id !== todoId);
    updateCounter();
    saveTodos();
}

// mark todo as complete
function markAsComplete(todoCompleted, textElement) {
    if (todoCompleted) {
        textElement.classList.add('is-complete');
    } else {
        textElement.classList.remove('is-complete');
    }
}

// update element to show total number of todos
function updateCounter() {
    const totalTodosEl = document.querySelector('[data-total-todos]');
    totalTodosEl.innerText = `${todos.length} items left`;
}

// set up local storage
function loadTodos() {
    const todosString = localStorage.getItem(TODOS_STORAGE_KEY);
    return JSON.parse(todosString) || [];
}
function saveTodos() {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}
