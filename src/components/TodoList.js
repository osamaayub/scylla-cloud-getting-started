import React, { useState, useCallback, useEffect } from 'react';
import AddItemForm from './AddItemForm';
import Item from './Item';
import axios from 'axios';

const PORT = 4242;
const BASE_URL = `http://localhost:${PORT}`;

const TodoList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/get-all-items`)
            .then((res) => setItems(res.data));
    }, []);

    const onItemCreate = useCallback(
        (newItem) => {
            setItems([...items, { ...newItem, id: items.length }]);
            axios.post(`${BASE_URL}/create-item`, newItem);
        },
        [items]
    );

    const onItemUpdate = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
            axios.put(`${BASE_URL}/update-item/${item.id}`, {
                completed: item.completed,
            });
        },
        [items]
    );

    const onItemDelete = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
            axios.delete(`${BASE_URL}/delete-item/${item.id}`);
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
