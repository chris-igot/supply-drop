/* eslint-disable react-hooks/exhaustive-deps */
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import axios from 'axios';
import DeleteConfirm from '../Forms/DeleteConfirm';
import React, { useState, useEffect } from 'react';

function CollectionTable({ collectionName }) {
    const [collection, setCollection] = useState([]);
    const [head, setHead] = useState([]);

    useEffect(() => {
        getCollection();
    }, []);

    function getCollection() {
        axios
            .get('/api/admin/collection/' + collectionName)
            .then((res) => {
                setCollection(res.data);
                getHead(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getHead(c) {
        if (c.length > 0) {
            setHead(Object.keys(c[0]));
        } else {
            setHead([]);
        }
    }

    function deleteItem(id) {
        axios
            .delete(`/api/admin/collection/${collectionName}/${id}`)
            .then(() => {
                getCollection();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {collection.length > 0 && (
                            <TableCell>Actions</TableCell>
                        )}
                        {head.map((colName) => (
                            <TableCell key={colName}>{colName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collection.map((row, index) => (
                        <TableRow key={index}>
                            {collection.length > 0 && (
                                <TableCell>
                                    <DeleteConfirm
                                        confirmMessage={`Are you sure you want to delete ${row._id} in Collection(${collectionName})`}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            deleteItem(row._id);
                                        }}
                                    />
                                </TableCell>
                            )}
                            {head.map((colName) => (
                                <TableCell key={colName + index}>
                                    {row[colName]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CollectionTable;
