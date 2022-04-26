import React from 'react'
import { InputComponentHook, InputComponentProps } from './types'
import { Button, ButtonGroup, Checkbox, Container, FormControlLabel, FormGroup, FormLabel, Grid, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'

export type TestDataListItem = {
    someString: string,
    someNumber: number,
    someBoolean: boolean,
    someOptional?: string
}

export type TestData = {
    title: string,
    someNumber: number,
    includeList: boolean,
    someList: Array<TestDataListItem>
}

function BranchDom({ show = true, children }: React.PropsWithChildren<{show?: boolean}>) {
    if (show) {
        return <>{children}</>
    }
    return <></>
}

const useTitleInputComponent: InputComponentHook<Pick<TestData, "title">> = (initData) => {
    const titleRef = React.createRef<HTMLTextAreaElement>()

    function getData() {
        if (!titleRef.current || !titleRef.current.value) {
            return initData
        }

        return {
            title: titleRef.current.value
        }
    }

    function Component() {
        return <TextField label="title"
            variant="outlined"
            defaultValue={initData.title}
            inputRef={titleRef}
            margin="normal"
            fullWidth
        />
    }

    return [Component, getData]
}

const useNumberInputComponent: InputComponentHook<Pick<TestData, "someNumber">> = (initData: Pick<TestData, "someNumber">) => {
    const numberRef = React.createRef<HTMLInputElement>()

    function getData(): Pick<TestData, "someNumber"> {
        if (!numberRef.current) {
            return initData
        }
        return {
            someNumber: Number.parseInt(numberRef.current.value)
        }
    }

    function Component() {
        return <TextField label="Some number"
            variant="outlined"
            defaultValue={initData.someNumber}
            inputRef={numberRef}
            type="number"
            margin="normal"
            fullWidth
        />
    }

    return [Component, getData]
}

const useListInputComponent: InputComponentHook<Pick<TestData, "someList">> = (initData: Pick<TestData, "someList">) => {
    const [list, setList] = React.useState(initData.someList)

    function getData(): Pick<TestData, "someList"> {
        return {
            someList: list
        }
    }

    function addListItem(data: TestDataListItem) {
        setList([
            ...list,
            data
        ])
    }

    function editListItem(index: number, data: Partial<TestDataListItem>) {
        setList(list.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    ...data
                }
            }
            return item
        }))
    }

    function deleteListItem(index: number) {
        setList(list.filter((item, idx) => index !== idx))
    }

    function DataRow({ idx, someString, someNumber, someBoolean, someOptional }: TestDataListItem & { idx: number }) {
        const numberRef = React.createRef<HTMLInputElement>()
        const stringRef = React.createRef<HTMLInputElement>()
        const booleanRef = React.createRef<HTMLInputElement>()
        const optionalRef = React.createRef<HTMLInputElement>()

        function handleEdit() {
            if (numberRef.current && stringRef.current && booleanRef.current && optionalRef.current) {
                const someNumber = Number.parseInt(numberRef.current.value)

                editListItem(idx, {
                    someNumber: Number.isNaN(someNumber) ? undefined : someNumber,
                    someString: stringRef.current.value,
                    someBoolean: booleanRef.current.checked,
                    someOptional: optionalRef.current.value
                })
            }
        }

        function handleDelete() {
            deleteListItem(idx)
        }

        return (
            <TableRow>
                <TableCell>
                    <TextField type="number" defaultValue={someNumber} size="small" inputRef={numberRef} />
                </TableCell>
                <TableCell>
                    <TextField defaultValue={someString} size="small" inputRef={stringRef} />
                </TableCell>
                <TableCell align="center">
                    <Checkbox defaultChecked={someBoolean} inputRef={booleanRef} />
                </TableCell>
                <TableCell>
                    <TextField defaultValue={someOptional} size="small" inputRef={optionalRef} />
                </TableCell>
                <TableCell>
                    <ButtonGroup size="small">
                        <Button color="warning" onClick={handleEdit}>Edit</Button>
                        <Button color="error" onClick={handleDelete}>Delete</Button>
                    </ButtonGroup>
                </TableCell>
            </TableRow>
        )
    }

    function AddComponent({ handleAdd }: {handleAdd: (data: TestDataListItem) => void}) {
        const numberRef = React.createRef<HTMLInputElement>()
        const stringRef = React.createRef<HTMLInputElement>()
        const booleanRef = React.createRef<HTMLInputElement>()
        const optionalRef = React.createRef<HTMLInputElement>()

        function handleAddClick() {
            if (numberRef.current && stringRef.current && booleanRef.current && optionalRef.current) {
                handleAdd({
                    someNumber: Number.parseInt(numberRef.current.value),
                    someString: stringRef.current.value,
                    someBoolean: booleanRef.current.checked,
                    someOptional: optionalRef.current.value || undefined
                })
            }
        }
        
        return (
            <Grid container spacing={2} margin={2} alignContent="center">
                <Grid item>
                    <TextField size="small" label="number" type="number" variant="outlined" inputRef={numberRef} />
                </Grid>
                <Grid item>
                    <TextField size="small" label="string" type="text" variant="outlined" inputRef={stringRef} />
                </Grid>
                <Grid item>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Boolean" inputRef={booleanRef}/>
                    </FormGroup>
                </Grid>
                <Grid item>
                    <TextField size="small" label="optional" type="text" variant="outlined" inputRef={optionalRef} />
                </Grid>
                <Grid item>
                    <Button color="primary" variant="contained" onClick={handleAddClick}>Add</Button>
                </Grid>
            </Grid>
        )
    }

    function Component() {
        return (
            <>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Some Number</TableCell>
                                <TableCell>Some String</TableCell>
                                <TableCell>Some Boolean</TableCell>
                                <TableCell>Some Optional</TableCell>
                                <TableCell>Buttons</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                list.map((item, idx) => (
                                    <DataRow {...item} idx={idx} key={idx} />
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddComponent handleAdd={addListItem} />
            </>
        )
    }

    return [Component, getData]
}

const useIncludeListComponent: InputComponentHook<Pick<TestData, "includeList">> = (initData) => {
    const [includeList, setIncludeList] = React.useState(initData.includeList)

    function getData() {
        return {
            includeList
        }
    }

    function Component({ updateValue }: InputComponentProps<Pick<TestData, "includeList">>) {
        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            setIncludeList(e.currentTarget.checked)
            updateValue?.call(updateValue, {
                includeList: e.currentTarget.checked
            })
        }

        return (
            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked={initData.includeList} onChange={handleChange} />} label="Include List" />
            </FormGroup>
        )
    }

    return [Component, getData]
}

const useTestDataInputComponent: InputComponentHook<TestData> = (initialData: TestData) => {
    const [TitleComponent, getTitle] = useTitleInputComponent(initialData)
    const [NumberComponent, getNumber] = useNumberInputComponent(initialData)
    const [ListComponent, getList] = useListInputComponent(initialData)
    const [IncludeListComponent, getIncludeList] = useIncludeListComponent(initialData)

    function getData() {
        const includeList = getIncludeList()
        return {
            ...initialData,
            ...getTitle(),
            ...getNumber(),
            ...includeList,
            someList: includeList.includeList ? getList().someList : []
        }
    }

    function Component({ updateValue }: Partial<InputComponentProps<TestData>>) {
        function updateIncludeList(data: Pick<TestData, "includeList">) {
            updateValue?.call(updateValue, {
                ...initialData,
                ...data
            })
        }

        return (<>
            <TitleComponent />
            <NumberComponent />
            <IncludeListComponent updateValue={updateIncludeList} />
            <BranchDom show={initialData.includeList}>
                <ListComponent />
            </BranchDom>
        </>)
    }

    return [Component, getData]
}

export default useTestDataInputComponent