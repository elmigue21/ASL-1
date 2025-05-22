'use client'
import { Button } from '@/components/ui/button'
import React from 'react'

function UnsubscribePage() {

    
    const handleClick = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      console.log("clicked");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/unsubscribe?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        console.error("Failed to confirm subscription");
      }

      const data = await response.json();
      console.log("data", data);
    };

  return (
    <div>
        <Button onClick={()=>{handleClick()}}>UNSUBSCRIBE</Button>
    </div>
  )
}

export default UnsubscribePage