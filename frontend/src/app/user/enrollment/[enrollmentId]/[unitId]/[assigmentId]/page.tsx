import React from 'react'

const AssigmentPage = async ({ params }: { params: Promise<{ enrollmentId: string,unitId:string, assigmentId: string }> }) => {
  const { unitId, enrollmentId, assigmentId } = await params;
  
  return (
    <div>
      <h1>{unitId}</h1>
          <h1>{enrollmentId}</h1>
          <h1>{assigmentId}</h1>
    </div>
  )
}

export default AssigmentPage
