import { useEffect } from "react"
import { useState } from "react"

export const Async = () => {
    const [isButtonVisible, setIsButtonVisible] = useState(false)
    const [isButtonInvisible, setIsButtonInvisible] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setIsButtonVisible(true)
            setIsButtonInvisible(true)
        }, 1000)
    }, [])

    return (
        <div>
            <h1>Apenas testando, amigo</h1>
            { isButtonVisible && (
                <button>Button</button>
            ) }
            {!isButtonInvisible && (
                <button>Im invisible</button>
            )}
        </div>
    )
}