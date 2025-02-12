import { type Assignment } from "@/types";
import { Progress, Steps } from "antd";
import React, { useState } from "react";
import { EllipsisOutlined, EnterOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

const QuizAssigmentModal = ({
    timed = false,
    assignment,
    complete,
}: {
    assignment: Assignment;
    timed?: boolean;
    complete: () => Promise<void>;
}) => {
    const router = useRouter();

    // for later fix ...
    const [current, setCurrent] = useState<number>(0);
    const [submited, setSubmited] = useState(false);
    const [value, setValue] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [points, setPoints] = useState(0);

    const questions: Prisma.JsonArray = assignment.QuizAssignment
        ?.questions! as Prisma.JsonArray;

    // const items = questions.map((question,i) => ({ key: question.id, title: "" }))
    const items = Object.keys(questions!).map((q, i) => ({
        key: i,
        title: "",
    }));
    function submitAnswer() {
        if (value == Number(answer)) {
            setPoints((p) => p + 1);
        }
        setSubmited(true);
    }

    function next() {
        if (current < items.length - 1) {
            setCurrent(current + 1);
            setSubmited(false);
            setValue(null!);
        } else {
            setCompleted(true);
        }
        // submit assigment
        // complete();
    }

    const { question, answer, options } = questions[current] as Record<
        string,
        any
    >;

    return (
        <>
            <article className="w-full h-full">
                <div className="flex justify-between items-center gap-3 ">
                    <div className="flex-1 flex gap-4 items-center">
                        <h1 className="font-semibold">
                            Question {current + 1} of {items.length}
                        </h1>
                        <Steps
                            className="sm:max-w-56 "
                            style={{ lineHeight: 8 }}
                            current={current}
                            items={items}
                        />
                    </div>
                    <div>
                        <EllipsisOutlined style={{ fontSize: 32 }} />
                    </div>
                </div>

                {/* Questions */}
                <div className="">
                    <div className="my-6">
                        <h1 className="text-4xl font-semibold">
                            {assignment.title}
                        </h1>
                        <p className="text-lg italic">{question}</p>
                    </div>

                    {!completed && (
                        <form
                            onSubmit={submitAnswer}
                            className="flex flex-wrap gap-4"
                        >
                            {options?.map((option: string, i: number) => (
                                <label
                                    key={i}
                                    htmlFor={option}
                                    className={`flex justify-between items-center w-full md:max-w-sm border-2 border-slate-300 dark:border-slate-700 p-4 rounded-md hover:bg-slate-200 hover:dark:bg-slate-600 cursor-pointer ${submited ? (value === answer && value == i ? "bg-green-300" : value == i && value !== answer && "bg-red-300") : ""}`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <input
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setValue(Number(e.target.value))
                                            }
                                            value={i}
                                            type="radio"
                                            name="option"
                                            id={option}
                                            placeholder="hh"
                                            className=""
                                        />
                                        <span className="font-normal">
                                            {option}
                                        </span>
                                    </div>
                                    <div className="div px-2 shadow-md border rounded-md">
                                        {i + 1}
                                    </div>
                                </label>
                            ))}
                        </form>
                    )}

                    {completed && (
                        <div className="flex flex-col items-center gap-8">
                            <h1 className="text-lg font-semibold">
                                Your score is: {points}/{items.length}
                            </h1>
                            <Progress
                                type="circle"
                                percent={(points / items.length) * 100}
                            />
                        </div>
                    )}
                </div>
            </article>
            {completed ? (
                <div className="w-full flex justify-between items-center mt-6  py-6 border-t-2 border-slate-100">
                    {points / items.length > 0.5 ? (
                        <span className="text-xl font-normal">😎 not bad</span>
                    ) : (
                        <span className="text-xl font-normal">
                            😔 maybe next time !
                        </span>
                    )}

                    <button
                        className="p-4 rounded-md capitalize border-slate-200 dark:border-slate-700 bg-slate-700 dark:bg-slate-100 text-slate-100 dark:text-slate-700 text-lg font-thin"
                        type="button"
                        onClick={complete}
                    >
                        next unit/assigment
                    </button>
                </div>
            ) : (
                <div className="w-full flex justify-end mt-6  py-6 border-t-2 border-slate-100">
                    {submited ? (
                        <button
                            type="button"
                            className="p-4 flex items-center justify-between w-full md:max-w-72  border-2 rounded-md   border-slate-200 dark:border-slate-700 bg-slate-700 dark:bg-slate-100 text-slate-100 dark:text-slate-700 text-lg font-thin"
                            onClick={next}
                        >
                            <span>
                                {submited && current == items.length - 1
                                    ? "Complete Assigment"
                                    : "next question"}
                            </span>
                            <span>
                                <EnterOutlined />
                            </span>
                        </button>
                    ) : (
                        <button
                            className="p-4 flex items-center justify-between w-full md:max-w-72  border-2 rounded-md   border-slate-200 dark:border-slate-700 bg-slate-700 dark:bg-slate-100 text-slate-100 dark:text-slate-700 text-lg font-thin"
                            onClick={submitAnswer}
                        >
                            <span>Submit Answer</span>
                            <span>
                                <EnterOutlined />
                            </span>
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default QuizAssigmentModal;
