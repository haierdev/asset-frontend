import React, { Component } from 'react'

// import axios from 'axios'

import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';

function editLink() {
    return (
        <div className="btn-group dropstart">

            <button className="btn dropdown-toggle p-0" type="button" id="filterDashboard" data-bs-toggle="dropdown" aria-expanded="false">
                <i className='bi bi-three-dots-vertical fs-3'></i>
            </button>
            <ul className="dropdown-menu dropstart-custom-table w-auto" aria-labelledby="filterDashboard">
                <li className='w-100 py-2'>
                    <div className="form-check text-end me-3">
                        <label className="form-check-label fs-5">
                            Edit 
                            <i className='bi bi-pencil-fill mx-2'></i>
                        </label>
                    </div>
                </li>
                <li className='w-100 py-2'>
                    <div className="form-check text-end me-3">
                        <label className="form-check-label fs-5">
                            Delete 
                            <i className='bi bi-trash-fill mx-2'></i>
                        </label>
                    </div>
                </li>
            </ul>
        </div>
    )
}

class Table extends Component {

    state = {
        rows: []
    }

    // componentDidMount() {
    //     axios.get(`https://jsonplaceholder.typicode.com/users`)
    //         .then(res => {
    //             const rows = res.data;
    //             this.setState({ rows });

    //             console.log(rows)
    //         })
    // }

    render() {
        return (
            < div className='card shadow-none border-1' >
                <div className='card-body'>
                    {/* Table */}
                    <div style={{ height: 400, width: '100%', id: 1 }}>
                        <Box sx={{
                            height: 400,
                            width: '100%'
                        }}>
                            <DataGrid
                                sx={{
                                    boxShadow: 0,
                                    border: 0,
                                }}
                                disableColumnMenu
                                checkboxSelection
                                columns={columns}
                                pageSize={5}
                                rows={rows}
                                rowsPerPageOptions={[5]}
                                components={{
                                    LoadingOverlay: LinearProgress,
                                    Toolbar: GridToolbar
                                }}
                                componentsProps={{
                                    toolbar: {
                                        quickFilterProps: { debounceMs: 500 },
                                        showQuickFilter: true,
                                    },
                                }}
                            />
                        </Box>
                    </div >
                </div>
            </div>
        )
    }
}

const columns = [
    {
        field: 'id',
        headerName: 'No',
        width: 50
    },
    {
        field: 'condition',
        headerName: 'Condition',
        width: 480,
    },
    {
        field: 'uid',
        headerName: '',
        width: 50,
        renderCell: editLink
    }
];

const rows = [
    { id: 1, condition: 'Baik/Layak', uid: 1 },
    { id: 2, condition: 'Rusak', uid: 2 },
    { id: 3, condition: 'Write Off SAP', uid: 3 },
    { id: 4, condition: 'Disposal', uid: 4 },
    { id: 5, condition: 'Not Identify/Lost', uid: 5 }
];

export default Table