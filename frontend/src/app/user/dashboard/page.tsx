import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Student dashboard",
    description: "Overwiew of courses...",
};

const Dashboard = async() => {
  return (
    <div className='py-6'>
        {/* intro */}
          <p className='text-lg italic'>
              “Success isn't always about greatness. It's about consistency. Consistent hard work leads to success. Greatness will come.” - Dwayne Johnson
          </p>
          {/* in progress */}
          <section>
              <h1>Continue Learning</h1>
              
          </section>

          <section>
          <h1>Completed Courses</h1>
          </section>

          <section>
          <h1>Recommandations</h1>
      </section>
    </div>
  )
}

export default Dashboard
