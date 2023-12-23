import React, { useEffect, useState } from "react"
import axios from "axios"
import {
    Button,
    FormControl,
    Slider,
    Typography
} from "@mui/material"
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



const DP = () => {
    let [selectedModel, setSelectedModels] = useState("kAnonymity")
    const [anonColor, setAnonColor] = useState("error")
    const [file, setFile] = useState(null)
    const [fileContent, setFileContent] = useState("")
    const [parsedCSV, setParsedCSV] = useState(null)
    const [fileContentAnon, setFileContentAnon] = useState("")
    const [parsedCSVAnon, setParsedCSVAnon] = useState(null)
    const [rows, setRows] = React.useState([]); // rows of the dataset
    const [columns, setColumns] = React.useState([]);

    const initialColState = parsedCSV ? parsedCSV.data[0].map((name, index) => ({
        enabled: true,  // You may adjust this based on your logic
        checked: false,
        epsilon: 0,
        name: name,
    })) : [];
    const [col, setCol] = useState(initialColState);



    useEffect(() => {
        // If data from the requirements is present in local storage then set the color of the anonymize button to green
        if (localStorage.getItem("Hdata") !== null) {
            setAnonColor("success");
        } else {
            setAnonColor("error");
        }
    }, []);


    const handleModelChange = (event) => {
        setSelectedModels(event.target.value);
    };

    const handleColumnToggle = (columnIndex) => {
        setCol((prevCol) => [
            ...prevCol.slice(0, columnIndex),
            { ...prevCol[columnIndex], checked: !prevCol[columnIndex].checked },
            ...prevCol.slice(columnIndex + 1),
        ]);
    };

    const handleEpsilonChange = (columnIndex, value) => {
        setCol((prevCol) => [
            ...prevCol.slice(0, columnIndex),
            { ...prevCol[columnIndex], epsilon: value },
            ...prevCol.slice(columnIndex + 1),
        ]);
    };

    function isFloat(x) {
        return !isNaN(x) && isFinite(x) && Number.isInteger(x) === false && x.toString().includes('.');
    }



    const handleAnonymizeClick = () => {
        const formData = new FormData();
        formData.append("file", file);

        // Collect epsilon values from the col array
        const epsilonValues = col.map(column => column.epsilon)
        formData.append("epsilonValues", JSON.stringify(epsilonValues))

        // Collect checked values from the col array
        const checkedValues = col.map(column => column.checked)
        formData.append("checkedValues", JSON.stringify(checkedValues))

        axios.post('http://localhost:5000/anonymize', formData)
            .then(response => {
                console.log("Anonymization successful:", response);
                setFileContentAnon(response.data.content_anon);

                // Parse the file content using Papa
                Papa.parse(response.data.content_anon, {
                    complete: function (results) {
                        setParsedCSVAnon(results);
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
                        console.error('Error parsing CSV:', error.message);
                    }
                });
            })
            .catch(error => {
                console.error('Error during anonymization:', error.message);
            });
    };


    const handleFileInputChange = (event) => {
        const file = event.target.files[0]
        setFile(file)
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
                        setParsedCSV(results);

                        const x = [];

                        for (let i = 1; i < results.data[0].length; i++) {
                            // Extract values for the current column
                            const columnValues = results.data.map(row => row[i]).splice(1);
                            // console.log(columnValues)

                            // Find the first non-null value for the current column
                            const firstNonNullValue = columnValues.find(value => value !== null && value !== '');
                            console.log(firstNonNullValue)

                            // Add the first non-null value to the 'x' array
                            x.push(firstNonNullValue);
                        }

                        // Now, 'x' contains the first non-null value for each column
                        console.log(x);


                        // Now, 'x' contains the first non-null value for each feature
                        // console.log(x);


                        // Create index-to-column mapping
                        const headers = results.data[0];
                        const newColState = headers.slice(1).map((column, index) => {
                            return {
                                enabled: isFloat(x[index]),
                                checked: false,
                                epsilon: 50,
                                name: column,
                            };
                        });

                        setCol(newColState);
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
                    Differential Privacy
                </Typography>

                <FormControl fullWidth>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileInputChange}
                        style={{ marginBottom: '16px' }}
                    />
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 6 }}>
                    <Typography variant="h5" sx={{ mb: 4 }}>Select preferred Noise Mechanism (Currently PyDP supports only Laplace. Others can be seamlessly added once PyDP supports it):</Typography>

                    <RadioGroup value={selectedModel} onChange={handleModelChange}>
                        <FormControlLabel
                            value="kAnonymity"
                            control={<Radio />}
                            label="Laplace Noise"
                        />
                        <FormControlLabel
                            value="lDiversity"
                            control={<Radio />}
                            label="Exponential Noise"
                            disabled
                        />
                        <FormControlLabel
                            value="tCloseness"
                            control={<Radio />}
                            label="Gaussian Noise"
                            disabled
                        />
                    </RadioGroup>
                </FormControl>

                

                {parsedCSV && (
                    <div>
                        <Divider style={{ color: 'white', backgroundColor: 'white', visibility: "hidden" }} />
                        <Typography variant="h5" sx={{ mb: 2 }}>Select Columns and Set Epsilon:</Typography>

                        {col.map((colInfo, columnIndex) => (
                            <div key={colInfo.name}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={colInfo.checked}
                                            onChange={() => handleColumnToggle(columnIndex)}
                                            disabled={!colInfo.enabled}
                                        />
                                    }
                                    label={colInfo.name}
                                />

                                {colInfo.checked && (
                                    <div style={{ marginLeft: 16 }}>
                                        <Typography variant="body1" gutterBottom>
                                            Epsilon for {colInfo.name}: {colInfo.epsilon}%
                                        </Typography>
                                        <Slider
                                            value={colInfo.epsilon}
                                            onChange={(event, value) => handleEpsilonChange(columnIndex, value)}
                                            aria-labelledby={`${colInfo.name}-epsilon-slider`}
                                            min={0}
                                            max={100}
                                            step={1}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}



                


                <Button
                    className="mt"
                    variant="contained"
                    startIcon={<Check />}
                    sx={{ mr: 1 }}
                    onClick={() => handleAnonymizeClick(file)}
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
                {/* <FileContent fileContentAnon={fileContentAnon} /> */}
            </Box>
        </Box>
    );
};

export default DP;
