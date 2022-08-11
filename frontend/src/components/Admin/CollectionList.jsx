import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import axios from 'axios';

function CollectionList() {
    const [collectionList, setCollectionList] = useState([]);

    useEffect(() => {
        getCollectionList();
    }, []);

    function getCollectionList() {
        console.log('getCollectionList');
        axios
            .get('/api/admin/collection/')
            .then((res) => {
                setCollectionList(res.data);
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
                        <TableCell>Collection Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collectionList.map((collectionName) => (
                        <TableRow key={collectionName}>
                            <TableCell>
                                <Button
                                    component={RouterLink}
                                    to={`/admin/collection/${collectionName}`}
                                >
                                    {collectionName}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CollectionList;
