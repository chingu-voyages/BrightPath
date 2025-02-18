import moment from "moment";
import { type Assignment } from "@/types";
import { Progress, Steps } from "antd";
import React, { useState } from "react";
import { EllipsisOutlined, EnterOutlined } from "@ant-design/icons";
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
    const [started, setStarted] = useState(false);
    const [current, setCurrent] = useState<number>(0);
    const [submited, setSubmited] = useState(false);
    const [value, setValue] = useState<number>(null!);
    const [completed, setCompleted] = useState(false);
    const [points, setPoints] = useState(0);
    const [error, setError] = useState(false);

    const questions: Prisma.JsonArray = assignment.QuizAssignment
        ?.questions! as Prisma.JsonArray;

    const items = Object.keys(questions!).map((q, i) => ({
        key: i,
        title: "",
    }));

    function submitAnswer() {
        if (!value && value !== 0) {
            setError(true);
        } else {
            if (value === Number(answer)) {
                setPoints((p) => p + 1);
            }
            setSubmited(true);
            setError(false);
        }
    }

    function next() {
        setValue(null!);
        if (current < items.length - 1) {
            setCurrent(current + 1);
            setSubmited(false);
        } else {
            setCompleted(true);
        }
        // submit assigment
        // complete();
    }

    // retake
    function retake() {
        setPoints(0);
        setCurrent(0);
        setValue(null!);
        setCompleted(false);
        setStarted(false);
        setSubmited(false);
    }

    const { question, answer, options } = questions[current] as Record<
        string,
        any
    >;

    return started ? (
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

                    {error && (
                        <div className="text-red-500">
                            must select same thing first
                        </div>
                    )}

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
                                            ) => {
                                                console.log(e.target.value);
                                                setValue(
                                                    Number(e.target.value),
                                                );
                                            }}
                                            checked={value === i}
                                            value={i}
                                            type="radio"
                                            name="option"
                                            id={option}
                                            disabled={submited}
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
                    <span className="text-xl font-normal">
                        {points / items.length > 0.5
                            ? "😎 not bad"
                            : "😔 maybe next time !"}
                    </span>
                    <button
                        className="p-4 rounded-md capitalize border-slate-200 dark:border-slate-700 bg-slate-700 dark:bg-slate-100 text-slate-100 dark:text-slate-700 text-lg font-thin"
                        type="button"
                        onClick={
                            points / items.length > 0.5 ? complete : retake
                        }
                    >
                        {points / items.length > 0.5
                            ? "Next Unit/ Assigment "
                            : "Redo 💁"}
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
    ) : (
        <article className="h-full min-h-72 md:min-h-96 w-full flex flex-col justify-between md:py-8">
            <div>
                <h1 className="capitalize text-xl">{assignment.title}</h1>
                <p className="lowercase ">Type: {assignment.type}</p>
                <p>
                    {assignment.QuizAssignment?.timeLimit &&
                        (moment
                            .duration(assignment.QuizAssignment?.timeLimit)
                            .humanize() as string)}
                </p>
            </div>
            <div className="w-full flex justify-end py-4">
                <button
                    className="p-4 rounded-md capitalize border-slate-200 dark:border-slate-700 bg-slate-700 dark:bg-slate-100 text-slate-100 dark:text-slate-700 cursor-pointer hover:bg-slate-600 text-lg font-thin"
                    type="button"
                    onClick={() => setStarted(true)}
                >
                    Start Assigment
                </button>
            </div>
        </article>
    );
};

export default QuizAssigmentModal;
