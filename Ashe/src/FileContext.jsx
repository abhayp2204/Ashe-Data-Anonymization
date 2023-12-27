import { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [file, setFile] = useState(null)
    const [parsedCSV, setParsedCSV] = useState(null)
    const initialColState = parsedCSV ? parsedCSV.data[0].map((name, index) => ({
        enabled: true,  // You may adjust this based on your logic
        checked: false,
        epsilon: 0,
        name: name,
    })) : [];
    const [cols, setCols] = useState(initialColState);

    const setFileData = (newFile) => {
        setFile(newFile);
    }

    const setParsedCSVData = (newParsedCSV) => {
        setParsedCSV(newParsedCSV);
    }

    const setColsData = (newCols) => {
        setCols(newCols);
    }


    return (
        <FileContext.Provider value={{ file, setFileData, parsedCSV, setParsedCSVData, cols, setColsData }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFile = () => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFile must be used within a FileProvider');
    }
    return context;
}