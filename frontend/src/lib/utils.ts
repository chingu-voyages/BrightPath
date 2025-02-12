import moment from "moment";

export const computeCourseDuration = (course: any) => {
    let courseDuration = moment.duration();

    for (const unit of course.units) {
        const unitDuration = moment.duration();

        for (const assignment of unit.assignments) {
            unitDuration.add(assignment.duration);
        }

        unit.duration = unitDuration.asMilliseconds();
        courseDuration.add(unitDuration);
    }

    course.duration = courseDuration.asMilliseconds();
};

interface Quote {
    phrase: string;
    author: string;
}

const quotes: Quote[] = [
    { phrase: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
    { phrase: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
    { phrase: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { phrase: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { phrase: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { phrase: "It is never too late to be what you might have been.", author: "George Eliot" },
    { phrase: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { phrase: "Do not wait for leaders; do it alone, person to person.", author: "Mother Teresa" },
    { phrase: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { phrase: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" }
];

export const getRandomQuote = (): string => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    return `"${randomQuote.phrase}" - ${randomQuote.author}`;
}
