import { Check, Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  Slider,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SideBar from "./Navbar";



const ConfigPage = () => {
  var dict_configs = {} // contains the privacy parameters section of the config dict to be sent to the backend
  const [selectedConfig, setSelectedConfig] = useState("");
  let [selectedModel, setSelectedModels] = useState("kAnonymity"); // default model
  const [suppressionRate, setSuppressionRate] = useState(50); // default suppression rate
  const [value, setValue] = React.useState(0); // default value for k
  const [anonColor, setAnonColor] = useState("error"); // default color for anonymize button
  useEffect(() => {
    // If data from the requirements is present in local storage then set the color of the anonymize button to green
    if (localStorage.getItem("Hdata") != null) {
      setAnonColor("success")
    }
    else {
      setAnonColor("error")
    }
  }, [])


  const handleConfigChange = (event) => {
    setSelectedConfig(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModels(event.target.value);
  };

  const handleSuppressionRateChange = (event, value) => {
    setSuppressionRate(value);
  };

  const handleAnonymizeClick = () => {
    // Handle anonymize button click

    dict_configs["model"] = "KANONYMITY" // Currently ARX only supports kAnonymity
    let suppressionFrac = suppressionRate / 100.0 // convert suppression rate to fraction
    dict_configs["rate"] = suppressionFrac.toString() // add suppression rate to config dict
    dict_configs["k"] = value.toString() // add k to config dict

    localStorage.setItem("config", JSON.stringify(dict_configs)); // store config dict in local storage

    // check if localstorage has a heirarchy dict
    // if not, exit

    // if yes, then send the heirarchy dict and config dict to the backend
    // backend will return the anonymized data

    if (localStorage.getItem("Hdata") == null) {
      alert("Please upload hierarchy files") // if no hierarchy files are uploaded, then return
      return
    }

    // prep the final dict to be sent to the backend
    let finalDict = {}
    finalDict["privacy_config"] = dict_configs
    finalDict["file_name"] = "config.xml"
    finalDict["attributes"] = []
    let data = JSON.parse(localStorage.getItem("Hdata"))
    for (let i = 0; i < data.length; i++) {
      let attr = {}
      attr["attribute_name"] = data[i]["attribute"]

      attr["attributeType"] = data[i]["type"]
      attr["DataType"] = data[i]["dataTypes"]
      finalDict["attributes"].push(attr)
    }

    console.log(finalDict)

    // send the final dict to the backend
    axios.post('http://localhost/api/anon/uploadConfig', finalDict)
      .then(response => {
        console.log("File uploaded successfully")
        console.log(response.data);
        // send the name of the file to the backend for anonymization
        axios.post('http://localhost/api/anon/anonymize', { "data": localStorage.getItem("name") })
          .then(response2 => {
            console.log("Data sent for anonymization")
            console.log(response2.data);
          }
          )
          .catch(error => {
            console.log(error);
          }
          );
      }
      )
      .catch(error => {
        console.log(error);
      }
      );



  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
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
        <Typography variant="h6" component="h2" gutterBottom>
          Configuration
        </Typography>


        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Select Models (Currently ARX supports only K-Anonymity. Others can be seamlessly added once ARX supports it):</Typography>

          <RadioGroup value={selectedModel} onChange={handleModelChange}>
            <FormControlLabel
              value="kAnonymity"
              control={<Radio />}
              label="K-Anonymity"
            />
            <FormControlLabel
              value="lDiversity"
              control={<Radio />}
              label="L-Diversity"
              disabled
            />
            <FormControlLabel
              value="tCloseness"
              control={<Radio />}
              label="T-Closeness"
              disabled
            />
          </RadioGroup>
        </FormControl>
        <Divider style={{ color: 'white', backgroundColor: 'white', visibility: "hidden" }} />
        <Typography variant="body1" gutterBottom>
          Suppression Rate: {suppressionRate}%
        </Typography>
        <Slider
          value={suppressionRate}
          onChange={handleSuppressionRateChange}
          aria-labelledby="suppression-rate-slider"
          min={0}
          max={100}
          step={1}
        />

        <TextField

          id="outlined-number"
          label={(selectedModel == "kAnonymity" ? "K" : selectedModel == "lDiversity" ? "L" : "T") + "-value"}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={value}
          onChange={handleValueChange}
          sx={{ mb: 2 }}
        />



        <Divider style={{ color: 'white', backgroundColor: 'white', visibility: "hidden" }} />


        <Button
          variant="contained"
          startIcon={<Check />}
          sx={{ mr: 1 }}
          onClick={handleAnonymizeClick}
          color={anonColor}
        >
          Anonymize
        </Button>

        <Button
          variant="contained"
          startIcon={<Close />}
          onClick={() => { window.location.href = "/source" }}

        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigPage;
