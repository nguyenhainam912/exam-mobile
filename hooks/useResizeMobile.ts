import React, { useEffect, useState } from 'react'

const useResizeMobile = () => {
    const [isResize, setIsResize] = useState(false)
    useEffect(() => {
        const handleResize = () => {
            setIsResize(window.innerWidth <= 1500)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    return isResize
}

export default useResizeMobile