import React, { useState, useCallback, useEffect } from 'react';
import AddItemForm from './AddItemForm';
import Item from './Item';
import axios from 'axios';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}/api/items`;

const TodoList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get(BASE_URL).then((res) => setItems(res.data));
    }, []);

    const onItemCreate = useCallback(
        (newItem) => {
            axios.post(BASE_URL, newItem).then((res) => {
                setItems([...items, { ...newItem, id: res.data.itemId }]);
            });
        },
        [items]
    );

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

    const onItemDelete = useCallback(
        (item) => {
            axios.delete(`${BASE_URL}/${item.id}`).then(() => {
                const index = items.findIndex((i) => i.id === item.id);
                setItems([...items.slice(0, index), ...items.slice(index + 1)]);
            });
        },
        [items]
    );

    return (
        <>
            <AddItemForm onItemCreate={onItemCreate} />
            {items && items.length === 0 && (
                <p className='text-center'>
                    You have no todo items yet! Add one above!
                </p>
            )}
            {items &&
                items.map((item) => (
                    <Item
                        item={item}
                        key={item.id}
                        onItemUpdate={onItemUpdate}
                        onItemDelete={onItemDelete}
                    />
                ))}
        </>
    );
};

export default TodoList;
