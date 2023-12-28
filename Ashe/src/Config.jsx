import { useEffect, useState } from "react"
import { useFile } from './FileContext'


import {
    Button,
    FormControl,
    Slider,
    Typography
} from "@mui/material"

import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import { Close } from "@mui/icons-material"
import SideBar from "./Navbar"
import Checkbox from "@mui/material/Checkbox"

import { Link } from "react-router-dom"



const Config = () => {
    let [selectedModel, setSelectedModels] = useState("kAnonymity")
    const { parsedCSV, cols, setColsData } = useFile()



    const handleModelChange = (event) => {
        setSelectedModels(event.target.value)
    }

    const handleColumnToggle = (columnIndex) => {
        setColsData((prevCol) => [
            ...prevCol.slice(0, columnIndex),
            { ...prevCol[columnIndex], checked: !prevCol[columnIndex].checked },
            ...prevCol.slice(columnIndex + 1),
        ])
        console.log('[CONFIG] Column toggled')
    }

    const handleEpsilonChange = (columnIndex, value) => {
        setColsData((prevCol) => [
            ...prevCol.slice(0, columnIndex),
            { ...prevCol[columnIndex], epsilon: value },
            ...prevCol.slice(columnIndex + 1),
        ])
        console.log('[CONFIG] Epsilon value set')
    }



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
                    Configure Epsilon Values
                </Typography>


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

                        {cols.map((colInfo, columnIndex) => (
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





                <div className="button-container">

                    <Link
                        to="/anonymizer"
                        className="linkstyle pop"
                        variant="contained"
                        sx={{ mr: 1 }}
                    >
                        Anonymize
                    </Link>

                    <Button
                        className="mt"
                        variant="contained"
                        startIcon={<Close />}
                        onClick={() => { window.location.href = "/source" }}
                    >
                        Cancel
                    </Button>
                </div>
            </Box>
        </Box>
    )
}

export default Config
