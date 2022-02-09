import React from 'react';
import { Form, InputGroup, Button, FormControl } from 'react-bootstrap';

const AddItemForm = ({ onItemCreate }) => {
    const [newItem, setNewItem] = React.useState('');

    const onItemChange = (e) => {
        setNewItem(e.target.value);
    };

    const createItem = (e) => {
        e.preventDefault();
        onItemCreate({ name: newItem });
        setNewItem('');
    };
    return (
        <Form onSubmit={createItem}>
            <InputGroup className='mb-3'>
                <FormControl
                    value={newItem}
                    onChange={onItemChange}
                    type='text'
                    placeholder='New Item'
                    y
                />
                <Button
                    type='submit'
                    variant='primary'
                    disabled={!newItem.length}
                >
                    Add
                </Button>
            </InputGroup>
        </Form>
    );
};

export default AddItemForm;
