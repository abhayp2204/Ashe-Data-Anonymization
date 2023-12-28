import React, { useEffect, useState } from "react"
import { useFile } from './FileContext'

import axios from "axios"
import {
    Button,
    Typography
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import { Check, Close } from "@mui/icons-material"
import SideBar from "./Navbar"
import Papa from 'papaparse'



const DP = () => {
    const [anonColor] = useState("error")
    const [rows, setRows] = React.useState([]); // rows of the dataset
    const [columns, setColumns] = React.useState([]);

    const { file, cols } = useFile()



    const handleAnonymize = () => {
        const formData = new FormData();
        formData.append("file", file);

        // Collect epsilon values from the col array
        const epsilonValues = cols.map(column => column.epsilon)
        formData.append("epsilonValues", JSON.stringify(epsilonValues))

        // Collect checked values from the col array
        const checkedValues = cols.map(column => column.checked)
        formData.append("checkedValues", JSON.stringify(checkedValues))

        axios.post('http://localhost:5000/anonymize', formData)
            .then(response => {
                console.log("[ANONYMIZER] Anonymization successful:", response);

                // Parse the file content using Papa
                Papa.parse(response.data.content_anon, {
                    complete: function (results) {
                        let headers = results.data[0]
                        let locCol = []
                        for (let i = 0; i < headers.length; i++) {
                            locCol.push({
                                field: headers[i],
                                headerName: headers[i],
                                width: 130,
                            })
                        }
                        setColumns(locCol)

                        let locRow = []
                        for (let i = 1; i < results.data.length; i++) {
                            let row = {}
                            for (let j = 0; j < headers.length; j++) {
                                row[headers[j]] = results.data[i][j]
                            }
                            row['id'] = i
                            locRow.push(row)
                        }
                        setRows(locRow)
                    },
                    error: function (error) {
                        console.error('Parse error: Error parsing CSV:', error.message);
                    }
                })
            })
            .catch(error => {
                console.error('Axios error: Error during anonymization:', error.message);
            })
    };



    return (
        <Box sx={{ display: "flex" }}>
            <SideBar />
            <Box
                component="span"
                sx={{
                    p: 10,
                    border: "1px dashed grey",
                    margin: "5% auto",
                    width: "70%",
                    height: "100%",
                }}
            >
                <Typography variant="h2" component="h2" gutterBottom>
                    Differential Privacy
                </Typography>

                


                <Button
                    className="mt"
                    variant="contained"
                    startIcon={<Check />}
                    sx={{ mr: 1 }}
                    onClick={() => handleAnonymize(file)}
                    color={anonColor}
                    >
                    Anonymize
                </Button>

                <Button
                    className="mt"
                    variant="contained"
                    startIcon={<Close />}
                    onClick={() => { window.location.href = "/source" }}
                >
                    Cancel
                </Button>
                <Divider style={{
                    backgroundColor: '#023047',
                    marginTop: '30px',
                    marginBottom: '10px',
                    height: '4px',
                    opacity: '0.3',
                }} />

                <div margin="10px 5px 2px 5px">
                    <div style={{ height: 30, width: "100%", margin: "0px" }}></div>
                </div>
                <div style={{ height: 600, width: "100%", marginTop: "50px" }}>
                    <DataGrid rows={rows} columns={columns} pageSize={5} />
                </div>
            </Box>
        </Box>
    );
};

export default DP
