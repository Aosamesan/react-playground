import React from 'react';
import './App.css';
import { Button, Container } from '@mui/material';
import useTestDataInputComponent, { TestData } from './components';

const initialData: TestData = {
  title: "initialTitle",
  someNumber: 0,
  includeList: true,
  someList: [
    {
      someString: "initialString",
      someNumber: 0,
      someBoolean: false,
    }
  ]
}

function App() {
  const [data, setData] = React.useState(initialData)
  const [InputComponent, getTestData] = useTestDataInputComponent(data)

  function handleApply() {
    const data = getTestData()
    setData(data)
  }

  return (
    <Container maxWidth="lg">
      <InputComponent updateValue={setData} />
      <Button color="success" fullWidth variant="contained" onClick={handleApply}>Apply</Button>
      <pre>
        {JSON.stringify(data, null, 4)}
      </pre>
    </Container>
  );
}

export default App;
