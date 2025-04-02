'use client'
import React from 'react'
import { useParams } from "next/navigation";
function ViewPage() {
     const { id } = useParams();
  return (
    <div>ViewPage {id}</div>
  )
}

export default ViewPage