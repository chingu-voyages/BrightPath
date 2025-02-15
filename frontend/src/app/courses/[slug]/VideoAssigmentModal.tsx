// import { Assignment } from '@prisma/client';
import { Assignment } from '@/types';
import React, { useState } from 'react';
import { EllipsisOutlined,ShareAltOutlined, ProfileOutlined, BookOutlined  } from "@ant-design/icons";
import { icons } from 'antd/es/image/PreviewGroup';
import { Tooltip } from 'antd';

const VideoAssigmentModal = ({
    assignment,
    complete,
}: {
    assignment: Assignment;
    complete: () => Promise<void>;
}) => {
    const { transcript, videoUrl } = assignment.VideoAssignment!;
    const [completed, setCompleted] = useState(false);

    const videoTools = [
        {
            title: "Take notes",
            icons:<ProfileOutlined  style={{fontSize:24}}/>
        },
        {
            title: "Bookmarks",
            icons:<BookOutlined  style={{fontSize:24}}/>
        },
        {
            title: "Share",
            icons:<ShareAltOutlined  style={{fontSize:24}}/>
        },
        {
            title: "More Options",
            icons:<EllipsisOutlined  style={{fontSize:24}}/>
        },
    ]
  return (
    <>
        <section className='w-full flex gap-2'>
            <video
            className='w-full rounded-lg'
             onEnded={()=>setCompleted(true)} controls src={videoUrl}>
            </video>
            {/* tooltips */}
            <div className='p-2 py-4 flex flex-col gap-2 border rounded-md max-h-fit border-slate-300 dark:border-slate-700'>
                {
                      videoTools.map((tool) => (
                        <Tooltip key={tool.title} placement="right" title={tool.title}>
                              <p className='p-1 hover:bg-slate-300 rounded-md'>{tool.icons}</p>
                        </Tooltip>

                    ))
                }
            </div>
        </section>
        <div className='w-full flex justify-end mt-6  py-6 border-t-2 border-slate-100'>
              {
                  completed && <button
                  className="p-4 rounded-md capitalize border-slate-200 dark:border-slate-700 bg-slate-700 dark:bg-slate-100 text-slate-100 dark:text-slate-700 text-lg font-thin"
                  type="button"
                  onClick={complete}
              >
                  next unit/assigment
              </button>
              }
              {!completed && <div >
                  <h1>Transcript</h1>
                  <p>{transcript}</p>
              </div>}
        </div>
    </>
  )
}

export default VideoAssigmentModal
