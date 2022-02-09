import React, { useState, useCallback } from 'react';
import AddItemForm from './AddItemForm';
import Item from './Item';

const TodoList = () => {
    const [items, setItems] = useState([]);

    const onItemCreate = useCallback(
        (newItem) => {
            setItems([...items, { ...newItem, id: items.length }]);
        },
        [items]
    );

    const onItemUpdate = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            console.log(index);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items]
    );

    const onItemDelete = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
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
