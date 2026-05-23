import { useSelector } from "react-redux";
import React from 'react'

const learning = () => {
    const photos = useSelector((state) => state.photo.Photos);
    console.log(photos)
  return (
    <div>

    </div>
  )
}
export default learning
