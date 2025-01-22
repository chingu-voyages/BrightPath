import app from "./app";

const port = process.env.PORT || 8080;

app.listen(8080, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
