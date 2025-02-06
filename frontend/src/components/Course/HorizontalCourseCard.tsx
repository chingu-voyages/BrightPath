import { Course } from '@prisma/client';
import { CheckCircleOutlined, DesktopOutlined, RightOutlined } from "@ant-design/icons";
import Link from 'next/link';
import React from 'react'

const HorizontalCourseCard = async ({course,completed=false}:{course:Course,completed:boolean}) => {
    // const res = await fetch(`${process.env.BACKEND_API_URL}/courses/${id}`);
    // const course: Course = await res.json();
  return (
    <article>
      <div>
        
      </div>
      <section>
        <div>
            <h1>{course.title}</h1>
            {/* instructor ?? name */}
            <p>taught by Instructor Name</p>
        </div>
        <div>
            <p>{course.shortDescription}</p>
            
            {/* btn ?? */}
            {
                completed ? (
                    <Link href ={`/course/${course.id}`}>view Certificate</Link>
                ):(
                    <Link href={`/course/${course.id}`}>
                        <div>
                            <p>continue learning</p>
                            <div>
                                <p>
                                    <DesktopOutlined />
                                </p>
                                {/* Course last ... */}
                                <p>
                                    The Agile process
                                </p>
                            </div>
                        </div>
                        <div>
                        <RightOutlined />
                        </div>
                    </Link>
                )
            }
        </div>
            {
                completed ? (
                    // ?? completed date
                    <div>
                    <CheckCircleOutlined />   
                    Completed on  Data xx xxx xxx
                    </div>
                  ) : (
                    <div>
                        <p>progress</p>
                        <div>
                            <p>xx %</p>
                            <p>xx hours left</p>
                        </div>
                    </div>
                )
            }
      </section>
    </article>
  )
}

export default HorizontalCourseCard
