# Client app

The client app is implemented with ReactJS and uses `axios` to send HTTP requests to the server app.

[alt text](https://github.com/raoufchebri/getting-started/blob/master/.img/todo-react-demo.gif?raw=true)

## Getting started

Install the project dependencines using the following command:
`npm install`

Run the application using `npm start`.

The `starter` project doesn't require a backend. You can add, update and delete items, however they are not saved and will disappear when you refresh the browser.

If you want to use the `end` project, you will first need to [implement the backend](../server/nodejs/README.md).

## Using the starter project

Install `axios` using the following command:
`npm i axios `

In the components/TodoList.js file, import axios then locate the onCreateItem function and add the following code inside the useCallback hook:

### Create

```
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

const TodoList = () => {
   const [items, setItems] = useState([]);

   const onItemCreate = useCallback(
       (newItem) => {
           axios.post(`${BASE_URL}/items`, newItem).then((res) => {
               setItems([...items, { ...newItem, id: res.itemId }]);
           });
       },
       [items]
   );
//...

```

### Read

In the TodoList.js component, add the following code:

```
import React, { useState, useCallback, useEffect } from 'react';
// ...
const TodoList = () => {
   // ...
   useEffect(() => {
       axios.get(BASE_URL).then((res) => setItems(res.data));
   }, []);

```

### Update

In the client application, in The TodoList.js component, locate the onItemUpdate function and replace it with the following code:

```
const onItemUpdate = useCallback(
       (item) => {
           axios
               .put(`${BASE_URL}/${item.id}`, { completed: item.completed })
               .then(() => {
                   const index = items.findIndex((i) => i.id === item.id);
                   setItems([
                       ...items.slice(0, index),
                       item,
                       ...items.slice(index + 1),
                   ]);
               });
       },
       [items]
   );

```

### Delete

In the TodoList component in the client project, locate the onItemDelete function and replace it with the following:

```
const onItemDelete = useCallback(
       (item) => {
           axios.delete(`${BASE_URL}/${item.id}`).then(() => {
               const index = items.findIndex((i) => i.id === item.id);
               setItems([...items.slice(0, index), ...items.slice(index + 1)]);
           });
       },
       [items]
   );

```
