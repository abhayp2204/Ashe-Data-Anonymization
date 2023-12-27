import React, { useEffect, useState } from "react"
import axios from "axios"
import { useFile } from './FileContext'
import {
    Button,
    FormControl,
    Slider,
    Typography
} from "@mui/material"
import { Link } from "react-router-dom"
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import { Check, Close } from "@mui/icons-material"
import SideBar from "./Navbar"
import Papa from 'papaparse'
import Checkbox from "@mui/material/Checkbox"
import './style.css'



const Source = () => {
    const { file, setFileData, setParsedCSVData, cols, setColsData } = useFile()
    const [fileContent, setFileContent] = useState("")
    const [parsedCSV, setParsedCSV] = useState(null)
    const [rows, setRows] = React.useState([]); // rows of the dataset
    const [columns, setColumns] = React.useState([]);
    function isFloat(x) {
        return !isNaN(x) && isFinite(x) && Number.isInteger(x) === false && x.toString().includes('.');
    }


    const handleFileInputChange = (event) => {
        const file = event.target.files[0]
        setFileData(file)
        const formData = new FormData();
        formData.append("file", file);

        axios.post('http://localhost:5000/dataset', formData)
            .then(response => {
                console.log("File uploaded successfully:", response.data.filename);

                // Save the file name and content in local storage and state
                localStorage.setItem("uploadedFile", response.data.filename);
                setFileContent(response.data.content);

                // Parse the file content using Papa
                Papa.parse(response.data.content, {
                    complete: function (results) {
                        setParsedCSV((prevCSV) => {
                            if (prevCSV !== results) {
                                return results;
                            }
                            return prevCSV;
                        });

                        setParsedCSVData((prevData) => {
                            if (prevData !== results) {
                                return results;
                            }
                            return prevData;
                        });

                        const x = [];
                        for (let i = 1; i < results.data[0].length; i++) {
                            const columnValues = results.data.map(row => row[i]).splice(1);
                            const firstNonNullValue = columnValues.find(value => value !== null && value !== '');
                            // console.log(firstNonNullValue)
                            x.push(firstNonNullValue);
                        }


                        let headers = results.data[0]
                        const newColState = headers.slice(1).map((column, index) => {
                            return {
                                enabled: isFloat(x[index]),
                                checked: false,
                                epsilon: 50,
                                name: column,
                            };
                        });
                        setColsData(newColState);

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
                        console.error('Error parsing CSV:', error.message);
                    }
                });
            })
            .catch(error => {
                console.error('Error uploading file:', error.message);
            });
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
                    Source - Upload a CSV File
                </Typography>

                <FormControl fullWidth>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileInputChange}
                        style={{ marginBottom: '16px' }}
                    />
                </FormControl>


                <Link
                    to="/configure"
                    className="linkstyle pop"
                    variant="contained"
                    sx={{ mr: 1 }}
                >
                    Configure
                </Link>

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

export default Source;
