import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';

function Item({ item, onItemUpdate, onItemDelete }) {
    const toggleCompletion = () => {
        onItemUpdate({
            id: item.id,
            name: item.name,
            completed: !item.completed,
        });
    };

    const deleteItem = () => {
        onItemDelete(item);
    };

    return (
        <Row>
            <Col xs={1} className='text-center'>
                <Form>
                    <Form.Check type={'checkbox'} onClick={toggleCompletion} />
                </Form>
            </Col>
            <Col
                xs={10}
                className={`name ${item.completed ? 'completed' : ''}`}
            >
                {item.name}
            </Col>
            <Col xs={1}>
                <Button variant='link' onClick={deleteItem}>
                    <i className='fa fa-remove text-danger' />
                </Button>
            </Col>
        </Row>
    );
}

export default Item;
