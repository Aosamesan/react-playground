import React from "react"

export type InputComponentHook<T> = (data: T) => [
    React.FunctionComponent<InputComponentProps<T>>,
    () => T
]
export type InputComponentProps<T> = {
    updateValue?: (data: T) => void
}
