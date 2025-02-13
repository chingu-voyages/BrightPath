import { Assignment } from "@/types";
import React, { useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Editor } from "@monaco-editor/react";
import { Select } from "antd";
const InteractiveAssigment = ({
    timed = false,
    assignment,
    complete,
}: {
    assignment: Assignment;
    timed?: boolean;
    complete: () => Promise<void>;
}) => {
    const { codeSnippet, language } = assignment.InteractiveAssignment!;
    const [codeSource, setCodeSource] = useState(codeSnippet);
    const [languages, setLanguages] = useState(language);

    function handleChange(value: string | undefined) {
        setCodeSource(value!);
    }
    return (
        <>
            <div className=" lg:hidden">
                please use computer or larger screen to access this assignment
            </div>
            <div className="hidden lg:flex justify-between p-2 bg-red-50">
                <section className="w-full p-2">
                    <div className="flex p-4 justify-between items-center border-b  w-full">
                        <h1>Code </h1>
                        <div>
                            <Select
                                className="min-w-32"
                                showSearch
                                defaultValue={languages}
                                onChange={(value) => setLanguages(value)}
                                options={[
                                    {
                                        value: "html",
                                        label: "html",
                                    },
                                    {
                                        value: "javascript",
                                        label: "javascript",
                                    },
                                ]}
                            />
                            <EllipsisOutlined />
                        </div>
                    </div>
                    <Editor
                        height=""
                        className="min-h-96"
                        language={languages}
                        defaultValue={codeSnippet}
                        value={codeSource}
                        onChange={handleChange}
                    />
                </section>

                {/* preview */}
                <section className=" max-w-md  w-full p-2 border-l">
                    <div className="flex p-4 justify-between items-center border-b  w-full ">
                        <h1>Preview </h1>
                        <EllipsisOutlined />
                    </div>
                    <iframe
                        className="w-full"
                        title="preview"
                        srcDoc={codeSource}
                    ></iframe>
                </section>
            </div>
        </>
    );
};

export default InteractiveAssigment;
