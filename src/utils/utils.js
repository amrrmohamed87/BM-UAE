

export const handleCheckboxChange = (event, data, setSelectedRowsProps) => {
    const isChecked = event.target.checked;

    setSelectedRowsProps((prevRows) => {
        if (isChecked) {
            return [...prevRows, data];
        } else {
            return prevRows.filter((row) => row !== data)
        }
    })
}

export const handleRowsPerPage = (event, setRowsPerPageProps, setCurrentPageProps) => {
    setRowsPerPageProps(event.target.value);
    setCurrentPageProps(1);
}